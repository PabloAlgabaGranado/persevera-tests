"""Contrastes de la paleta final de Persevera Tests: «Noche y menta».

Calcula todos los pares que cita paleta.md: texto (AA, 4,5:1), interfaz y gráficos (3:1),
los del icono y las distancias ΔE2000 (normal, deuteranopía y protanopía), con la matriz
completa entre los colores que significan algo.
Usa color.py, que va en esta misma carpeta: es copia sin cambios del color.py de la revisión
de iconos del 13-oct-2026. La variable COLOR_PY permite usar otro.

    python3 contrastes.py > contrastes.txt
"""
import importlib.util
import itertools
import os
import sys

sys.dont_write_bytecode = True  # no dejar __pycache__ dentro del paquete de marca

RUTA_COLOR = os.environ.get(
    'COLOR_PY',
    os.path.join(os.path.dirname(os.path.abspath(__file__)), 'color.py'),
)
_spec = importlib.util.spec_from_file_location('color_revision', RUTA_COLOR)
color = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(color)
cr, de_cvd, mezcla, hue = color.cr, color.de_cvd, color.mezcla, color.hue

# Paleta
MARCA = '#7AD8D2'        # menta
HEREDADA = '#5BA899'     # verde medio de Persevera
FONDO = '#0F2A31'        # petróleo noche
SUPERFICIE = '#16363E'
ESTRUCTURAL = '#2E545C'
BORDE = '#5A858C'
ETIQUETA = '#1C3F43'
TEXTO = '#F1FAF7'
SECUNDARIO = '#9DBAB5'
ACIERTO, ACIERTO_TEXTO, ACIERTO_FONDO = '#5DC650', '#7FD873', '#1F4A35'
FALLO, FALLO_TEXTO, FALLO_FONDO = '#EF6A6A', '#F59A9A', '#3E2B33'
AVISO = '#E8863A'
BLANCO = '#FFFFFF'       # casillas vacías del icono

# Otras apps de la familia
PERSEVERA_MARCA, PERSEVERA_FONDO = '#0D7C66', '#F6F9F6'
ORAL_FONDO, ORAL_MARCA = '#1B2A4A', '#E8B84B'

# Icono: el cono luzTests va de y=436 (30 %) a y=1024 (0 %). Las casillas empiezan en y=680.
OPACIDAD_CASILLAS = 0.30 * (1 - (680 - 436) / (1024 - 436))
CONO_CASILLAS = mezcla(MARCA, FONDO, OPACIDAD_CASILLAS)
CONO_ARRIBA = mezcla(MARCA, FONDO, 0.30)
# Contorno de la etiqueta de origen: menta al 55 % sobre su relleno y sobre el fondo
CONTORNO_ETIQUETA_FONDO = mezcla(MARCA, FONDO, 0.55)

# (fg, bg, etiqueta, clase). clase: 'uso' = se usa así; 'tope' = se mide para fijar una regla
# (si no llega, paleta.md prohíbe ese uso); 'deco' = decorativo, no tiene que llegar.
TEXTO_PARES = [
    (TEXTO, FONDO, 'texto sobre fondo (enunciado, cabecera)', 'uso'),
    (TEXTO, SUPERFICIE, 'texto de opción sobre superficie', 'uso'),
    (TEXTO, ACIERTO_FONDO, 'texto de la opción correcta', 'uso'),
    (TEXTO, FALLO_FONDO, 'texto de la opción fallada', 'uso'),
    (SECUNDARIO, FONDO, 'secundario sobre fondo (contador, tiempo, «Tema 1»)', 'uso'),
    (SECUNDARIO, SUPERFICIE, 'secundario sobre superficie (explicación, letras A y C)', 'uso'),
    (SECUNDARIO, ETIQUETA, 'secundario sobre la etiqueta de origen', 'tope'),
    (MARCA, FONDO, 'marca como texto sobre fondo («Tests»)', 'uso'),
    (MARCA, SUPERFICIE, 'marca como texto sobre superficie (título de la explicación)', 'uso'),
    (MARCA, ETIQUETA, 'etiqueta de origen «Oficial, AGE 2024»', 'uso'),
    (FONDO, MARCA, '«Siguiente» (texto #0F2A31 sobre menta)', 'uso'),
    (FONDO, HEREDADA, '«Siguiente» pulsado', 'uso'),
    (ACIERTO_TEXTO, ACIERTO_FONDO, '«Respuesta correcta»', 'uso'),
    (FALLO_TEXTO, FALLO_FONDO, '«Tu respuesta»', 'uso'),
    (FONDO, ACIERTO, 'letra D en el círculo de acierto', 'uso'),
    (FONDO, FALLO, 'letra B en el círculo de fallo', 'uso'),
    (AVISO, FONDO, 'aviso como texto sobre fondo', 'tope'),
    (AVISO, SUPERFICIE, 'aviso como texto sobre superficie', 'tope'),
    (AVISO, ETIQUETA, 'aviso como texto sobre la etiqueta de origen', 'tope'),
    (AVISO, ACIERTO_FONDO, 'aviso como texto sobre el relleno de acierto', 'tope'),
    (AVISO, FALLO_FONDO, 'aviso como texto sobre el relleno de fallo', 'tope'),
    (FONDO, AVISO, 'texto #0F2A31 sobre relleno naranja', 'tope'),
    (TEXTO, AVISO, 'texto #F1FAF7 sobre relleno naranja', 'tope'),
    (HEREDADA, FONDO, 'marca heredada como texto sobre fondo', 'tope'),
    (HEREDADA, SUPERFICIE, 'marca heredada como texto sobre superficie', 'tope'),
]

INTERFAZ_PARES = [
    (ACIERTO, ACIERTO_FONDO, 'borde y tic de acierto contra su relleno', 'uso'),
    (ACIERTO, FONDO, 'borde de acierto contra el fondo', 'uso'),
    (FALLO, FALLO_FONDO, 'borde y aspa de fallo contra su relleno', 'uso'),
    (FALLO, FONDO, 'borde de fallo contra el fondo', 'uso'),
    (BORDE, SUPERFICIE, 'borde de opción neutra contra la tarjeta', 'uso'),
    (BORDE, FONDO, 'borde de opción neutra contra el fondo', 'uso'),
    (SECUNDARIO, SUPERFICIE, 'aro de la letra e iconos de cabecera', 'uso'),
    (MARCA, ESTRUCTURAL, 'progreso contra el carril', 'uso'),
    (MARCA, FONDO, 'botón y progreso contra el fondo', 'uso'),
    (MARCA, SUPERFICIE, 'barra de la caja de explicación contra la superficie', 'deco'),
    (HEREDADA, FONDO, 'botón pulsado contra el fondo', 'uso'),
    (AVISO, FONDO, 'icono de aviso sobre fondo', 'tope'),
    (AVISO, SUPERFICIE, 'icono de aviso sobre superficie', 'tope'),
    (AVISO, ETIQUETA, 'icono de aviso sobre la etiqueta de origen', 'tope'),
    (AVISO, ACIERTO_FONDO, 'icono de aviso sobre el relleno de acierto', 'tope'),
    (AVISO, FALLO_FONDO, 'icono de aviso sobre el relleno de fallo', 'tope'),
    (ESTRUCTURAL, SUPERFICIE, 'estructural contra la superficie (¿sirve de borde?)', 'tope'),
    (ESTRUCTURAL, FONDO, 'estructural contra el fondo (¿sirve de borde?)', 'tope'),
    (CONTORNO_ETIQUETA_FONDO, FONDO, 'contorno de la etiqueta de origen (menta al 55 %) contra el fondo', 'deco'),
    (SUPERFICIE, FONDO, 'tarjeta contra el fondo (el borde la separa)', 'deco'),
]

ICONO_PARES = [
    (MARCA, FONDO, 'pantalla del flexo contra el fondo', 'uso'),
    (HEREDADA, FONDO, 'barra del flexo contra el fondo', 'uso'),
    (HEREDADA, MARCA, 'barra del flexo contra la pantalla', 'deco'),
    (BLANCO, FONDO, 'casillas vacías contra el fondo', 'uso'),
    (BLANCO, CONO_CASILLAS, f'casillas vacías contra el cono a su altura (luz al {OPACIDAD_CASILLAS * 100:.0f} %)', 'uso'),
    (MARCA, CONO_CASILLAS, 'casilla marcada contra el cono a su altura', 'uso'),
    (FONDO, MARCA, 'tic contra la casilla marcada', 'uso'),
    (MARCA, BLANCO, 'casilla marcada contra las vacías (se distingue por estar llena y por el tic)', 'deco'),
    (CONO_ARRIBA, FONDO, 'cono de luz bajo la barra (30 %) contra el fondo', 'deco'),
]

DISTANCIAS = [
    (MARCA, ACIERTO, 'marca frente a acierto'),
    (MARCA, ACIERTO_TEXTO, 'marca frente a acierto texto'),
    (MARCA, FALLO, 'marca frente a fallo'),
    (ACIERTO, FALLO, 'acierto frente a fallo'),
    (ACIERTO_TEXTO, FALLO_TEXTO, 'acierto texto frente a fallo texto'),
    (HEREDADA, MARCA, 'marca heredada frente a menta'),
    (HEREDADA, ACIERTO, 'marca heredada frente a acierto'),
    (FONDO, PERSEVERA_MARCA, 'fondo frente a Persevera (marca e icono, #0D7C66)'),
    (FONDO, PERSEVERA_FONDO, 'fondo frente a Persevera (fondo de la app, #F6F9F6)'),
    (FONDO, ORAL_FONDO, 'fondo frente a Oral (fondo, #1B2A4A)'),
    (MARCA, PERSEVERA_MARCA, 'menta frente a la marca de Persevera'),
    (MARCA, ORAL_MARCA, 'menta frente a la pantalla dorada de Oral'),
    (ACIERTO, AVISO, 'acierto frente a aviso'),
    (ACIERTO_TEXTO, AVISO, 'acierto texto frente a aviso'),
    (FALLO, AVISO, 'fallo frente a aviso'),
    (FALLO_TEXTO, AVISO, 'fallo texto frente a aviso'),
]

# Colores que significan algo, para la matriz completa. Un mismo significado agrupa a un color
# con su rótulo (acierto y acierto texto) y a las dos marcas: esos pares no cuentan como
# «colores que significan cosas distintas».
SIGNIFICADO = [
    (MARCA, 'menta', 'marca'),
    (HEREDADA, 'marca heredada', 'marca'),
    (ACIERTO, 'acierto', 'acierto'),
    (ACIERTO_TEXTO, 'acierto texto', 'acierto'),
    (FALLO, 'fallo', 'fallo'),
    (FALLO_TEXTO, 'fallo texto', 'fallo'),
    (AVISO, 'aviso', 'aviso'),
]


def coma(x):
    return f'{x:.2f}'.replace('.', ',')


def estado(r, limite, clase):
    if r >= limite:
        return 'OK   '
    return {'uso': 'NO   ', 'tope': 'veto ', 'deco': 'deco '}[clase]


def seccion(titulo, pares, limite, fallos):
    print(f'\n-- {titulo}')
    for fg, bg, et, clase in pares:
        r = cr(fg, bg)
        e = estado(r, limite, clase)
        if r < limite and clase == 'uso':
            fallos.append(et)
        print(f'  {e} {coma(r):>6}:1  {fg} sobre {bg}  {et}')


def main():
    fallos = []
    print('PERSEVERA TESTS: NOCHE Y MENTA. Contrastes y distancias.')
    print('Fórmula WCAG 2 y ΔE2000 de color.py (daltonismo: Machado 2009, severidad 1).')
    print('Estados: OK llega al umbral. NO se usa así y no llega.')
    print('veto: se mide para fijar una regla y no llega, así que paleta.md prohíbe ese uso.')
    print('deco: decorativo, no tiene que llegar.')
    seccion('Texto (AA: 4,5:1)', TEXTO_PARES, 4.5, fallos)
    seccion('Interfaz y gráficos (3:1)', INTERFAZ_PARES, 3, fallos)
    seccion('Icono (3:1)', ICONO_PARES, 3, fallos)
    print(f'\n   cono a la altura de las casillas: {CONO_CASILLAS} (luz al {coma(OPACIDAD_CASILLAS * 100)} %);'
          f' bajo la barra: {CONO_ARRIBA}; contorno de la etiqueta sobre el fondo: {CONTORNO_ETIQUETA_FONDO}')
    print('\n-- Distancias ΔE2000 (normal / deuteranopía / protanopía), tono HSL y contraste de luminancia')
    for a, b, et in DISTANCIAS:
        n, d, p = de_cvd(a, b)
        print(f'  {et}: {a} ({hue(a)}°) frente a {b} ({hue(b)}°): ΔE {coma(n)} / {coma(d)} / {coma(p)}'
              f'   contraste {coma(cr(a, b))}:1')
    pares = []
    for (a, na, sa), (b, nb, sb) in itertools.combinations(SIGNIFICADO, 2):
        pares.append((de_cvd(a, b), na, nb, 'mismo' if sa == sb else 'distinto'))
    for i, vision in enumerate(['normal', 'deuteranopía', 'protanopía']):
        print(f'\n-- Matriz ΔE2000 entre los colores que significan algo, de más cerca a más lejos ({vision})')
        print('   Columnas: normal / deuteranopía / protanopía. «mismo» = mismo significado.')
        for d, na, nb, sig in sorted(pares, key=lambda x: x[0][i]):
            print(f'  {coma(d[0]):>6} / {coma(d[1]):>6} / {coma(d[2]):>6}  {sig:8}  {na} frente a {nb}')
    print('\nPares en uso que no llegan:', ', '.join(fallos) if fallos else 'ninguno')


if __name__ == '__main__':
    main()
