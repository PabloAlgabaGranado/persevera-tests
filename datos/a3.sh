#!/bin/bash
# A3 (docs/guia-consolas.md, bloque 2): saca de la base de producción de Persevera la estructura de
# las tablas que copia Tests, sin ninguna fila. Solo lee: pg_dump --schema-only abre su transacción
# en modo READ ONLY y las dos consultas (a3-dependencias.sql y a3-funciones.sql) también.
# Escribe tres ficheros en datos/, hace las comprobaciones de 2.5 y no sube nada.
#
#   bash datos/a3.sh            # con el host del pooler que guarda el repo de Persevera
#   bash datos/a3.sh <host>     # con el que diga su panel de Supabase («Connect», Session pooler)
#
# Pide la contraseña de postgres una sola vez y no la escribe en ningún fichero ni en el historial.
# Hecho para el bash 3.2 de macOS.
set -euo pipefail

REF=rljfcmjvulmjooxoxzxo
HOST=${1:-aws-1-eu-west-1.pooler.supabase.com}
# Si se pega la cadena entera del panel, solo se usa el host.
case "$HOST" in *@*) HOST=$(printf '%s' "$HOST" | sed -E 's#^.*@([^:/?]+).*$#\1#') ;; esac
VERSION_MINIMA=17  # Persevera tiene Postgres 17.6, y pg_dump no vuelca un servidor más nuevo que él

cd "$(dirname "$0")/.."
SALIDA=datos
# Las 21 tablas y las 2 vistas de A3 (las mismas que en a3-dependencias.sql y a3-comprobar.sh).
TABLAS="oposiciones bloques temas epigrafes tema_epigrafe preguntas minicasos minicaso_preguntas
supuestos_originales supuesto_original_preguntas supuestos_oficiales supuesto_oficial_preguntas
marcado_items marcado_unidades psico_items_graficos usuario_oposicion respuestas_usuario
pregunta_respondida study_activity_log simulacros simulacro_sesiones"
VISTAS="v_casos_para_revisar v_estado_pregunta_usuario"

for b in pg_dump psql; do
  if ! command -v "$b" >/dev/null 2>&1; then
    echo "No encuentro $b. Primero: brew install libpq && export PATH=\"\$(brew --prefix libpq)/bin:\$PATH\""
    exit 1
  fi
  v=$("$b" --version | sed -E 's/^[^0-9]*([0-9]+).*$/\1/')
  if [ "$v" -lt "$VERSION_MINIMA" ]; then
    echo "$b es la versión $v y hace falta la $VERSION_MINIMA o más."
    echo "Haz: export PATH=\"\$(brew --prefix libpq)/bin:\$PATH\" y vuelve a lanzarlo."
    exit 1
  fi
done

export PGHOST="$HOST" PGPORT=5432 PGDATABASE=postgres PGUSER="postgres.$REF" PGSSLMODE=require
printf 'Contraseña de la base de Persevera (usuario postgres; no se ve al escribirla): '
IFS= read -r -s PGPASSWORD
echo
export PGPASSWORD

TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

echo "Conectando a $PGHOST como $PGUSER, en solo lectura..."
if ! SERVIDOR=$(psql -X -q -t -A -v ON_ERROR_STOP=1 \
       -c "set session characteristics as transaction read only; select current_setting('server_version')"); then
  echo "No he podido conectar. Mira la contraseña y el host (panel de Supabase de Persevera, «Connect», Session pooler)."
  exit 1
fi
SERVIDOR=$(printf '%s' "$SERVIDOR" | tail -n 1)
FECHA=$(date '+%d-%m-%Y %H:%M %Z')
VPGDUMP=$(pg_dump --version)

echo "1/3 Las tablas y las vistas (pg_dump --schema-only)..."
ARGS_T=""
for t in $TABLAS $VISTAS; do ARGS_T="$ARGS_T -t public.$t"; done
# shellcheck disable=SC2086  # ARGS_T se parte en palabras a propósito
pg_dump --schema-only --no-owner --lock-wait-timeout=5s $ARGS_T -f "$TMP/esquema.sql"
# Las estadísticas llevan valores reales de las columnas. --schema-only no las saca, pero se comprueba.
if grep -q -E 'pg_restore_(relation|attribute)_stats|^COPY |^INSERT INTO ' "$TMP/esquema.sql"; then
  echo "El volcado trae datos o estadísticas, y no debería. No he escrito nada en datos/. Avisa en la conversación."
  exit 1
fi

echo "2/3 De qué depende cada tabla..."
psql -X -q -v ON_ERROR_STOP=1 -f "$SALIDA/a3-dependencias.sql" -o "$TMP/dependencias.txt"

echo "3/3 El texto de esas funciones y los enum..."
psql -X -q -v ON_ERROR_STOP=1 -f "$SALIDA/a3-funciones.sql" -o "$TMP/funciones.sql"

cabecera() {
  printf '%s Sacado de Persevera, producción (%s), el %s.\n' "$1" "$REF" "$FECHA"
  printf '%s Con %s contra Postgres %s, con --schema-only y en solo lectura (datos/a3.sh).\n' "$1" "$VPGDUMP" "$SERVIDOR"
}
ESQUEMA="$SALIDA/esquema-persevera.sql"
FUNCIONES="$SALIDA/esquema-persevera-funciones.sql"
DEPENDENCIAS="$SALIDA/esquema-persevera-dependencias.txt"
{ cabecera '--'; cat "$TMP/esquema.sql"; } > "$ESQUEMA"
{ cabecera '--'; cat "$TMP/funciones.sql"; } > "$FUNCIONES"
{ cabecera '#'; cat "$TMP/dependencias.txt"; } > "$DEPENDENCIAS"

# 2.5: las comprobaciones, en su propio script para que sirvan también al camino del editor SQL.
COMPROBADO=0
COMPROBACIONES=$(bash "$SALIDA/a3-comprobar.sh" "$ESQUEMA" "$FUNCIONES" "$DEPENDENCIAS") || COMPROBADO=$?
if [ "$COMPROBADO" -ne 0 ] && [ "$COMPROBADO" -ne 2 ]; then
  echo "Las comprobaciones han fallado (salida $COMPROBADO). Pega en la conversación lo que haya salido arriba."
  exit 1
fi

echo
echo "Hecho. Copia esto y pégalo en la conversación:"
echo
echo "A3, EL ESQUEMA REAL"
echo "Commit en persevera-tests: (el que salga al subirlo)"
echo "Versión de pg_dump: $VPGDUMP (servidor: Postgres $SERVIDOR)"
echo "Host del pooler de Persevera: $PGHOST"
echo "$COMPROBACIONES"
echo "¿La consulta de los enum dio error?: no"
echo "Fecha y hora: $FECHA"
echo
if [ "$COMPROBADO" -eq 2 ]; then
  echo "NO LO SUBAS: ha salido algo en el grep de secretos. Di en la conversación el fichero y la línea, sin el valor."
else
  echo "Para subirlo:"
  echo "  git add datos/"
  echo "  git commit -m \"A3: esquema real del contenido de Persevera (solo lectura)\""
  echo "  git pull --rebase && git push"
fi
