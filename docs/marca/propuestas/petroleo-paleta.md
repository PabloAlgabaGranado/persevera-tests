# Paleta de Persevera Tests: Petróleo

> Guardada en `propuestas/` el 13-oct-2026, cuando Blanca eligió «Noche y menta» (ver `../paleta.md`). Aquí `icono.svg` es `petroleo-icono.svg`, `icono-1024.png` es `petroleo-icono-1024.png` y `pantalla-ejemplo.svg` es `petroleo-pantalla.svg`. El texto va tal cual, salvo la etiqueta de origen, que se cita como sale en su pantalla: «Oficial, AGE 2024».

Elegida por Blanca el 13-oct-2026. Es la dirección «Petróleo»: la app es clara como Persevera, usa el azul petróleo como color de marca y el azul noche de la familia para el texto. El verde queda solo para los aciertos.

Los contrastes los recalculó un revisor con la fórmula WCAG y todos los pares de texto e interfaz pasan AA. Ficheros: `icono.svg` (1024x1024, sin transparencia), `icono-1024.png` y `pantalla-ejemplo.svg` (una pregunta de ejemplo, ya corregida). Las otras dos propuestas que no se eligieron están en `propuestas/`.

| Papel | Color | Uso |
|---|---|---|
| marca | `#0E5E6F` | Petróleo (191°). Fondo del icono, botón «Siguiente» (blanco encima 7,37:1), barra de progreso (5,48:1 contra el carril) y marca como texto sobre el fondo (6,83:1). |
| marca profunda | `#0A4553` | Casillas marcadas del icono, texto de la etiqueta de origen, «Por qué» y mini flexo de la etiqueta (9,05:1 sobre la pálida), y botón pulsado (blanco encima 10,56:1). |
| luz | `#7DD3D8` | Pantalla del flexo y cono de luz (del 34 % al 0 %). Solo sobre oscuro (4,28:1 sobre la marca); nunca texto sobre claro. |
| medio decorativo | `#4AA9B3` | Barra del flexo. Decorativo: nunca texto (2,7:1 sobre blanco). |
| casilla vacía (icono) | `#BFD4DA` | Casillas sin marcar y línea de cabecera de la hoja del icono (decorativo, 1,54:1 sobre la hoja). |
| pliegue (icono) | `#A9D6DC` | Esquina doblada de la hoja del icono. |
| pálida | `#E2F0F3` | Fondo de la etiqueta «Oficial, AGE 2024» y de la caja «Por qué». |
| fondo | `#F3F7F8` | Fondo de la app. |
| superficie | `#FFFFFF` | Tarjetas de opción neutras y hoja del icono. |
| borde de opción | `#7A8E98` | NUEVO. Borde de las opciones neutras, de 1,25 px: 3,41:1 contra la tarjeta y 3,17:1 contra el fondo (WCAG 1.4.11). |
| carril / separador | `#D5E0E4` | Carril de la barra de progreso y separadores. Decorativo; nunca como borde de un control. |
| estructural / texto | `#1B2A4A` | Enunciado, textos de las opciones, títulos e iconos de cabecera: 13,19:1 sobre el fondo y 14,22:1 sobre blanco. |
| texto secundario | `#56677A` | Contador y textos de apoyo: 5,38:1 sobre el fondo y 5,81:1 sobre blanco. |
| neutra de opción | `#EAF0F2` | Círculo de la letra en las opciones sin corregir (letra #1B2A4A, 12,36:1). |
| acierto | `#1B7D3E` | Borde, círculo y tic de la correcta, y punto de aciertos: 4,57:1 contra su relleno y 4,81:1 contra el fondo; la letra blanca da 5,19:1. |
| acierto fondo | `#E6F4EA` | Relleno de la opción correcta. |
| acierto texto | `#14652F` | Rótulo «Respuesta correcta» (6,31:1). |
| fallo | `#C8423C` | Borde, círculo y aspa de la fallada, y punto de fallos: 4,20:1 contra su relleno y 4,53:1 contra el fondo; la letra blanca da 4,88:1. |
| fallo fondo | `#FBEAE9` | Relleno de la opción fallada. |
| fallo texto | `#A12E29` | Rótulo «Tu respuesta» (6,14:1). |
| aviso | `#E8863A` | El naranja de Persevera, solo como relleno de «OJO, TRAMPA» con texto #1B2A4A (5,35:1). Nunca como icono ni texto sobre claro (2,66:1). |
| aviso texto e icono | `#A05116` | Antes #A9561A, que daba 4,46:1 sobre la pálida. Ahora 5,70:1 sobre blanco, 5,29:1 sobre el fondo y 4,88:1 sobre la caja «Por qué». |

## Reglas que vienen con la paleta

- Ningún elemento de marca va en verde: el verde significa «acierto» en cada pregunta.
- Con daltonismo rojo-verde, acierto y fallo se confunden. La app marca siempre el acierto con un tic y el fallo con un aspa, y escribe «Respuesta correcta» y «Tu respuesta».
- El aviso naranja `#E8863A` solo se usa como relleno con texto `#1B2A4A`. Como texto o icono se usa `#A05116`.
- El color de luz `#7DD3D8` solo va sobre fondos oscuros, nunca como texto sobre claro.
- El degradado del icono se llama `luzTests` para no chocar con el `luz` del icono de Oral si los dos van en la misma página.
- El modo oscuro de la app está por diseñar.
