# La hoja de ruta de Persevera Tests

Lo que queda para publicar la app y en qué orden. Cada conversación empieza leyendo esto, hace una sola tarea y la marca como hecha en el mismo commit (con la fecha y el commit). Si una tarea cambia o aparece otra, se cambia aquí. Las decisiones de producto están en `docs/guia-decisiones.md`, la guía que cerró Blanca el 13-oct-2026. Si algo de aquí choca con ella, manda la guía. Lo marcado «propuesto» sale de lo que la guía recomendaba antes de decidir, no de una decisión: Blanca puede cambiarlo.

Cada tarea lleva un código para poder decir qué espera a qué: T (se puede hacer ya), A (lo hace Álvaro), C (contenido), P (antes de publicar) y D (después del lanzamiento). Las T van en el orden en que se hacen, aunque dos no van por su número. T9 va justo después de T1, porque Álvaro empieza ya sus tareas y necesita su guía. T23 va justo después de T4, porque su paso de tema se aplica a cada fichero del motor que se copia. Las rutas de Persevera empiezan en la raíz de su repositorio. En el Mac está en `/Users/alvaroalgaba/Desktop/EXAMI/PRIMERA DESCARGA EN MAC/persevera`, siempre entre comillas. Lo que se cita de la rama del día D lleva delante `claude/dia-d` y está comprobado en 54e448e. Las citas sin prefijo son de `main` en 2b3ed1d (17-sep) y solo orientan. Cada tarea vuelve a buscar las líneas en el commit que copia, porque en `claude/dia-d` ya no cuadran: en `TakeTest.tsx`, `TutorView` pasa de las líneas 10, 591 y 1194 a las 13, 635 y 1241.

La meta: Persevera Tests publicada en iOS, Android y la web (tests.perseveraoposiciones.com). Con ella, un opositor puede entrar, elegir una de las 5 oposiciones y hacer gratis el test de muestra de cada tema. Después empieza los 7 días de prueba o paga uno de los tres planes. Practica con el banco de Persevera, que se copia solo cada noche: tests por tema, exámenes oficiales, supuestos, simulacros y sus fallos.

## Hecho

- [x] Las siete decisiones de producto, cerradas por Blanca el 13-oct-2026 (`guia-decisiones.md`).
- [x] El icono y la paleta: la dirección «Noche y menta», elegida por Blanca el 13-oct-2026 en lugar de «Petróleo» (`marca/paleta.md` y su carpeta).
- [x] El correo de soporte: hola@perseveraoposiciones.com, elegido por Blanca el 13-oct-2026. Se redirige a hola@brooksoo.com, el buzón que ya contesta lo de Persevera (`claude/dia-d`, `docs/dia-d/comunicacion-y-terminos.md`, línea 1015).
- [x] El tiempo de Álvaro: «Todo ya», elegido por Blanca el 13-oct-2026. Álvaro hace ya todas sus tareas de Tests, a la par del día D, aunque Policía Nacional (1.14) y el pago de Persevera Oral tengan que esperar. El calendario lo recoge.

## Se puede hacer ya

Esto lo hacen conversaciones en el repositorio nuevo, sin consolas. Cuando una tarea espera algo de Álvaro, lo dice. Cuando deja algo que Álvaro tiene que subir o desplegar (la copia, una función con sus secretos, las plantillas de los correos, el icono), añade sus pasos a la guía de T9 en el mismo commit.

Todas las piezas de Persevera se copian del mismo commit. Es el de `claude/dia-d` el día de la primera copia (hoy 54e448e) o, si el día D ya está unido, el de `main` de después. Su motor ya cuenta el banco por RPC, que es lo que Tests necesita con su RLS (T10). Ese commit va en la cabecera de cada fichero y en la prueba de paridad (T4). Cada tarea sigue los `import` de lo que copia en ese commit y copia también lo que falte, con su cabecera. Lo que sea tutor, plan, gamificación, paywall de Persevera o ejercicio escrito se corta.

- [x] **T1. El repositorio y sus reglas.** Hecho el 13-oct-2026 en bc377fa, y la marca en `docs/marca/` en el commit siguiente. Espera a: A1. Montar el esqueleto con la misma tecnología que Persevera Oral:
  - `eslint.config.js`, `tsconfig*.json` y vitest, copiados de `persevera-oral`.
  - `package.json`, a partir del de Oral pero sin lo que solo usa Oral (`@independo/capacitor-voice-recorder`, `mammoth` y `pdfjs-dist`). Lleva lo que pide el motor, con las versiones de `persevera/package.json` (líneas 16-34): `@capacitor/haptics`, `@capacitor-community/in-app-review`, `@capacitor/app`, `@capacitor/browser` y `@revenuecat/purchases-capacitor`. Y el SDK web de RevenueCat (`@revenuecat/purchases-js`), que Persevera no usa.
  - `vite.config.ts` con `build: { target: 'safari14' }`, copiado de Persevera. Sin el proxy del worker, porque Tests no tiene tutor.
  - `capacitor.config.ts` con `appId: 'com.persevera.tests'` y `appName: 'Persevera Tests'`, todavía sin `ios/` ni `android/`.
  - De Persevera, `public/_headers`, `public/_redirects`, `public/confirmado.html` y la red de seguridad en línea de `index.html`. La cabecera de `_redirects` dice que la defensa real contra su comodín está en `index.html`. Se pueden copiar también dos guardianes de `claude/dia-d`: `scripts/comprobar-tamano-dist.mjs` y `scripts/comprobar-acceso-forzado.mjs` (este, solo si Tests tiene un interruptor para forzar el acceso).
  - Un `CLAUDE.md` hecho a partir del de Oral. Lleva «copiar, nunca mover» con cabecera de procedencia, GRANT y RLS en cada migración, toda función SECURITY DEFINER cerrada a `public` y `anon`, y las normas del texto visible. Y dos reglas propias. El banco no se corrige aquí: se corrige en Persevera y llega con la copia de la noche. El motor tampoco se arregla aquí.
  - Esta hoja, copiada a `docs/hoja-de-ruta.md`, la guía a `docs/guia-decisiones.md`, la guía de consolas a `docs/guia-consolas.md` (T9) y la carpeta `marca/` (icono, paleta y pantalla de ejemplo) a `docs/marca/`.

  Hecho cuando `npm run lint`, `npx tsc -b`, `npm run test` y `npm run build` pasan en verde con una pantalla vacía, y el commit está subido.

- [ ] **T9. La guía para Álvaro.** Borrador hecho el 13-oct-2026 en la carpeta del proyecto (`guia-consolas.md`, junto a esta hoja); T1 lo copia a `docs/guia-consolas.md`, y se da por hecha cuando Álvaro siga su primer bloque sin preguntar. Espera a: T1. Va justo después de T1, porque Blanca decidió el 13-oct-2026 que Álvaro hace ya sus tareas, a la par del día D. Escribir `docs/guia-consolas.md` siguiendo el modelo de `claude/dia-d`, `docs/dia-d/guia-consolas.md`. Primero cubre, en orden, lo que Álvaro puede hacer ya: A2, A4, A5, la primera parte de A7 (Resend y la dirección de vuelta) y de A8 a A13. A3 ya va explicada aquí. Los pasos de A6, del resto de A7, de A14, A15 y A16 los añade después la tarea que hace lo que se sube o se despliega: T10, T12, T13, T19 a T21 y T23. Cada parte lleva:
  - el tiempo de cada bloque;
  - los identificadores listos para copiar y pegar (`com.persevera.tests` y los tres productos);
  - qué no tocar de Persevera;
  - qué datos no secretos tiene que devolver.

  Lleva también la propuesta de la copia del banco: qué copia, cómo, cómo se comprueba y dónde corre (lo que describe T10). La lista de columnas de cada tabla la cierra T10, cuando el motor ya esté copiado. La guía de decisiones dice que cómo se hace exactamente lo decide Álvaro (`guia-decisiones.md`, línea 59). Él la aprueba o la cambia en A5, antes de que T10 la escriba. Hecho cuando Álvaro puede seguir esa primera parte sin preguntar, y cada paso dice qué tarea desbloquea.

- [x] **T2. El esquema de Tests.** Hecho el 13-oct-2026: cuatro migraciones en `supabase/migrations/` y `npm run probar:esquema` en verde en las dos pasadas. Tres cosas cambian respecto a lo de abajo. `simulacros` va vacía y sin función ni disparador: en Persevera nunca existieron (lo comprobó `src/lib/simulacroGC/__tests__/persistencia.test.ts`, líneas 104-112), y con ellos cada simulacro contaría dos veces, porque `userStats.ts` suma esa tabla y `simulacro_sesiones`. `registrar_aceptacion` saca la versión de una tabla nueva, `version_terminos`, porque Tests no tiene el interruptor de Persevera. Y las tablas del contenido llevan RLS sin políticas: hasta T10 la app no ve ninguna fila. Lo que falta por confirmar de las tablas hechas en el panel de Persevera va marcado «sin ver» en `20261013200000_comun_y_contenido.sql`, y lo cierra T10 con A3. Migraciones en `supabase/migrations/`, probadas con PGlite como en Oral (`scripts/arnes-supabase.mjs` y `scripts/probar-esquema.mjs`). Cada prueba hace dos pasadas: con los GRANT automáticos y sin ellos, porque Supabase deja de darlos el 30-oct-2026.

  Las tablas del contenido (las que copia T10) se crean aquí, con las columnas que tienen en A3, menos la rúbrica y el texto del temario, que T10 no copia, y una `retirada_at`. Sus UNIQUE son parciales (`where retirada_at is null`), y las restricciones `_jugable` de las preguntas de supuestos, que usan `puntos_clave` (no se copia), se adaptan (`guia-consolas.md`, anexo A, A.3). Cuando T10 cierre su lista de columnas, ajusta estas tablas en su propia migración. Su RLS, su copia y lo que se calcula sobre ellas son de T10.

  Cuando el motor copiado lee una tabla de Persevera, en Tests la tabla se llama igual y tiene las mismas columnas, para que la copia del código no cambie:
  - `respuestas_usuario` y `pregunta_respondida`, con sus disparadores y sus políticas.
  - `study_activity_log`, solo con las columnas que escribe `activityLog.ts` (líneas 153-166).
  - `simulacros`, con la función y el disparador que la rellenan desde `study_activity_log`.
  - `simulacro_sesiones`.
  - Las vistas `v_estado_pregunta_usuario` (de `20260620000001_v_estado_epigrafe.sql` y `20260804140000_reset_progreso_por_epigrafe.sql`) y `v_casos_para_revisar`.
  - La función `preguntas_aleatorias` (de `20260723000000_preguntas_aleatorias.sql`).

  Las que se crearon fuera de las migraciones de Persevera se cierran con A3. Hasta entonces, se escriben con lo que leen y escriben los ficheros copiados.

  Lo nuevo va en español:
  - `catalogo_tests`: qué oposiciones se ofrecen, en qué orden y desde cuándo. Es de Tests y la copia del banco no la toca. El onboarding la lee, así que una oposición nueva entra sin publicar otra versión.
  - `eleccion_oposicion`: la oposición de cada usuario (`user_id`, como lo llama el motor). Lleva `plaza` 1 (la plaza 2 queda para «Añadir otra»), `elegida_at` y si el cambio cuenta para los 30 días. Su historial va en `cambios_oposicion`, copiada y adaptada de `claude/dia-d`, `20261005090000_cobro_1_catalogo_contrato.sql` (línea 384).
  - `suscripciones`: una fila por compra. Se parte de la tabla de Oral (`persevera-oral`, `20261008120000_esquema_inicial.sql`, líneas 1492-1525). Trae `unique (plataforma, id_externo)`, el estado, el producto, la fecha de fin y el disparador `solo_servidor` (líneas 82-89). Se le añaden el entorno, la duración, `en_prueba`, `renueva` y la web (RevenueCat Billing) entre las plataformas. La columna del usuario pasa a `user_id`.
  - `tiene_acceso(usuario, oposicion)`, nueva. En Oral solo existe `tiene_acceso_de_pago(p_usuario)`, sin oposición (línea 1532). Une `suscripciones` con `eleccion_oposicion`. Una fila de sandbox solo cuenta para las cuentas de `cuentas_de_prueba`.
  - `cuentas_de_prueba` (`revisor` y `qa`), copiada de `cobro_1` (líneas 242-271), donde el día D ya deja el sandbox solo para ellas.
  - `pruebas_usadas`: quién ha gastado ya la prueba, en cualquier canal. Lo que impide repetirla sobrevive al borrado de la cuenta, como `huellas_prueba` en `cobro_1` (línea 396). Allí es la huella de la tarjeta: no da el nombre, pero es un dato seudónimo, y P2 lo declara. La app lo pregunta con `prueba_disponible()`, SECURITY DEFINER y cerrada a `public` y `anon`.
  - `eventos_pago` (de `cobro_1`, línea 402).
  - `aceptaciones_terminos` (de `cobro_1`, línea 415) y la función `registrar_aceptacion` (de `claude/dia-d`, `20261005091000_cobro_2_rpc.sql`, línea 440).
  - `avisos_renovacion`, copiada de `claude/dia-d`, `20261002150000_avisos_renovacion.sql`.
  - `reportes_pregunta` (propuesto): quién reporta, qué pregunta (tabla e id), un motivo de una lista corta, un texto opcional de hasta 500 letras y el estado de la revisión. Si la pregunta no tiene id en la base (los psicotécnicos que se generan en la app), guarda una copia del ítem, como `psico_reportes` (`20260619000001_psico_reportes.sql`, líneas 9-18). Cada usuario inserta y ve los suyos, con un tope diario.
  - `embudo`: muestra empezada, paywall visto y compra empezada (T22).
  - `version_minima_app`, copiada de `claude/dia-d`, `20261001120000_version_minima_app.sql`. Sirve para obligar a actualizar cuando un arreglo del motor lo pida (D7).

  Hecho cuando `npm run probar:esquema` pasa las dos pasadas. Comprueba tres cosas: la matriz de permisos por rol y por tabla, que nadie salvo el servidor escribe `suscripciones`, `eventos_pago`, `pruebas_usadas` ni `cuentas_de_prueba`, y que `tiene_acceso` no cuenta el sandbox de una cuenta normal.

- [ ] **T3. La base común.** Copiar de Persevera, con su cabecera:
  - `src/lib/oposicionesIds.ts` y `src/lib/oposicionScope.ts`.
  - `src/services/studyPlanEngine/reglasOposicion.ts`. Es un módulo puro, y aquí solo sirve para la penalización y los bloques con supuestos.
  - `src/styles/examen.ts`, `src/lib/textUtils.ts`, `src/lib/pruebaIdioma.ts` y `src/lib/paginarSupabase.ts`.
  - `src/lib/cifras.ts`, que trae `miles()` y los decimales con coma (`dosDecimales` y `hastaDosDecimales`). Es la de Persevera y no la de Oral, para no tener dos.
  - Lo que en `claude/dia-d` piden el test y Mis fallos: `src/lib/contextoTest.ts`, `src/lib/desgloseTest.ts`, `src/lib/bancoDeTest.ts` y `src/lib/recuentosPorRpc.ts`, que cuenta el banco con las RPC de T10.
  - `src/components/common/RejillaRespuestas.tsx`, `BotonVolver.tsx`, `CloseButton.tsx`, `Collapse.tsx`, `ContextMenu.tsx` y la carpeta `Loading/`.
  - Los ganchos `useHaptics`, `useHapticsAutoBind`, `useSounds` y `useLongPress`.

  `src/lib/oposicionActivaContext.tsx` se reescribe. En Persevera lee y escribe `usuario_oposicion` (líneas 149-155). Aquí lee la oposición de `eleccion_oposicion` (T2) y nunca la escribe: la cambia la función de T17. Hecho cuando compila y pasan las pruebas copiadas con estos ficheros: `src/lib/__tests__/oposicionesIds.test.ts`, `src/lib/__tests__/pruebaIdioma.test.ts`, `src/lib/textUtils.test.ts`, `src/lib/paginarSupabase.test.ts` y `src/lib/cifras.test.ts`.

- [ ] **T4. La prueba de paridad del motor.** Escribir `scripts/test-paridad.mjs` (`npm run test:paridad`) siguiendo el modelo de `persevera-oral/worker/test-paridad.mjs`.
  - Saca cada original con `git show <commit>:<ruta>` del repositorio de Persevera (variable `PERSEVERA_REPO`) y no escribe nada allí.
  - Un módulo puro tiene que quedar igual línea a línea, salvo la cabecera.
  - En un fichero con cambios, la diferencia con el original tiene que ser exactamente la guardada en `paridad/<fichero>.diff`. Los cortes y los añadidos van ahí, cada bloque con el código de la tarea que lo pide: un corte de T5, la etiqueta de T18, el reporte de T19, el turno de C5. Una diferencia sin tarea hace fallar la prueba. Siempre que se pueda, lo nuevo va en envoltorios fuera de los ficheros copiados.
  - Ejecuta los constructores de simulacros, el original y la copia, con el mismo banco de prueba y el mismo azar fijado, y exige el mismo resultado.
  - Cuando exista la copia del banco (T10), comprueba que el alcance que calcula coincide con su regla sobre el banco de prueba. Deja escrita la diferencia de `version_so`, que el código de Persevera no filtra.
  - Comprueba que las columnas que piden los `.select` de lo copiado están todas en la lista de la copia (T10).

  Cada tarea que copia algo lo añade aquí. Como el motor pasa a la paleta de Tests (T23), la comparación se hace después de ese paso de tema. Hecho cuando pasa en verde con lo de T3 y falla si se cambia a propósito una línea de lógica de un módulo copiado.

- [ ] **T23. La identidad de Persevera Tests.** Va justo después de T4. Blanca eligió la dirección «Noche y menta» el 13-oct-2026, icono incluido, en lugar de «Petróleo», que había elegido antes ese mismo día. El icono, la paleta con sus reglas y una pantalla de ejemplo están en `docs/marca/` (T1): `icono.svg`, `icono-1024.png`, `paleta.md` y `pantalla-ejemplo.svg`.
  - Los colores de `paleta.md` van en `src/tema/paleta.ts`. Como en Oral, un color nuevo se añade allí y no suelto.
  - Se cumplen las reglas de `paleta.md`. La menta es la marca y nunca significa «acierto»: ningún elemento de marca va en verde y la menta no marca nada como correcto. El acierto lleva siempre su tic y el fallo su aspa, además de «Respuesta correcta» y «Tu respuesta», porque con daltonismo rojo-verde no se distinguen por el color. El naranja de aviso va solo donde lo permite `paleta.md`, y el borde de un control nunca es el color estructural decorativo.
  - El paso de tema del motor, tomado por defecto (sección «Lo que se ha tomado por defecto»). Un script cambia en lo copiado los colores fijos de Persevera por los de la paleta (y, como Tests es oscura y Persevera clara, también sus fondos claros y su texto oscuro), sube a 13 px los tamaños de letra menores y quita el «·» de los textos. Cada tarea que copia algo del motor lo pasa por el script.
  - El icono, en todos los tamaños, a partir de `icono.svg`.
  - La pantalla de arranque y el color de fondo de Capacitor, en `#0F2A31`.
  - El modo claro está por diseñar (`paleta.md`). Hasta entonces, la app va solo en oscuro, aunque el móvil esté en modo claro (propuesto).

  Hecho cuando `paleta.ts` existe, lo copiado en T3 ya ha pasado por el script y no usa ningún color fuera de la paleta ni letra por debajo de 13 px, T4 compara después del script, y el icono está en `assets/`, listo para A14. De T5 a T8, cada copia pasa por el script y T4 lo comprueba.

- [ ] **T5. Hacer un test y revisarlo.** Copiar `src/components/views/TestSelectorModal.tsx`, `TakeTest.tsx` y `SelectorInglesModal.tsx`.
  - En `TakeTest.tsx` se quitan tres cosas. El tutor: `TutorView`, líneas 10, 591 y 1194. El plan: `intentarMarcarPorActividad`, líneas 14 y 775. La gamificación: `logActivity`, líneas 8 y 376, que pasa a un `registrarActividad` mínimo que solo inserta en `study_activity_log` (T2).
  - En `TestSelectorModal.tsx` se quitan el repaso de flashcards (`onRepasoFSRS`, línea 63 y líneas 684-701) y el paywall de Persevera.
  - El paywall está en `usePremium` y `PaywallModal` (líneas 7, 11 y 131) y en su modal (656-663 y 734). También en cada uso de `esPremium`:
    - el arranque directo (221-233);
    - el efecto y el corte que llevan al Tema 1 del Bloque 1 (337-350 y 365-371);
    - Mis fallos y Examen real de pago (748 y 754);
    - la muestra de Practicar (810 y 822);
    - el Modo examen de pago (1026).
  - Cada uso pasa a un `tieneAcceso` que sale de la base (T2). Sin acceso, Practicar solo ofrece la muestra (T11) y lo demás abre el paywall (T14). Hasta que lleguen, valen los de la maqueta.
  - Los recuentos salen de las RPC de T10, por `bancoDeTest.ts`, como en `claude/dia-d`. Con la RLS, contar leyendo las tablas daría 10 preguntas por tema y escondería bloques.
  - `cargarEpigrafesTema` se saca sola de `src/services/studyPlanService.ts` y va a `src/lib/epigrafes.ts`. Está en la línea 856 y son unas 40 líneas que solo leen `tema_epigrafe` y `epigrafes`.

  Hecho cuando todo esto funciona en una maqueta (un Supabase de mentira con un banco pequeño, como la de Oral):
  - se configura un test por tema, otro por bloque y otro de examen oficial;
  - se contestan, se revisan con sus filtros y «Repasar fallos» funciona;
  - con un usuario sin acceso, sale la muestra y lo demás abre el paywall.

  T4 lo cubre.

- [ ] **T6. Supuestos tipo test.** Copiar `src/components/views/SupuestosView.tsx`, `src/lib/supuestos.ts` y estos ficheros de `src/components/Supuestos/`: `SupuestoPlayer.tsx`, `MinicasosList.tsx`, `OriginalesList.tsx`, `OficialesList.tsx` y `SupuestoSelectorSheet.tsx`.
  - Se quitan el tutor (`SupuestoPlayer.tsx`, líneas 3 y 290), `logActivity` (líneas 11 y 347, que pasa al `registrarActividad` de T5) y el plan (línea 14).
  - Se quita el paywall de `SupuestosView.tsx` (líneas 8-9, 44-45 y 206-217, con «Hazte Premium» y `ProBadge`).
  - Se quita también el caso de muestra gratis de `MinicasosList.tsx` (líneas 87-91 y 198) y de `OriginalesList.tsx` (líneas 106-110 y 172). La muestra decidida son 10 preguntas por tema, no un caso. Un supuesto sin acceso abre el paywall.
  - Se quita el modo «Examen real (escribir)», porque sin corrección con IA no tiene sentido. Sale de tres sitios:
    - `SupuestoSelectorSheet.tsx` (líneas 84-93);
    - el `import` de `SupuestoExamenReal` en `SupuestosView.tsx` (línea 16);
    - `corregirSupuesto` en `supuestos.ts` (líneas 215-229), que llama al worker de Persevera. Con ella sale lo que solo usa ella: en `claude/dia-d`, `cabecerasWorker` y `correccionEscrita`.

    `SupuestoExamenReal.tsx` no se copia.
  - De `src/lib/mindmapProgress.ts` se copia solo `parseBloqueLead`, que usa `MinicasosList.tsx` (línea 10).

  Hecho cuando, en la maqueta, se juegan un minicaso, un supuesto original y uno oficial. Las preguntas sin opciones no salen (ya lo hace `SupuestoPlayer.tsx`, líneas 120-125) y las anuladas no puntúan (líneas 319-322).

- [ ] **T7. Mis fallos.** Copiar `src/components/views/MisFallosView.tsx` y `src/lib/casosRepaso.ts` sin cortes: no tocan tutor, plan ni flashcards. Hecho cuando, en la maqueta, los fallos de T5 y de los supuestos de T6 salen acotados a la oposición. T4 lo cubre.

- [ ] **T8. Simulacros, psicotécnicos y Guardia Civil.** Los psicotécnicos de Guardia Civil entran, tomado por defecto (sección «Lo que se ha tomado por defecto»). Copiar:
  - La carpeta `src/components/views/Simulacros/` con sus pruebas de `__tests__/`, menos los ejercicios que se escriben y corrige la IA: `SimulacroRunnerHaciendaSegundo.tsx` y, en `claude/dia-d`, `SimulacroRunnerGestionCivilSegundo.tsx`. `SimulacroRunnerGCPsico.tsx` sí se copia.
  - `src/lib/simulacroGC/`.
  - Los psicotécnicos: `src/lib/psico/` y `src/components/Psico/`, también los de figuras de Guardia Civil.
  - El marcado de ortografía y gramática: `src/lib/marcado/` y `src/components/Marcado/`.

  Cortes:
  - Se quitan el tutor (`SimulacroResultado.tsx`, línea 24) y el plan (línea 26).
  - `logActivity` pasa al `registrarActividad` de T5. Sale de estos ficheros:
    - `SimulacroRunner.tsx` (línea 11);
    - `SimulacroRunnerAuxiliar.tsx` (líneas 6 y 79);
    - `src/lib/simulacroGC/guardar.ts` (líneas 9 y 58);
    - `src/components/Psico/PsicoStudyModal.tsx` (líneas 10 y 291);
    - `src/components/Marcado/MarcadoView.tsx` (líneas 6 y 242).
  - En `SimulacroHubModal.tsx` sale el 2.º ejercicio de Hacienda (líneas 9, 111-130, 328-430 y 574). En `claude/dia-d` el hub ofrece además los ejercicios escritos de otras oposiciones (`TemaEscritoView` y `Contabilidad/entrada`, líneas 23-24), que salen igual.
  - `pedirValoracion` (`SimulacroResultado.tsx`, línea 7, de `src/lib/appReview.ts`) se queda. No lleva id de tienda (`InAppReview.requestReview()`, línea 50): solo hace falta su dependencia (T1).
  - El reporte de `PsicoStudyModal.tsx` (línea 369) se deja para T19.

  Hecho cuando, en la maqueta, salen los simulacros de las 5 oposiciones:
  - el generado y el oficial;
  - el del Auxiliar, con sus psicotécnicos;
  - el de Guardia Civil, con ortografía, gramática, conocimientos, inglés y psicotécnicos.

  Pasan las pruebas copiadas y T4 compara los constructores.

- [ ] **T10. El contenido y su copia automática desde Persevera.** Espera a: A3 y A5. Es la propuesta de T9, tal como la apruebe Álvaro. Un script, `scripts/copiar-banco.mjs` (`npm run copiar-banco`), copia el contenido de Persevera a Tests. Con `--ensayo` enseña las diferencias sin escribir. Nunca copia de Tests a Persevera.

  Qué copia, y nada más:
  - Las tablas `oposiciones`, `bloques`, `temas`, `epigrafes`, `tema_epigrafe`, `preguntas`, `minicasos`, `minicaso_preguntas`, `supuestos_originales`, `supuesto_original_preguntas`, `supuestos_oficiales` y `supuesto_oficial_preguntas`.
  - `marcado_items` y `marcado_unidades`, la ortografía y la gramática de Guardia Civil (`20260721000000_marcado_orto_gram.sql`).
  - `psico_items_graficos`, los psicotécnicos de figuras de Guardia Civil (T8).
  - Cada tabla tiene su lista de columnas escrita: la unión de lo que leen los ficheros copiados (sacado de sus `.select`) y de A3. Una que falte puede fallar sin avisar. Por ejemplo, `cargarEpigrafesTema` pide `epigrafes.num_flashcards` (`studyPlanService.ts`, línea 876) y, si no está, su `catch` devuelve `[]`. T4 comprueba que no falta ninguna.
  - No se copian la rúbrica del 2.º ejercicio (`enunciado_examen`, `respuesta_modelo`, `puntos_clave`) ni el texto del temario.
  - Nada de usuarios: ni respuestas, ni suscripciones, ni `usuario_oposicion`, ni tutor, ni planes, ni `psico_reportes`.

  Cómo copia:
  - Lee Persevera con el usuario de solo lectura de A4, en una sola transacción de lectura, para tener una foto coherente.
  - Escribe en Tests en una sola transacción, en el orden de las claves ajenas.
  - Conserva los UUID, porque van escritos en `oposicionesIds.ts` y en el motor.
  - Lo que desaparece de Persevera no se borra en Tests. Se marca con `retirada_at` y deja de verse, para no romper las respuestas que lo apuntan. En Persevera, un despliegue borró 371 preguntas de golpe y chocó con `respuestas_usuario` (`deploy/README.md`). Si la fila vuelve, se desmarca.
  - En Tests, solo el usuario de la copia escribe estas tablas. El disparador `solo_servidor` cierra el paso a `anon` y `authenticated`.
  - Si se decide quitar las preguntas `pendiente` (C8), se hace aquí y no en el código.

  Después recalcula lo propio de Tests:
  - `alcance_pregunta`: a qué oposición entra cada pregunta. Usa la regla con la que Persevera da a cada oposición sus preguntas, que tiene tres partes:
    - el epígrafe está en el temario por `tema_epigrafe`, o el tema es de la oposición (`getScopeOposicion` y `filtroEpigrafeOTema`, `src/lib/oposicionScope.ts`);
    - `oposicion_id` es nulo o el suyo (`20260628000002_preguntas_oposicion_id.sql`, líneas 13-16, y `deploy/exportar_supabase_a_excel.py`, línea 68);
    - `version_so` es nula o la de la oposición. Esto ningún código de Persevera lo filtra todavía (C4).
  - El origen de cada pregunta (C2).
  - La muestra (T11).

  La RLS del contenido deja leer a `authenticated` solo lo que entra en su oposición con prueba o pago (`tiene_acceso`, T2), más la muestra. `anon` no lee nada. Con esa RLS, contar leyendo las tablas da solo lo que cada cual ve (`claude/dia-d`, `20261006092000_proteccion_3_recuentos.sql`, líneas 5-9). Por eso se copian, adaptadas, las RPC de recuento que lee lo copiado: hoy `banco_de_test_por_tema` y `originales_recuento`. Devuelven números, nunca contenido.

  Cómo se sabe que no se separa:
  - Antes de confirmar, compara tabla por tabla el número de filas vivas y una huella en las dos bases. La huella es el md5 de todas las filas, ordenadas por id y con las mismas columnas.
  - Si algo no cuadra, no confirma, deja la copia anterior y manda un correo de aviso.
  - Cada pasada queda en `registro_copias`: fecha, filas y huella por tabla, resultado y duración.
  - Si Persevera quita o cambia una columna de la lista, la copia falla y avisa. Una columna nueva se apunta en el registro hasta que se añada a la lista.
  - Una comprobación aparte avisa si la última copia buena tiene más de 36 horas.

  Hecho cuando, con dos PGlite (un Persevera de prueba y un Tests), se cumple todo esto:
  - La copia deja las huellas iguales.
  - Tras editar, borrar y añadir filas en el Persevera de prueba, la segunda pasada lo refleja.
  - Las respuestas a una pregunta borrada siguen ahí, y la pregunta ya no se ve.
  - Un cambio a mano en el contenido de Tests hace fallar la comprobación.
  - Un usuario sin pago no lee por la API más que la muestra.
  - Uno con prueba o pago lee su oposición y ninguna otra.
  - Las RPC de recuento dan el banco entero a quien solo tiene la muestra.

- [ ] **T11. La muestra gratis.** Un test de 10 preguntas por tema, siempre el mismo, para quien no tiene prueba ni pago.
  - Se parte de lo que ya publica la web: los ids de `persevera-web/src/data/tests-tema/*.json` (45, 28, 36, 32 y 23 temas). Se copian a `datos/muestra/` con su cabecera (persevera-web en d9a5ee5).
  - Esos ficheros van por la numeración de la web («1-1») y guardan el título del tema de la app, no su id (`persevera-web/scripts/exportar-tests-tema.mjs`, líneas 348-360 y 411). Hay dos formas de unirlos a los temas de la app: emparejarlos por el título, con una comprobación, o que la copia regenere la muestra con los mismos filtros, partiendo de esos ids.
  - Guardia Civil tiene 24 temas en la app y 23 en la web (`claude/dia-d`, `docs/tarifas-por-oposicion/mapas/catalogo-bandas.md`, línea 24). El que falta se hace con los mismos filtros.
  - En cada copia del banco, una pregunta de la muestra que ya no esté verificada o se haya retirado se cambia por otra. La nueva pasa los mismos filtros de `exportar-tests-tema.mjs` (líneas 20-27 y 211-246). Fuera las opciones que se explican solas, las que remiten a una figura y las explicaciones que nombran la letra. Al juntar las diez se vigilan el reparto de la letra correcta y que la correcta no sea siempre la más larga. Las demás preguntas se conservan.
  - Se guarda en `muestra_tema`, y la RLS de T10 deja leer esas preguntas a cualquiera con cuenta.
  - En Practicar, cada tema enseña «Test de muestra, 10 preguntas». Lo demás lleva al paywall.

  Hecho cuando se cumple todo esto:
  - un usuario sin pago hace el test de muestra de cualquier tema de las 5 oposiciones, de todos los temas de la app y no solo de los de la web;
  - en PGlite, ese usuario no lee ninguna otra pregunta;
  - la muestra no cambia entre dos copias si sus preguntas siguen valiendo.

- [ ] **T12. Entrar.** Copiar de Persevera Oral `src/lib/sesion.ts`, `src/componentes/entrar/` y `scripts/comprobar-claves.mjs` (este, si no lo trajo ya A2, que lo usa antes). Traen correo y contraseña, recuperar la contraseña y poner una nueva, y ya usan las claves `sb_publishable_` y `sb_secret_`. Google y Apple quedan preparados y apagados, como en Oral, hasta A16.
  - Los enlaces de los correos van siempre a tests.perseveraoposiciones.com, también desde el móvil. Persevera lo hace así porque un enlace al esquema de la app muere en el navegador del correo (`AuthScreen.tsx`, líneas 10-17).
  - En `sesion.ts`, la vuelta deja de ser `window.location.origin` (línea 78), que en el móvil no es una web. El esquema propio solo hace falta para Google y Apple (A16).
  - Nunca vuelven a `app.perseveraoposiciones.com`, que es la web de Persevera.
  - Las plantillas de los correos (`supabase/email-templates/` de Persevera) se reescriben aquí con la marca de Tests. Álvaro solo las sube (A7).

  Hecho cuando, en la maqueta, se registra, entra, recupera la contraseña y sale, y una prueba comprueba que nada en el código apunta al proyecto de Persevera.

- [ ] **T13. El webhook de RevenueCat de Tests.** La función `revenuecat-webhook` del Supabase de Tests.
  - Autentica la cabecera `Authorization` entera, sin cortar en el primer carácter distinto.
  - Guarda el evento en `eventos_pago`. Un reintento suma `intentos`, y un evento ya procesado contesta 200 sin hacer nada.
  - Decide con un módulo puro y escribe `suscripciones` por `(plataforma, id_externo)`.
  - Atiende alta, renovación, cancelación, descancelación, problema de cobro, caducidad, cambio de producto, transferencia, pausa, extensión y reembolso. En la web, los seis productos de RevenueCat Billing no tienen periodo de gracia (13-oct-2026: RevenueCat solo lo deja poner al crear el producto y se crearon con el conector, que no tiene ese campo), así que un cobro fallido manda a la vez `BILLING_ISSUE` y `EXPIRATION` y RevenueCat reintenta el cobro hasta 30 días. T13 decide entre dar desde el servidor los días de Persevera en Google (7 en mensual y semestral, 14 en anual) o rehacer los productos en el panel con su periodo de gracia antes de publicar, cuando aún no hay clientes.
  - Como la web cobra por RevenueCat Billing, las compras de la web también llegan por aquí. No hay webhook de Stripe.
  - El webhook de `claude/dia-d` no escribe las compras de la web. Solo conoce App Store y Google Play, y una tienda distinta acaba en `otra_tienda` (`_shared/cobro/decidir.ts`, líneas 203-205 y 362-364). Se añade la tienda `RC_BILLING`, con sus eventos de prueba sacados de la documentación de RevenueCat o de una compra de prueba.
  - Apunta la prueba gastada en `pruebas_usadas`. En la web, con la huella de la tarjeta pedida al Stripe de Tests, si RevenueCat Billing lo permite (A13). Comprobado el 14-oct-2026 (línea 419): RevenueCat Billing lo permite. Los clientes de Stripe se buscan por `metadata['rc_customer_id']`, el usuario de RevenueCat, y la huella sale del método de pago, que ya está guardado al empezar la prueba. Puede haber varios clientes por usuario (sin probar).
  - Manda el correo del alta (T20).
  - Los productos que conoce son los de la guía (T9), los mismos que Álvaro crea en las tiendas. Si el producto es desconocido, contesta 500 y manda una alerta, y RevenueCat reintenta.
  - Se copia la estructura de `claude/dia-d`: `supabase/functions/revenuecat-webhook/index.ts`, `_shared/cobro/decidir.ts` y `_shared/cobro/aplicar.ts`. Se dejan fuera los tramos, la oposición por compra y las intenciones de subida. También se copian los eventos de prueba de `_shared/cobro/fixtures/revenuecat/`.
  - Se añade `sincronizar-compra` (de `claude/dia-d`), la red por si el aviso de RevenueCat tarda. Hoy solo mira App Store y Google Play (`index.ts`, línea 19): se amplía a la web.

  Hecho cuando vitest pasa con todos los eventos de prueba (también los de la web), el mismo evento dos veces deja una sola fila, y una caducidad apaga solo su compra.

- [ ] **T14. El paywall con los tres planes y la prueba.** Mensual 9,99 €, semestral 46,99 € y anual 79,99 €, con renovación automática y 7 días de prueba.
  - En iOS y Android, con `@revenuecat/purchases-capacitor`, copiando `src/lib/revenuecat.ts` de `claude/dia-d`:
    - el `app_user_id` es el usuario de Tests;
    - la oferta se pide por su id, nunca la actual del panel;
    - el producto se comprueba antes de comprar, con los identificadores de la guía (T9), los mismos que Álvaro crea en las tiendas;
    - la cuenta de la tienda tiene que ser la de la sesión.
  - En Android, si la prueba ya está gastada, se compra la opción del plan base sin la fase gratis. Google decide quién puede tener la prueba por su cuenta de Google, no por el usuario de Tests.
  - En la web, con el SDK web de RevenueCat (`@revenuecat/purchases-js`) sobre RevenueCat Billing. Es código nuevo: Persevera cobra en la web con Stripe Checkout (`PaywallModal.tsx`, líneas 159-166), y su `revenuecat.ts` no hace nada en la web (`claude/dia-d`, líneas 4-5). La prueba también pide tarjeta. Los colores del pago van en la configuración web de RevenueCat, en «Appearance» (Noche y menta desde el 14-oct-2026, y el icono en «App info»). Valen también para los enlaces de compra, y los correos de RevenueCat toman dos de ellos. El idioma se pone con `selectedLocale: 'es'`. En los enlaces de compra no se puede elegir y salen en inglés.
  - La prueba solo se ofrece a quien no la ha gastado en ningún canal, según `prueba_disponible()` (T2; ver A13).
  - El precio se dice sin justificarlo. Debajo va qué pasa al acabar la prueba, cada cuánto se renueva y cómo se cancela, con enlaces a términos y privacidad.
  - En iOS y en Android no hay enlaces ni precios de la web (norma 3.1.1 de Apple y política de pagos de Google). Eroodite ya tuvo un rechazo de Apple por esto (`TRAMITE_APPSTORE.md`, línea 12).
  - «Restaurar compras» y «Gestionar suscripción» están en las tres plataformas.
  - Antes de pagar se registra la aceptación de los términos, copiando de `claude/dia-d` `src/components/Tarifas/aceptacionTerminos.ts`.

  Hecho cuando, con una maqueta de ofertas (como la banda de planes de Oral), se ven los tres planes con prueba y sin ella en iOS, Android y web. Una compra de mentira acaba con acceso tras la respuesta de `sincronizar-compra`. La compra web tiene su propia maqueta. La compra de verdad se prueba en P5.

- [ ] **T15. El onboarding de dos pasos** (propuesto). Se escribe nuevo, porque el onboarding de Persevera es el planificador (`src/App.tsx`, comentario de las líneas 14-17).
  - Paso 1, elegir oposición. La lista sale de `catalogo_tests` y `oposiciones`, con el nombre oficial: nunca «C1» ni «C2».
  - Paso 2, elegir plan: el paywall de T14, con «Seguir con la muestra gratis» a la vista.
  - La primera elección no gasta el cambio de los 30 días.

  Hecho cuando, en la maqueta, una oposición añadida a `catalogo_tests` aparece sin tocar el código, y quien sigue con la muestra llega a Practicar con su oposición ya elegida.

- [ ] **T16. Las tres pestañas y Tu cuenta.** El armazón es nuevo: `App.tsx` y la barra de abajo, con tres pestañas (propuesto).
  - Practicar: tests por tema y por bloque, exámenes oficiales y supuestos, más inglés, ortografía y gramática en Guardia Civil.
  - Simulacros: la pantalla de simulacros copiada en T8.
  - Mis fallos y progreso: T7 más una página de progreso nueva, con aciertos, fallos y blancos por tema y por bloque, y la nota de los simulacros. De `src/lib/userStats.ts` solo se aprovechan las consultas de tests y simulacros, unas 300 líneas. Nada de XP, retos, logros ni Dominio (`ProgresoView.tsx`, líneas 218-228).

  Tu cuenta se abre desde la cabecera y lleva:
  - el plan y su fecha (copiado de Oral, `src/componentes/comun/DialogoPlan.tsx`);
  - la oposición con su cambio (T17);
  - «Gestionar suscripción» y «Restaurar compras» (T14);
  - términos, privacidad y contacto (P12);
  - cerrar sesión y borrar la cuenta (T21).

  Al abrirse, la app mira la versión mínima (T2), copiando `src/lib/versionMinima.ts` de `claude/dia-d`. Los colores salen de la paleta de T23.

  Hecho cuando las tres pestañas y Tu cuenta funcionan en la maqueta. En el móvil: una columna, 16 px de margen y sin scroll horizontal. En escritorio también. Ningún texto visible baja de 13 px, tampoco en el motor tras el paso de tema de T23.

- [ ] **T17. Cambiar de oposición cada 30 días.** La función `cambiar_oposicion(p_oposicion)`, con las reglas en el servidor.
  - Es libre la primera elección, el cambio durante la prueba y el cambio sin suscripción (con la muestra).
  - Con pago, se puede cambiar una vez cada 30 días. Si aún no toca, devuelve la fecha desde la que se puede.
  - Se copia, simplificada (sin tramos, subidas ni bajadas), de `elegir_oposicion_suscripcion` (`claude/dia-d`, `20261005091000_cobro_2_rpc.sql`, líneas 216-287), con su `revoke` y su `grant`.
  - En Tu cuenta, los botones «Cambiar ahora» o «Disponible el {fecha}», copiados de `claude/dia-d`, `src/components/Tarifas/cambioDeOposicion.ts`.
  - El progreso no se toca. Las respuestas se guardan por pregunta y se acotan por contenido, así que lo común cuenta en las dos oposiciones. Ese común es el banco del Administrativo que comparten el Auxiliar, Seguridad Social y Hacienda.

  Hecho cuando las pruebas en PGlite cubren estos casos:
  - la primera elección y el cambio en prueba;
  - el segundo cambio antes de 30 días, rechazado y con su fecha;
  - el cambio después de 30 días;
  - al volver a la oposición de antes, las respuestas siguen ahí.

- [ ] **T18. Las etiquetas de origen.** Cada pregunta y cada supuesto lleva una etiqueta visible:
  - «Oficial», con la convocatoria (propuesto). Ya existe en `TakeTest.tsx` (líneas 953-958) para `fuente = 'conv_real'`.
  - «Original» (propuesto).
  - «Supuesto de desarrollo adaptado a test». En los oficiales adaptados se añade que la pregunta sale de un examen oficial de desarrollo, y que las opciones y la letra correcta son de Persevera, no del tribunal.

  Una hoja explica qué significa cada etiqueta. La etiqueta sale del origen que calcula la copia (C2), no del texto de la pregunta. Hecho cuando las tres salen en el test, en la revisión, en los supuestos, en los simulacros y en Mis fallos.

- [ ] **T19. Reportar una pregunta** (propuesto). Un botón «Reportar esta pregunta» en el test, en la revisión, en los supuestos, en los psicotécnicos y en el marcado.
  - En `TakeTest.tsx` va en el menú de pulsación larga, que hoy solo tiene tutor y copiar (líneas 1262-1272), y como botón visible en la revisión.
  - El modelo es el «¿Algo no cuadra? Reportar» de los psicotécnicos: `src/components/Psico/PsicoStudyModal.tsx` (líneas 346-371) y la tabla de `20260619000001_psico_reportes.sql`.
  - El reporte de los psicotécnicos (`PsicoStudyModal.tsx`, línea 369) pasa a `reportes_pregunta` (T2). Los que se generan en la app no tienen id en la base, así que se guarda la copia del ítem.
  - Cada reporte manda un correo al equipo con el código de la pregunta (`C1-…`, `HAC-OF-…`), porque la corrección se hace en Persevera.
  - Para ese correo se parte de `supabase/functions/notify-reporte-psico/index.ts`, que ya está en `main`. No se copia tal cual: lee los campos de `psico_reportes` (líneas 21-35) y hay que adaptarla a la tabla nueva.

  Hecho cuando se cumple todo esto:
  - un reporte se guarda con su motivo y el usuario ve que se ha enviado;
  - el mismo usuario no puede duplicar el reporte de una pregunta;
  - en PGlite, nadie lee los reportes de otro.

- [ ] **T20. El correo del alta y el aviso de renovación.** Son los dos que pide la Ley 10/2025.
  - El alta: se copia `parrafosAlta` de `claude/dia-d`, `supabase/functions/_shared/cobro/correos.ts`, con una oposición, tres duraciones, la prueba y el formulario de desistimiento. Lo manda el webhook en cada alta nueva: la primera compra y la de quien vuelve a comprar tras caducar, como en Persevera (`claude/dia-d`, `docs/dia-d/comunicacion-y-terminos.md`, línea 669).
  - El aviso: se copian de `claude/dia-d` `supabase/functions/avisar-renovacion/index.ts`, `supabase/functions/_shared/avisoRenovacion.ts`, la migración `20261002150000_avisos_renovacion.sql` y `scripts/probar-aviso-renovacion.mjs`. Como en Persevera, solo se avisa en el semestral y el anual, entre 15 y 18 días antes del cobro.
  - Los importes del aviso salen de los productos de Tests, y los datos, de RevenueCat para los tres canales. Así que sobra la rama de Stripe.
  - Hoy `avisar-renovacion` trata la web como Stripe (`index.ts`, línea 11). Hay que comprobar que `evaluarRevenueCat` sirve para las compras de RevenueCat Billing.
  - Remite Tests, con su marca.

  Hecho cuando las pruebas de los dos módulos pasan con los textos escritos a mano, y el ensayo del aviso, que no envía nada, lista a quién escribiría.

- [ ] **T21. Borrar la cuenta.** Desde Tu cuenta, como pide Apple.
  - Se copian de `claude/dia-d` `supabase/functions/delete-account/` (con `borrar.ts` y el contrato v2) y `src/components/Tarifas/borrarCuenta.ts`, y la hoja de `src/components/common/DeleteAccountModal.tsx`.
  - Si hay una suscripción de App Store o Google Play que sigue renovándose, la app avisa de que hay que cancelarla allí y pide confirmar.
  - La de la web se cancela al borrar. El `borrar.ts` de `claude/dia-d` la cancela con la API de Stripe (líneas 9-17 y 44-50), pero con RevenueCat Billing no hay suscripciones en Stripe. Aquí se cancela a través de RevenueCat, y se decide si se borra también el cliente de RevenueCat.
  - Solo se borra la cuenta de Tests. Persevera no se entera.

  Hecho cuando pasan las pruebas de `borrar.ts` con dobles y, en PGlite, borrar la cuenta deja sin filas suyas todas las tablas de usuario.

- [ ] **T22. Medir la conversión.** Desde el primer día se cuenta cuántos hacen la muestra, cuántos ven el paywall, cuántos empiezan la prueba y cuántos acaban pagando, por canal y por oposición. La prueba y el pago salen de RevenueCat, cuyas gráficas ya cubren los tres canales. Lo de antes sale de `embudo` (T2), sin más dato personal que el id del usuario. Una consulta en `docs/medir.md` saca las cifras de la semana. Hecho cuando, en la maqueta, cada paso deja su fila y la consulta devuelve el embudo de prueba.

## Lo hace Álvaro

Son las consolas, las cuentas, las migraciones, los despliegues y los builds, en su Mac. La guía paso a paso es T9. Cada tarea dice qué la bloquea y qué desbloquea. Blanca decidió el 13-oct-2026 que empiezan ya, cada una en cuanto está lo que espera, a la par del día D. Lo que Álvaro haga antes de tener la guía sigue lo que dice esta hoja.

- [x] **A1. El repositorio en GitHub.** Lo primero de todo. Un repositorio privado, `PabloAlgabaGranado/persevera-tests` como el de Oral, y la carpeta en el Mac. Cada tarea termina con commit y `git push`, como en Oral (`persevera-oral/CLAUDE.md`, línea 20), y la conversación siguiente parte de lo subido. Bloquea: T1. Hecho cuando el repositorio existe y T1 puede subir su commit. Hecho el 13-oct-2026 por Blanca.

- [ ] **A2. El proyecto de Supabase de Tests.** Un proyecto nuevo, en la UE, con Postgres 15 o posterior, en un plan de pago con copias diarias. Los gratuitos se pausan a los 7 días sin actividad y no tienen copias diarias; Pro guarda 7 días (comprobado el 13-oct-2026). Se apunta el coste. La dirección y las claves `sb_publishable_` y `sb_secret_` van en `.env.local` (nunca en el repositorio) y se comprueban con `node scripts/comprobar-claves.mjs`, copiado de Oral si T1 no lo trajo. Nada apunta a Persevera. Bloquea: A6, A7, A15 y las pruebas con la base real. Hecho cuando el script dice que las claves funcionan.

- [x] **A3. El esquema real del contenido.** Hecho el 13-oct-2026 por Álvaro: `datos/esquema-persevera.sql`, en `6439257`, y en el commit siguiente sin el formato con el que lo copia el panel. Sin la contraseña de la base no había `pg_dump`, así que salió del editor SQL de Supabase con `datos/a3-editor.sql`, que solo lee el catálogo. Tiene las 21 tablas y las 2 vistas, con sus restricciones, índices, RLS, políticas, disparadores y permisos, y las dos funciones de las que dependen, `preguntas_aleatorias` y `set_respuesta_oposicion_id`. Carga en un Postgres vacío (probado en PGlite). Ninguna función ni disparador rellena `simulacros`, como ya vio T2. Ya visto para T10 y para cerrar T2: en Persevera, `respuestas_usuario` tiene además `sesion_id`, `tipo_fallo` y `uso_comodin`, que la app no escribe; `respuesta` es `character(1)` y admite NULL (en T2, `text not null`), y `modo` es NOT NULL y lleva un CHECK con sus valores. Muchas tablas de Persevera se crearon fuera de sus migraciones, y su definición solo está en la base de producción.
  - `BACKLOG.md` (apartado «Núcleo multi-oposición») solo nombra `usuario_oposicion`.
  - Pero tampoco tienen su `create` las tablas del contenido, `epigrafes`, `respuestas_usuario`, `pregunta_respondida`, `study_activity_log` ni `simulacros`.
  - La vista `v_casos_para_revisar` solo aparece en un `ALTER VIEW` (`20260615000000_rls_unrestricted.sql`, línea 54).
  - El disparador que rellena `simulacros` solo se describe (`20260617000000_simulacros_oposicion_id.sql`, línea 13).

  Hay que sacar con `pg_dump --schema-only`, que solo lee:
  - las tablas del contenido de T10 y `epigrafes`;
  - `usuario_oposicion`;
  - `respuestas_usuario` y `pregunta_respondida`, con sus disparadores y políticas;
  - `study_activity_log`;
  - `simulacros`, con la función y el disparador que la rellenan desde `study_activity_log`;
  - la vista `v_casos_para_revisar`.

  Se deja en `datos/esquema-persevera.sql` del repo de Tests. Bloquea: A4 y cerrar T2 y T10. Hecho cuando el fichero está en el repo.

- [ ] **A4. El lector de Persevera.** Es una migración de Persevera: la escribe una conversación de Persevera y la aplica Álvaro. Lleva:
  - un rol de Postgres, `lector_tests`, con `select` solo sobre las tablas de T10 y por columnas: todas las que tiene cada tabla en A3, menos la rúbrica y el texto del temario, que T10 no copia. La lista de T10 queda dentro, así que A4 no la espera;
  - una política de lectura `to lector_tests` en cada una de esas tablas. Tienen la RLS encendida, con sus políticas de lectura (`claude/dia-d`, `docs/dia-d/especificacion.md`, líneas 1354-1358), y un rol nuevo sin política no ve ninguna fila;
  - su cadena de conexión para Tests. Nunca la clave de servicio de Persevera.

  Espera a: A3. No se aplica la misma noche que una fase del día D. Bloquea: A6 y los secretos de A5. Hecho cuando una consulta de prueba lee `preguntas` y no puede leer `respuestas_usuario` ni escribir nada.

- [ ] **A5. La copia de cada noche: cómo y dónde.** Lo decide Álvaro, en dos pasos.
  - Primero aprueba o cambia la propuesta de la copia que trae la guía (T9).
  - Después elige dónde corre. La propuesta es una tarea programada de GitHub Actions en el repo de Tests, a las 04:00 de Madrid, con la cadena de `lector_tests` y la de escritura de Tests como secretos. GitHub Actions no tiene IPv6, así que se usa la cadena del pooler de Supabase y no la conexión directa.
  - La alternativa es una función de Supabase con su cron, si la copia cabe en su tiempo máximo.
  - También hay que elegir a quién llegan los avisos de la copia.

  Espera a: A1 y T9. Los secretos esperan también a A2 y A4, salvo el de escritura de Tests (`TESTS_COPIA_URL`), que va en A6, justo después de `supabase db push`, porque su rol nace con esas migraciones. Bloquea: T10, que no espera a los secretos, y A6. Hecho cuando la propuesta está aprobada, está decidido dónde corre y los secretos de lectura están puestos.

- [ ] **A6. Las migraciones y la primera copia.** `supabase db push` contra el proyecto de Tests, nunca contra el de Persevera. Después:
  - cargar `catalogo_tests` con las 5 oposiciones;
  - lanzar la copia a mano, primero con `--ensayo` y luego de verdad;
  - activar la copia de cada noche;
  - al día siguiente, mirar `registro_copias`;
  - medir la RLS con el banco entero (32.256 preguntas, `AUDITS.md`, línea 66). La política, `preguntas_aleatorias` (que ordena con `random()`) y las RPC de recuento tienen que caber en el `statement_timeout`. El día D no enciende su protección sin medirlo en producción (`especificacion.md`, línea 1376), y un PGlite con un banco pequeño no lo ve.

  Espera a: A2, A3, A4, A5, T2 y T10. Bloquea: C1, P5 y la muestra con datos reales. Hecho cuando hay dos copias nocturnas seguidas con las huellas iguales y la medida está apuntada, antes de P5.

- [ ] **A7. El correo de Tests.**
  - Una cuenta o un dominio de Resend propios de Tests, con sus registros SPF y DKIM, y mirar los límites del plan. Las funciones de Persevera usan la clave de Resend de Persevera (`notify-reporte-psico/index.ts`, línea 12), y esa no se toca. Empezado el 14-oct-2026 (bloque 6 de la guía): el dominio `tests.perseveraoposiciones.com`, en Irlanda, va en el equipo de Resend de Persevera y Eroodite (`brooksoo`, plan Pro, cuenta hola@brooksoo.com) y no en uno propio, porque uno nuevo obliga a pagar; las claves de Tests irán restringidas a ese dominio. Los registros están en Cloudflare (el DKIM, `send.tests`, `rsend.tests` y `_dmarc.tests`, porque la raíz no tiene DMARC), y Resend dio el dominio por verificado ese día, sin subdominio de seguimiento, así que no sigue aperturas ni clics. De A7 quedan el SMTP de Supabase Auth y la dirección de vuelta.
  - El SMTP de Supabase Auth, con las plantillas de T12.
  - La dirección de vuelta, tests.perseveraoposiciones.com, en Authentication. El esquema de la app, solo para A16.

  Espera a: A2 y T12, salvo la cuenta o el dominio de Resend con sus registros, que no esperan a nada, y la dirección de vuelta, que solo espera a A2. Bloquea: el alta de cuentas reales y T20 en real. Hecho cuando un registro de prueba recibe su correo con la marca de Tests y el enlace vuelve a Tests.

- [x] **A8. La web.** Hecho el 14-oct-2026 por Álvaro (bloque 8 de la guía): el proyecto `persevera-tests` de Cloudflare Pages, con `e248ba4` subido con `wrangler`, y tests.perseveraoposiciones.com activo, con un CNAME con nube naranja. Que el proyecto está en la cuenta de la zona y que el CNAME lo puso Cloudflare solo es deducción (guía, 8.1 y 8.2). La carga se comprobó con `curl`: la raíz da el `index.html` y el `.js` da 200. El ajuste de la zona «Browser Cache TTL» subía a 4 horas (`max-age=14400`) el `max-age=300` de `_headers` en los `.js`, también en la app de Persevera. Álvaro lo cambió ese día para toda la zona, a «Respect Existing Headers» como se le propuso, y después los `.js` de las dos apps daban `max-age=300`. Un proyecto de Cloudflare Pages para tests.perseveraoposiciones.com (el subdominio se ha tomado por defecto). También el registro DNS del subdominio, sabiendo quién lleva la zona: la web pública de Persevera y su app están en Cloudflare Pages (`persevera-web/public/_headers`, línea 1; solo `README.md` y `vercel.json` hablan de Vercel), y el dominio vive en la cuenta de Cloudflare del hermano de Álvaro (`claude/dia-d`, `docs/dominio-propio-supabase.md`, líneas 52-53). `public/_headers` y `public/_redirects` ya vienen de T1. Bloquea: las páginas legales con su dirección final (P1 a P3 y P11), la URL de borrado que pide Google y el cobro web de P5. Hecho cuando la dirección carga la app.

- [ ] **A9. El primer build de Android.** `npx cap add android`, con un keystore nuevo para Tests guardado fuera del repo. La app en Play Console y un AAB mínimo en la pista interna: la pantalla de T1, con el SDK de RevenueCat ya dentro. Google pide un AAB subido antes de crear suscripciones (`TRAMITE_GOOGLEPLAY.md`, línea 40), y no hace falta esperar a la app entera. `@capacitor/android` no viene en el `package.json` de Oral: se instala aquí con la versión de Persevera. Espera a: A1 y T1. Bloquea: A11. Hecho cuando el AAB está en la pista interna.

- [ ] **A10. Apple.** No necesita build. Empezado el 13-oct-2026 por Álvaro (bloque 5 de la guía): el App ID `com.persevera.tests` con In-App Purchase; la app «Persevera Tests» en App Store Connect, con Apple ID 6822481702 y SKU `persevera-tests`; tres cuentas de sandbox con su Gmail (Tests QA se quedó con la dirección sin «+», y sirve igual); y dos claves nuevas para RevenueCat, la In-App Purchase y la de la API de App Store Connect con acceso App Manager, guardadas por él (Issuer ID `f41cf5d9-62f8-4377-96a1-13cdf6d42ae1`). Falta el grupo de suscripción con sus productos y las URL de RevenueCat (bloque 10).
  - El App ID `com.persevera.tests` en la misma cuenta, y la app en App Store Connect.
  - Un grupo de suscripción, «Persevera Tests», con tres productos (mensual, semestral y anual). Cada uno lleva una semana gratis como oferta de introducción y va sin compras multilicencia, como en el día D.
  - Las dos URL de RevenueCat para las notificaciones del servidor, la de producción y la de sandbox (`claude/dia-d`, `docs/dia-d/guia-consolas.md`, línea 580). Sin la de sandbox, Apple manda los avisos de las compras de prueba a la de producción. RevenueCat pone las dos con un botón (`guia-consolas.md`, 10.8).
  - Cuentas de sandbox.
  - Comprobar si la cuenta está en el Small Business Program. Con él, Apple se queda el 15 %; sin él, el 26 % el primer año en la UE. Está dentro: lo confirmó Álvaro el 13-oct-2026.

  Las URL de RevenueCat esperan a su proyecto, el primer paso de A13, y los identificadores de los productos salen de la guía (T9). Bloquea: A13. Hecho cuando los tres productos están listos para enviar con la primera versión. Hasta que exista el paywall (T14), la captura de la pantalla de compra de cada producto es provisional. La buena se pone en P7.

- [ ] **A11. Google.**
  - Una suscripción con tres planes base, periodo de gracia y una oferta de 7 días con la elegibilidad «nunca tuvo ninguna suscripción en esta app».
  - La cuenta de servicio para RevenueCat, con los cuatro permisos que pide hoy RevenueCat (también «Manage store presence»). Se dan en los permisos de la cuenta, que alcanzan también a Persevera y Eroodite (`guia-consolas.md`, 11.6). Sus credenciales tardan hasta 36 horas en validarse.
  - Las notificaciones (RTDN) hacia RevenueCat.
  - Comprobar si la cuenta pide una prueba cerrada antes de producción. Persevera fue directa a producción (`TRAMITE_GOOGLEPLAY.md`, líneas 46-47), así que no se cuenta en el calendario.

  Espera a: A9, y lo de RevenueCat también a su proyecto, el primer paso de A13. Los identificadores salen de la guía (T9). Bloquea: A13. Hecho cuando los planes están activos.

- [ ] **A12. El Stripe de Tests.** Una cuenta nueva, con su verificación de identidad y su banco (puede tardar días), Stripe Tax para el IVA, y conectada a RevenueCat Billing. El titular es el mismo que el de Persevera, Brooks & Oo, S.L. (`persevera-web/src/data/legal.ts`, línea 5), así que lleva el mismo tratamiento fiscal. Persevera cobra en la web con el IVA dentro y el NIF opcional (`stripe-checkout/index.ts`, líneas 141-175). La cuenta de Persevera no se toca. La conexión con RevenueCat Billing espera al proyecto, el primer paso de A13. Bloquea: la parte web de A13. Empezado el 13-oct-2026: Blanca abrió la cuenta, separada y fuera de cualquier organización (`acct_1UQA9NDBHlndqjVo`, con Radar Lite), y el hilo, con su visto bueno, configuró Stripe Tax como en Persevera (`guia-consolas.md`, bloque 13.1, pasos 1 a 3). La verificación ya estaba aceptada ese mismo día: cobros y pagos activos y nada pendiente (leído con el conector). Esa noche Álvaro puso los datos públicos (descriptor del extracto `PERSEVERA TESTS` y soporte hola@perseveraoposiciones.com) y la descripción del negocio de Tests, que era la de Persevera; la verificación en dos pasos ya estaba puesta, y la cuenta tiene modo de prueba y entornos de prueba (bloque 7). La conexión con RevenueCat Billing la hizo Álvaro la noche del 13-oct-2026 (bloque 7.1). El modo de prueba tiene su propia configuración de impuestos: sin la sede, RevenueCat no deja comprar en sandbox («Invalid tax origin address»), y el 14-oct-2026 Álvaro le puso la sede, el código y los precios con IVA, sin registro. En el bloque 13 se cambia la marca de los recibos, que lleva el verde de Persevera (`#0d7c66`) y no la paleta de Tests. Hecho cuando la cuenta puede cobrar.

- [ ] **A13. El RevenueCat de Tests.** Empezado el 13-oct-2026 desde el hilo, con el visto bueno de Blanca: el proyecto `proj0fca9795`, las apps de App Store y Play Store, el entitlement `acceso`, los seis productos y las ofertas `default` y `sin_prueba` con sus paquetes (`guia-consolas.md`, bloques 4, 10.7, 11.7 y 12). Lo que mira el bloque 4, hecho el 13-oct-2026: `hola@brooksoo.com` es el dueño de Persevera y de Tests, y el plan es Pro (conector). En Persevera, Álvaro vio «Transfer to new App User ID» y «Anybody» en «Allow testing entitlements and in-app currency for», que la especificación del día D quiere en «Allowed App User IDs only»: es cosa de Persevera y desde aquí no se toca. Ese usuario de RevenueCat no tiene la verificación en dos pasos (conector), y se les dijo a Álvaro y a Blanca. Bloque 7, la noche del 13-oct-2026: Álvaro conectó el Stripe de Tests a RevenueCat y creó la configuración web `Persevera Tests (Web)` (`app9dc4cffa75`, por el camino del modo de prueba, con Stripe como proveedor de impuestos), y el hilo, con el sí desde la cuenta de Blanca, creó los seis productos web y los puso en `default`, `sin_prueba` y `acceso` (`guia-consolas.md`, 7.3, 13.6 y 13.7). Los seis se quedaron sin periodo de gracia: el conector no tiene ese campo y RevenueCat no deja ponerlo después de crear el producto (lo vio Álvaro en el panel); lo decide T13 (línea 232). El 14-oct-2026 Álvaro hizo las dos compras de sandbox del bloque 7: la huella de la tarjeta se puede leer (línea 419). RevenueCat no deja borrar el enlace de compra «Prueba huella (borrar)»: sigue vivo, su URL de Production no se comparte y antes de P13 se pide al soporte que lo quite (guía, 7.5, paso 4).
  - Un proyecto nuevo, «Persevera Tests», con App Store, Google Play y RevenueCat Billing sobre el Stripe de Tests.
  - Un entitlement y los tres productos de cada canal. En RevenueCat Billing, el precio es el final, con el IVA dentro. No pide el NIF ni hace facturas para empresas: queda como duda para el gestor.
  - Dos ofertas: `default`, con los tres planes y la prueba, y `sin_prueba`, para quien ya la gastó.
  - En la web y en Android, el servidor elige la oferta. En iOS manda Apple, que da una prueba por Apple ID. Queda un hueco: quien gastó la prueba en la web podría tener otra en el iPhone con otro Apple ID. Se cierra con tres productos sin prueba en el mismo grupo, si Álvaro lo ve.
  - El webhook, apuntando a la función de Tests con su secreto.
  - «Allow testing entitlements and in-app currency for», en «Nobody» hasta que existan las cuentas de prueba, y después solo para ellas. «Restore behavior», decidido a propósito. Los dos están en «Project settings» (`guia-consolas.md`, línea 639).
  - Las claves públicas de cada canal (`appl_`, `goog_`, y en la web `rcb_` y `rcb_sb_`). Las secretas se crean en A15: la v1 para `sincronizar-compra` y el aviso de renovación, y la v2 para cancelar, reembolsar y abrir el portal de las compras web.
  - Comprobado el 13-oct-2026 en la ayuda de RevenueCat: RevenueCat Billing no cobra aparte (los ingresos de todos los proyectos de la cuenta se suman para los 2.500 $ al mes sin coste), Stripe Tax cobra 0,45 € por cobro web y la prueba se limita por usuario de RevenueCat, no por tarjeta. Si se puede leer la huella de la tarjeta en el Stripe de Tests (T13) se prueba en `guia-consolas.md`, bloque 7. Comprobado el 14-oct-2026 con dos compras de sandbox con la misma tarjeta: sí. RevenueCat Billing creó un cliente en Stripe en cada compra, con `rc_customer_id` (el usuario de RevenueCat) en sus metadatos, y guardó la tarjeta con una SetupIntent al empezar la prueba, sin cobrar. La huella (`card.fingerprint`) fue la misma en los dos clientes. No se probó qué pasa si el mismo usuario compra dos veces. En sandbox, la semana de prueba dura 5 minutos y la suscripción se renueva sola, seis veces en la primera compra. El historial de eventos de la API v2 salió vacío.

  Espera a: A10 y A11, y la parte web también a A12. Crear el proyecto y la comprobación del último punto van antes, porque A10, A11 y A12 se conectan al proyecto, y T2, T13 y T14 necesitan esas respuestas. El webhook necesita A2. Bloquea: A15 y P5. Hecho cuando los productos, las ofertas, el webhook y las claves públicas están puestos. La compra de sandbox que llega al webhook se hace en P5, con A14 y A15.

- [ ] **A14. Las plataformas nativas y los builds de prueba.**
  - `npx cap add ios`.
  - Firmar con el mismo equipo de Apple que Persevera (`F9T767LMSX`) y, en Android, con el keystore de A9.
  - El esquema de vuelta, solo para Google y Apple (A16).
  - El icono de T23.
  - Subir los builds a TestFlight y a la pista interna de Google.

  Espera a: A9 y T1 a T16 estables. Bloquea: P5. Hecho cuando la app abre en un iPhone y en un Android de prueba.

- [ ] **A15. Desplegar las funciones y sus secretos.** `revenuecat-webhook`, `sincronizar-compra` y `delete-account`. También `avisar-renovacion` con su cron (nace apagado, como en Persevera) y el aviso de reportes con su webhook de base de datos. Espera a: A6, A7, A13, T13, T19, T20 y T21. Bloquea: P5. Hecho cuando el ensayo de cada función contesta 200.

- [ ] **A16. Entrar con Google y Apple (opcional para el lanzamiento).** Crear los clientes OAuth de Tests en Google y en Apple, darlos de alta en el Supabase de Tests y encender `PROVEEDORES_SOCIALES` (T12). Si entra Google, entra Apple (norma 4.8). Hecho cuando las dos entradas funcionan en iOS, Android y web.

## Contenido

Es trabajo de datos. Lo que corrige preguntas se hace en Persevera, en su propia conversación, y llega con la copia. Lo que solo decide cómo se enseña algo se hace en la copia o en Tests.

- [ ] **C1. El recuento de partida.** Tras A6, contar en la base de Tests, por oposición:
  - preguntas en alcance y verificadas;
  - oficiales por convocatoria;
  - supuestos oficiales y originales, con sus preguntas;
  - minicasos y preguntas adaptadas a test;
  - ejercicios de ortografía y gramática, y psicotécnicos.

  Compararlo con el recuento del 13-sep (`claude/dia-d`, `docs/tarifas-por-oposicion/mapas/catalogo-bandas.md`, líneas 20-24) y apuntar en `docs/contenido.md` lo que no cuadre. Hecho cuando las cifras de la app y de la ficha de tienda salen de aquí, no de las fichas de la web.

- [ ] **C2. El origen de cada pregunta.** La copia (T10) calcula el origen con estas reglas:
  - «Oficial»: `fuente = 'conv_real'`, una pregunta de un supuesto oficial del Administrativo o de Seguridad Social, o un ejercicio de marcado con `fuente = 'conv_real'` (`20260721000000_marcado_orto_gram.sql`, líneas 32-35). Lleva su convocatoria.
  - «Original»: una pregunta propia, un minicaso, un supuesto original, un psicotécnico o un ejercicio de marcado propio.
  - «Supuesto de desarrollo adaptado a test»: una pregunta con opciones, de un supuesto con rúbrica, de una oposición con ejercicio escrito. Hoy solo es Hacienda (`tieneEjercicioEscrito` en `src/lib/oposicionesIds.ts`). Si además viene de un supuesto oficial, conserva su convocatoria. Como A4 no deja leer la rúbrica, cómo sabe la copia qué preguntas la tienen lo decide Álvaro en A5 (`guia-consolas.md`, anexo A, A.6).

  Hecho cuando se cumple todo esto:
  - las adaptadas cuadran con el recuento del 13-sep (en Hacienda, 181 preguntas de supuestos oficiales y 454 de originales con rúbrica);
  - los códigos `*-OF-*` coinciden con `conv_real` (`AUDITS.md`, línea 47);
  - las que no encajan quedan en una lista para corregir en Persevera.

- [ ] **C3. Hacienda: los supuestos adaptados.**
  - Fuera de Tests las preguntas que son solo de desarrollo, sin opciones (`20260814000000_supuesto_preguntas_solo_desarrollo.sql`).
  - Fuera también los supuestos sin preguntas: `HAC-OF-2024-S01` a `S03` (`AUDITS.md`, línea 59).
  - En los oficiales adaptados va el aviso de T18.
  - La ficha de Hacienda dice que Tests no prepara el 2.º ejercicio escrito.

  Hecho cuando ningún supuesto de Hacienda sale vacío ni sin su aviso.

- [ ] **C4. Windows 10 y Windows 11 en el Auxiliar.** El examen del Auxiliar es de Windows 10, y la ofimática del banco está escrita para Windows 11.
  - Hay que etiquetar como `win11` las 62 preguntas que solo valen para Windows 11 y subir sus variantes `win10`. Es el paso 3 de `supabase/migrations/20260620000002_version_so.sql` (`BACKLOG.md`, línea 64).
  - Se hace en Persevera y llega con la copia.
  - El filtro lo pone la copia del banco en `alcance_pregunta` y en la RLS (T10). El motor no lo tiene, y en Persevera «Cablear filtro `version_so`» sigue abierto (`BACKLOG.md`, línea 64).

  **Antes de publicar el Auxiliar**, cuyo examen se espera en mayo-junio de 2027. Hecho cuando el Auxiliar no recibe en Tests ninguna pregunta `win11`.

- [ ] **C5. La promoción interna de Seguridad Social.** 100 de sus 360 preguntas oficiales son de promoción interna (`BACKLOG.md`, líneas 30-31).
  - En Tests salen del selector de examen oficial del test, donde en Persevera aún aparecen (`TestSelectorModal.tsx`, líneas 268-281). Del simulacro oficial ya salen (`SimulacroOficialSelector.tsx`, líneas 40-46).
  - En vez de filtrar por texto en dos sitios, la copia saca el turno de `convocatoria_fuente` y los selectores lo usan. Es un cambio documentado en T4.
  - La práctica nunca sirve preguntas oficiales (`TestSelectorModal.tsx`, líneas 533 y 549-551; `preguntas_aleatorias` con `p_incluir_oficiales = false`). Así que estas preguntas siguen solo en Mis fallos de quien las falló, con la etiqueta «Oficial, promoción interna».

  Hecho cuando quien prepara el acceso libre no ve un examen de promoción interna presentado como suyo.

- [ ] **C6. Las claves de los exámenes oficiales.** Antes de venderlos como oficiales, hay que comprobar cada convocatoria contra su plantilla definitiva: la letra correcta, las anuladas y las de reserva (`orden_examen` 101 en adelante).
  - Las preguntas sueltas no tienen campo de «anulada». Los supuestos sí lo tienen (`estado = 'anulada-en-examen-oficial'`).
  - Las correcciones se hacen en Persevera. Si hace falta el campo, va en una migración de Persevera.
  - Tests solo enseña como «Examen oficial» las convocatorias revisadas. Se apuntan en `datos/convocatorias-revisadas.json` con la convocatoria, la fecha y de dónde sale la plantilla.
  - Los exámenes incompletos lo dicen. AGE 2019 y AGE 2022 Extraordinaria no tienen el Bloque VI en la base, y el simulacro lo rellena con preguntas propias (`simulacroBuilder.ts`, líneas 7-13).

  Hecho cuando cada convocatoria de las 5 oposiciones está revisada o escondida.

- [ ] **C7. Los sesgos del banco.** Medir en todo el banco que se sirve, por oposición, lo que la web ya evita en su muestra (`persevera-web/scripts/exportar-tests-tema.mjs`, líneas 20-27):
  - la correcta como la más larga;
  - la opción que se explica sola;
  - la explicación que nombra la letra;
  - el reparto de la letra correcta.

  El informe va en `docs/contenido.md`, con el porcentaje por oposición y la lista de códigos para corregir en Persevera, de peor a menos malo. Barajar las opciones no lo arregla mientras haya explicaciones que citan la letra. Sale de un riesgo de la guía, no de una decisión: informa y no frena la publicación. Hecho cuando el informe está escrito y Persevera tiene la lista.

- [ ] **C8. Las preguntas pendientes.** El simulacro generado de Persevera admite preguntas en estado `pendiente` (`simulacroBuilder.ts`, línea 1031), y los tests solo `verificada`. Contar cuántas hay por oposición y decidir si Tests las quita. Si se quitan, se hace en la copia del banco (T10), no en el código. Hecho cuando está decidido y apuntado aquí.

- [ ] **C9. Los psicotécnicos del Auxiliar.** Se generan en la app (`src/lib/psico/`) y cuentan como «Original». Los exámenes oficiales del Auxiliar no traen sus 30 psicotécnicos, y el simulacro oficial los rellena con generados (`simulacroBuilder.ts`, líneas 1586-1592). La pantalla del simulacro lo dice. Hecho cuando el simulacro oficial del Auxiliar no se presenta como el examen completo.

## Antes de publicar

- [ ] **P1. Los términos de Tests.** Partir de `persevera-web/src/pages/terminos.astro` y adaptarlo:
  - una oposición por suscripción y su cambio cada 30 días;
  - los tres planes, la prueba de 7 días (una por persona) y la muestra;
  - la renovación y cómo se cancela en cada canal;
  - el desistimiento con su formulario.

  Van en tests.perseveraoposiciones.com/terminos. Antes, elegir dónde viven las páginas legales: en HTML estático en el `public/` de Tests, o en persevera-web, que también está en Cloudflare Pages (A8). La web de Tests es una app de una sola página, con el comodín `/* /index.html 200` en `_redirects`.

  La versión de los términos va en una constante, como `VERSION_TERMINOS` (`persevera-web/src/data/legal.ts`, línea 13), y es la que guarda `aceptaciones_terminos`. El texto lo aprueba Álvaro. Persevera tiene una duda abierta con el abogado: si el aviso de la Ley 10/2025 alcanza a la prueba. Vale también aquí (`claude/dia-d`, `docs/dia-d/comunicacion-y-terminos.md`, línea 757). Espera a: A8. Hecho cuando la página está publicada y aprobada.

- [ ] **P2. La política de privacidad.** Partir de `persevera-web/src/pages/privacidad.astro`. Debe decir:
  - qué guarda Tests: cuenta, respuestas, reportes, compras y los pasos del embudo de T22;
  - quién trata los datos: Supabase, RevenueCat, Stripe, Apple, Google y Resend;
  - qué se guarda tras el borrado y cuánto tiempo: `pruebas_usadas`, con la huella de la tarjeta si la hay;
  - que no hay IA y que Tests no comparte nada con Persevera.

  Hay que comprobar que los acuerdos de tratamiento de datos cubren las cuentas nuevas de Supabase, RevenueCat, Resend y Stripe. Va en tests.perseveraoposiciones.com/privacidad. Espera a: A8. Hecho cuando está publicada y aprobada por Álvaro.

- [ ] **P3. La página para borrar la cuenta.** Google la pide en «Seguridad de los datos». Partir de `persevera-web/src/pages/eliminar-cuenta.astro`, la página que Google ya aceptó a Persevera, con el nombre de Tests, qué se borra y qué se conserva. Va en tests.perseveraoposiciones.com/eliminar-cuenta. Espera a: A8 y T21. Hecho cuando la página está publicada y el borrado desde la app funciona en un móvil.

- [ ] **P4. Los textos del cobro.** Revisar en el paywall lo que pide Apple en la norma 3.1.2: precio, duración, renovación, qué pasa al acabar la prueba, y enlaces a términos y privacidad. La ley española pide además que el botón final lleve una fórmula de pago inequívoca (art. 98.2). El botón final de RevenueCat Billing no se puede rotular, así que la fórmula «Contratar con obligación de pago» va en nuestra pantalla previa. Lo valida el abogado. Sin promesas. Hecho cuando Álvaro aprueba los textos de los tres canales.

- [ ] **P5. El cobro de punta a punta, en sandbox y en los tres canales.** Lo hace Álvaro con una conversación al lado. Casos:
  - comprar con prueba y sin ella;
  - renovar (en sandbox las tiendas aceleran el tiempo);
  - cancelar, descancelar y dejar caducar;
  - un cobro fallido;
  - restaurar en otro dispositivo;
  - cambiar de oposición;
  - borrar la cuenta con una suscripción viva;
  - recibir el correo del alta y el aviso de renovación.

  Espera a: A6, A7, A8, A13, A14, A15, T14, T20 y T21. Hecho cuando cada caso deja la fila esperada en `suscripciones` y el acceso esperado en la app.

- [ ] **P6. El contenido, listo.** C1 a C9, hechos o decididos, salvo C7, que informa y no frena. Sin C4, el Auxiliar se tendría que esconder en `catalogo_tests`. Eso choca con la decisión 1, que saca las 5 oposiciones al lanzar: si C4 no llega, decide Blanca. Sin C6, los exámenes sin revisar no se enseñan como oficiales. Hecho cuando cada oposición del catálogo tiene su contenido revisado.

- [ ] **P7. La ficha de tienda.** El nombre «Persevera Tests», un subtítulo, una descripción y capturas propias, no las de Persevera. Cifras de C1, sin promesas y sin presentarla como «Persevera más barata». La misma en Apple y en Google.
  - En Apple: la URL de soporte (obligatoria), la de privacidad, el enlace a los términos en la descripción (norma 3.1.2) y la captura de la pantalla de compra de cada producto (`TEXTOS_APPSTORE.md`, líneas 47-53 y 77-80).
  - En Google: el correo de contacto, «Acceso a la app» con la cuenta demo y las cuentas de prueba de licencias (`TRAMITE_GOOGLEPLAY.md`, líneas 19 y 22). Y la norma de contenido repetitivo (https://support.google.com/googleplay/android-developer/answer/9899034).

  Espera a: T23, C1 y P12. Hecho cuando está cargada en las dos consolas.

- [ ] **P8. La privacidad en las tiendas.** Las etiquetas de privacidad de App Store y la «Seguridad de los datos» de Google, coherentes con P2, y la clasificación por edad. Hecho cuando están rellenas en las dos consolas.

- [ ] **P9. La nota al revisor de Apple (norma 4.3).** En inglés, como en `TEXTOS_APPSTORE.md` de Persevera.
  - Explica que Persevera es la plataforma completa de estudio y que Persevera Tests es otro producto: solo tests, una oposición, otra interfaz y otro precio.
  - Nombra también las otras apps de la misma cuenta: Eroodite (`TRAMITE_APPSTORE.md`, línea 8) y Persevera Oral.
  - Lleva una cuenta de prueba sin pago, para que el revisor vea el paywall. Esa cuenta está en `cuentas_de_prueba` y tiene el correo confirmado (`TEXTOS_APPSTORE.md`, línea 57).

  Si Apple la rechaza, se para y decide Blanca. El plan B de una tarifa «solo tests» dentro de Persevera era una recomendación de antes de decidir, no una decisión (guía, línea 90). Hecho cuando la nota y la cuenta están en App Store Connect.

- [ ] **P10. El texto visible, repasado.** Leer toda la app de corrido. Frases cortas y sin tono de IA, sin «·», decimales con coma y miles con punto (`miles()`), ningún texto por debajo de 13 px, y nunca «C1» ni «C2». También en el motor copiado, después del paso de tema de T23. Hecho cuando no queda nada que cambiar.

- [ ] **P11. El aviso legal y las cookies de la web.** Persevera los tiene en `persevera-web/src/pages/aviso-legal.astro` y `cookies.astro`. Hacen falta los de tests.perseveraoposiciones.com, donde viva lo de P1. Persevera usa atribución de Google Ads con consentimiento (`src/lib/atribucion.ts` y `src/lib/googleAds.ts`; `cookies.astro`, líneas 18-28). Por defecto, la web de Tests sale sin cookies de publicidad: no se copian `atribucion.ts` ni `googleAds.ts`, y la página de cookies lo dice. Si más adelante se quieren medir campañas, se añaden con su consentimiento. Espera a: A8 y P1. Hecho cuando las dos páginas están publicadas y aprobadas por Álvaro.

- [ ] **P12. El soporte y los reembolsos.** Persevera usa `hola@brooksoo.com` (`persevera-web/src/data/legal.ts`, líneas 34-35) y, en los correos del cobro, `CORREO_PERSEVERA` (`claude/dia-d`, `_shared/cobro/correos.ts`, línea 46). Tests necesita:
  - su buzón: hola@perseveraoposiciones.com, que se redirige a hola@brooksoo.com y contesta quien ya contesta lo de Persevera (decidido por Blanca el 13-oct-2026). Hay que comprobar que la redirección sigue funcionando antes de publicar;
  - la URL de soporte que Apple pide como obligatoria (`TEXTOS_APPSTORE.md`, línea 51);
  - cómo se devuelve una compra web en RevenueCat Billing, con el desistimiento de los términos (`comunicacion-y-terminos.md`, apartado 8.9);
  - qué se responde a quien pide el reembolso de una compra de tienda.

  Hecho cuando el buzón funciona, la URL existe y cada caso tiene su respuesta escrita.

- [ ] **P13. Enviar a revisión y publicar** (lo hace Álvaro). Builds firmados de iOS y Android, la web en producción, y `catalogo_tests` ajustado si alguna oposición no está lista y Blanca lo decide. Espera a: P1 a P12. Hecho cuando la app está publicada en las dos tiendas y en la web. Antes, pedir al soporte de RevenueCat que quite el enlace de compra «Prueba huella (borrar)», que no se puede borrar desde el panel (A13).

## Después del lanzamiento

- [ ] **D1. Leer los reportes cada semana.** Pasar las correcciones a Persevera con el código de la pregunta. Cerrar cada reporte cuando su corrección llega con la copia, y apuntar cuántos hubo y de qué tipo.

- [ ] **D2. Revisar la conversión a las 4 semanas.** Con T22 y RevenueCat: muestra, paywall, prueba y pago, por canal y por oposición. Si casi nadie empieza la prueba, mirar primero el paywall y después el precio. En Persevera hay 2 pruebas activas frente a 892 clientes nuevos. Con el anual igual: medir antes de bajarlo.

- [ ] **D3. Técnico de Hacienda, solo el primer ejercicio**, cuando esté activa en Persevera. Sus preguntas son copias `THAC-` que no comparten filas (`AUDITS.md`, línea 20). Sus 80 supuestos oficiales no tienen opciones (`catalogo-bandas.md`, línea 25), así que solo entra el test. Copiar de Persevera su configuración (id, reglas y estructura del simulacro) del commit de entonces, ampliar T4, añadirla a `catalogo_tests` y comprobar su alcance en la copia.

- [ ] **D4. Policía Nacional**, cuando esté activa en Persevera, que la añade después del día D, en la 1.14. Con «Todo ya» puede llegar más tarde, porque Álvaro hace antes las tareas de Tests. Igual que D3: copiar su configuración, ampliar T4, revisar sus etiquetas y añadir su línea en `catalogo_tests`.

- [ ] **D5. Gestión de la Administración Civil del Estado**, cuando esté activa en Persevera. Trae 18 supuestos oficiales y 18 originales con versión tipo test. Entran como adaptados (C2), con su aviso.

- [ ] **D6. «Añadir otra oposición».** Un producto «2 oposiciones» a 19,98 € dentro del mismo grupo de suscripción, para que Apple prorratee la subida y no abra otra prueba. La plaza 2 en `eleccion_oposicion`, y el webhook y el paywall ampliados.

- [ ] **D7. Las copias nuevas del motor.** Cuando Persevera arregle algo del motor de tests, se copia de su commit y se mueve el commit fijado en T4. Un fallo del motor encontrado aquí se apunta en esta hoja y se arregla en Persevera. Si el arreglo tiene que llegar a todos, se sube la versión mínima (T2).

## Qué necesita decidir Blanca todavía

- **Quién hace las capturas de la tienda** (P7). El icono y la paleta ya están elegidos.
- **Quien pague Persevera y Tests por la misma oposición.** Qué se le dice: un aviso en la ficha y en las preguntas frecuentes, o nada.
- **Si C4 no llega a tiempo**, qué se hace con el Auxiliar (P6).
- **Si Apple rechaza la app por la norma 4.3**, qué se hace (P9).

## Lo que se ha tomado por defecto

Si Blanca no dice otra cosa, la hoja sigue esto. Cambiar uno es cambiar esta lista y las tareas que nombra.

- **El aspecto del motor copiado** (T23, antes de T5). Los ficheros del motor llevan más de 2.000 colores fijos de Persevera (`#0D7C66`, `rgba(13,124,102,…)`), más de 250 tamaños de letra por debajo de 13 px (como `TakeTest.tsx`, línea 957, o `PsicoStudyModal.tsx`, línea 674, a 12 px) y textos con «·» (`TestSelectorModal.tsx` y `SimulacroResultado.tsx`). Había dos salidas: (a) dejarlos como están y aplicar la paleta y las normas del texto solo a las pantallas nuevas, o (b) un paso de tema que los cambia en lo copiado. Se toma la (b), porque la decisión 4 pide que Tests se vea distinta de Persevera y porque el verde de Persevera en el motor subiría el riesgo de la norma 4.3. Con la app oscura de Noche y menta, la (a) ya no cabe: las pantallas copiadas saldrían claras dentro de una app oscura.
- **Los psicotécnicos de Guardia Civil entran** (T8 y T10). La decisión 1 dice que Guardia Civil lleva «todo lo que Persevera ya tiene para su examen», y entre paréntesis nombra conocimientos, ortografía, gramática e inglés (guía, línea 43). Persevera tiene además 838 psicotécnicos de figuras (`psico_items_graficos`) y un simulacro aparte (`SimulacroRunnerGCPsico.tsx`). Leído al pie de la letra, entran.
- **El subdominio es tests.perseveraoposiciones.com** (A8). Es el ejemplo de la guía (línea 79).
- **Sin cookies de publicidad en la web de Tests** al lanzar (P11).
- **Solo modo oscuro al lanzar** (T23), porque el modo claro está por diseñar.
- **Lo propuesto.** Las tres pestañas, el onboarding de dos pasos, las etiquetas «Oficial» y «Original» y el botón de reportar salen de la recomendación de la guía (líneas 107-108), no de una decisión.

## Calendario (estimación)

Es una estimación, no un compromiso. Blanca decidió el 13-oct-2026 que Álvaro hace ya todas sus tareas de Tests, a la par del día D, aunque Policía Nacional y el pago de Oral tengan que esperar. Cada tarea A empieza en cuanto tiene lo que espera, y no en noviembre como decía antes. El calendario depende también de que el día D salga el 27-oct o poco después. Cada fecha dice lo antes que puede empezar algo, no cuándo empezará.

- **Desde el 14-oct:** Álvaro hace primero A1, porque T1 lo espera para subir su trabajo. Después hace A3, que hace falta para cerrar T2 y T10. El Stripe de Tests (A12) conviene abrirlo ya, porque la verificación puede tardar días. El proyecto de RevenueCat, el primer paso de A13, también va ya: A10, A11 y A12 se conectan a él. Con él se hacen las comprobaciones de A13, porque de sus respuestas dependen `pruebas_usadas` (T2), T13 y T14. Lo demás que no espera a nada puede empezar también: A10 sin los productos (el App ID, la app en App Store Connect y las cuentas de prueba) y la cuenta de Resend, la primera parte de A7. A2 tampoco espera a nada, pero no hace falta hasta noviembre, con T12 y A6, y su plan de pago se cobra desde que se crea. En el repositorio van T1 y, justo después, T9, la guía de Álvaro.
- **Desde que esté T1, hacia el 19-oct:** con la pantalla vacía de T1 ya se pueden hacer A8, la web, y A9, el primer paquete de Android (el AAB) en la prueba interna de Google. En cuanto A9 esté subido va A11, que en Persevera costó varias vueltas (`TRAMITE_GOOGLEPLAY.md`, líneas 41-44). Ahí se mira también si Google pide una prueba cerrada. Con la guía de T9, Álvaro crea los tres productos de A10. A10 se cierra con una captura provisional de la pantalla de compra, y la buena se pone en P7. Cada cuenta se conecta a RevenueCat cuando está lista. Cuando A10 y A11 tengan sus productos, sigue A13. Su parte web espera a que Stripe esté verificado (A12), y el webhook, el aviso de cada compra a Tests, espera a A2. Empieza también A5: Álvaro aprueba o cambia la propuesta de la copia que trae T9 y elige dónde corre. Una conversación de Persevera puede escribir ya A4 con el esquema de A3, para aplicarla después del día D. Las T siguen su orden: T2 a T4, T23 y T5 a T8.
- **Alrededor del día D (la semana del 26-oct):** el día D va primero. De Tests sigue lo que no toca Persevera y se puede dejar a medias: lo que quede de A5 y de A7 a A13, y lo que pida la verificación de Stripe. Lo que no se hace es aplicar A4. Es mejor aplicarla después del día D, en una noche sin fase, porque la rama del día D aún no está unida y A4 no corre prisa. Lo primero que la necesita es A6, a través de los secretos de A5, y A6 no se espera antes de noviembre. Si A6 llega a esperarla antes del día D, A4 va antes, en una noche libre.
- **Noviembre:** cuando le toca, va T10. C8 se decide antes de cerrar T10, porque quitar las pendientes se hace en la copia. Con A2 y A4, A5 se cierra con sus secretos de lectura; el de escritura va en A6. Después va A6, con la primera copia y la medida de la RLS (lo que deja leer a cada usuario) con el banco entero, para ver que no se queda lenta. Tras A6 van C1 y C2. Siguen T11 a T17. Con T12 llega el resto de A7 (el envío de los correos de la cuenta, con sus plantillas) y la comprobación de A2. Si A16 entra, sus clientes OAuth se pueden crear desde T12. Lo que quede de A13 se acaba aquí. Como A8 ya está, los textos legales (P1, P2 y P11) pueden empezar aquí y no en enero. P1 y P2 nombran el buzón de soporte, hola@perseveraoposiciones.com. En Persevera, después del día D, van C4 y C6.
- **Diciembre:** van T18 a T22, y C3, C5, C7 y C9. A14 empieza cuando T1 a T16 estén estables, y A15 con las funciones. Después va P5, el cobro de prueba (sandbox) en los tres canales, con la compra que llega al webhook. También van P3, P4, P8 y P9. Y P12, porque P7 lo espera. Si A16 entra, su prueba en iOS y Android va con A14. Hay que contar con la Navidad.
- **Enero de 2027:** van P6 con el contenido revisado, P7 con capturas de la app ya hecha, P10 (leer la app entera) y el envío a revisión (P13).
- **Publicación:** no antes de mediados de enero de 2027. Antes de esta decisión, la hoja decía finales de enero o febrero. Se puede adelantar poco, una o dos semanas, porque lo largo sigue siendo construir la app (las T) y revisar el contenido (las C), y A14, A15 y P5 esperan a que la app esté hecha. Lo que se gana es que las esperas de Stripe, Apple y Google pasan mientras se construye la app y no al final, y que las páginas legales van antes. Si pasa algo de lo que lo retrasa, va a finales de enero o más tarde. Las fechas de examen de 2027 son estimaciones, por cómo han ido otros años (`demanda_tiendas.md`): Hacienda en marzo-abril, Administrativo y Auxiliar en mayo-junio, Seguridad Social en junio y Guardia Civil en julio-septiembre.
- **Lo que marca la fecha:** la cadena de las T, de T1 a T22 con T23. T10 espera a A3 y a A5, y A6, que necesita también A4, va después de T10. Tras las T vienen A14, A15 y P5. También el contenido, de C1 a C9 salvo C7, y sobre todo C4 y C6 en Persevera. Las cuentas y las tiendas ya no están en esa cadena, salvo que Stripe o Google tarden semanas.
- **Lo que lo retrasa:** que el día D se mueva otra vez o dé problemas, porque Álvaro va primero a él. Que las T o la revisión del contenido lleven más de lo calculado. Que Stripe tarde en verificar la cuenta, o que Apple pida cambios por la norma 4.3. La prueba cerrada de Google se comprueba en A11, pero no se cuenta.
- **Lo que cuesta esta decisión:** Policía Nacional (1.14) y el pago de Oral ya no pasan delante. Ahora esperan ellos cada vez que una tarea A de Tests pide el tiempo de Álvaro.

## Revisión

- 13-oct-2026: una revisión contrastó esta hoja con el código y dio 51 hallazgos. Se aplicaron 50, cada uno comprobado. Cambiaron el commit de origen (`claude/dia-d`), los ficheros y cortes que faltaban, el esquema, la copia y su RLS con sus fuentes reales, el cobro web por RevenueCat Billing, lo legal y el soporte. También el orden de las tareas (por eso cambian los números de las T y las A) y el calendario, que ya no lleva horas. Al comprobarlos salieron tres cortes más: `logActivity` en el marcado y en los psicotécnicos, y los ejercicios escritos que trae `claude/dia-d`.
- Se descartó uno, el barrido de basura de extracción en las preguntas oficiales antes de C6. Ya se hizo el 9-ago-2026: `AUDITS.md`, «Barrido de oficiales 2026-08-09», con 3.039 revisadas y 3 arregladas.
- 13-oct-2026, después de la revisión: Blanca eligió el icono y la paleta «Petróleo». T23 pasa a ir justo después de T4, y cuatro puntos que estaban abiertos (el aspecto del motor, los psicotécnicos de Guardia Civil, el subdominio y las cookies) quedan con un valor por defecto que Blanca puede cambiar.
- 13-oct-2026, más tarde: Blanca eligió «Todo ya» para el tiempo de Álvaro. El calendario se rehízo con lo que espera cada tarea: las de Álvaro empiezan ya, a la par del día D, y Policía Nacional y el pago de Oral esperan. Dos revisiones de la propuesta, comprobadas contra la hoja, cambiaron además esto. T9 pasa a ir justo después de T1 y cubre primero lo que Álvaro puede hacer ya, y cada tarea que deja algo para desplegar añade sus pasos a la guía. A4 da permiso a las columnas de A3 menos lo que T10 no copia, así que no espera a la lista de T10, y T2 crea las tablas del contenido con esas columnas. A5, A7, A10, A11, A12 y A13 dicen qué parte se puede hacer antes, y la compra de prueba de A13 pasa a P5. T13 y T14 usan los identificadores de la guía. La publicación se adelanta poco: no antes de mediados de enero de 2027.
- 13-oct-2026, al final del día: Blanca eligió hola@perseveraoposiciones.com como correo de soporte de Tests (P12).
- 13-oct-2026, con la guía de consolas: el borrador de T9 está en `guia-consolas.md`. Lo que comprobó (la web pública en Cloudflare Pages, las URL de sandbox de Apple, los permisos de Google, las respuestas de A13, el botón de pago de P4, el secreto de escritura de la copia en A6, los UNIQUE parciales de T2 y la rúbrica de C2) se ha apuntado en sus tareas sin mover ninguna línea, para que las citas de la guía sigan valiendo.
- 13-oct-2026, cambio de estética: Blanca cambió de opinión y eligió «Noche y menta», icono incluido, en lugar de «Petróleo». La app pasa a ser oscura, así que el paso de tema de T23 convierte también los fondos claros y el texto oscuro del motor, y el modo claro queda por diseñar. Petróleo pasa a `marca/propuestas/`. Se cambiaron T23 y lo tomado por defecto sin mover ninguna línea.

## Maquetas de las pantallas

15-oct-2026: hay una maqueta de cada pantalla, 49 en total, con Noche y menta y lo que dice esta hoja: entrar, elegir oposición y plan, Practicar, Simulacros, Mis fallos y progreso, hacer un test y Tu cuenta. Está en https://claude.ai/artifact/9fcJ6B6M2BcZACFzpcSXaP, y sus fuentes en la carpeta del proyecto, `persevera-tests/maquetas/`, con un `LEEME.md`. Es para repasarla con Blanca antes de construir, y las tareas que hacen estas pantallas pueden partir de ella. Lo que Blanca cambie se apunta aquí, con la fecha, y en la tarea que lo construye.

### Para decidir en el repaso

Para dibujar las pantallas hizo falta elegir 17 cosas que esta hoja no fija. Si Blanca no dice otra cosa, se quedan así. El número es el de la pantalla en la maqueta, y entre paréntesis va la tarea que la construye.

- **1.2 (T12).** ¿«Entrar» o «Iniciar sesión»? Puesto: «Entrar», como Oral, de donde se copia. Persevera y `public/confirmado.html` dicen «Iniciar sesión»; si se queda «Entrar», se cambia también allí.
- **1.3 (T12).** Al crear la cuenta, ¿basta la frase de los términos o se pide además una casilla? Puesto: la frase sola, como Persevera.
- **1.5 (T12).** Los errores de los formularios, ¿en naranja o en rojo? Puesto: naranja con su icono, porque el rojo es el de las respuestas falladas. Oral los pone en rojo.
- **2.2 (T14).** ¿Qué plan sale marcado de entrada y en qué orden van? Puesto: el mensual, el primero.
- **3.2 (T11 y T16).** Quien no paga, ¿ve Supuestos y Simulacros con candado o no los ve? Puesto: con candado, y el candado abre los planes.
- **3.3 (T5).** ¿«Examen real», como Persevera, o «Examen oficial», como la etiqueta de las preguntas? Puesto: «Examen oficial».
- **4.1 (T8).** El simulacro generado, ¿dice «banco PERSEVERA» o «Preguntas originales»? Puesto: «Preguntas originales», como la etiqueta «Original» de T18.
- **4.6 (T8).** ¿Se dice en los simulacros de Hacienda que el 2.º ejercicio no se hace en la app? Puesto: sí, en una nota, con dónde están sus supuestos adaptados a test.
- **5.1 (T7).** Los colores de Mis fallos. Puesto: Pendientes en rojo, En refuerzo en menta y Dominadas en blanco. En Persevera son naranja, azul y verde, que en Tests son el aviso y el acierto.
- **5.3 (T16).** La nota de los simulacros en Progreso, ¿en lista o en gráfica? Puesto: una lista, cada uno con su fecha, una barra y su nota.
- **6.2 (T5).** ¿Se queda el aviso «Incorrecto. La respuesta correcta era D» o bastan los rótulos de las opciones? Puesto: se queda, porque viene de Persevera.
- **6.6 (T19).** Los motivos para reportar, que son nuevos porque Persevera no tiene. Puestos: «La respuesta correcta está mal», «El enunciado o las opciones tienen un error», «La explicación no cuadra», «La ley ha cambiado» y «Otro».
- **6.7 (T18).** La etiqueta del supuesto adaptado, ¿larga («Supuesto de desarrollo adaptado a test») o corta («Adaptado a test»)? Puesto: la larga, que es la de esta hoja.
- **6.8 (T6).** ¿Se ve el código del caso («HAC-OF-2023-S02») encima del contador? Puesto: sí, como en Persevera, porque sirve para decir qué caso se reporta.
- **7.1 (T16 y T21).** «Borrar la cuenta», ¿en rojo o en el color del texto? Puesto: rojo, en la fila y en el botón de 7.6, como Oral y Persevera, aunque en Tests el rojo es el de las respuestas falladas.
- **7.4 (T17).** ¿Se pide confirmar antes de cambiar de oposición? Puesto: sí.
- **7.6 (T21).** ¿«Borrar» o «Eliminar»? Puesto: «Borrar», y la palabra para confirmar es BORRAR. Persevera dice «Eliminar cuenta» y pide ELIMINAR.

### Fallos del motor encontrados al dibujarlas

Comprobados en Persevera, `claude/dia-d` en `54e448e`. Como dice D7, se arreglan en Persevera y llegan con la copia siguiente. El detalle está en `persevera-tests/maquetas/fallos-motor-verificados.md`.

Hacer un test (T5), en `src/components/views/TakeTest.tsx`:

- El menú de la pulsación larga no sale en «Revisar respuestas», porque la revisión vuelve antes (517-645) y el menú solo está en la pantalla del test (1270-1333). Su id no se borra nunca, así que el menú sale encima del test nuevo tras «Repetir test» (843) o «Repasar fallos» (652-660).
- En modo examen, «Salir» no guarda nada (282 y 398-400), pero el aviso de salir dice «Las preguntas que ya hayas respondido contarán para tu progreso» (1256).
- «Repasar fallos» tras un test en modo examen sigue en modo examen, con el tiempo entero del examen (652-660), y vuelve a guardar las respuestas como `examen_real` (326-331).
- Los blancos no se guardan pregunta a pregunta, solo su número en `metadata.en_blanco` (385-400 y 455). La página de progreso de T16 pide blancos por tema, así que hace falta guardarlos o quitar ese dato.
- La rejilla dice «Quedan 1 sin contestar», sin singular (987-991).

Simulacros (T8):

- Hacienda: al entregar dice «No has elegido supuesto» aunque su simulacro no lleva supuesto (`SimulacroRunner.tsx`, 470-486).
- Hacienda: el resultado dice «70 preguntas oficiales» sea cual sea el número (`SimulacroResultado.tsx`, 1131) y enseña el aviso de los cortes de la Comisión Permanente de Selección, que no es suyo (809-813).
- Hacienda: el hub anuncia «80 preguntas» (`SimulacroHubModal.tsx`, 1551, 1573 y 1586), pero cinco de sus seis oficiales tienen entre 95 y 99 (`simulacroBuilder.ts`, 1085-1087).
- Seguridad Social: «corte último con plaza: 50.00» es la suma de los dos mínimos, no un corte, y sale con punto decimal (`simulacroScoring.ts`, 298, y `SimulacroResultado.tsx`, 903-910).
- Guardia Civil, psicotécnico: la intro dice que lo que quede en blanco cuenta como fallo y, justo debajo, que no penaliza (`SimulacroRunnerGCPsico.tsx`, 141-146). El resultado lo llama «bloque teórico» (`SimulacroResultadoGC.tsx`, 126-130).
- Seguridad Social y Hacienda: el generado habla de «la distribución por bloques de esta convocatoria» sin nombrar ninguna (`SimulacroIntroPantalla.tsx`, 107-108).
- Auxiliar: el simulacro no guarda la sesión ni las respuestas, así que sus fallos no llegan a Mis fallos (`SimulacroRunnerAuxiliar.tsx`).
- Allí «preguntas originales» quiere decir las del examen (`SimulacroResultado.tsx`, 1128, y `SimulacroIntroPantalla.tsx`, 142). En Tests choca con la etiqueta «Original» de T18, así que se cambia al copiar, por ejemplo por «preguntas del examen», con el «banco PERSEVERA» de esos textos.

Mis fallos (T7), en `src/components/views/MisFallosView.tsx`:

- La pestaña Casos no se acota a la oposición (`src/lib/casosRepaso.ts`, 53-61), y la vista no trae la oposición para filtrarla aquí. Hasta que se arregle en Persevera, T7 no puede darse por hecha.
- Por bloque y Por tema solo cuentan los temas de la oposición activa (222-239). En el Auxiliar salen casi a 0, y en Seguridad Social y Hacienda pierden la parte que comparten con el Administrativo.
- El aviso de Casos habla del «mejor intento» (917), pero el porcentaje es el de la última respuesta.
- El «% dominado» divide entre todas las preguntas vistas, también las que nunca se fallaron (325-327).
- Los botones anuncian todos los fallos (503-505 y 702-703), pero el test se corta en 20 o en 30 (304 y 314).

Entrar, cobro y cambio de oposición (T12, T14 y T17):

- `public/confirmado.html` dice siempre «Email confirmado», también cuando el enlace ha caducado o ya se usó. La copia de Tests lo hereda. Oral ya lo resuelve (`src/lib/sesion.ts`, 142).
- Hay dos textos para «no hay nada que restaurar» (`PaywallModal.tsx`, 462, y `textosDiaD.ts`, 183).
- «Ya has cambiado de oposición este mes» (`flujoCompra.ts`, 691) y «una vez al mes» (`textosDiaD.ts`, 60), cuando la regla es de 30 días.
- Si la activación tarda, dice «pulsa Restaurar», y el botón se llama «Restaurar compras» (`flujoCompra.ts`, 707).

### Lo que piden las maquetas a sus tareas

- **T14.** En Persevera, «Restaurar compras» solo sale en el móvil (`PaywallModal.tsx`, 403-405). Falta decidir qué hace en la web con RevenueCat Billing. En el móvil, la prueba que se ofrece sale de la tienda (`revenuecat.ts`, 206-215). En Tests la oferta (`default` o `sin_prueba`) se elige según `prueba_disponible()`, para no enseñar «Hoy 0 €» a quien ya gastó la prueba en la web.
- **Al copiar.** Se quitan los nombres de Persevera: «elige Persevera» en los pasos para cancelar (`textosDiaD.ts`, 292-293) y sus fichas de tienda en `versionMinima.ts` (24-25).
- **P4.** Los términos dicen que se cancela en App Store «al menos 24 horas antes de la renovación», pero durante la prueba el primer cobro no es una renovación. Lo mira el abogado.
