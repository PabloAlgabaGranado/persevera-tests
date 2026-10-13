#!/bin/bash
# A3 por el editor SQL (docs/guia-consolas.md, bloque 2): guarda en datos/esquema-persevera.sql el
# resultado de datos/a3-editor.sql y lo comprueba con datos/a3-comprobar.sh.
#
#   bash datos/a3-desde-editor.sh            # lo toma del portapapeles (pbpaste)
#   bash datos/a3-desde-editor.sh fichero    # o de un fichero
#
# El panel de Supabase lo copia a veces como CSV: con la cabecera «esquema», todo entre comillas y
# las comillas de dentro dobladas. Eso se deshace aquí. Hecho para el bash 3.2 de macOS.
set -euo pipefail

cd "$(dirname "$0")/.."
DESTINO=datos/esquema-persevera.sql
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
if [ "$#" -ge 1 ]; then cat "$1" > "$TMP"; else pbpaste > "$TMP"; fi
if [ ! -s "$TMP" ]; then echo "El portapapeles está vacío: vuelve a copiar la celda «esquema» del editor SQL."; exit 1; fi

if head -n 1 "$TMP" | grep -q '^esquema$'; then
  # Copiado como CSV: fuera la cabecera, la comilla de apertura, la de cierre y las comillas dobladas.
  sed -e '1d' -e '2s/^"//' -e '$s/"$//' -e 's/""/"/g' "$TMP" > "$DESTINO"
else
  cat "$TMP" > "$DESTINO"
fi
echo "Guardado en $DESTINO ($(wc -l < "$DESTINO" | tr -d ' ') líneas)."
bash datos/a3-comprobar.sh "$DESTINO"
