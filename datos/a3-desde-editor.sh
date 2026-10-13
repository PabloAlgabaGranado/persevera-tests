#!/bin/bash
# A3 por el editor SQL (docs/guia-consolas.md, bloque 2): guarda en datos/esquema-persevera.sql el
# resultado de datos/a3-editor.sql y lo comprueba con datos/a3-comprobar.sh.
#
#   bash datos/a3-desde-editor.sh            # lo toma del portapapeles (pbpaste)
#   bash datos/a3-desde-editor.sh fichero    # o de un fichero
#
# El panel de Supabase lo copia a veces como CSV: con la cabecera «esquema» (y su fin de línea de
# Windows, \r\n), todo entre comillas y las comillas de dentro dobladas. Eso se deshace aquí.
# Hecho para el bash 3.2 y el awk de macOS.
set -euo pipefail

cd "$(dirname "$0")/.."
DESTINO=datos/esquema-persevera.sql
TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT
if [ "$#" -ge 1 ]; then cat "$1" > "$TMP"; else pbpaste > "$TMP"; fi
if [ ! -s "$TMP" ]; then echo "El portapapeles está vacío: vuelve a copiar la celda «esquema» del editor SQL."; exit 1; fi

if head -n 1 "$TMP" | tr -d '\r' | grep -q '^esquema$'; then
  # Copiado como CSV: fuera la cabecera, los \r, la comilla de apertura, la de cierre y las comillas
  # dobladas. La de cierre va sola en la última línea, que entonces queda vacía y no se escribe.
  awk 'NR == 1 { next }
       { sub(/\r$/, "") }
       NR == 2 { sub(/^"/, "") }
       { gsub(/""/, "\""); l[NR] = $0; n = NR }
       END { sub(/"$/, "", l[n]); if (l[n] == "") n--; for (i = 2; i <= n; i++) print l[i] }' "$TMP" > "$DESTINO"
else
  cat "$TMP" > "$DESTINO"
fi
echo "Guardado en $DESTINO ($(wc -l < "$DESTINO" | tr -d ' ') líneas)."
bash datos/a3-comprobar.sh "$DESTINO"
