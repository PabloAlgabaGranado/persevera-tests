# CLAUDE.md

## Qué es

**Persevera Tests** es una app de tests para opositores: elige una oposición y practica con preguntas de examen, tests por tema, exámenes oficiales, supuestos y simulacros. Sale con las cinco oposiciones que ya están en Persevera. Es una app **separada de Persevera**, como Persevera Oral: repositorio, base de datos Supabase, RevenueCat, Stripe y claves propios. El banco de preguntas es una copia del de Persevera, que se actualiza sola cada noche y en un solo sentido.

React 19 + TypeScript + Vite 8, empaquetada con Capacitor 8 (`com.persevera.tests`). Las plataformas nativas (`ios/`, `android/`) aún no se han añadido.

```bash
npm run dev     # http://localhost:5320 (puerto fijo)
npm run build   # tsc -b, vite build y el guardián del tope de Cloudflare Pages
npm run lint
npm run test    # vitest, solo src/**/*.test.ts(x)
npm run probar:esquema   # las migraciones de supabase/migrations en PGlite, con y sin los GRANT automáticos
```

Cuando se añada `ios/`, el build lleva también `xattr -cr dist && xattr -cr ios/App/App/public`, como en Persevera: Xcode falla si `public/` trae atributos extendidos de macOS.

## La hoja de ruta

Lo que queda y en qué orden está en `docs/hoja-de-ruta.md`. Cada conversación la lee antes de empezar, hace una sola tarea y la marca como hecha en el mismo commit, con la fecha. Para terminar una tarea: `npm run lint`, `npx tsc -b`, `npm run test` y `npm run build` en verde, commit en `main` y `git push`. Ninguna conversación se cierra con cambios sin commit o sin subir.

- Las decisiones de producto están en `docs/guia-decisiones.md`, que cerró Blanca el 13-oct-2026. Si algo de la hoja choca con ella, manda la guía.
- La guía de Álvaro para cuentas y consolas está en `docs/guia-consolas.md`. Cada tarea que deja algo que Álvaro tiene que subir o desplegar añade sus pasos allí en el mismo commit.
- La marca (icono, paleta con sus reglas y pantalla de ejemplo) está en `docs/marca/`.
- `docs/guia-consolas.md` cita líneas de `docs/hoja-de-ruta.md`: al cambiar la hoja, se cambia en el sitio o se añade al final, sin mover líneas, o se actualizan las citas.

## El código que viene de Persevera: copiar, nunca mover

El motor de tests y algunas piezas comunes vienen de Persevera, en `/Users/alvaroalgaba/Desktop/EXAMI/PRIMERA DESCARGA EN MAC/persevera` (ruta con espacios: siempre entre comillas).

- **Copiar, nunca mover.** En Persevera no se escribe, no se mueve, no se borra nada y no se hace git salvo para leer: varias sesiones trabajan allí a la vez.
- Cada fichero copiado lleva en su cabecera la ruta de origen, la rama, el commit y la fecha, y lo que se ha cambiado aquí.
- Todas las piezas se copian del mismo commit: el de `claude/dia-d` (hoy `54e448e`) o, cuando el día D esté unido a `main`, el de `main` de después. Ese commit va en la cabecera de cada fichero y en la prueba de paridad (T4).
- Se siguen los `import` de lo copiado y se copia también lo que falte, con su cabecera. Lo que sea tutor, plan, gamificación, paywall de Persevera o ejercicio escrito se corta.
- **El motor no se arregla aquí.** Un fallo de lo copiado se apunta en la hoja de ruta y se arregla en Persevera, en su propia conversación. Después se copia aquí de ese commit y se mueve el commit de la prueba de paridad.
- **El banco no se corrige aquí.** Una pregunta mal se corrige en Persevera y llega con la copia de la noche. Tests no escribe nunca en las tablas del contenido.
- Ya copiado (13-oct-2026, rama `claude/dia-d` en `54e448e`): `public/_headers`, `public/_redirects`, `public/confirmado.html`, la red de seguridad de caché de `index.html` y `scripts/comprobar-tamano-dist.mjs`. De Persevera Oral (`main` en `b8e151a`): `eslint.config.js`, `tsconfig*.json` y la base de `package.json`.

## Lo propio: repositorio, base de datos, cobro y claves

- Repositorio en GitHub, privado: `PabloAlgabaGranado/persevera-tests` (`origin`, rama `main`).
- Proyecto de Supabase propio, proyecto de RevenueCat propio («Persevera Tests», `proj0fca9795`) y cuenta de Stripe propia, con las claves en `.env.local` (nunca al repositorio ni a una conversación). Nada apunta al proyecto, a las claves ni al RevenueCat de Persevera.
- El cobro va todo por RevenueCat: App Store, Google Play y la web con RevenueCat Billing sobre el Stripe de Tests. Los identificadores (productos, acceso `acceso`, ofertas `default` y `sin_prueba`) están en `docs/guia-consolas.md`.
- **Toda tabla o vista nueva en `public` lleva sus GRANT en la misma migración**, junto a su RLS (desde el 30-oct-2026 Supabase no da permisos a las tablas nuevas y sin GRANT responden `42501 permission denied`):

  ```sql
  alter table public.x enable row level security;                      -- y sus políticas
  grant select, insert, update, delete on public.x to authenticated;  -- solo los verbos que usa el cliente
  grant select, insert, update, delete on public.x to service_role;   -- siempre
  ```

- **Toda función SECURITY DEFINER cierra `public` y `anon` en la misma migración**:

  ```sql
  revoke all on function public.f(uuid) from public, anon;
  grant execute on function public.f(uuid) to authenticated, service_role;
  ```

## Convenciones

- Identificadores en español (`temas`, `preguntas`, `respuestas_usuario`), y los nombres de Persevera tal cual en lo copiado.
- Estilos en línea. Colores de la paleta (`docs/marca/paleta.md`; desde T23, `src/tema/paleta.ts`); un color nuevo se añade allí, no suelto.
- Comunicación entre ventanas con eventos de `window` (`nombre:abrir`, `nombre:cerrar`), nunca librerías de estado.
- Iconos de `@phosphor-icons/react`. Nada de emojis.
- Paleta «Noche y menta», elegida por Blanca el 13-oct-2026: app oscura, fondo `#0F2A31`, marca menta `#7AD8D2`, texto `#F1FAF7`. La menta nunca significa «acierto» y el verde es solo para los aciertos. El acierto lleva siempre su tic y «Respuesta correcta», y el fallo su aspa y «Tu respuesta». Solo modo oscuro al lanzar. Las reglas completas, en `docs/marca/paleta.md`.
- Letra: Cormorant Garamond solo para el nombre «Persevera Tests»; la del sistema para la interfaz.
- Móvil: una columna con 16 px de margen, sin scroll horizontal. Ningún texto visible por debajo de 13 px.

## Texto visible

- Sin tono de IA: frases cortas y llanas, como las diría una persona.
- Sin «·» como separador.
- Sin promesas: nada de «aprobarás», «garantizado», «mejorarás tu nota».
- Decimales con coma y miles con punto: `toLocaleString('es-ES')` y `miles()` de `src/lib/cifras.ts` (T3), nunca un número interpolado en crudo ni `toFixed`.
- El precio se enuncia sin justificarlo.
