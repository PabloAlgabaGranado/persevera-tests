# Persevera Tests: guía de decisiones

Estudio del 13 de octubre de 2026, hecho sobre el código de Persevera (`persevera`, `persevera-web`, `persevera-oral` y la rama del día D), sus cobros en RevenueCat y la web de la competencia. Cada recomendación pasó por una revisión escéptica, y aquí va ya corregida.

Las cifras marcadas con (V) están comprobadas en el código, en un documento del repo o en la web. Las marcadas con (I) son deducciones.

## Estado

Las siete decisiones quedaron cerradas por Blanca el 13-oct-2026. La hoja de ruta para construir la app está en `hoja-de-ruta.md`, en esta misma carpeta. Cada sección empieza por lo decidido y sigue con lo que se recomendó antes, como contexto.

| N.º | Decisión | Recomendación | Estado |
|---|---|---|---|
| 1 | Oposiciones de lanzamiento | **Decidido el 13-oct:** las 5 de Persevera al lanzar. Técnico de Hacienda (solo el primer ejercicio), Policía Nacional y GACE entran cuando estén activas en Persevera | Decidido |
| 2 | Cuentas con Persevera | **Decidido el 13-oct:** todo separado, como Persevera Oral. Base, cuentas y cobro propios, con una copia del banco que se actualiza sola desde Persevera | Decidido |
| 3 | Plataformas y tecnología | **Decidido el 13-oct:** iOS, Android y web, con cobro en la web desde el principio y Stripe propio de Tests. App nueva con la misma tecnología que Persevera | Decidido |
| 4 | Nombre y diseño | **Decidido el 13-oct:** «Persevera Tests», con icono distinto pero que evoque a Persevera y paleta de la misma gama pero distinta, como Persevera Oral | Decidido |
| 5 | Cambiar de oposición o añadir otra | **Decidido el 13-oct:** una oposición por suscripción, con un cambio gratis cada 30 días desde la app. «Añadir otra», en una versión posterior | Decidido |
| 6 | Planes semestral y anual | **Decidido el 13-oct:** 46,99 € el semestral y 79,99 € el anual, con renovación automática | Decidido |
| 7 | Prueba gratis | **Decidido el 13-oct:** 7 días de prueba, una por persona, y una muestra gratis permanente de 10 preguntas por tema | Decidido |

## Lo que conviene saber antes de decidir

- **Persevera hoy.** Es una app hecha con React y Capacitor, con iOS, Android y una versión web servida con el mismo código. Usa Supabase como base de datos y RevenueCat para las tiendas, y cobra en la web con Stripe (V). Tiene 5 oposiciones en vivo.
- **El banco de preguntas solo existe en la base de Persevera** y se corrige casi cada semana: 32.256 preguntas en total (V, AUDITS.md). Recuento por oposición del 13 de septiembre (V, docs del día D):

| Oposición | Preguntas | Supuestos (oficiales + originales) | Minicasos |
|---|---|---|---|
| Administrativo del Estado | 11.341 | 16 + 66 | 161 |
| Auxiliar Administrativo del Estado | 8.009 | ninguno (su examen no tiene) | ninguno |
| Agente de Hacienda | 9.566 | 39 + 122, los únicos de desarrollo con versión test | 222 |
| Administrativo de la Seguridad Social | 6.088 | 6 + 43 | 126 |
| Guardia Civil | 2.317 | ninguno | ninguno |

- **El día D de Persevera** (previsto, de momento, para el 27 de octubre) pasa a cobrar por oposición. Cross cuesta 14,99 € al mes e incluye las oposiciones tipo test: Administrativo, Auxiliar, Seguridad Social, Guardia Civil y Policía. Fondo cuesta 18,99 € e incluye Agente de Hacienda (V). El 9 de octubre aún no había nada aplicado en producción, y la fecha ya se movió una vez (V).
- **Persevera cobra todavía poco.** El 13 de septiembre tenía 19 suscripciones activas: 6 en Stripe, 6 en Apple, 3 en Google y 4 códigos de libro (V). En los últimos 28 días, RevenueCat marca unos 191 € de ingresos recurrentes al mes en las tiendas y 892 clientes nuevos (V).
- **Todo lo técnico pasa por Álvaro**: compilar, las consolas de Apple, Google y RevenueCat, y las migraciones. Detrás del día D vienen Policía Nacional y Persevera Oral (V). Calculo que lanzar Tests a principios de 2027 es más realista que en diciembre (I).
- **La competencia** también cobra por oposición, entre 12,90 € y 19,99 € al mes. 9,99 € es el mensual más barato del mercado, pero en el plan anual la competencia baja a 4-8 € al mes (V, webs de OpositaTest, InnoTest, Adams, PreparaOposiciones y OpoRuta).

## 1. Oposiciones de lanzamiento

**Decidido por Blanca el 13-oct-2026.** Tests sale con las 5 oposiciones que ya están en Persevera: Administrativo del Estado, Auxiliar Administrativo del Estado, Administrativo de la Seguridad Social, Agente de Hacienda y Guardia Civil. Después entran Técnico de Hacienda (solo el primer ejercicio, el tipo test), Policía Nacional y GACE, cada una cuando esté activa en Persevera. Policía Nacional entra en Persevera justo después del día D (V, especificación del día D).

Valores por defecto tomados en el hilo: el Auxiliar incluye sus psicotécnicos, y Guardia Civil lleva todo lo que Persevera ya tiene para su examen (conocimientos, ortografía, gramática e inglés). Como el catálogo va a crecer, la lista de oposiciones del onboarding tiene que salir de la base de datos, para añadir una sin publicar otra versión de la app.

Lo que se recomendó antes de decidir, por si sirve de contexto:

**Recomendación:** salir con Administrativo del Estado, Auxiliar Administrativo del Estado, Administrativo de la Seguridad Social y Agente de Hacienda. Guardia Civil va en una segunda tanda, antes de su examen de verano.

- Las cuatro tienen examen tipo test y el contenido ya está hecho. Cubren los exámenes de 2027 por orden: Hacienda en marzo-abril, Administrativo y Auxiliar en mayo-junio, Seguridad Social en junio (I, por el patrón de otros años).
- Hacienda es la única oposición con los «supuestos de desarrollo adaptados a test» que decidiste incluir. Sin ella, esa categoría queda vacía. Además, Tests no cubre su segundo ejercicio escrito, que es justo lo que vende Fondo, así que ahí la canibalización es menor.
- En el Auxiliar, 30 de las 110 preguntas del examen son psicotécnicas (V, BOE-A-2025-26262). Persevera ya las genera, y recomiendo contarlas como preguntas originales.
- Guardia Civil tiene mucha demanda (26.806 convocados en julio de 2026, V), pero su banco es el más pequeño, y la ortografía, el inglés y los psicotécnicos hay que adaptarlos antes.
- **Trabajo de datos antes de lanzar:** marcar como «adaptadas a test» las versiones de 4 opciones de Hacienda, con el aviso de que la letra correcta de los oficiales la pone Persevera y no el tribunal. Etiquetar las preguntas de Windows 10 y Windows 11 para el Auxiliar. Sacar la promoción interna del selector de examen real de Seguridad Social.

## 2. Cuentas con Persevera

**Decidido por Blanca el 13-oct-2026: todo separado, como Persevera Oral.** Tests tiene su propio proyecto de Supabase, sus cuentas, su proyecto de RevenueCat y sus claves. No comparte nada con Persevera en tiempo de ejecución, y quien tenga Persevera se crea otra cuenta para Tests.

Valor por defecto tomado en el hilo para que la copia del banco no se quede atrás: una copia automática en un solo sentido, de Persevera a Tests, que se repite sola (por ejemplo, cada noche). Las preguntas se corrigen siempre en Persevera y nunca en Tests. La copia trae solo el contenido (preguntas, exámenes oficiales, supuestos y lo que los ordena por oposición), nunca datos de usuarios. Cómo se hace exactamente lo decide Álvaro.

Consecuencias para lo que queda: la pregunta de si quien paga Persevera tiene Tests incluido deja de aplicar. Las barreras contra que una compra de Tests abra Persevera ya no hacen falta, y Tests no depende de la protección del día D, así que puede empezarse sin esperar a que el día D esté estable (salvo por el tiempo de Álvaro).

Lo que se recomendó antes de decidir, por si sirve de contexto:

**Recomendación:** la misma cuenta y la misma base de datos que Persevera, con el cobro de Tests totalmente aparte.

- El valor de Tests es un banco vivo. Copiarlo a otra base, como se hizo con Persevera Oral, convierte cada corrección en un problema de sincronización. Persevera ya decidió «compartir, no duplicar» (V, MULTIOPOSICION.md).
- Con la misma cuenta, quien pase de Tests a Persevera conserva sus fallos y su progreso. Tests funciona así como escalón hacia Persevera.
- **Barreras obligatorias.** Hoy una compra de Tests abriría Persevera Premium entero por cinco vías distintas (V). Hacen falta: una tabla de suscripciones propia de Tests, un proyecto de RevenueCat y un webhook propios, la oposición de cada suscripción guardada en el servidor, y avisos cruzados al borrar la cuenta o reiniciar el progreso, porque afectan a las dos apps.
- **Cómo lee Tests el contenido.** La protección del día D cierra las tablas de preguntas a quien no tenga derechos de Persevera (V). Tests tiene que leerlas a través de vistas o funciones propias que comprueben sus suscripciones, sin tocar la protección de Persevera. Esto se diseña ya con Álvaro y se construye cuando el día D esté estable.
- **Queda por decidir aquí** si quien paga Persevera tiene Tests incluido para su oposición. Recomiendo que sí, porque no cuesta nada y evita que alguien pague dos veces por lo mismo.

## 3. Plataformas y tecnología

**Decidido por Blanca el 13-oct-2026:** iOS, Android y web desde el lanzamiento, y se cobra también en la web desde el principio, con una cuenta de Stripe propia de Tests.

Valores por defecto tomados en el hilo:
- App nueva en su propio repositorio, con la misma tecnología que Persevera (React, Vite y Capacitor), copiando el motor de tests con la regla de Oral («copiar, nunca mover») y una prueba que avise si la copia se separa del original.
- La web es el mismo código publicado en un subdominio, por ejemplo tests.perseveraoposiciones.com.
- La cuenta de Stripe de Tests se conecta al proyecto de RevenueCat de Tests (RevenueCat Billing). Así un solo sitio sabe quién ha pagado, sea en iOS, en Android o en la web, y la cuenta de Stripe de Persevera no se toca.
- Como se vende en la web, la app de iOS vende también dentro de la app (norma 3.1.3(b) de Apple).

Lo que se recomendó antes de decidir, por si sirve de contexto:

**Recomendación:** iOS y Android desde el primer día. El mismo código publicado en la web (por ejemplo, tests.perseveraoposiciones.com), al principio solo para entrar y usar lo comprado en las tiendas. El cobro en la web, más adelante.

- **App nueva** con la misma tecnología que Persevera: React, Vite y Capacitor. Copiaría el motor de tests, simulacros y supuestos, unas 18.000 líneas reutilizables en un 75-80 % (I). Se haría con la regla de Oral, «copiar, nunca mover», y con una prueba automática que avise si la copia se separa del original.
- Las mismas cuentas de desarrollador de Apple y Google, con un identificador propio (`com.persevera.tests`). Inicio de sesión con correo, Google y Apple.
- **Cobro en la web.** El margen extra es pequeño (unos 7,8 € netos frente a 7,02 € en tiendas, I) y añade un tercer circuito de cobro. Con todo separado, cuando toque, lo coherente es RevenueCat Billing dentro del proyecto de Tests o una cuenta de Stripe propia de Tests, nunca la de Persevera.
- **Plan B** si Apple rechaza Tests por parecerse demasiado a Persevera (norma 4.3): una tarifa «solo tests» dentro de Persevera.
- **Pendiente de comprobar:** si la cuenta de Apple está en el Small Business Program. Con él, Apple se queda el 15 %; sin él, el 26 % el primer año en la UE (V).

## 4. Nombre y diseño

**Decidido por Blanca el 13-oct-2026:** el nombre es «Persevera Tests», con identidad propia hecha como en Persevera Oral. El icono es distinto pero parecido, y evoca a la marca Persevera. La paleta de la app es de la misma gama de colores que Persevera, pero distinta.

Punto de partida comprobado en el código:
- Persevera usa como marca el verde académico `#0D7C66` (con `#0A6352`, `#5BA899` y `#E8F5F1`), el azul noche `#1B2A4A` como color estructural y un fondo blanco verdoso `#F6F9F6` (`persevera/src/theme/theme.css:21-59`).
- Persevera Oral usa el azul noche `#1B2A4A` como fondo, el oro `#E8B84B` como color de marca, y el verde `#0D7C66` solo en la acción principal de cada pantalla (`persevera-oral/src/tema/paleta.ts`).
- **Elegida por Blanca el 13-oct-2026: la dirección «Noche y menta»**, icono incluido, en lugar de «Petróleo», que había elegido antes ese mismo día. La pantalla del flexo, en menta, ilumina cuatro casillas de respuesta con la tercera marcada, sobre un petróleo casi negro. La app es oscura, con la marca en menta `#7AD8D2` sobre el fondo `#0F2A31` y el texto casi blanco `#F1FAF7`, y el verde queda solo para los aciertos. Icono, paleta completa y pantalla de ejemplo en `persevera-tests/marca/` (`icono.svg`, `icono-1024.png`, `paleta.md`, `pantalla-ejemplo.svg`); Petróleo queda en `marca/propuestas/`. Las tres propuestas se pueden ver en https://claude.ai/artifact/9DU4dq63g8vgFQhaoXbDQo.

Lo que se recomendó antes de decidir, por si sirve de contexto:

**Recomendación:** mantener «Persevera Tests», con color, icono, capturas y navegación propios.

- Una interfaz claramente distinta es la mejor defensa ante la norma 4.3 de Apple, y sale barata, porque la navegación, el onboarding, el paywall y las estadísticas hay que hacerlos nuevos de todos modos.
- Propuesta: tres pestañas (Practicar, Simulacros, Mis fallos y progreso) y un onboarding de dos pasos (elegir oposición y elegir plan).
- Desde el principio: etiquetas visibles «Oficial» con la convocatoria, «Original» y «Supuesto de desarrollo adaptado a test», y un botón para reportar una pregunta, que hoy no existe en los tests de Persevera (V).
- **La alternativa** es una marca sin «Persevera». Protege mejor la imagen de precio de Persevera, cuya web dice que no quiere estar en «la liga de las apps de tests» (V, precio.astro), a cambio de perder la confianza que ya tiene la marca.

## 5. Cambiar de oposición o añadir otra

**Decidido por Blanca el 13-oct-2026:** una suscripción da una oposición. Se puede cambiar gratis desde la app una vez cada 30 días, conservando el progreso. Añadir una segunda oposición llega en una versión posterior. Los detalles que siguen se aplican tal cual.

Lo que se recomendó antes de decidir:

**Recomendación:** una suscripción da una oposición. Se puede cambiar gratis desde la app una vez cada 30 días, y lo valida el servidor. La primera elección y los cambios durante la prueba no cuentan. El progreso se conserva, porque se guarda por pregunta.

- Basta un grupo de suscripción por tienda, así que hay una sola prueba gratis por persona. Son las mismas reglas que Persevera ya ha redactado para el día D (V).
- Pasar del Auxiliar al Administrativo no cuesta nada, y conviene anunciarlo como ventaja.
- **Añadir una segunda oposición**, en una segunda versión: un producto «2 oposiciones» dentro del mismo grupo de suscripción, a 19,98 €. Así Apple prorratea la subida y no abre otra prueba gratis.

## 6. Planes semestral y anual

**Decidido por Blanca el 13-oct-2026:** 46,99 € el semestral y 79,99 € el anual, con renovación automática, junto al mensual de 9,99 €. Se copian de Persevera el aviso de renovación y el correo de alta que pide la Ley 10/2025.

Lo que se recomendó antes de decidir:

**Recomendación:** 46,99 € el semestral (7,83 € al mes, un 22 % menos) y 79,99 € el anual (6,67 € al mes, un 33 % menos), con renovación automática.

- En Persevera, 10 de cada 15 suscripciones de pago son mensuales (V), así que el mensual es lo que más importa.
- El semestral sería el más barato del mercado. El anual queda en la zona media: igual que PreparaOposiciones y por debajo de OpositaTest e InnoTest, pero por encima de Adams y de OpoRuta (V).
- Netos en tiendas al 15 %: unos 33 € por semestre y 56 € por año (I).
- **Obligación legal:** avisar de cada renovación con antelación y mandar un correo que confirme el alta (Ley 10/2025). Persevera ya lo tiene diseñado para el día D, y Tests puede copiarlo (V).

## 7. Prueba gratis

**Decidido por Blanca el 13-oct-2026:** 7 días de prueba con acceso completo, una por persona, y además una muestra gratis permanente (un test de 10 preguntas por tema) para quien no quiera dar la tarjeta.

Valores por defecto tomados en el hilo: en la web, la prueba también pide la tarjeta, como en las tiendas, para que los tres canales funcionen igual; la muestra cubre a quien no quiera darla. Se mide desde el primer día cuántos empiezan la prueba y cuántos acaban pagando.

Lo que se recomendó antes de decidir:

**Recomendación:** 7 días de prueba en las tiendas, una por persona, y una muestra gratis permanente para quien no quiera dar la tarjeta.

- Siete días es lo que ya da Persevera y lo habitual en el mercado (V).
- La muestra puede ser el «Test del tema» de 10 preguntas que la web pública ya publica para las 5 oposiciones (V). Con la base separada, Tests la sirve desde su propia base.
- Hay que medir desde el primer día cuántos empiezan la prueba y cuántos acaban pagando. En Persevera casi nadie la empieza: 2 pruebas activas frente a 892 clientes nuevos (V).

## Riesgos que no cambian lo decidido, pero hay que tener presentes

- **Precio frente a Cross.** En las oposiciones tipo test, Tests a 9,99 € cubre casi el mismo examen que Cross a 14,99 €. Lo que frena el cambio es que Tests no tiene tutor, plan, flashcards ni corrección con IA. Falta decidir qué pasa con quien pague las dos.
- **Calidad del banco.** El equipo conoce sesgos en algunas preguntas, como que la respuesta correcta sea la más larga, y la web los filtra al elegir su muestra (V). En una app que solo tiene tests, el opositor los nota antes.
- **Claves de los exámenes oficiales.** No consta que todas sean las de la plantilla definitiva, y las preguntas sueltas no tienen un campo de «anulada» (I). Venderlas como oficiales exige revisarlas.
- **Carga sobre la base de Persevera.** Los usuarios de Tests usarían la misma base de producción (I).
