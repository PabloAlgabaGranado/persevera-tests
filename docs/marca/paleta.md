# Paleta de Persevera Tests: Noche y menta

Elegida por Blanca el 13-oct-2026, en lugar de «Petróleo», que se eligió antes ese mismo día y pasa a `propuestas/`. Es la dirección «Noche y menta»: la app es oscura, con fondo petróleo noche, la menta como color de marca y el texto casi blanco. El verde del acierto no se usa para nada más.

Los contrastes y las distancias de color se recalcularon por script, con la fórmula WCAG y ΔE2000, y todos los pares de texto e interfaz que se usan pasan AA. Ficheros: `icono.svg` (1024x1024, sin transparencia), `icono-1024.png` (sin canal alfa, para las tiendas) y `pantalla-ejemplo.svg` (una pregunta de ejemplo, ya corregida). Las cifras salen de `revision/contrastes.py`, que lleva `color.py` al lado, y su salida es `revision/contrastes.txt`. En `revision/` van también los renders de comprobación: el icono a 48 px y la pantalla a doble tamaño. Las otras propuestas están en `propuestas/`: las de Petróleo (`petroleo-*`, con su paleta en `petroleo-paleta.md`), las de la dirección libre (`libre-*`) y las de Noche y menta antes de corregirlas (`noche-menta-*`).

| Papel | Color | Uso |
|---|---|---|
| marca | `#7AD8D2` | Menta (176°). Pantalla del flexo y casilla marcada del icono (9,01:1 sobre el fondo y 5,91:1 sobre el cono a su altura), y cono de luz `luzTests` (del 30 % al 0 %). Botón «Siguiente» con texto `#0F2A31` (9,01:1), progreso (4,96:1 contra el carril), etiqueta de origen (6,83:1 sobre su relleno, con el contorno en menta al 55 %), la palabra «Tests» (9,01:1 sobre el fondo), y la barra y el título de la caja de explicación (7,71:1 sobre la superficie). La caja sale al corregir, pero su menta es marca: no dice si la respuesta está bien o mal. |
| marca heredada | `#5BA899` | El verde medio de Persevera. Barra del flexo, en el icono y en la cabecera (5,38:1 sobre el fondo), y botón pulsado con texto `#0F2A31` (5,38:1). |
| fondo | `#0F2A31` | Petróleo noche (192°). Fondo de la app y del icono. Es también la tinta oscura: tic del icono (9,01:1 sobre la menta), texto de «Siguiente» y letras de los círculos de acierto (6,92:1) y de fallo (4,97:1). |
| superficie | `#16363E` | Tarjetas de opción, caja de explicación y botones redondos de la cabecera. Contra el fondo da 1,17:1, así que a la tarjeta la separa su borde. |
| etiqueta de origen | `#1C3F43` | Relleno de la etiqueta «Oficial, AGE 2024». |
| estructural | `#2E545C` | Carril del progreso y contorno de etiquetas que no se pulsan, como «Tema 1». Decorativo: 1,56:1 contra la superficie y 1,82:1 contra el fondo. |
| borde de opción | `#5A858C` | Borde de las opciones neutras: 3,17:1 contra la tarjeta y 3,70:1 contra el fondo. |
| texto | `#F1FAF7` | Enunciado, textos de las opciones, cabecera y barra de estado: 14,15:1 sobre el fondo, 12,11:1 sobre la superficie, 9,46:1 sobre el relleno de acierto y 12,36:1 sobre el de fallo. |
| texto secundario | `#9DBAB5` | Contador, tiempo, «Tema 1», cuerpo de la explicación, letras y aros de las opciones neutras e iconos de cabecera: 7,25:1 sobre el fondo, 6,21:1 sobre la superficie y 5,50:1 sobre la etiqueta de origen. |
| casilla vacía (icono) | `#FFFFFF` | Casillas sin marcar del icono: 15,04:1 sobre el fondo y 9,87:1 sobre el cono a su altura. Solo en el icono. |
| acierto | `#5DC650` | Borde, círculo y tic de la correcta: 4,62:1 contra su relleno y 6,92:1 contra el fondo. La letra va en `#0F2A31` (6,92:1). |
| acierto texto | `#7FD873` | Rótulo «Respuesta correcta» (5,73:1 sobre su relleno). |
| acierto fondo | `#1F4A35` | Relleno de la opción correcta. |
| fallo | `#EF6A6A` | Borde, círculo y aspa de la fallada: 4,34:1 contra su relleno y 4,97:1 contra el fondo. La letra va en `#0F2A31` (4,97:1). |
| fallo texto | `#F59A9A` | Rótulo «Tu respuesta» (6,24:1 sobre su relleno). |
| fallo fondo | `#3E2B33` | Relleno de la opción fallada. |
| aviso | `#E8863A` | El naranja de Persevera, para los avisos como «OJO, TRAMPA». No sale en la pantalla de ejemplo. Lleva siempre su icono y su texto. Como texto, 5,66:1 sobre el fondo, 4,84:1 sobre la superficie y 4,94:1 sobre el relleno de fallo. Como relleno, con texto `#0F2A31` (5,66:1). Nunca va sobre el relleno de acierto. |

## Reglas que vienen con la paleta

- La menta es la marca y nunca significa «acierto». No va en nada que diga si una respuesta está bien o mal: ni en bordes, ni en tics, ni en rótulos de corrección. Y ningún elemento de marca va en el verde del acierto.
- Acierto y marca están cerca: el acierto queda a ΔE 26,19 de la menta (23,55 su rótulo) y a 22,23 del verde heredado (22,53 su rótulo). El par más cercano entre colores que significan cosas distintas es fallo y aviso, a 21,73 (22,52 con el rótulo de fallo). Por eso cada uno lleva siempre su forma y su texto: el acierto, su tic y «Respuesta correcta»; el fallo, su aspa y «Tu respuesta»; el aviso, su icono y su texto, como «OJO, TRAMPA».
- Hace falta también por el daltonismo rojo-verde. Con deuteranopía, acierto y fallo quedan a ΔE 6,40 (8,60 sus rótulos): casi no se distinguen. Con protanopía, a 22,75. Con el aviso es peor: con deuteranopía queda a 3,95 del acierto, a 8,99 del fallo y a 9,28 del rótulo de acierto. El aviso nunca se reconoce solo por el color.
- El aviso `#E8863A`, como texto o como icono, va sobre el fondo (5,66:1), la superficie (4,84:1) y el relleno de fallo (4,94:1). Sobre la etiqueta de origen da 4,29:1: ahí puede ir el icono, que pide 3:1, pero no el texto, que pide 4,5:1. Sobre el relleno de acierto no va: el texto no llega (3,78:1) y el icono quedaría junto al borde y el tic del acierto, que con deuteranopía son casi de su mismo color. De relleno lleva texto `#0F2A31` (5,66:1), nunca `#F1FAF7` (2,50:1).
- `#2E545C` es decorativo: carril y contorno de etiquetas que no se pulsan. Nunca es el borde de un control, porque da 1,56:1 contra la superficie y 1,82:1 contra el fondo. Si un control o una etiqueta que se pulsa lleva borde, va en `#5A858C` (3,17:1 y 3,70:1). Los botones redondos de la cabecera no llevan borde, porque los reconoce su icono (6,21:1 sobre su relleno). «Siguiente» tampoco: su relleno da 9,01:1 contra el fondo.
- El `#5BA899` heredado va solo en la barra del flexo y en el estado pulsado. Las cifras lo dejarían ir de texto sobre el fondo (5,38:1) y la superficie (4,60:1), pero no se usa así: queda a ΔE 13,43 de la menta y a 22,23 del acierto, y un texto en ese verde se leería como acierto. Con protanopía, además, queda a 3,56 del rótulo de fallo.
- La pantalla de arranque y el color de fondo de Capacitor van en `#0F2A31`.
- El degradado del icono se llama `luzTests` para no chocar con el `luz` del icono de Oral si los dos van en la misma página.
- Ningún texto visible por debajo de 13 px.
- Al lanzar, la app va solo en modo oscuro. El modo claro está por diseñar.

## Lo que hay que vigilar

- Se parece más a Oral que a Persevera: las dos son oscuras y llevan el flexo que ilumina. El fondo queda a ΔE 15,39 del de Oral (8,33 con deuteranopía). De Persevera queda a 30,17 de su marca y a 76,76 del fondo de su app. Lo que la separa de Oral es la pantalla del flexo, menta frente a oro (ΔE 37,04), y la fila de casillas. Esas dos cosas no se tocan.
- La casilla menta con tic del icono es la marca, no un estado de la app. En la app el tic solo dice «acierto»: la opción elegida antes de corregir no se dibuja como esa casilla, con menta y tic.
- Una app oscura se lee peor a pleno sol. Y el motor que se copia de Persevera es claro: al pasar sus pantallas al modo oscuro hay que convertir también sus fondos claros y sus textos oscuros, no solo los colores de marca.
