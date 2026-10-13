#!/bin/bash
# A3 (docs/guia-consolas.md, bloque 2.5): las comprobaciones del esquema sacado de Persevera.
# Sirve para los ficheros de datos/a3.sh y para el del editor SQL (datos/a3-editor.sql):
#
#   bash datos/a3-comprobar.sh datos/esquema-persevera.sql [más ficheros…]
#
# Escribe las líneas de 2.5 del «Devuelve». Sale con 2 si el grep de secretos encuentra algo,
# y entonces no hay que subir nada. Hecho para el bash 3.2 de macOS.
set -euo pipefail

if [ "$#" -eq 0 ]; then echo "Uso: bash datos/a3-comprobar.sh fichero [fichero…]"; exit 1; fi
TODO=$(mktemp)
trap 'rm -f "$TODO"' EXIT
cat "$@" > "$TODO"
# El del editor se copia a mano: si le falta la última línea, se ha cortado al copiarlo.
if grep -q 'desde el editor SQL' "$TODO" && ! grep -q '^-- FIN del esquema de A3\.' "$TODO"; then
  echo "El fichero está cortado: le falta la última línea, «-- FIN del esquema de A3.». Vuelve a copiar la celda entera."
  exit 1
fi

TABLAS="oposiciones bloques temas epigrafes tema_epigrafe preguntas minicasos minicaso_preguntas
supuestos_originales supuesto_original_preguntas supuestos_oficiales supuesto_oficial_preguntas
marcado_items marcado_unidades psico_items_graficos usuario_oposicion respuestas_usuario
pregunta_respondida study_activity_log simulacros simulacro_sesiones"
VISTAS="v_casos_para_revisar v_estado_pregunta_usuario"

# 2.5.1: las 21 tablas y las 2 vistas.
FALTAN=""
for t in $TABLAS; do grep -q "^CREATE TABLE public\.$t (" "$TODO" || FALTAN="$FALTAN $t"; done
for v in $VISTAS; do grep -q "^CREATE VIEW public\.$v " "$TODO" || FALTAN="$FALTAN $v"; done
# 2.5.2: cada disparador tiene su función (pg_dump escribe public.f; el editor, solo f).
SIN_FUNCION=""
for f in $(grep -o 'EXECUTE FUNCTION [a-z0-9_.]*' "$TODO" | sed -e 's/EXECUTE FUNCTION //' -e 's/^public\.//' | grep -v '\.' | sort -u); do
  grep -q "FUNCTION public\.$f(" "$TODO" || SIN_FUNCION="$SIN_FUNCION $f"
done
# 2.5.3: la función que rellena simulacros desde study_activity_log.
RELLENA=$(awk '/^-- public\.[a-z0-9_]+\(/ { n = $2; sub(/\(.*/, "", n) }
               tolower($0) ~ /insert into (public\.)?simulacros/ && n != "" { print n }' "$TODO" | sort -u | tr '\n' ' ')
# 2.5.4: sin secretos. Solo se enseña fichero y línea, nunca el valor.
SECRETOS=$(grep -H -n -E 'sb_secret_|sk_live|sk_test|rk_live|whsec_|eyJhbGci|Bearer [A-Za-z0-9]|(^|[^A-Za-z0-9_])re_[A-Za-z0-9_]{20,}|password' \
             "$@" | cut -d: -f1,2 | tr '\n' ' ' || true)

echo "Paso 2.5.1, tablas y vistas: ${FALTAN:+faltan:}${FALTAN:-todo ok}"
echo "Paso 2.5.2, funciones de los disparadores: ${SIN_FUNCION:+faltan:}${SIN_FUNCION:-todo ok}"
echo "Paso 2.5.3, la función que rellena simulacros: ${RELLENA:-ninguna}"
echo "Grep de secretos: ${SECRETOS:+salió algo en }${SECRETOS:-vacío}"
if [ -n "$SECRETOS" ]; then exit 2; fi
