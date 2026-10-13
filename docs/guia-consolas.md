# Persevera Tests: las consolas de Álvaro

> **Estado al 13-oct-2026**
> - **Ya hecho desde el hilo el 13-oct-2026**, con el visto bueno de Blanca y el conector de RevenueCat: el proyecto «Persevera Tests» (`proj0fca9795`, dueño `hola@brooksoo.com`, el mismo que Persevera y Eroodite), sus apps de App Store (`app6974824c52`) y Play Store (`app3585b5c72c`), el entitlement `acceso` con los seis productos de la tabla, y las ofertas `default` (la actual) y `sin_prueba`, cada una con sus tres paquetes. En los bloques 4, 10, 11 y 12, lo marcado «Ya hecho» no se repite. En el proyecto Persevera no se tocó nada. Ninguna otra tarea tuya está hecha. Más tarde, ese mismo día: Blanca creó el repositorio privado `PabloAlgabaGranado/persevera-tests` (ya tiene T1 subido) y la cuenta de Stripe «Persevera Tests» (`acct_1UQA9NDBHlndqjVo`), separada y fuera de cualquier organización, con Radar en «Lite». Con su visto bueno, desde el hilo se puso Stripe Tax en esa cuenta (13.1, pasos 1 a 3). La cuenta de Persevera no se tocó.
> - Blanca decidió el 13-oct-2026 que empiezas ya con todo lo de Tests, a la par del día D de Persevera. La referencia del día D es el martes 27-oct, y puede moverse. El día D va primero.
> - El correo de soporte de Tests es `hola@perseveraoposiciones.com`, elegido por Blanca el 13-oct-2026. Se redirige a `hola@brooksoo.com`, el buzón que ya contesta lo de Persevera.
> - Esta guía es la T9 de la hoja de ruta. Las líneas que cita de la hoja son las de su versión del 13-oct-2026.

Esta guía es para ti, Álvaro, con la consola delante y en tu Mac. Dice qué crear en cada cuenta de Persevera Tests, en qué orden, cuánto tarda cada bloque y qué datos no secretos tienes que devolver. Nadie puede ver ni comprar nada de Tests hasta que se publique (P13), así que un bloque a medias no hace daño.

---

## Qué cubre y qué no

Sigue la forma de la guía de consolas del día D de Persevera (`claude/dia-d`, `docs/dia-d/guia-consolas.md`, en 54e448e; aquí, «guía del día D»). Cubre, en el orden del calendario de la hoja (líneas 602-615):

- **Esta semana:** A1, A3, abrir A12, el proyecto de RevenueCat y las comprobaciones de A13, A10 sin los productos y la cuenta de Resend (la primera parte de A7).
- **Desde que esté T1:** A8, A9, los productos de A10, A11, el resto de A13 (su parte web, cuando Stripe esté verificado) y A5, con la propuesta de la copia del banco (anexo A).
- **Después del día D:** aplicar A4. El encargo de la migración, listo para pegar en una conversación de Persevera, se puede pasar antes, en cuanto A3 y esta guía estén en el repo de Tests (hoja, líneas 606-607).
- **En noviembre:** A2, la dirección de vuelta de A7, el webhook de A13 y los secretos de A5.

**No cubre** A6, el resto de A7 (las plantillas de los correos), A14, A15 ni A16. Sus pasos los añade a esta guía la tarea que hace lo que se sube o se despliega, en su mismo commit (hoja, líneas 18 y 33):
- T10, la copia del banco, para A6;
- T12, las plantillas de los correos y los clientes de A16;
- T13, T19, T20 y T21, las funciones de A15;
- T23, el icono de A14.

## Cómo usarla

1. **Un bloque cada vez, en el orden de la guía.** Cada bloque dice al principio cuánto tarda, a qué espera y qué desbloquea.
2. **Cada bloque empieza con «Mira y anota, sin cambiar nada».** Lo que se mira, solo se mira.
3. **Al acabar un bloque, devuelve sus datos.** Copia su apartado «Devuelve», rellénalo y pégalo en una conversación del repositorio de Tests. Esa conversación lo apunta en `docs/hoja-de-ruta.md`, junto a la tarea, con la fecha. Si lo prefieres, apúntalo tú en la hoja. Nada de lo que pide «Devuelve» es secreto.
   - **Mientras T1 no haya subido su commit** (hacia el 19-oct), esa hoja todavía no está en el repositorio: la copia T1 (hoja, línea 29). Pega los «Devuelve» de esos días en la conversación de T1, que los apunta al copiar la hoja, o guárdalos en una nota y pégalos todos juntos en la primera conversación de Tests después de T1.
4. **Las órdenes llevan la carpeta propuesta** en el bloque 1, `/Users/alvaroalgaba/Developer/persevera-tests`. Si en 1.2 eliges otra, cámbiala en cada `cd` y en cada `git -C` (bloques 1, 2, 8, 9, 15 y 16) y en las dos rutas del encargo de 15.1.
5. **Copia y pega los identificadores** de la tabla de abajo. En Apple y en Google, uno mal escrito no se puede borrar ni volver a usar.
6. **Si la pantalla no coincide con la guía, para** y escríbelo en la conversación.
7. **«(sin verificar)»** marca lo que no he podido confirmar en la ayuda oficial. «(propuesto)» marca lo que decides tú.
8. **Los botones** van en español y, cuando la ayuda de esa consola está en inglés, con el rótulo en inglés entre paréntesis.
9. **Puedes parar al final de cualquier bloque.**

> **PELIGRO (siempre)**
> - **De Persevera no se toca nada.** Solo hay dos excepciones: A3, que solo lee su base (`pg_dump --schema-only`, bloque 2), y A4, una migración de Persevera que escribe una conversación de Persevera y aplicas tú después del día D, nunca la noche de una fase (bloque 15).
> - **Las cuentas son las de Persevera.** Apple, Google Play, RevenueCat, Cloudflare y GitHub son las mismas. Antes de crear algo, mira arriba que estás en Persevera Tests y no en Persevera ni en Eroodite.
> - **Nada de Tests apunta a Persevera:** ni al proyecto de Supabase `rljfcmjvulmjooxoxzxo`, ni a sus claves, ni a su Stripe, ni a su Resend, ni a `app.perseveraoposiciones.com`.
> - **Ningún secreto en el repositorio ni en una conversación.** Son secretos: las claves `sb_secret_`, las contraseñas de las bases y las cadenas de conexión que las llevan, los ficheros `.p8` de Apple, el JSON de la cuenta de servicio de Google, el keystore (`.jks`) y sus contraseñas, las claves de Stripe (`sk_`, `rk_`, `whsec_`), las claves secretas de RevenueCat (`sk_`), la clave de Resend (`re_`), el secreto del webhook y las contraseñas de las cuentas de prueba. Van a `.env.local` (que nunca se sube), a los secretos de Supabase o a los de GitHub, y una copia a tu gestor de contraseñas.
> - **No envíes nada a revisión** en Apple ni en Google hasta P13: ningún «Añadir para revisión» (Add for Review), ninguna pista de producción.
> - **«En familia» (Family Sharing) siempre apagado.** Una vez encendido no se puede apagar (guía del día D, línea 601). Nada de compras de varias unidades.
> - **Sin promesas en ningún texto** que se vea: ni en las tiendas ni en los correos.

---

## El orden y los tiempos

Unas **11 horas y 50 minutos** de trabajo tuyo, repartidas en semanas. Cada tarea empieza en cuanto tiene lo que espera (hoja, línea 604).

| Cuándo | Bloque | Tarea | Tu tiempo | Lo que tarda solo |
|---|---|---|---|---|
| Esta semana | 1. El repositorio | A1 | 15 min | nada |
| Esta semana | 2. El esquema real del contenido | A3 | 40 min | nada |
| Esta semana | 3. La cuenta de Stripe de Tests | A12 | 45 min | la verificación de Stripe: días, sin dato en el repo |
| Esta semana | 4. El proyecto de RevenueCat y las comprobaciones | A13 | 15 min | nada |
| Esta semana | 5. Apple sin los productos | A10 | 45 min | nada |
| Esta semana | 6. La cuenta de Resend | A7 | 25 min | los registros de tu hermano y la verificación, hasta 72 h |
| Esta semana | 7. La prueba de la huella | A13 | 40 min | nada |
| Desde T1 (hacia el 19-oct) | 8. La web | A8 | 35 min | el registro DNS, si lo pone tu hermano |
| Desde T1 | 9. El primer paquete de Android | A9 | 85 min | la primera versión interna: horas |
| Desde T1 | 10. Los productos de Apple y su conexión | A10 y A13 | 70 min | hasta 1 h hasta el sandbox |
| Desde T1 | 11. Google: suscripción, cuenta de servicio y avisos | A11 y A13 | 90 min | hasta 36 h la validación |
| Desde T1 | 12. RevenueCat: entitlement, ofertas, ajustes y claves | A13 | 25 min | nada |
| Con Stripe verificado | 13. La web de pago | A12 y A13 | 65 min | nada |
| Desde T1 | 14. La propuesta de la copia del banco | A5 | 20 min | nada |
| Después del día D (el encargo, en cuanto estén A3 y esta guía) | 15. El lector de Persevera | A4 | 40 min | la conversación de Persevera que la escribe |
| Noviembre | 16. El Supabase de Tests y la dirección de vuelta | A2 y A7 | 35 min, más 20 si adelantas el SMTP | 1 día hasta la primera copia de seguridad |
| Noviembre | 17. El webhook de RevenueCat | A13 | 10 min | nada |
| Noviembre | 18. Los secretos de la copia | A5 | 10 min | nada |

Esta semana son unas 3 h 45 min. Desde T1, unas 6 h 30 min. A4, 40 min. Noviembre, unos 55 min, más 20 si adelantas el SMTP.

---

## Los identificadores (todo sale de aquí)

**Lo que no tiene vuelta atrás:**
- En App Store Connect, un ID de producto no se puede cambiar después de guardarlo ni volver a usar en la misma app, aunque se borre [Apple campos].
- En Google Play, los ID de producto no se pueden cambiar ni reutilizar, y las suscripciones, los planes base y las ofertas no se pueden borrar [Google suscripciones], [Google ofertas].
- El nombre del paquete de Android queda registrado al crear la app en Play Console y es para siempre [Android verificación], [Play crear app].
- En RevenueCat, el identificador de una oferta no se puede cambiar (guía del día D, línea 636). En RevenueCat Billing, un precio guardado no se cambia: solo se añaden monedas [RC productos web].

### La app, las cuentas y los nombres

| Qué | Valor | Estado |
|---|---|---|
| App en iOS y Android | `com.persevera.tests` | decidido |
| Nombre de la app | `Persevera Tests` | decidido |
| Repositorio | `PabloAlgabaGranado/persevera-tests`, privado, rama `main` | decidido (hoja, A1) |
| Carpeta en el Mac | `/Users/alvaroalgaba/Developer/persevera-tests` | propuesto (bloque 1) |
| Web | `tests.perseveraoposiciones.com` | tomado por defecto (hoja, línea 597) |
| Proyecto de Cloudflare Pages | `persevera-tests` | propuesto |
| Equipo de Apple | `F9T767LMSX`, el de Persevera | decidido |
| SKU de la app en App Store Connect | `persevera-tests` | propuesto |
| Grupo de suscripción de Apple | referencia y nombre visible `Persevera Tests` | decidido |
| Cuenta de Stripe | `Persevera Tests`, descriptor del extracto `PERSEVERA TESTS` | propuesto |
| Titular | Brooks & Oo, S.L., NIF B26969022, Calle Doctor Fleming, 21, 41210 Guillena (Sevilla), España | decidido (`persevera-web/src/data/legal.ts`, líneas 30-32) |
| Proyecto de RevenueCat | `Persevera Tests` | decidido |
| Apps de RevenueCat | `Persevera Tests (App Store)`, `Persevera Tests (Play Store)` y `Persevera Tests (Web)` | propuesto |
| Entitlement | identificador `acceso`, nombre `Persevera Tests` | propuesto |
| Ofertas | `default` (los tres planes con la prueba) y `sin_prueba` | decidido (hoja, línea 414) |
| Webhook de RevenueCat | nombre `Supabase Tests - suscripciones`, URL `https://<ref de Tests>.supabase.co/functions/v1/revenuecat-webhook` | propuesto |
| Proyecto de Google Cloud | `persevera-tests` | propuesto |
| Keystore de Android | `~/claves/persevera-tests/persevera-tests-upload.jks`, alias `upload` | propuesto |
| Proyecto de Supabase | `Persevera Tests`, `project_id = "persevera-tests"`, región West EU (Ireland), `eu-west-1` | propuesto |
| Equipo y dominio de Resend | equipo `Persevera Tests`, dominio `tests.perseveraoposiciones.com` en Irlanda (`eu-west-1`) | propuesto |
| Remitente de los correos | `Persevera Tests <avisos@tests.perseveraoposiciones.com>` | propuesto |
| Correo de soporte y de respuesta | `hola@perseveraoposiciones.com` (se redirige a `hola@brooksoo.com`) | decidido por Blanca el 13-oct-2026 |
| Rol de lectura en Persevera | `lector_tests` | decidido (hoja, A4) |
| Rol de escritura de la copia en Tests | `copia_banco` | propuesto (anexo A) |

### Los tres planes en cada canal

| Plan | Precio con IVA | Apple (ID de producto) | Google (en RevenueCat) | Web, con prueba | Web, sin prueba | Paquete de RevenueCat |
|---|---|---|---|---|---|---|
| Mensual | 9,99 € | `com.persevera.tests.una.mensual` | `tests_una:mensual` | `tests_una_mensual` | `tests_una_sinprueba_mensual` | Monthly (`$rc_monthly`) |
| Semestral | 46,99 € | `com.persevera.tests.una.semestral` | `tests_una:semestral` | `tests_una_semestral` | `tests_una_sinprueba_semestral` | Six Month (`$rc_six_month`) |
| Anual | 79,99 € | `com.persevera.tests.una.anual` | `tests_una:anual` | `tests_una_anual` | `tests_una_sinprueba_anual` | Annual (`$rc_annual`) |

**Apple** (ID de producto, para copiar):
```
com.persevera.tests.una.mensual
com.persevera.tests.una.semestral
com.persevera.tests.una.anual
```

**Google:**
- suscripción: `tests_una`, con el nombre `Persevera Tests`;
- planes base: `mensual`, `semestral` y `anual`, con renovación automática;
- oferta de prueba en cada plan base: `prueba-7d`, 7 días gratis, para quien nunca tuvo una suscripción en la app.

**Web (RevenueCat Billing):**
```
tests_una_mensual
tests_una_semestral
tests_una_anual
tests_una_sinprueba_mensual
tests_una_sinprueba_semestral
tests_una_sinprueba_anual
```

**Nombre visible y descripción** (propuesto; se pueden cambiar después):
- nombre de cada producto, el mismo en Apple (referencia y visible) y en la web: `Persevera Tests mensual`, `Persevera Tests semestral` y `Persevera Tests anual`. Apple admite de 2 a 30 caracteres (guía del día D, línea 599); el más largo tiene 25;
- descripción, la misma en los tres y en los tres canales: `Los tests de tu oposición` (25 caracteres; Apple admite 45). No justifica el precio, como se decidió en el día D (guía del día D, línea 9). La tilde ya la aceptó Apple en la descripción de los tramos de Persevera, que el 13-oct estaban listos para enviar (`READY_TO_SUBMIT`, leído con el conector de RevenueCat).

**Reservado, no se crea ahora** (para que nadie gaste esos nombres en otra cosa):
- `com.persevera.tests.dos.*`, `tests_dos` y `tests_dos_*`, para el producto «2 oposiciones» de D6;
- `com.persevera.tests.una_sinprueba.mensual`, `.semestral` y `.anual`, tres productos de Apple sin la semana gratis, solo si decides cerrar el hueco de A13 (bloque 10, paso 10.9).

Por qué estos nombres, en el anexo C.

### Lo que va en `.env.local` de Tests (nunca en el repositorio)

| Variable | Qué es | Bloque |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://<ref de Tests>.supabase.co` | 16 |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | la clave `sb_publishable_…` | 16 |
| `SUPABASE_SECRET_KEY` | la clave `sb_secret_…`, secreta | 16 |
| `VITE_REVENUECAT_IOS_KEY` | la clave pública `appl_…` | 12 |
| `VITE_REVENUECAT_ANDROID_KEY` | la clave pública `goog_…` | 12 |
| `VITE_REVENUECAT_WEB_KEY` y `VITE_REVENUECAT_WEB_SANDBOX_KEY` | las claves públicas de la web, la real y la de sandbox (propuesto: el nombre lo fija T14) | 13 |

Los tres primeros nombres son los de Oral (`persevera-oral/scripts/comprobar-claves.mjs`, líneas 11-13). Los de iOS y Android, los de Persevera (`claude/dia-d`, `src/lib/revenuecat.ts`, líneas 41-45). Las claves públicas no son secretas, pero tampoco van al chat: basta con decir que están puestas.

---

# Esta semana (desde el 14-oct)

## Bloque 1. El repositorio (A1, unos 15 min)

- **Espera a:** nada. Es lo primero de todo (hoja, línea 337).
- **Desbloquea:** T1 y, con ella, todas las T.

### 1.0 Mira y anota, sin cambiar nada (2 min)

1. En GitHub, con la cuenta `PabloAlgabaGranado`, mira si ya existe `persevera-tests`. Si existe, no lo crees otra vez: apunta si es privado y si tiene commits, y sigue en 1.2.
2. Apunta en qué carpeta del Mac tienes `persevera-oral`. Te sirve para elegir en 1.2.

### 1.1 Crear el repositorio (5 min)

1. Entra en GitHub con `PabloAlgabaGranado`, la cuenta dueña de `persevera-oral` (privado, creado el 10-oct-2026, leído hoy por la API de GitHub). Es una cuenta personal, y en una cuenta personal solo crea repositorios su dueño [GitHub crear].
2. Arriba a la derecha, **+** y «New repository».
3. Rellena:
   - Owner: `PabloAlgabaGranado`
   - Repository name: `persevera-tests`
   - Description: `Persevera Tests`
   - Visibility: **Private**
   - Sin plantilla, sin README, sin .gitignore y sin licencia. El primer commit lo sube T1, y unos ficheros iniciales le darían un conflicto [GitHub crear].
4. Pulsa «Create repository».
5. Opcional: en «Settings», «General», apaga «Wikis», como en Oral.

Lo mismo desde la terminal [gh repo create]:

```bash
gh repo create PabloAlgabaGranado/persevera-tests --private --description "Persevera Tests" --disable-wiki
```

### 1.2 La carpeta en el Mac (5 min)

Dónde va lo decides tú (propuesto):
- **Propuesta: fuera de iCloud**, en `/Users/alvaroalgaba/Developer/persevera-tests`. Sin espacios y sin las copias «x 2.ext» de iCloud, que en Oral tienen su propia regla (`persevera-oral/CLAUDE.md`, línea 37) y en Persevera obligan al build a borrarlas (`package.json`, línea 8). La copia de seguridad es GitHub, porque cada tarea acaba con `git push`.
- **Alternativa: en el Escritorio, junto a Oral.** Entonces díselo a la conversación de T1, para que copie al `CLAUDE.md` de Tests la regla de iCloud de Oral.

Con la propuesta (con la otra, cambia las dos primeras líneas):

```bash
mkdir -p "/Users/alvaroalgaba/Developer"
cd "/Users/alvaroalgaba/Developer"
git clone https://github.com/PabloAlgabaGranado/persevera-tests.git
git -C persevera-tests symbolic-ref HEAD refs/heads/main
git -C persevera-tests status
```

- `git clone` avisa de que el repositorio está vacío. Es lo esperado.
- La cuarta línea deja la rama en `main` aunque tu git use otro nombre por defecto.
- `git status` tiene que decir «On branch main» y «No commits yet».

### 1.3 El acceso de Claude (3 min, solo si las conversaciones de Tests van en Claude Code en la web)

1. En https://claude.ai/connect-github, mira que la GitHub App de Claude tiene acceso a `persevera-tests`. Si la instalaste «solo en repositorios elegidos», añádelo.
2. Añade el repositorio en los ajustes del proyecto de Claude donde vayan las conversaciones de Tests.

### Comprueba que (GitHub)

1. `https://github.com/PabloAlgabaGranado/persevera-tests` dice «Private».
2. `git -C "/Users/alvaroalgaba/Developer/persevera-tests" remote -v` enseña `origin` con `https://github.com/PabloAlgabaGranado/persevera-tests.git`.
3. `git -C "/Users/alvaroalgaba/Developer/persevera-tests" ls-remote origin` no da error.

> **PELIGRO (GitHub)**
> - Ni público ni con ficheros iniciales.
> - No toques los ajustes de `persevera`, `persevera-web` ni `persevera-oral`.
> - `.env.local` nunca va al repositorio. T1 lo pone en `.gitignore`, como Oral (`persevera-oral/.gitignore`, líneas 5-7).

### Devuelve (A1)

```
A1, EL REPOSITORIO
Repositorio: https://github.com/PabloAlgabaGranado/persevera-tests (privado: sí/no)
¿Ya existía antes de hoy?: sí/no
Carpeta en el Mac (ruta entera):
¿Está en iCloud?: sí/no
Carpeta de persevera-oral en el Mac:
GitHub App de Claude con acceso: sí/no/no hace falta
Fecha:
```

**Hecho (A1)** cuando el repositorio existe, la carpeta apunta a él y T1 puede subir su commit (hoja, línea 337).

---

## Bloque 2. El esquema real del contenido (A3, unos 40 min)

- **Espera a:** A1, porque los ficheros van al repositorio de Tests.
- **Desbloquea:** A4, y cerrar T2 y T10 (hoja, línea 355). Desde el 13-oct-2026, los pasos 2.2 a 2.5 los hace de una vez `bash datos/a3.sh <host del pooler>`, que pide la contraseña una sola vez, comprueba lo de 2.5 y escribe el «Devuelve»; la cabecera de 2.6 también la pone él. Sin la contraseña de la base, el mismo esquema sale pegando `datos/a3-editor.sql` en el editor SQL del panel de Supabase de Persevera (una sola SELECT, solo lee); su resultado se guarda como `datos/esquema-persevera.sql` y se comprueba con `bash datos/a3-comprobar.sh datos/esquema-persevera.sql`.

Muchas tablas de Persevera se crearon fuera de sus migraciones, y su definición solo está en la base de producción (hoja, líneas 341-345). Aquí se saca con `pg_dump --schema-only`, que **solo lee**: abre su transacción en modo `REPEATABLE READ, READ ONLY` [pg_dump código] y no saca ninguna fila [pg_dump].

### 2.0 Mira y anota, sin cambiar nada (5 min)

1. ¿Tienes en tu gestor la contraseña de la base de Persevera (usuario `postgres`)? **Si no la tienes, para y avisa.** No la restablezcas: eso cambia Persevera y puede romper lo que la usa.
2. En el panel de Supabase de **Persevera**, botón «Connect», mira el pooler de sesión (puerto 5432). Solo mirar. El repo de Persevera guarda `postgresql://postgres.rljfcmjvulmjooxoxzxo@aws-1-eu-west-1.pooler.supabase.com:5432/postgres` (`supabase/.temp/pooler-url`, en 54e448e). Si el panel dice otro host, usa el del panel y apúntalo. Supabase pide copiarlo de ahí porque no se deduce de la región [Supabase conexión].
3. ¿Esta noche se aplica una fase del día D? Si es así, para: A3 va otro día.

### 2.1 Preparar (10 min, una sola vez)

Persevera tiene Postgres 17.6 (`supabase/.temp/postgres-version`, en 54e448e), y `pg_dump` no puede volcar un servidor más nuevo que él. `brew install libpq` instala la versión 18, que no queda en el `PATH` por sí sola [Homebrew libpq].

```bash
brew install libpq
export PATH="$(brew --prefix libpq)/bin:$PATH"
pg_dump --version
psql --version
cd "/Users/alvaroalgaba/Developer/persevera-tests"
mkdir -p datos
PERSEVERA='postgresql://postgres.rljfcmjvulmjooxoxzxo@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require'
```

- Las dos versiones tienen que ser 17 o más.
- La cadena va **sin contraseña**: `pg_dump` y `psql` la piden al conectar, y así no queda en el historial ni en ningún fichero.
- Se usa el pooler de sesión porque funciona por IPv4 y es lo que Supabase recomienda para los volcados [Supabase conexión], [Supabase volcados].
- No uses `supabase db dump` ni ningún comando de la CLI de Supabase en la carpeta de Persevera: su `supabase/.temp/` está en git (54e448e) y la CLI escribiría ahí.

### 2.2 Las tablas y las vistas (5 min)

```bash
pg_dump "$PERSEVERA" --schema-only --no-owner --lock-wait-timeout=5s \
  -t public.oposiciones -t public.bloques -t public.temas -t public.epigrafes -t public.tema_epigrafe \
  -t public.preguntas -t public.minicasos -t public.minicaso_preguntas \
  -t public.supuestos_originales -t public.supuesto_original_preguntas \
  -t public.supuestos_oficiales -t public.supuesto_oficial_preguntas \
  -t public.marcado_items -t public.marcado_unidades -t public.psico_items_graficos \
  -t public.usuario_oposicion -t public.respuestas_usuario -t public.pregunta_respondida \
  -t public.study_activity_log -t public.simulacros -t public.simulacro_sesiones \
  -t public.v_casos_para_revisar -t public.v_estado_pregunta_usuario \
  -f datos/esquema-persevera.sql
```

- Son las 15 tablas del contenido de T10 (hoja, líneas 166-168), las que pide A3 (hoja, líneas 347-353) y dos más que crea T2 (`simulacro_sesiones` y `v_estado_pregunta_usuario`), por si en producción se cambiaron desde el panel.
- `--lock-wait-timeout=5s`: si no consigue el bloqueo compartido de una tabla en 5 segundos, falla en vez de esperar [pg_dump]. Si falla, repítelo otro rato.
- Va sin `--no-privileges` a propósito: así salen los GRANT, que T2 y A4 necesitan ver.
- Lo que **no** saca `-t`: las funciones de los disparadores y de las políticas, y los tipos propios [pg_dump]. Van en 2.3 y 2.4.

### 2.3 De qué depende cada tabla (5 min)

Guarda esto como `datos/a3-dependencias.sql`:

```sql
-- A3: lo que necesitan las tablas y vistas de A3 y no sale con pg_dump -t (funciones y tipos).
-- Solo lee: la sesión entera va en modo solo lectura.
set session characteristics as transaction read only;
\pset footer off
with objetivo(rel) as (
  select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname = any (array[
     'oposiciones','bloques','temas','epigrafes','tema_epigrafe','preguntas',
     'minicasos','minicaso_preguntas','supuestos_originales','supuesto_original_preguntas',
     'supuestos_oficiales','supuesto_oficial_preguntas','marcado_items','marcado_unidades','psico_items_graficos',
     'usuario_oposicion','respuestas_usuario','pregunta_respondida','study_activity_log','simulacros','simulacro_sesiones',
     'v_casos_para_revisar','v_estado_pregunta_usuario'])
),
deps as (
  select t.tgrelid as rel, 'disparador ' || t.tgname as por, t.tgfoid as fn, null::oid as tipo
    from pg_trigger t
   where not t.tgisinternal and t.tgrelid in (select rel from objetivo)
  union all
  select coalesce(pol.polrelid, ad.adrelid, con.conrelid, rw.ev_class),
         case d.classid when 'pg_policy'::regclass then 'política ' || pol.polname
                        when 'pg_attrdef'::regclass then 'valor por defecto'
                        when 'pg_constraint'::regclass then 'restricción ' || con.conname
                        else 'vista' end,
         case when d.refclassid = 'pg_proc'::regclass then d.refobjid end,
         case when d.refclassid = 'pg_type'::regclass then d.refobjid end
    from pg_depend d
    left join pg_policy pol on d.classid = 'pg_policy'::regclass and pol.oid = d.objid
    left join pg_attrdef ad on d.classid = 'pg_attrdef'::regclass and ad.oid = d.objid
    left join pg_constraint con on d.classid = 'pg_constraint'::regclass and con.oid = d.objid
    left join pg_rewrite rw on d.classid = 'pg_rewrite'::regclass and rw.oid = d.objid
   where d.refclassid in ('pg_proc'::regclass, 'pg_type'::regclass)
     and coalesce(pol.polrelid, ad.adrelid, con.conrelid, rw.ev_class) in (select rel from objetivo)
  union all
  select a.attrelid, 'columna ' || a.attname, null, a.atttypid
    from pg_attribute a
   where a.attrelid in (select rel from objetivo) and a.attnum > 0 and not a.attisdropped
)
select distinct d.rel::regclass as tabla, d.por,
       p.oid::regprocedure as funcion, format_type(ty.oid, null) as tipo
  from deps d
  left join pg_proc p on p.oid = d.fn
  left join pg_namespace pn on pn.oid = p.pronamespace
  left join pg_type ty on ty.oid = d.tipo
  left join pg_namespace tn on tn.oid = ty.typnamespace
 where (p.oid is not null and pn.nspname not in ('pg_catalog', 'information_schema'))
    or (ty.oid is not null and tn.nspname not in ('pg_catalog', 'information_schema') and ty.typrelid = 0)
 order by 1, 2;
```

```bash
psql "$PERSEVERA" -X -v ON_ERROR_STOP=1 -f datos/a3-dependencias.sql -o datos/esquema-persevera-dependencias.txt
```

Lista cada función y cada tipo propio que usan los disparadores, las políticas, los valores por defecto, las restricciones, las vistas y las columnas. No ve una función que otra llama por dentro: eso se ve en los cuerpos del paso 2.4.

### 2.4 El texto de esas funciones (5 min)

Guarda esto como `datos/a3-funciones.sql`:

```sql
-- A3: el texto de las funciones de public de las que dependen las tablas y vistas de A3,
-- más las que se piden por nombre, y los enum propios. Solo lee.
set session characteristics as transaction read only;
\pset tuples_only on
\pset format unaligned
with objetivo(rel) as (
  select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname = any (array[
     'oposiciones','bloques','temas','epigrafes','tema_epigrafe','preguntas',
     'minicasos','minicaso_preguntas','supuestos_originales','supuesto_original_preguntas',
     'supuestos_oficiales','supuesto_oficial_preguntas','marcado_items','marcado_unidades','psico_items_graficos',
     'usuario_oposicion','respuestas_usuario','pregunta_respondida','study_activity_log','simulacros','simulacro_sesiones',
     'v_casos_para_revisar','v_estado_pregunta_usuario'])
),
fns as (
  select t.tgfoid as fn from pg_trigger t where not t.tgisinternal and t.tgrelid in (select rel from objetivo)
  union
  select d.refobjid
    from pg_depend d
    left join pg_policy pol on d.classid = 'pg_policy'::regclass and pol.oid = d.objid
    left join pg_attrdef ad on d.classid = 'pg_attrdef'::regclass and ad.oid = d.objid
    left join pg_constraint con on d.classid = 'pg_constraint'::regclass and con.oid = d.objid
    left join pg_rewrite rw on d.classid = 'pg_rewrite'::regclass and rw.oid = d.objid
   where d.refclassid = 'pg_proc'::regclass
     and coalesce(pol.polrelid, ad.adrelid, con.conrelid, rw.ev_class) in (select rel from objetivo)
  union
  select p.oid from pg_proc p join pg_namespace n on n.oid = p.pronamespace
   where n.nspname = 'public' and p.proname = any (array['preguntas_aleatorias'])  -- pedidas por nombre
)
select format(E'-- %s (%s, de %s)\n-- permisos: %s\n%s;\n',
              p.oid::regprocedure,
              case when p.prosecdef then 'SECURITY DEFINER' else 'SECURITY INVOKER' end,
              pg_get_userbyid(p.proowner),
              coalesce(p.proacl::text, 'los de serie (EXECUTE para PUBLIC)'),
              pg_get_functiondef(p.oid))
  from fns join pg_proc p on p.oid = fns.fn join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.prokind in ('f', 'p')
 order by 1;
-- Los enum propios de public que usan las columnas. Es otra sentencia, así que repite su «objetivo».
with objetivo(rel) as (
  select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname = any (array[
     'oposiciones','bloques','temas','epigrafes','tema_epigrafe','preguntas',
     'minicasos','minicaso_preguntas','supuestos_originales','supuesto_original_preguntas',
     'supuestos_oficiales','supuesto_oficial_preguntas','marcado_items','marcado_unidades','psico_items_graficos',
     'usuario_oposicion','respuestas_usuario','pregunta_respondida','study_activity_log','simulacros','simulacro_sesiones',
     'v_casos_para_revisar','v_estado_pregunta_usuario'])
)
select format('CREATE TYPE %s AS ENUM (%s);', t.oid::regtype,
              string_agg(quote_literal(e.enumlabel), ', ' order by e.enumsortorder))
  from pg_type t join pg_namespace n on n.oid = t.typnamespace join pg_enum e on e.enumtypid = t.oid
 where n.nspname = 'public'
   and t.oid in (select a.atttypid from pg_attribute a join objetivo o on o.rel = a.attrelid where a.attnum > 0)
 group by t.oid;
```

```bash
psql "$PERSEVERA" -X -q -v ON_ERROR_STOP=1 -f datos/a3-funciones.sql -o datos/esquema-persevera-funciones.sql
```

- `preguntas_aleatorias` va por su nombre para que T2 la compare con la de producción (hoja, línea 51).
- Si una función de la salida llama a otra de `public` (se ve en su cuerpo, por ejemplo `public.otra(`), añade su nombre a la lista «pedidas por nombre» y repite este paso.
- La consulta de los `enum` es otra sentencia y repite el `with objetivo`, porque en PostgreSQL una CTE solo vale dentro de su sentencia. Corregida así no se ha lanzado contra ninguna base (sin verificar). Si da error, apúntalo y sigue: las funciones ya quedaron escritas antes, y T2 saca los `enum` de las columnas.

### 2.5 Comprobar que no falta nada (5 min)

1. Están las 21 tablas y las 2 vistas:
   ```bash
   for t in oposiciones bloques temas epigrafes tema_epigrafe preguntas minicasos minicaso_preguntas \
            supuestos_originales supuesto_original_preguntas supuestos_oficiales supuesto_oficial_preguntas \
            marcado_items marcado_unidades psico_items_graficos usuario_oposicion respuestas_usuario \
            pregunta_respondida study_activity_log simulacros simulacro_sesiones; do
     grep -q "^CREATE TABLE public\.$t (" datos/esquema-persevera.sql && echo "ok     $t" || echo "FALTA  $t"
   done
   for v in v_casos_para_revisar v_estado_pregunta_usuario; do
     grep -q "^CREATE VIEW public\.$v" datos/esquema-persevera.sql && echo "ok     $v" || echo "FALTA  $v"
   done
   ```
2. Cada disparador tiene su función:
   ```bash
   grep -o 'EXECUTE FUNCTION public\.[a-z0-9_]*' datos/esquema-persevera.sql | sed 's/EXECUTE FUNCTION public\.//' | sort -u |
   while read f; do grep -q "FUNCTION public\.$f(" datos/esquema-persevera-funciones.sql && echo "ok     $f" || echo "FALTA  $f"; done
   ```
3. **Que no salga** una función que rellene `simulacros` desde `study_activity_log`. La hoja la daba por hecha (línea 345), pero T2 comprobó el 13-oct-2026 que en Persevera nunca existió. Si sale algo, dilo en la conversación, porque cambia T2:
   ```bash
   grep -n 'simulacros' datos/esquema-persevera-funciones.sql
   ```
4. **Sin secretos.** Algunas funciones se escribieron desde el editor de SQL y su texto no está en el repo de Persevera (`claude/dia-d`, `supabase/migrations/20260926090000_cerrar_contenido_a_anonimos.sql`, líneas 102-104). Una podría llevar una clave pegada:
   ```bash
   grep -n -E 'sb_secret_|sk_live|sk_test|rk_live|whsec_|eyJhbGci|Bearer [A-Za-z0-9]|re_[A-Za-z0-9_]{16,}|password' datos/esquema-persevera*.sql datos/esquema-persevera-dependencias.txt
   ```
   Tiene que salir vacío. **Si sale algo, no lo subas:** di en la conversación en qué fichero y línea, sin el valor.

Desde Postgres 17.6, el volcado empieza con `\restrict <clave>` y acaba con `\unrestrict <clave>`, una defensa de `psql` que cambia en cada volcado [Postgres 17.6]. No lo quites: lo quita T2 al cargar el fichero en PGlite.

### 2.6 La cabecera y el commit (5 min)

1. Pon al principio de cada uno de los tres ficheros de salida unas líneas de comentario (`--` en los `.sql`, `#` en el `.txt`) con: «Sacado de Persevera, producción, `rljfcmjvulmjooxoxzxo`», la fecha y la hora, la versión de `pg_dump` y «con `--schema-only`, en solo lectura». Es la cabecera de procedencia de «copiar, nunca mover».
2. Súbelo:
   ```bash
   git add datos/esquema-persevera.sql datos/esquema-persevera-funciones.sql datos/esquema-persevera-dependencias.txt datos/a3-dependencias.sql datos/a3-funciones.sql
   git commit -m "A3: esquema real del contenido de Persevera (solo lectura)"
   git push
   ```
3. Si T1 todavía no ha subido su commit, avisa en su conversación de que `main` ya trae `datos/`.

### Comprueba que (A3)

1. Los dos bucles de 2.5 solo dicen «ok».
2. El grep de secretos salió vacío.
3. Los cinco ficheros están en GitHub, en `datos/`.

> **PELIGRO (A3)**
> - Nunca `pg_dump` sin `--schema-only`: traería a tu Mac las respuestas, las cuentas y las compras de Persevera.
> - No restablezcas la contraseña de la base de Persevera. No enciendas en su panel «Temporary access», «Enforce SSL» ni restricciones de red.
> - Ningún comando de la CLI de Supabase en la carpeta de Persevera.
> - No lo lances la noche de una fase del día D.
> - La contraseña de `postgres` no se escribe en ninguna orden ni en ningún fichero: la pide `psql`.

### Devuelve (A3)

```
A3, EL ESQUEMA REAL
Commit en persevera-tests:
Versión de pg_dump:
Host del pooler de Persevera (del panel):
Paso 2.5.1, tablas y vistas: todo ok / faltan:
Paso 2.5.2, funciones de los disparadores: todo ok / faltan:
Paso 2.5.3, la función que rellena simulacros: nombre:
¿La consulta de los enum dio error?: sí/no
Grep de secretos: vacío / salió algo (fichero y línea, sin el valor)
Fecha y hora:
```

**Hecho (A3)** cuando `datos/esquema-persevera.sql` está en el repo (hoja, línea 355). Después del día D se repite, en cinco minutos (ver «Lo que no se hace todavía»). Hecho el 13-oct-2026, por el editor SQL (`6439257`).

---

## Bloque 3. La cuenta de Stripe de Tests (A12, primera parte, unos 45 min)

- **Espera a:** nada. Conviene abrirla ya, porque la verificación puede tardar días (hoja, línea 606). El repo no dice cuántos.
- **Desbloquea:** la prueba de la huella (bloque 7), que no espera a la verificación. Ya verificada, la parte web del cobro (bloque 13).

Tests cobra en la web con RevenueCat Billing sobre este Stripe. Los productos y los precios se crean en RevenueCat, no en Stripe [RC web], [RC comunidad productos]. Así que en este Stripe no se crea catálogo.

### 3.0 Mira y anota, sin cambiar nada (5 min)

1. Entra en Stripe y abre el selector de cuentas, arriba a la izquierda. Apunta si «Persevera Oposiciones» está dentro de una organización.
2. Apunta si ya existe alguna cuenta «Persevera Tests». El 13-oct no había ninguna (conector de Stripe).
3. En la cuenta de Persevera, en la configuración de impuestos («Configuración», «Impuestos», `https://dashboard.stripe.com/settings/tax`; los registros, en la pestaña «Ubicaciones» (Locations)) [Stripe Tax alta], confirma lo que leyó el conector el 13-oct: Stripe Tax activo, precios con impuestos incluidos, código `txcd_10000000` y un registro en España como pequeño vendedor (`small_seller`) desde el 23-jul-2026. Solo mirar.

### 3.1 La cuenta nueva (10 min)

Stripe pide una cuenta aparte para cada negocio que funciona por su cuenta. La misma sociedad puede usar el mismo NIF y los mismos datos, con otros datos públicos [Stripe varias cuentas].

- **Si Persevera ya está en una organización:** «Create new account», «Create a new account in your organization», nombre `Persevera Tests`, país España. Puedes copiar la entidad legal, los datos de la empresa y la cuenta del banco [Stripe organizaciones]. La cuenta de Persevera no cambia.
- **Si Persevera no está en ninguna organización:** «New account» y crea `Persevera Tests` fuera de ninguna organización [Stripe varias cuentas]. **No crees una organización para meter a Persevera:** eso cambia la cuenta de Persevera (su equipo y su acceso pasan a la organización) [Stripe organizaciones]. Rellena los datos a mano.

Antes de seguir, mira arriba que estás en **Persevera Tests**.

> **Ya hecho el 13-oct-2026 por Blanca:** 3.1. La cuenta es `acct_1UQA9NDBHlndqjVo`, separada, fuera de cualquier organización; Persevera tampoco está en ninguna. En el alta eligió «Elige lo que necesitas» (Stripe Tax y Radar, sin Managed Payments) y Radar «Lite», el incluido. El panel decía «Ya estás en tu cuenta activa». En 3.2 y 3.3 solo mira que la verificación está enviada y que los datos públicos son los de abajo; completa lo que falte. Terminado el 13-oct-2026 por Álvaro: verificada, con los datos públicos y la descripción de Tests, la verificación en dos pasos ya puesta y modo de prueba además de los entornos de prueba.

### 3.2 La verificación (20 min, más la espera)

1. En la cuenta **Persevera Tests**, abre `https://dashboard.stripe.com/account/onboarding`, el enlace con el que la ayuda de Stripe manda verificar el negocio [Stripe alta]. En el panel suele salir también como un aviso o un botón para activar los pagos (sin verificar el rótulo).
2. Rellena el formulario con lo de abajo y envíalo. Si Stripe pide algo que no está aquí, apúntalo y sigue con lo demás.

Ten a mano [Stripe alta]:
- Brooks & Oo, S.L., NIF B26969022, Calle **Doctor** Fleming, 21, 41210 Guillena (Sevilla), España (`persevera-web/src/data/legal.ts`, líneas 30-32). En el Stripe de Persevera la dirección pone «Doctro»: aquí escríbela bien. La de Persevera no se arregla desde aquí; solo la apuntas.
- El representante y los titulares que pida Stripe, con su documento.
- La cuenta del banco para los cobros. Puede ser la misma que la de Persevera [Stripe varias cuentas].
- La web: `https://tests.perseveraoposiciones.com`. Aún no carga (eso es A8, bloque 8). Si Stripe la exige cargada para terminar, termina lo demás, apúntalo y vuelve después del bloque 8 (sin verificar que la pida).

### 3.3 Los datos públicos (5 min)

En «Configuración», «Empresa», «Datos públicos» (Public details; `https://dashboard.stripe.com/settings/public`) [Stripe alta]:
- Nombre: `Persevera Tests`.
- Descriptor del extracto: `PERSEVERA TESTS` (de 5 a 22 caracteres) [Stripe checklist].
- Correo de soporte: `hola@perseveraoposiciones.com`, el que eligió Blanca (hoja, línea 13).
- Web: `https://tests.perseveraoposiciones.com`.
- Las URL de términos y privacidad, todavía no: existen con P1 y P2.

### 3.4 Lo que queda de este bloque (5 min)

1. Activa la verificación en dos pasos con una clave de acceso o una llave [Stripe checklist].
2. Mira si la cuenta nueva tiene «Modo de prueba» (Test mode) o solo entornos de prueba (sandboxes). Las cuentas nuevas sin verificar pueden tener solo sandboxes [RC conectar Stripe]. **Apúntalo:** decide cómo se hace el bloque 7.
3. No crees nada más: ni productos, ni precios, ni enlaces de pago, ni tablas de precios, ni webhooks, ni portal de clientes. Con RevenueCat Billing no hay webhook de Stripe (hoja, línea 233).

### Comprueba que (Stripe)

1. En el selector hay dos cuentas: «Persevera Oposiciones», sin cambios, y «Persevera Tests».
2. En Persevera Tests, la dirección dice «Doctor».
3. El catálogo de productos de Persevera Tests está vacío.

> **PELIGRO (Stripe)**
> - En la cuenta de Persevera, nada: ni productos, ni impuestos, ni webhooks, ni la app de RevenueCat, ni la errata de su dirección.
> - No metas la cuenta de Persevera en una organización nueva.
> - Antes de crear algo, mira en qué cuenta y en qué modo estás.
> - Las claves `sk_`, `rk_` y `whsec_` nunca van a una conversación.

### Devuelve (A12, primera parte)

```
A12, LA CUENTA DE STRIPE
¿Persevera estaba en una organización?: sí/no
Cuenta de Tests (acct_…, no es secreto):
¿Dentro de la organización o fuera?:
¿Tiene Modo de prueba o solo sandboxes?:
¿Pidió la web cargada para verificar?: sí/no
Verificación: enviada el … / aceptada el …
Correo de soporte puesto:
Fecha:
```

**Hecho (A12)** cuando la cuenta puede cobrar en modo real (hoja, línea 409). Lo demás de A12 (Stripe Tax, la app de RevenueCat y el dominio) va en el bloque 13.

---

## Bloque 4. El proyecto de RevenueCat y las comprobaciones de A13 (unos 15 min)

- **Espera a:** nada.
- **Desbloquea:** conectar Apple (bloque 10), Google (bloque 11) y el Stripe de Tests (bloques 7 y 13). Las respuestas de 4.2 desbloquean T2 (`pruebas_usadas`), T13 y T14 (hoja, línea 421).

### 4.0 Mira y anota, sin cambiar nada (5 min)

Entra en RevenueCat con el usuario dueño de Persevera, `hola@brooksoo.com`. El proyecto nuevo será de quien lo cree (deducción): con otro usuario, no quedaría en la cuenta que paga el plan Pro, que piden los webhooks (bloque 17), y solo el dueño del proyecto puede conectar Stripe (bloque 7) [RC conectar Stripe].

En el proyecto **Persevera** (solo mirar):
1. En «Project settings», «Collaborators» (sin verificar la ruta), mira que ese usuario sale como `owner`. El 13-oct era el único, con el nombre «Brooks & Oo, S.L.» y el rol `owner` (conector).
2. En «Project settings», pestaña «General», apunta lo que pone «Restore behavior» y «Allow testing entitlements and in-app currency for». La especificación del día D dice «Transfer to new App User ID» y «Allowed App User IDs only» (`claude/dia-d`, `docs/dia-d/especificacion.md`, líneas 1462-1463).
3. Apunta tu plan de RevenueCat. El conector dice Pro (13-oct). Los webhooks piden Pro [RC webhooks].

### 4.1 El proyecto (10 min)

> **Ya hecho el 13-oct-2026 desde el hilo:** los pasos 1 a 7. El proyecto es `proj0fca9795`. Se creó por la API, sin asistente: no preguntó la plataforma, no creó ninguna oferta de la «Test Store» y el entitlement `acceso` se creó a mano. RevenueCat añadió sola una app «Test Store» (`app08e19f50f4`), que no estorba. De este bloque solo te queda mirar 4.0 y apuntar su «Devuelve». 4.0 lo miró Álvaro el mismo día (hoja, A13).

1. En RevenueCat, crea un proyecto nuevo: `Persevera Tests`. Es la misma cuenta que Persevera y Eroodite: Tests será el tercer proyecto.
2. Si pregunta la plataforma, elige Capacitor, como Persevera (`TRAMITE_APPSTORE.md`, línea 36) (sin verificar que lo pregunte).
3. Si el asistente pide un entitlement, escribe a mano el identificador `acceso` y el nombre `Persevera Tests`. El de Persevera se quedó en «Persevera Premium», con espacio, porque se escribió así en ese paso (`TRAMITE_APPSTORE.md`, línea 38).
4. Si el asistente crea la oferta `default`, con productos de la «Test Store», déjala: es la oferta con prueba. En Persevera, el entitlement y `default` se crearon en el mismo segundo que el proyecto (conector, 13-oct).
5. Si al acabar el asistente no hay ningún entitlement, o el que hay no es `acceso`: «Product catalog», «Entitlements», «+ New», identificador `acceso`, nombre `Persevera Tests`. Uno que creara el asistente con otro identificador déjalo como está y apúntalo: los productos van solo a `acceso`.
6. No conectes todavía ninguna tienda.
7. Apunta el id del proyecto. No es secreto. En la dirección del panel sale sin su prefijo: es lo que va después de `/projects/`. Por ejemplo, la de Persevera es `https://app.revenuecat.com/projects/79841c3c/…` y su id es `proj79841c3c` (conector, 13-oct). Con `proj` delante, ese es el id. Los de las apps sí salen enteros, después de `/apps/`, y empiezan por `app`.

### 4.2 Las comprobaciones de A13, con su respuesta

La hoja pide comprobar tres cosas antes de que T2, T13 y T14 las necesiten (línea 419). Esto es lo que dice la documentación (consultada el 13-oct-2026):

| Pregunta | Respuesta | Fuente | Qué queda |
|---|---|---|---|
| ¿RevenueCat Billing cobra aparte? | No. Solo la tarifa normal de RevenueCat: gratis hasta 2.500 $ de ingresos al mes y el 1 % después. Stripe cobra su comisión y Stripe Tax la suya | [RC web], [RC precios] | Nada. Los ingresos de Persevera, Eroodite y Tests se suman para los 2.500 $: RevenueCat factura por cuenta, con un solo plan y un solo ingreso seguido para todos sus proyectos (conector, 13-oct: plan Pro, unos 470 $ en los últimos 30 días y sin medio de pago). Al pasar de 2.500 $ al mes, la cuenta necesitará un medio de pago |
| ¿Qué cobra Stripe? | 1,5 % + 0,25 € con tarjetas estándar del EEE; 2,8 % + 0,25 € las prémium; 3,15 % + 0,25 € las internacionales | [Stripe precios] | Nada |
| ¿Y Stripe Tax? | Para RevenueCat Billing, la tarifa fija por transacción: «50¢ per transaction in tax-registered locations» en EE. UU. [RC web]. En España es la de integración por API, 0,45 € por transacción, también en cada renovación; la de 0,5 % es para Billing, Checkout, Invoicing y Payment Links [Stripe Tax precios] | [RC web], [Stripe Tax precios] | Confirmarlo en la primera factura de Stripe. Son 0,45 € de cada cobro: un 4,5 % del mensual, un 1 % del semestral y un 0,6 % del anual. Díselo a Blanca por el margen del mensual |
| ¿La prueba se limita por tarjeta o por cuenta? | Por cliente de RevenueCat (el usuario de Tests) y su historial en el proyecto. La regla «Didn't have any subscription yet» cuenta las compras de todas las apps del proyecto, también App Store y Google Play: «never had any subscription in this Project (including in other Apps of the project)». No mira ni la tarjeta ni el correo | [RC productos web], [RC ciclo de vida] | Que funcione entre canales se ve en P5 |
| ¿La prueba pide tarjeta? | Sí, y no cobra hasta que acaba | [RC ciclo de vida] | Nada |
| ¿Se puede pedir la huella de la tarjeta al Stripe de Tests? | La ayuda no lo dice: no explica qué crea RevenueCat Billing en Stripe ni con qué id casar un evento | [RC conectar Stripe], [RC medios de pago] | **Bloque 7** |
| ¿Precio con IVA incluido? | Sí, fuera de EE. UU. y Canadá, sin ajustar nada. Se desglosa con Stripe Tax y un registro real | [RC impuestos] | Nada |
| ¿Factura y NIF? | Recibos y facturas en PDF con el IVA desglosado y un pie con los datos del vendedor. **No pide el NIF del cliente** ni hace facturas para empresas. Persevera hoy sí deja escribirlo (`claude/dia-d`, `supabase/functions/stripe-checkout/index.ts`, línea 204) | [RC impuestos] | Duda para el gestor (ver «Lo que falta por saber») |
| ¿Cómo llega al webhook? | `store: RC_BILLING`, con `environment` `SANDBOX` o `PRODUCTION`. Un reembolso llega como `CANCELLATION` con `cancel_reason: CUSTOMER_SUPPORT` | [RC eventos], [RC ciclo de vida] | T13 saca sus eventos de prueba del bloque 7 |
| ¿Se puede rotular el botón de pagar? | No: ningún texto del pago se puede cambiar | [RC localización] | P4: la fórmula «Contratar con obligación de pago» va en la pantalla previa de Tests |
| ¿Manda correos RevenueCat Billing? | Sí, con el nombre de la app: alta, inicio de la prueba, renovación, cobro fallido, cancelación, reembolso, caducidad y otros | [RC correos] | Si los obligatorios se pueden apagar y en qué idioma salen (sin verificar). Se cruza con T20 |
| ¿Se puede cambiar después la cuenta de Stripe? | No, una vez que la configuración web tiene suscripciones | [RC comunidad Stripe] (personal de RevenueCat, marzo de 2026) | Se conecta el Stripe de Tests desde el principio |

> **PELIGRO (RevenueCat)**
> - En el proyecto Persevera, nada: ni ofertas, ni entitlement, ni webhook, ni ajustes.
> - No crees paywalls, experimentos ni reglas de segmentación (targeting) en ningún proyecto.

### Devuelve (A13, el proyecto)

```
A13, EL PROYECTO DE REVENUECAT
Usuario con el que lo creé (owner): hola@brooksoo.com / otro:
Id del proyecto Persevera Tests (proj…):
¿Preguntó la plataforma?: no / sí, elegí:
¿Pidió el entitlement?: sí (acceso) / no, lo creé a mano / creó otro (identificador):
¿Creó la oferta default?: sí/no
Persevera, Restore behavior (solo mirado):
Persevera, Allow testing entitlements… for (solo mirado):
Plan de la cuenta:
Fecha:
```

---

## Bloque 5. Apple sin los productos (A10, primera parte, unos 45 min)

- **Espera a:** nada (hoja, línea 392: no necesita build).
- **Desbloquea:** los productos y la conexión con RevenueCat (bloque 10), y las compras de prueba de P5.

### 5.0 Mira y anota: tu rol (5 min)

1. En App Store Connect, «Usuarios y acceso» (Users and Access), busca tu usuario y apunta su rol.
2. Registrar el App ID (5.1) pide el rol de titular (Account Holder) o de administrador (Admin) [Apple App ID]. Crear la app (5.2), titular, administrador o App Manager [Apple nueva app]. Las cuentas de sandbox (5.3) también las puede crear un Developer [Apple sandbox]. Las dos claves de 5.4, titular o administrador [Apple claves IAP], [Apple API ASC].
3. Si no eres administrador, 5.1 y 5.4 (las dos claves) los hace el titular de la cuenta. En Persevera, la cuenta de Apple Developer «buena» era la de tu hermano (`claude/dia-d`, `docs/dominio-propio-supabase.md`, líneas 225-226).
4. Mira arriba a la derecha que estás en el equipo de Persevera, `F9T767LMSX` (`ios/App/App.xcodeproj/project.pbxproj`, línea 312, en `main` 2b3ed1d).

### 5.1 El App ID (5 min)

1. En «Certificates, Identifiers & Profiles», «Identifiers» y **+** [Apple App ID].
2. «App IDs», «Continue». Deja el tipo «App» y «Continue».
3. Description: `Persevera Tests`.
4. «Explicit App ID». Bundle ID: `com.persevera.tests`, copiado.
5. Capacidades: «In-App Purchase» viene marcada en un App ID explícito [Apple App ID]. No marques nada más. «Sign In with Apple» se añade en A16, si entra: las capacidades se cambian después.
6. «Continue», revisa y «Register».

### 5.2 La app en App Store Connect (10 min)

1. «Apps», **+** y «Nueva app» (New App) [Apple nueva app].
2. Rellena:
   - Plataforma: iOS.
   - Nombre: `Persevera Tests`. De 2 a 30 caracteres [Apple info app]. Un nombre solo lo puede usar una app por idioma: **si está cogido, para y avisa** [Apple nueva app].
   - Idioma principal: Español (España), como Persevera (`TRAMITE_APPSTORE.md`, línea 9).
   - Bundle ID: `com.persevera.tests`, de la lista. Sale después de 5.1; si no sale, recarga.
   - SKU: `persevera-tests`. No lo ve nadie y no se puede cambiar [Apple info app].
   - Acceso de usuarios: completo (Full Access) (propuesto).
3. Pulsa «Crear» (Create).
4. Si avisa de un acuerdo pendiente en «Business», para: sin que el titular firme el último acuerdo no deja crear la app [Apple nueva app].
5. En «Información de la app» (App Information), apunta el Apple ID de la app: el número que genera Apple [Apple info app].

La categoría, la edad, la privacidad y la ficha van en P7 y P8.

### 5.3 Las cuentas de sandbox (10 min)

1. «Usuarios y acceso», «Sandbox» y **+** [Apple sandbox].
2. Crea tres, como en el día D, porque con un mismo Apple ID la segunda compra no es una compra nueva (`claude/dia-d`, `docs/dia-d/especificacion.md`, línea 1539). `<tu buzón>` es la parte de delante de un Gmail que leas:

   | Nombre | Apellido | Correo | País |
   |---|---|---|---|
   | Tests | QA | `<tu buzón>+tests-qa@gmail.com` | España |
   | Tests | Revisor | `<tu buzón>+tests-revisor@gmail.com` | España |
   | Tests | Normal | `<tu buzón>+tests-normal@gmail.com` | España |

3. El correo no puede ser ya un Apple ID. El nombre, el correo y la contraseña no se cambian después. Las direcciones con «+» valen [Apple sandbox]. La contraseña, a tu gestor.

Las cuentas de sandbox son de toda la cuenta de App Store Connect, no de una app [Apple sandbox]. Las de Persevera también sirven, porque la oferta de introducción se cuenta por grupo [Apple oferta intro]. El 13-oct-2026 la única que había era una de Eroodite: Persevera no tenía ninguna. Ese día Álvaro creó las tres de Tests.

### 5.4 Las claves para RevenueCat (10 min)

RevenueCat necesita una clave In-App Purchase, que es obligatoria, y una de la API de App Store Connect para importar los productos (`TRAMITE_APPSTORE.md`, línea 37). Las dos piden el rol de titular o administrador (5.0). Propuesto: claves nuevas para Tests, para poder quitarlas sin tocar Persevera. Ojo: no son solo de Tests. Las dos llegan a todas las apps de la cuenta, Persevera y Eroodite incluidas: la In-App Purchase vale para todas las apps de la cuenta [RC clave IAP], y una clave de equipo de la API no se puede limitar a una app [Apple API ASC]. Guárdalas con el mismo cuidado que las de Persevera.

1. **In-App Purchase:** «Usuarios y acceso», «Integraciones» (Integrations), «In-App Purchase», «Generate In-App Purchase Key» o **+** [Apple claves IAP]. Nombre: `RevenueCat Persevera Tests`. Se descarga una sola vez [RC clave IAP].
2. **App Store Connect API:** «Usuarios y acceso», «Integraciones», «App Store Connect API», clave nueva con el acceso **App Manager**, ni Admin ni más. RevenueCat pide «at least the access level App Manager» [RC clave ASC], y con eso basta. Nombre: `RevenueCat Persevera Tests`. También se descarga una sola vez.
3. Apunta el Issuer ID, que sale encima de la tabla de claves. No es secreto.
4. Los dos `.p8`, a tu gestor, **sin cambiarles el nombre** con que se descargan (`SubscriptionKey_….p8` la In-App Purchase y `AuthKey_….p8` la de la API; los dos nombres, sin verificar en la ayuda de Apple). RevenueCat pide subir la In-App Purchase con su nombre original [RC clave IAP]. Nunca al repositorio ni a una conversación.

### 5.5 El Small Business Program (5 min)

Con el programa, Apple se queda el 15 %; sin él, el 26 % el primer año en la UE (guía de decisiones, línea 91). Es de la cuenta de desarrollador: si Persevera está dentro, Tests también. Apple no dice en qué pantalla se ve [Apple SBP]. De la forma más rápida a la más segura: Está dentro: lo confirmó Álvaro el 13-oct-2026, y con eso queda hecho el bloque 5.
1. Busca en el correo del titular el de Apple que confirma el alta en el programa.
2. En «Pagos e informes financieros» (Payments and Financial Reports), mira lo que Apple paga por una suscripción de Persevera vendida en España: con el programa, lo que queda tras el IVA menos un 15 % (sin verificar que el informe lo deje ver así; lo sugiere un desarrollador [mjtsai]).
3. Pregunta a Apple Developer Support.

### Comprueba que (Apple, primera parte)

1. En «Identifiers» está `com.persevera.tests`, con In-App Purchase y sin Sign In with Apple.
2. `com.persevera.app` y `com.persevera.signin` siguen como estaban.
3. En «Apps» está Persevera Tests, en «Preparar para el envío», con el bundle `com.persevera.tests` y el SKU `persevera-tests`.
4. En «Sandbox» están las tres cuentas nuevas y las de Persevera.

> **PELIGRO (Apple, primera parte)**
> - No toques el App ID `com.persevera.app`, el Services ID `com.persevera.signin`, la app de Persevera ni sus claves.
> - No revoques ninguna clave In-App Purchase ni de App Store Connect que ya exista: la usa Persevera.
> - No borres ninguna cuenta de sandbox: un correo borrado no se puede volver a usar [Apple sandbox].
> - Sign In with Apple, todavía no (A16).

### Devuelve (A10, primera parte)

```
A10, APPLE SIN PRODUCTOS
Mi rol en App Store Connect:
App ID com.persevera.tests registrado por: yo / el titular; capacidades:
App Persevera Tests: nombre aceptado sí/no; Apple ID (número):
SKU, idioma principal y acceso:
Cuentas de sandbox (solo los correos y el país):
Issuer ID:
¿Claves nuevas o las de Persevera?:
Claves generadas por: yo / el titular; acceso de la de la API: App Manager sí/no
Nombres de los .p8 sin cambiar: sí/no
Small Business Program: dentro / fuera / no se sabe (cómo se vio)
Fecha:
```

---

## Bloque 6. La cuenta de Resend (A7, primera parte, unos 25 min)

- **Espera a:** nada (hoja, línea 386).
- **Desbloquea:** el correo de las cuentas en Supabase (bloque 16), el remitente de T12, T19 y T20, y el aviso de la copia (bloque 18).

**Lo importante:** en Resend, un dominio solo puede estar activo en un equipo. Si otro equipo lo reclama («claim») y lo completa, Resend lo quita del equipo que lo tenía [Resend claim]. Persevera ya manda desde `hola@` y `avisos@perseveraoposiciones.com` (`claude/dia-d`, `supabase/functions/_shared/cobro/aplicar.ts`, línea 552, y `alertas.ts`, línea 101), así que la raíz está en el Resend de Persevera. **Tests usa su propio subdominio, `tests.perseveraoposiciones.com`, en un equipo propio, y nunca reclama nada.**

Como la web de Tests va a ocupar `tests.perseveraoposiciones.com` con un CNAME (bloque 8), ese nombre no puede tener buzón: un CNAME no convive con otros registros en el mismo nombre [RFC 1034]. Se envía desde `avisos@tests.perseveraoposiciones.com` sin buzón, y las respuestas van al correo de soporte.

### 6.0 Mira y anota, sin cambiar nada (3 min)

1. Apunta con qué cuenta entras en el Resend de Persevera y en qué equipo está su dominio. Solo mirar.
2. Desde el Mac, mira si la raíz tiene DMARC:
   ```bash
   dig +short TXT _dmarc.perseveraoposiciones.com
   ```
   Apunta lo que salga, o «nada».

### 6.1 El equipo (5 min)

1. Entra en resend.com con la cuenta que prefieras: la de Persevera u otra nueva.
2. Crea un equipo nuevo: `Persevera Tests`. Cada equipo tiene sus claves, su facturación y su consumo, y se cambia de equipo pulsando su nombre, arriba a la izquierda [Resend equipos]. El rótulo de «crear equipo» no lo he visto (sin verificar).
3. Plan gratuito mientras se construye (propuesto). Da 100 correos al día y 3.000 al mes [Resend precios]. Antes de publicar se pasa a Pro, 20 $ al mes (ver «Lo que no se hace todavía»).
4. Mira arriba a la izquierda que estás en `Persevera Tests`.

### 6.2 El dominio (5 min)

1. En el equipo `Persevera Tests`, «Domains» y «Add domain» (sin verificar el rótulo).
2. Dominio: `tests.perseveraoposiciones.com`.
3. Región: Irlanda (`eu-west-1`) (propuesto). Para cambiarla después hay que borrar el dominio y crearlo otra vez [Resend regiones]. Ojo: Resend guarda los datos de la cuenta en EE. UU. aunque envíe desde Irlanda [Resend regiones]. Va a P2.
4. **Si Resend dice que el dominio ya está en uso, o te propone reclamarlo, para y avisa.** No lo reclames. Con un subdominio no debería pasar, pero la ayuda no habla de subdominios (sin verificar).
5. Resend enseña tres registros: un MX y un TXT en `send` y un TXT en `resend._domainkey` [Resend Cloudflare]. Copia los valores tal como salen. No son secretos. No actives la recepción.

### 6.3 Los registros (10 min, los pone tu hermano)

La zona `perseveraoposiciones.com` está en Cloudflare, en la cuenta de tu hermano, y los registros los mete él (`claude/dia-d`, `docs/dominio-propio-supabase.md`, líneas 41-54, comprobado el 26-ago-2026). En Cloudflare se escribe el nombre sin la raíz [Resend Cloudflare]:

| Tipo | Nombre | Contenido | Prioridad | Proxy |
|---|---|---|---|---|
| MX | `send.tests` | el de Resend | 10 | no aplica |
| TXT | `send.tests` | el de Resend (empieza por `v=spf1`) | | no aplica |
| TXT | `resend._domainkey.tests` | el de Resend (empieza por `p=`) | | Solo DNS |

- **DMARC:** si en 6.0 salió algo que empieza por `v=DMARC1`, no hagas nada: el subdominio usa el de la raíz [RFC 7489]. Si salió «nada», que tu hermano añada un TXT en `_dmarc.tests` con `v=DMARC1; p=none;`. Resend recomienda empezar con `p=none` [Resend DMARC].
- Ninguno de estos nombres toca los de Persevera: la raíz, `send`, `resend._domainkey`, `app`, `www`, `api`, ni las reglas de Email Routing.

### 6.4 Verificar (2 min, más la espera)

1. En Resend, pulsa verificar el dominio (sin verificar el rótulo). Puede tardar hasta 72 horas, normalmente mucho menos [Resend Cloudflare].
2. Desde el Mac, cada una tiene que devolver lo que puso tu hermano:
   ```bash
   dig +short MX send.tests.perseveraoposiciones.com
   dig +short TXT send.tests.perseveraoposiciones.com
   dig +short TXT resend._domainkey.tests.perseveraoposiciones.com
   ```
3. En los ajustes del dominio, apaga el seguimiento de aperturas y de clics. Resend deja elegirlo por dominio [Resend dominios]. Con el de clics encendido, reescribiría los enlaces de los correos de la cuenta (deducción).

Las claves de Resend no se crean ahora: cada una se crea justo antes de usarla (bloques 16 y 18), para que no quede ninguna sin uso.

### Comprueba que (Resend)

1. `tests.perseveraoposiciones.com` sale verificado en el equipo `Persevera Tests`.
2. El equipo de Persevera sigue con su dominio, sin avisos.
3. Los tres `dig` devuelven su valor.

> **PELIGRO (Resend)**
> - Nunca añadas `perseveraoposiciones.com` (la raíz) al equipo de Tests ni reclames ningún dominio. Persevera se quedaría sin correo.
> - No toques el equipo de Persevera, sus dominios ni sus claves. La clave de Resend de Persevera no se usa en Tests (hoja, línea 382).
> - Tu hermano solo añade nombres que acaban en `.tests`.

### Devuelve (A7, Resend)

```
A7, RESEND
Equipo: Persevera Tests (con la cuenta de Persevera / con una cuenta nueva)
Plan:
Dominio: tests.perseveraoposiciones.com, región:
¿Avisó de que el dominio estaba en uso?: sí/no
DMARC de la raíz (lo que dio dig, o «nada»):
¿Se añadió _dmarc.tests?: sí/no
Registros puestos por: mi hermano / yo
Verificado el:
Seguimiento de aperturas y clics: apagado sí/no
```

---

## Bloque 7. La prueba de la huella (A13, comprobación, unos 40 min)

- **Espera a:** el bloque 3 (la cuenta de Stripe de Tests existe, aunque no esté verificada) y el bloque 4.
- **Desbloquea:** la decisión de `pruebas_usadas` (T2), los eventos de prueba de la web para T13 y la respuesta a la última comprobación de A13 (hoja, línea 419).

La ayuda de RevenueCat no dice si se puede leer la huella de la tarjeta de una compra web. Se comprueba con una compra de sandbox. No hace falta código: basta un enlace de compra de RevenueCat [RC enlaces de compra].

### 7.1 Conectar el Stripe de Tests (10 min)

1. Solo el dueño del proyecto de RevenueCat puede conectar Stripe: «Only the owner of the RevenueCat project can connect a Stripe account» [RC conectar Stripe]. Entra con el usuario de 4.0 (`hola@brooksoo.com`). En la configuración de la cuenta de RevenueCat («Account settings»), «Connect Stripe account».
2. Instala la app de RevenueCat del Stripe App Marketplace **en la cuenta Persevera Tests** (o en su sandbox, si en 3.4 viste que solo tiene sandboxes). Mira arriba a la derecha que es la de Tests [RC conectar Stripe].
3. «View Stripe app settings» y entra con RevenueCat desde la app de Stripe. La cuenta tiene que salir en la configuración de RevenueCat.
4. No uses el «sandbox reclamable» que ofrece RevenueCat: una configuración con suscripciones no se puede pasar a otra cuenta de Stripe [RC comunidad Stripe].

### 7.2 La configuración de prueba (10 min)

Según lo que viste en 3.4 [RC conectar Stripe], [RC pruebas web]:
- **Con «Modo de prueba»:** en el proyecto Persevera Tests, «Web», nueva configuración de RevenueCat Billing (en partes del panel puede decir «Web Billing»). Es la configuración real, la única: hazla con los datos de 13.4 (nombre `Persevera Tests (Web)`, la cuenta de Stripe de Tests, moneda EUR). Las compras de sandbox van solas al modo de prueba de Stripe.
- **Solo con sandboxes:** crea una configuración aparte para el sandbox, `Persevera Tests (Web sandbox)`, con el sandbox de Stripe de Tests. La real se hace en el bloque 13. T14 tendrá que saber que hay dos.

### 7.3 Un producto y su paquete (5 min)

1. «Product catalog», «Products», «+ New», en la configuración web de 7.2 [RC productos web].
2. Identificador `tests_una_mensual`, nombre `Persevera Tests mensual`, descripción `Los tests de tu oposición`.
3. Suscripción con renovación automática, 1 mes, **9,99 EUR**. Revisa el precio antes de guardar: después no se puede cambiar [RC productos web].
4. Prueba gratis marcada, 7 días (sin verificar si el selector dice «7 días» o «1 semana»), con la elegibilidad «Didn't have any subscription yet».
5. Periodo de gracia por problemas de cobro («Grace period for billing issues») (propuesto): 7 días, el del plan `mensual` de Persevera en Google según RevenueCat (conector, 13-oct). Es la regla de 13.6: el mismo que Google para cada duración. Si en 11.0 la consola de Google dice otra cosa, cámbialo también aquí (sin verificar que se pueda cambiar después de guardar).
6. Cambios de suscripción: ninguno (propuesto), como los otros cinco de 13.6. Sin caminos definidos, el cliente no cambia de plan en el portal [RC productos web].
7. Guarda.
8. En «Product catalog», «Offerings», abre `default` (o créala con el identificador `default` si no existe) y añade el paquete «Monthly» (`$rc_monthly`) con este producto en la web. Es su sitio definitivo.

### 7.4 La compra de prueba (10 min)

1. En el proyecto Persevera Tests, «Funnels», sección «Purchase Links», crea un enlace de compra nuevo (Web Purchase Link) de la oferta `default`, con «Show the default package selection page». Sin paywall: esta guía no crea ninguno [RC enlaces de compra].
2. Selecciona el enlace en «Purchase Links» y pulsa «Share URL». Salen dos URL, la de Production y la de Sandbox; por el camino de los sandboxes solo sale la de Sandbox [RC pruebas web]. Copia la de **Sandbox**. No la compartas: con ella cualquiera se suscribe [RC enlaces de compra].
3. Añade al final de esa URL `/huella-prueba-1` y ábrela. Es el App User ID de esta compra. Sin él, la página da un error 404: «If the ID is not appended, users will see a 404 error page» [RC enlaces de compra].
4. Compra el mensual con la tarjeta de prueba `4242 4242 4242 4242`, una fecha futura, cualquier código y un correo tuyo.
5. Repite con la misma URL acabada en `/huella-prueba-2`, la misma tarjeta y otro correo tuyo (por ejemplo, con `+tests-huella2`).

### 7.5 Lo que se mira (5 min)

1. En el Stripe de Tests, en el modo de prueba o el sandbox, apunta:
   - si hay un cliente con cada correo;
   - si hay un pago o una intención de configuración (SetupIntent) con un método de pago;
   - si ese método enseña la huella («Fingerprint»), y si es la misma en las dos compras;
   - qué metadatos lleva (por ejemplo, un id de RevenueCat).
2. En RevenueCat, «Customers», busca `huella-prueba-1` y después `huella-prueba-2`. En cada uno, abre el evento `INITIAL_PURCHASE` del historial y apunta `store`, `transaction_id`, `original_transaction_id` y `period_type`.
3. Si puedes ver el cuerpo entero del evento, guárdalo en un fichero de tu Mac. Antes de pasarlo a la conversación de T13, cambia tu correo por uno inventado. Es su evento de prueba de la web.
4. **Al acabar, borra el enlace de compra** en «Funnels», «Purchase Links». Si sigue vivo, en cuanto Stripe esté verificado su URL de Production deja hacer una compra real de Tests antes de los términos (P1), los textos del cobro (P4) y la publicación (P13). La ayuda no dice si se borra o se desactiva (sin verificar): si no deja borrarlo, apúntalo y avisa.

### 7.6 Qué se decide con lo que salga

- **Hay huella y un id que lleva del evento al objeto de Stripe:** T13 la pide al Stripe de Tests con una clave restringida de solo lectura (secreta, en A15) y la guarda en `pruebas_usadas`.
- **Hay huella, pero ningún id que case:** solo se puede buscar el cliente por correo. Es débil.
- **No hay huella:** `pruebas_usadas` se queda con el usuario y, si P2 lo acepta, un resumen del correo.
- En los tres casos la huella llega después de empezar la prueba, porque el pago lo hace RevenueCat. Lo que T13 puede hacer con quien repite tarjeta es cancelarle la prueba antes del cobro. Lo decide T13.

### Comprueba que (huella)

1. En RevenueCat salen los clientes `huella-prueba-1` y `huella-prueba-2`, cada uno con su compra de sandbox.
2. El enlace de compra ya no está en «Purchase Links».
3. El Stripe de Persevera sigue sin la app de RevenueCat.

> **PELIGRO (huella)**
> - Solo en sandbox o en modo de prueba. Ninguna compra real.
> - La URL de sandbox del enlace de compra no se comparte.
> - Al acabar, el enlace de compra se borra (7.5.4).
> - En el Stripe de Persevera, nada.

### Devuelve (A13, la huella)

```
A13, LA HUELLA
Camino: modo de prueba (una configuración) / sandboxes (dos)
App User IDs de las dos compras: huella-prueba-1 y huella-prueba-2
Enlace de compra borrado al acabar: sí / no se pudo (qué dejó hacer)
Id de la configuración web (app…), y la de sandbox si hay dos:
¿Dejó crear la configuración con Stripe sin verificar?: sí/no
Cliente en Stripe con cada correo: sí/no
Pago o SetupIntent con método de pago: sí/no
Huella visible: sí/no; ¿la misma en las dos compras?: sí/no
Metadatos del objeto de Stripe (solo los nombres de las claves):
Id que casa el evento con Stripe: cuál, o ninguno
Del evento INITIAL_PURCHASE: store / period_type:
¿Guardé el cuerpo del evento?: sí/no
La prueba salió como «7 días» o «1 semana»:
Fecha:
```

---

# Desde que esté T1 (hacia el 19-oct)

## Bloque 8. La web (A8, unos 35 min)

- **Espera a:** T1. Se despliega su pantalla vacía, con `public/_headers` y `public/_redirects` ya copiados de Persevera (hoja, línea 27).
- **Desbloquea:** P1, P2, P3 y P11 con su dirección final, la URL de borrado que pide Google, el dominio del pago web en Stripe (bloque 13) y el cobro web de P5 (hoja, línea 388).

La hoja dice que la web pública de Persevera está en Vercel (líneas 388 y 509). Cuatro sitios de `persevera-web` dicen que está en Cloudflare Pages (`public/_headers`, línea 1; `src/data/fechaTema.ts`, línea 8; `src/data/site.ts`, líneas 52-54; `src/pages/privacidad.astro`, línea 70), y `vercel.json` parece un resto. Para Tests no cambia nada: la zona DNS está en Cloudflare igualmente.

### 8.0 Mira y anota, sin cambiar nada (5 min)

Desde el Mac:

```bash
dig +short NS perseveraoposiciones.com
dig +short tests.perseveraoposiciones.com
dig +short CAA perseveraoposiciones.com
```

1. La primera tiene que dar dos nombres acabados en `.ns.cloudflare.com`, como el 26-ago-2026 (`claude/dia-d`, `docs/dominio-propio-supabase.md`, línea 48). Si da otra cosa, es el caso 3 de 8.2.
2. La segunda tiene que salir vacía: `tests.` está libre. **Si sale algo, para y avisa.**
3. La tercera salió vacía el 26-ago-2026 (misma página, línea 47). Si ahora hay CAA, tiene que permitir las autoridades que usa Cloudflare, o el certificado no sale [CF dominios].
4. Apunta en qué cuenta de Cloudflare está el proyecto `persevera-app`, la app web de Persevera (`claude/dia-d`, `docs/dominio-propio-supabase.md`, línea 446). Solo mirar.

### 8.1 El proyecto y el primer despliegue (15 min)

Propuesto: subida directa con `wrangler` desde el Mac, como la app web de Persevera. Así el build usa tu `.env.local` y los guardianes de `npm run build`, y un push a `main` no publica nada solo, que importa porque cada conversación sube a `main`. Ojo: un proyecto de subida directa no se puede pasar después a la conexión con GitHub [CF subida directa].

```bash
cd "/Users/alvaroalgaba/Developer/persevera-tests"
git switch main
git pull
git status
npm ci
npm run build
npx wrangler login
npx wrangler pages project create persevera-tests --production-branch main
npx wrangler pages deploy dist --project-name persevera-tests --branch main
```

- `git status` tiene que decir «nothing to commit, working tree clean». Si no, para: no se despliega lo que no está subido.
- Cuenta de Cloudflare: la misma de `persevera-app` (propuesto). Si tienes varias, `wrangler` pregunta cuál.
- Las órdenes son las de [wrangler pages]. Con la rama de producción, el despliegue sale en `<proyecto>.pages.dev` [CF subida directa].
- Si `persevera-tests.pages.dev` está cogido, Cloudflare le pondrá otro nombre (sin verificar). Apúntalo: es el destino del CNAME.
- Abre `https://persevera-tests.pages.dev`: tiene que salir la pantalla de T1.

### 8.2 El dominio propio (10 min, más el DNS)

**Caso 1, el más probable: el proyecto está en la misma cuenta de Cloudflare que la zona.**
1. «Workers & Pages», el proyecto `persevera-tests`, «Custom domains», «Set up a domain» [CF dominios].
2. Escribe `tests.perseveraoposiciones.com` y «Continue».
3. Confirma el registro que propone: Cloudflare crea solo el CNAME `tests` hacia `persevera-tests.pages.dev` [CF dominios].
4. Si tu usuario no puede editar el DNS de esa cuenta, este paso lo confirma tu hermano.

**Caso 2: el proyecto está en otra cuenta de Cloudflare.**
1. Haz primero los pasos 1 y 2 del caso 1. El dominio se queda esperando.
2. Después, tu hermano añade en su zona un CNAME `tests` hacia `persevera-tests.pages.dev`, en «Solo DNS» (nube gris).
3. El orden importa: con el CNAME puesto antes de asociar el dominio, sale un error 522 [CF dominios]. La ayuda no dice si entre dos cuentas de Cloudflare va con proxy o sin él (sin verificar); la nube gris es el caso que sí explica, el del DNS de fuera.

**Caso 3: la zona ya no está en Cloudflare.** Como el caso 2, en el panel de quien lleve el DNS [CF dominios].

### 8.3 Comprobar (5 min)

```bash
curl -sI https://tests.perseveraoposiciones.com/
curl -s https://tests.perseveraoposiciones.com/una/ruta/cualquiera | head -c 300
ls dist/assets
curl -sI https://tests.perseveraoposiciones.com/assets/<un .js de la lista anterior>
curl -sI https://tests.perseveraoposiciones.com/assets/no-existe.js
```

1. La primera: `HTTP/2 200` y `cache-control: no-store` (`public/_headers`, líneas 8-12, de Persevera).
2. La segunda: el mismo `index.html` que la raíz, por el comodín de `public/_redirects`.
3. La cuarta: tipo JavaScript y `cache-control: public, max-age=300, must-revalidate` (`public/_headers`, líneas 32-33).
4. La quinta también da 200 y `text/html`, porque el comodín atrapa `/assets/*` (`public/_redirects`, líneas 5-12). Demuestra que la cuarta mira un fichero de verdad.

### Comprueba que (web)

1. `https://tests.perseveraoposiciones.com` carga la pantalla de T1, con candado.
2. `https://app.perseveraoposiciones.com` sigue cargando Persevera.
3. En el DNS solo hay un nombre nuevo: `tests`.

> **PELIGRO (web)**
> - Nunca despliegues sin `--project-name persevera-tests`, ni con `persevera-app`, que es la web de Persevera.
> - No toques los registros de Persevera: la raíz, `app`, `www`, `api`, `_acme-challenge.api`, los de Email Routing ni los de Resend.
> - No conectes el proyecto a GitHub: cada commit de `main` saldría publicado.
> - No despliegues con cambios sin subir.
> - No quites el comodín de `_redirects` ni pongas `immutable` en `_headers`: ya tumbó la app de Persevera el 4-ago-2026 (`public/_headers`, líneas 14-31).

### Devuelve (A8)

```
A8, LA WEB
NS (lo que dio dig):
¿tests. estaba libre?: sí/no
CAA (lo que dio dig, o «nada»):
Cuenta de Cloudflare de persevera-app:
Cuenta de Cloudflare de persevera-tests:
Dirección .pages.dev:
Caso de 8.2: 1/2/3
CNAME tests: lo puso Cloudflare solo / mi hermano / yo; proxy naranja/gris
Primeras líneas de curl -sI https://tests.perseveraoposiciones.com/:
Commit desplegado:
Fecha:
```

**Hecho (A8)** cuando la dirección carga la app (hoja, línea 388).

---

## Bloque 9. El primer paquete de Android (A9, unos 85 min)

- **Espera a:** A1 y T1 (hoja, línea 390).
- **Desbloquea:** A11 (bloque 11), porque Google pide un paquete subido antes de crear suscripciones (`TRAMITE_GOOGLEPLAY.md`, línea 40), y el keystore de A14.

### 9.0 Mira y anota, sin cambiar nada (5 min)

1. Trae lo último de T1 y mira que su `package.json` lleva el SDK de RevenueCat, que tiene que ir dentro del paquete (hoja, línea 390):
   ```bash
   cd "/Users/alvaroalgaba/Developer/persevera-tests"
   git switch main
   git pull
   grep -n '"@revenuecat/purchases-capacitor"' package.json
   ```
   Tiene que salir una línea. Se mira en `package.json` y no con `npm ls`, que solo enseña lo instalado en `node_modules` y saldría vacío si aún no has hecho `npm ci`. Si no sale, para y avisa en la conversación de T1.
2. En Play Console, mira que entras en la cuenta de desarrollador de Persevera y Eroodite (`TRAMITE_GOOGLEPLAY.md`, línea 4).

### 9.1 El keystore nuevo (10 min)

El keystore es la llave de subida: se guarda fuera del repositorio, con las contraseñas a buen recaudo (`TRAMITE_GOOGLEPLAY.md`, línea 17). Google guarda la llave que firma lo que se instala; tú, la de subida. Si se pierde la de subida, se pide cambiarla en Play Console sin perder la app [Android firma].

```bash
mkdir -p ~/claves/persevera-tests
"/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool" -genkey -v -keystore ~/claves/persevera-tests/persevera-tests-upload.jks -keyalg RSA -storetype JKS -keysize 2048 -validity 10000 -alias upload
```

- `keytool` viene con Android Studio y puede no estar en el `PATH` [Flutter Android]. Esa ruta es la habitual (sin verificar); si no existe, búscala con `find "/Applications/Android Studio.app" -name keytool`.
- 10.000 días son unos 27 años. Google pide al menos 25 [Android firma].
- Si avisa de que JKS es un formato propio, sigue.
- Contraseña: una larga, la misma para el almacén y la llave [Android firma]. A tu gestor, con una copia del `.jks`.
- Datos del certificado (propuesto): nombre `Persevera Tests`, unidad `Persevera`, organización `Brooks & Oo, S.L.`, ciudad `Guillena`, provincia `Sevilla`, país `ES`.

Las huellas del certificado, que no son secretas:

```bash
"/Applications/Android Studio.app/Contents/jbr/Contents/Home/bin/keytool" -list -v -keystore ~/claves/persevera-tests/persevera-tests-upload.jks -alias upload
```

Apunta las líneas SHA1 y SHA256.

### 9.2 La app en Play Console (15 min)

1. «Inicio», «Crear aplicación» [Play crear app].
2. Idioma predeterminado: Español (España).
3. Nombre: `Persevera Tests`.
4. Aplicación, no juego. Gratuita, como Persevera («Gratis con suscripciones», `TRAMITE_GOOGLEPLAY.md`, línea 8).
5. Correo de contacto: `hola@perseveraoposiciones.com`, el que eligió Blanca.
6. Las declaraciones que pida (políticas, exportación, firma de apps de Play).
7. «Crear aplicación».
8. Si pide el nombre del paquete: `com.persevera.tests`, copiado. Queda registrado a tu cuenta y es para siempre [Android verificación]. Que el formulario lo pida en este paso no lo he visto (sin verificar).

La ficha de la tienda es P7: no se rellena ahora.

### 9.3 La plataforma Android y el paquete (40 min)

```bash
cd "/Users/alvaroalgaba/Developer/persevera-tests"
git switch main
git pull
git status
npm install @capacitor/android@^8.2.0
npm run build
npx cap add android
npx cap sync android
```

- `@capacitor/android` no viene en el `package.json` de T1, que sale del de Oral. La versión es la de Persevera (`package.json`, línea 17) [Capacitor Android].
- Antes del commit, mira que `.gitignore` lleva estas líneas, y si no, añádelas (las cinco primeras son las de Persevera, la sexta la de Oral y las tres últimas protegen el keystore):
  ```
  android/build/
  android/.gradle/
  android/local.properties
  android/app/build/
  android/app/release/
  android/app/src/main/assets/public
  *.jks
  *.keystore
  keystore.properties
  ```
- En `android/app/build.gradle`: `applicationId "com.persevera.tests"`, `versionCode 1` y `versionName "1.0"` (sin verificar que sean los que deja Capacitor; si no, ponlos).
- En `android/variables.gradle`: `targetSdkVersion = 36`. Google lo exige a las apps nuevas desde el 31-ago-2026 [Android API], y es lo que tiene Persevera (`android/variables.gradle`, línea 4).

En Android Studio:
1. `npx cap open android`.
2. Abre `app/src/main/AndroidManifest.xml`, pestaña «Merged Manifest» (sin verificar el rótulo). Tiene que estar `com.android.vending.BILLING`, que trae el SDK de RevenueCat. **Si no está, para y avisa.** No tiene que haber `READ_MEDIA_IMAGES` ni `READ_MEDIA_VIDEO` (`TRAMITE_GOOGLEPLAY.md`, línea 14).
3. «Build», «Generate Signed Bundle / APK», «Android App Bundle», «Next» [Android firma].
4. El keystore de 9.1, alias `upload` y sus contraseñas. «Next».
5. Variante `release`, «Create». Sale `android/app/release/app-release.aab`.

Commit y push de `android/`, `package.json`, `package-lock.json` y `.gitignore`. Antes, `git status` no puede enseñar ningún `.aab`, `.jks` ni `local.properties`.

### 9.4 La prueba interna (15 min)

1. En Play Console, Persevera Tests, «Probar y publicar», «Pruebas», «Prueba interna» [Play prueba interna].
2. Pestaña «Testers»: «Crear una lista de correo electrónico», nombre `Persevera Tests internos`, con tu cuenta de Google. Guarda, márcala y «Guardar cambios». Admite hasta 100 testers.
3. «Crear nueva versión» [Play versión].
4. La primera vez sale la firma de apps de Play: deja que Google genere y guarde la llave de firma [Android firma].
5. «Subir» y elige el `.aab`. Nombre de la versión: `1 (1.0)`. Notas: `Primera versión de prueba.`
6. «Siguiente». Si sale «Resumen de errores», para y avisa. Si no, «Iniciar lanzamiento» [Play versión].
7. El enlace para unirse sale cuando el estado es «Publicada». La primera vez puede tardar horas [Play prueba interna].
8. En «Integridad de la app», «Firma de apps» (sin verificar la ruta), apunta el SHA-256 de la llave de firma y el de la de subida. El de subida tiene que coincidir con el de 9.1.

### Comprueba que (Android)

1. Persevera Tests existe en Play Console con el paquete `com.persevera.tests`.
2. La prueba interna tiene la versión `1 (1.0)` y no está en borrador.
3. La llave de subida de Play Console tiene el SHA-256 de 9.1.
4. En GitHub está `android/`, sin ningún `.aab` ni `.jks`.

> **PELIGRO (Android)**
> - Nada a producción ni a una prueba cerrada o abierta.
> - No toques la app de Persevera ni la de Eroodite.
> - El nombre del paquete es para siempre: cópialo.
> - El keystore y sus contraseñas, nunca al repositorio ni a una conversación.
> - En «Pruebas de licencia» no quites a nadie: la lista es de toda la cuenta y la usa Persevera (`TRAMITE_GOOGLEPLAY.md`, línea 19).

### Devuelve (A9)

```
A9, ANDROID
Huellas del certificado de subida: SHA1 … SHA256 …
App en Play Console: Persevera Tests, com.persevera.tests, gratuita
¿El formulario de crear pedía el paquete?: sí/no
targetSdkVersion:
Merged Manifest: BILLING sí/no; READ_MEDIA_* no/sí
Prueba interna: versión 1 (1.0), estado:
SHA-256 de la llave de firma (Play Console):
SHA-256 de la llave de subida: coincide sí/no
Commit de android/:
Fecha:
```

**Hecho (A9)** cuando el paquete está en la pista interna (hoja, línea 390).

---

## Bloque 10. Los productos de Apple y su conexión a RevenueCat (A10 y A13, unos 70 min)

- **Espera a:** los bloques 4 y 5, y esta guía, que trae los identificadores (hoja, línea 399).
- **Desbloquea:** el entitlement y las ofertas (bloque 12) y la comprobación de productos de T14.

Los pasos y los rótulos son los del bloque A de la guía del día D (líneas 122-208), que Apple comprobó en su ayuda el 2 y el 3 de octubre (líneas 590-607).

### 10.0 Mira y anota, sin cambiar nada (3 min)

1. Abre la app **Persevera Tests** en App Store Connect. Mira arriba que no es Persevera.
2. En «Monetización» (Monetization), «Suscripciones» (Subscriptions), no tiene que haber ningún grupo.

### 10.1 El grupo (2 min)

1. En «Suscripciones», **+** junto a los grupos.
2. Nombre de referencia: `Persevera Tests`. «Crear» (Create). Es el primer grupo de la app, así que no sale el aviso de grupo adicional.

### 10.2 Su nombre visible (2 min)

1. En la localización del grupo, «Añadir» o **+** (sin verificar el rótulo).
2. Idioma: Español (España).
3. Nombre visible del grupo (Subscription Group Display Name): `Persevera Tests`.
4. Opciones del nombre de la app (App Name Display Options): «Usar el nombre de la app» (Use App Name).
5. Guarda.

### 10.3 Los tres productos, vacíos (10 min)

Con cada fila, en este orden:
1. Dentro del grupo, «Crear» (Create) o **+**.
2. Nombre de referencia: la columna 1.
3. ID de producto: la columna 2, **copiado**.
4. «Crear».
5. «Duración de la suscripción» (Subscription Duration): la columna 3. «Guardar» (Save).

| Nombre de referencia | ID de producto | Duración |
|---|---|---|
| Persevera Tests anual | `com.persevera.tests.una.anual` | 1 año |
| Persevera Tests semestral | `com.persevera.tests.una.semestral` | 6 meses |
| Persevera Tests mensual | `com.persevera.tests.una.mensual` | 1 mes |

### 10.4 Completar los tres (25 min)

Abre cada uno y sigue estos pasos.

**Precio**
1. «Precios de suscripción» (Subscription Prices), «Añadir precio de suscripción» (Add Subscription Price).
2. País o región: España. Precio: 9,99, 46,99 o 79,99. Si no sale en la lista, «Ver precios adicionales» (See Additional Prices). Los tres tienen que estar en la rejilla de euros (pasos de 0,50 € hasta 49,99 y de 1 € hasta 199,99, guía del día D, línea 604), pero no lo he mirado en la consola: **si alguno no está, para y avisa.**
3. «Siguiente». Deja el resto de países como los propone Apple. «Siguiente» y «Confirmar» (Confirm).

**Disponibilidad**
4. «Disponibilidad» (Availability), «Configurar disponibilidad» (Set Up Availability).
5. Todos los países y regiones, «Listo» (Done). Limitarla a España dejaría fuera a quien tiene la cuenta de la App Store en otro país (`TRAMITE_APPSTORE.md`, línea 32).

**Nombre y descripción**
6. En nombre visible y descripción (Display Name and Description), «Añadir» (Add).
7. Idioma: Español (España).
8. Nombre visible: el mismo que el de referencia.
9. Descripción: `Los tests de tu oposición`, la misma en los tres.
10. «Añadir».

**Opciones de compra**
11. Apple trae puesto «Compras multilicencia: Se permite», con «Apple Business» y «Apple School Manager» marcados. Elige «No, no permitir compras multilicencia» y deja marcado solo App Store (guía del día D, línea 190). En el día D se olvidó en 15 de 16 (línea 8): míralo en los tres.

**Revisión**
12. En «Información para la revisión» (Review Information), sube una captura provisional de una pantalla de compra: 1242 × 2688 y sin canal alfa, que es lo que aceptó Apple en junio (guía del día D, líneas 717-720). Puede ser `paywall_iap_OK.png` de Descargas. Se puede cambiar, pero no quitar (línea 600). La buena va en P7.
13. Notas para la revisión, provisionales: `Subscription to one exam (oposición) in Persevera Tests.`
14. No toques «En familia» ni la categoría fiscal.
15. «Guardar», arriba a la derecha.

**La semana gratis**
16. En «Precios de suscripción», «Ver todos los precios de la suscripción» (View all Subscription pricing).
17. «Configurar oferta introductoria» (Set up Introductory Offer). Todos los países, «Siguiente».
18. Inicio: hoy. Fin: «Sin fecha de fin» (sin verificar). Si obliga a poner una, la más lejana que deje, y apúntala.
19. Tipo «Gratis» (Free), duración «1 semana» (1 Week). «Siguiente» y «Confirmar». Una oferta creada no se edita: se borra y se crea otra [Apple oferta intro].

### 10.5 Los niveles (3 min)

1. En el grupo, «Editar orden» (Edit Order).
2. Nivel 1, el anual; nivel 2, el semestral; nivel 3, el mensual. Es el orden del Premium de Persevera, por duración (`TRAMITE_APPSTORE.md`, línea 30).
3. Guarda.

Así, pasar a un nivel más alto es inmediato, con devolución de lo no usado, y bajar se aplica en la renovación (guía del día D, línea 603). Cuando llegue «2 oposiciones» (D6), irá por encima, y se reordena con «Editar orden».

### 10.6 El periodo de gracia de facturación (5 min, decides tú)

Es de toda la app: 3, 16 o 28 días, para todas las renovaciones o solo las de pago a pago, en sandbox o en los dos entornos [Apple gracia]. Persevera no lo tiene (guía del día D, línea 119).

Propuesto: 16 días, «Solo renovaciones de pago a pago» (Only Paid to Paid Renewals), en producción y sandbox. Con «solo de pago a pago», quien no paga al acabar la prueba no recibe días de más. Si prefieres no ponerlo, apúntalo: T13 trata igual el cobro fallido.

Si lo pones [Apple gracia]:
1. En «Apps», la app **Persevera Tests**.
2. En la barra de la izquierda, «Suscripciones» (Subscriptions).
3. En la sección «Periodo de gracia de facturación» (Billing Grace Period), «Configurar periodo de gracia de facturación» (Set Up Billing Grace Period).
4. Duración: 16 días.
5. Tipo de renovación: «Solo renovaciones de pago a pago» (Only Paid to Paid Renewals).
6. Entorno del servidor: «Producción y sandbox» (Production and Sandbox Environment).
7. «Confirmar» (Confirm). Un cambio tarda hasta 24 horas y solo vale para las renovaciones que vienen [Apple gracia].

### 10.7 La app de App Store en RevenueCat (15 min)

> **Ya hecho el 13-oct-2026 desde el hilo:** el paso 1 (la app es `app6974824c52`) y el 4 (los tres productos están creados y adjuntos a `acceso`). Empieza en el paso 2. Después del 3, mira en «Products» que RevenueCat ya encuentra los tres en App Store Connect.

1. En el proyecto **Persevera Tests**, «Apps», nueva app de App Store. Nombre: `Persevera Tests (App Store)`. Bundle ID: `com.persevera.tests`.
2. «In-app purchase key configuration»: sube el `.p8` In-App Purchase de 5.4, con el nombre con que se descargó, y escribe el Issuer ID. «Save changes». Es obligatoria [RC clave IAP].
3. «App Store Connect API»: sube su `.p8`, el Issuer ID y el número de proveedor (Vendor number): `94334658`. Es el de la cuenta, el mismo que tiene la app de App Store de Persevera en RevenueCat (conector, 13-oct). No es secreto. Si RevenueCat lo rechaza, sale en App Store Connect, «Pagos e informes financieros», arriba a la izquierda [RC clave ASC], aunque esa pantalla pide su propio acceso.
4. «Product catalog», «Products», «+ New», «Import Products», la app de App Store de Tests: los tres productos (guía del día D, línea 634). Si pregunta a qué entitlement adjuntarlos: a `acceso`. **En Tests sí**, al contrario que en el día D: Tests no tiene versiones viejas a las que un entitlement les abriera nada.

### 10.8 Las notificaciones del servidor (5 min)

1. En la app de App Store de Tests en RevenueCat, sección «Apple Server to Server notification settings», pulsa «Apply in App Store Connect». Pone la URL de RevenueCat en producción y en sandbox a la vez [RC notificaciones Apple].
2. En App Store Connect, en la app Persevera Tests, «Información de la app» (App Information), «Notificaciones del servidor del App Store» (App Store Server Notifications): tiene que haber URL de producción y de sandbox, las dos de RevenueCat, en versión 2.
3. Si el botón falla, pégalas a mano: la misma URL en las dos, «Version 2», «Guardar».

La hoja dice que sin la URL de sandbox las compras de prueba no mandan avisos (línea 395). Apple dice que entonces los manda a la de producción [Apple URL notificaciones]. Da igual: se ponen las dos.

### 10.9 Los tres productos sin prueba (decides tú; propuesto: ahora no)

En iOS manda Apple, que da una prueba por Apple ID y grupo [Apple oferta intro]. Quien gastó la prueba en la web podría tener otra en el iPhone con un Apple ID que nunca la usó (hoja, línea 415). Se cierra con tres productos del mismo grupo sin oferta introductoria.

- **Propuesto: no crearlos ahora.** El coste del hueco es una semana gratis de más para quien tenga dos cuentas, y que App Review acepte tres productos repetidos al mismo precio no está comprobado. Los nombres quedan reservados (`com.persevera.tests.una_sinprueba.*`) y se pueden crear más adelante, con otra versión.
- **Si decides crearlos:** pasos 10.3 y 10.4 sin la semana gratis (sin los pasos 16 a 19), cada uno en el nivel de su duración. Explícalo en la nota de P9.

### Comprueba que (Apple)

1. La app Persevera Tests tiene un grupo, «Persevera Tests», con tres suscripciones.
2. Las tres están en «Preparar para el envío» (Prepare for Submission). Ninguna en «Listo para revisión», «Esperando revisión» ni «En revisión». Hasta la captura buena pueden salir con «Faltan metadatos»: es lo esperado, y la primera vez se revisan con el primer build (`TRAMITE_APPSTORE.md`, líneas 31 y 33).
3. En las tres: «Compras multilicencia» en «No», solo App Store, y el enlace para activar «En familia» sigue ahí (está apagado).
4. El mensual tiene 9,99 € en España y una semana gratis; el semestral, 46,99 €; el anual, 79,99 €.
5. En RevenueCat, los tres productos están importados en la app de App Store de Tests y adjuntos a `acceso`.
6. En App Store Connect, las dos URL de notificaciones, versión 2.

Los productos de Apple solo cargan en sandbox con todos sus datos, y un cambio tarda hasta 1 hora en llegar (guía del día D, líneas 605 y 640). Si un paywall de prueba sale vacío, lo primero es mirar esto.

> **PELIGRO (Apple)**
> - Nada en la app de Persevera: ni sus grupos, ni sus productos, ni sus notificaciones.
> - No pulses «Añadir para revisión» (Add for Review) en ningún producto.
> - «En familia» siempre apagado.
> - Ni ofertas promocionales, ni códigos de oferta, ni ofertas de recuperación (win-back). En el anual, si Apple ofrece el pago mensual con compromiso de 12 meses, no lo añadas (guía del día D, líneas 255-256).
> - Al importar en RevenueCat, mira que la app elegida es la de Tests.

### Devuelve (A10, productos)

```
A10, PRODUCTOS DE APPLE
ID del grupo «Persevera Tests»:
3 productos con su semana gratis: sí/no
Fecha de fin de la oferta, si obligó a poner una:
Multilicencia en No y solo App Store, en los 3: sí/no
¿Estaban los 3 precios en la rejilla?: sí/no
Niveles: anual 1, semestral 2, mensual 3: sí/no
Periodo de gracia de facturación: no / días, tipo y entornos
¿Productos sin prueba?: no / sí
RevenueCat, app de App Store (app…, no es secreto):
Importados y en acceso: sí/no
Notificaciones del servidor, producción y sandbox, versión 2: sí/no
Fecha:
```

**Hecho (A10)** cuando los tres productos están listos para enviar con la primera versión (hoja, línea 399).

---

## Bloque 11. Google: la suscripción, la cuenta de servicio y sus avisos (A11 y A13, unos 90 min)

- **Espera a:** el bloque 9 (el paquete en la pista interna) y el bloque 4.
- **Desbloquea:** el bloque 12 y las compras de T14 en Android. Hecho cuando los planes están activos (hoja, línea 407).

### 11.0 Mira y anota, sin cambiar nada (5 min)

En la app **Persevera** de Play Console (solo mirar):
1. «Monetizar con Play», «Productos», «Suscripciones», `premium`. Apunta el periodo de gracia de cada plan base. `TRAMITE_GOOGLEPLAY.md` dice 14 días (línea 40), pero RevenueCat lee 7 días en `mensual`, `trimestral` y `semestral`, y 14 en `anual` (conector, 13-oct). Lo que diga la consola es lo bueno.
2. «Monetizar con Play», «Configuración de monetización»: apunta si la «Pausa» está habilitada.

### 11.1 La suscripción (5 min)

En la app **Persevera Tests**:
1. «Monetizar con Play», «Productos», «Suscripciones», «Crear suscripción» [Google suscripciones].
2. ID de producto: `tests_una`. Nombre: `Persevera Tests` (lo ven los usuarios, hasta 55 caracteres).
3. «Crear».
4. Descripción, que es interna: `Los tests de tu oposición`. Sin ventajas.
5. Guarda.

### 11.2 Los tres planes base (15 min)

Con cada fila de la tabla:
1. «Añadir plan básico». ID: la columna 1.
2. Tipo: «Renovación automática». Ni prepago ni plazos.
3. Periodo de facturación: la columna 2.
4. Periodo de gracia: el mismo que el plan de `premium` de la misma duración, según 11.0. El anual de `premium` vale para el anual; el semestral, para el semestral. Si no pudiste verlo, 7 días en `mensual` y `semestral` y 14 en `anual`. Google lo trae encendido [Android ciclo de vida].
5. Deja como vengan «Suspensión de cuenta», «Volver a suscribirse» y «Cambios en planes de facturación y ofertas».
6. «Definir precio»: todos los países y el precio de la columna 3 en EUR. El precio general se escribe sin impuestos, y Google suma el IVA en cada país [Google suscripciones].
7. Busca la fila de España. Si no pone exactamente el precio de la tabla, corrígelo con el lápiz de esa fila; si pregunta si incluye impuestos, sí. Así se hizo en junio (`TRAMITE_GOOGLEPLAY.md`, línea 40; guía del día D, líneas 304-309). **Si no sale exacto, para y avisa.**
8. «Guardar» y «Activar».

| Plan base | Periodo de facturación | Precio en España |
|---|---|---|
| `mensual` | Mensual | 9,99 |
| `semestral` | Cada 6 meses | 46,99 |
| `anual` | Anual | 79,99 |

### 11.3 La prueba, en cada plan (10 min)

1. «Añadir oferta». ID: `prueba-7d`.
2. Elegibilidad: «Adquisición de nuevos clientes», con «Nunca han tenido ninguna suscripción» [Google suscripciones]. Cuenta por cuenta de Google y por app: quien tuvo Persevera en Android sí tiene prueba en Tests.
3. «Añadir fase», «Prueba gratuita», 7 días.
4. «Guardar» y «Activar». **Tiene que quedar «Activa», no en borrador**: fue un pendiente de Persevera (guía del día D, línea 266).

Quien ya gastó la prueba compra el plan base sin la oferta. Eso lo hace la app (hoja, línea 249), no la consola.

### 11.4 Prueba cerrada y pruebas de licencia (5 min)

1. Mira si Play Console pide una prueba cerrada antes de producción. Solo la piden las cuentas personales creadas después del 13-nov-2023: 12 testers durante 14 días seguidos [Google prueba cerrada]. Persevera fue directa a producción (`TRAMITE_GOOGLEPLAY.md`, líneas 46-48). Dónde se ve el tipo de cuenta no lo he encontrado (sin verificar).
2. En «Configuración», «Pruebas de licencia», añade al menos dos Gmail tuyos si no están. La lista es de toda la cuenta (`TRAMITE_GOOGLEPLAY.md`, línea 19). Hacen falta dos porque una cuenta pierde la prueba en cuanto compra una vez.

### 11.5 La cuenta de servicio (20 min, más hasta 36 h)

Pasos de [RC credenciales Google].
1. En Google Cloud, crea un proyecto propio de Tests: `persevera-tests` (propuesto). Así Tests tiene su clave y su tema de Pub/Sub, y una clave no abre las dos apps. Si una cuenta de servicio puede servir a dos apps, RevenueCat no lo dice (sin verificar).
2. En «Project Overview» (Descripción general del proyecto) del proyecto nuevo, copia su **ID del proyecto**. Es único en todo Google Cloud: si `persevera-tests` estaba cogido, el ID no coincide con el nombre. Apúntalo, no es secreto.
3. Lo más rápido es el guion de RevenueCat en Cloud Shell, que activa las API, crea `revenuecat-service-account`, le da los papeles y genera `revenuecat-key.json` [RC credenciales Google]. El guion no se descarga:
   1. Abre Cloud Shell y su editor («Open Editor»), con el proyecto `persevera-tests` elegido arriba.
   2. En la carpeta de inicio, crea un fichero nuevo, `credentials.sh`, y pega el guion entero de la página de RevenueCat.
   3. En el guion, cambia el valor de `PROJECT_ID` (viene como `your_google_cloud_project_id`) por el ID del paso 2. Si lo dejas como viene, el guion avisa y se para.
   4. En el terminal de Cloud Shell: `bash credentials.sh`.
   5. En el explorador de ficheros del editor, botón derecho sobre `revenuecat-key.json` y «Download».

   A mano, sin el guion: activar «Google Play Android Developer API», «Google Play Developer Reporting API» y Pub/Sub; crear la cuenta; darle «Pub/Sub Editor» y «Monitoring Viewer»; crear una clave JSON.
4. El JSON, a tu gestor. Nunca al repositorio ni a una conversación. Después borra `revenuecat-key.json` de Cloud Shell (`rm ~/revenuecat-key.json`) y de Descargas.

### 11.6 Sus permisos en Play Console (10 min, decides tú antes de invitar)

RevenueCat pide dos cosas: «Under App permissions, add the app…» y «Under Account permissions, grant the following four permissions» [RC credenciales Google]. Dos de esos cuatro solo existen para toda la cuenta, y para una sola app se llaman de otra forma [Google permisos]. Sin los financieros, RevenueCat no valida las compras: le pasó a Persevera (`TRAMITE_GOOGLEPLAY.md`, línea 44). Elige una de las dos salidas **antes de invitar**, porque cada cambio de permisos puede volver a pedir hasta 36 horas de validación (11.7):

- **(a) Lo que dice RevenueCat.** En «Permisos de la aplicación», añade Persevera Tests. En «Permisos de la cuenta», los cuatro: «View app information and download bulk reports (read-only)», «View financial data, orders, and cancellation survey responses», «Manage orders and subscriptions» y «Manage store presence». Es lo que RevenueCat documenta, pero esos cuatro valen para todas las apps de la cuenta, también Persevera y Eroodite: con el JSON de Tests se podrían ver sus datos financieros y gestionar sus pedidos y suscripciones.
- **(b) Solo la app de Tests (propuesto).** En «Permisos de la aplicación», añade solo Persevera Tests con sus cuatro permisos de app: «Ver información de la aplicación (solo lectura)» (View app information (read-only)), «Ver datos financieros» (View financial data), «Gestionar pedidos y suscripciones» (Manage orders and subscriptions) y «Gestionar presencia en Play Store» (Manage store presence) [Google permisos] (los rótulos en español, sin verificar). Nada en «Permisos de la cuenta». No está comprobado que RevenueCat valide así (sin verificar). Si en 11.7 no valida pasadas 36 horas, avisa: pasar a la (a) es otra espera de hasta 36 horas.

Después:
1. «Usuarios y permisos», invitar con el `client_email` del JSON.
2. Los permisos de la salida que elijas.
3. «Invitar usuario».

### 11.7 La app de Play Store en RevenueCat (10 min)

> **Ya hecho el 13-oct-2026 desde el hilo:** el paso 1 (la app es `app3585b5c72c`) y el 3 (los tres productos están creados y adjuntos a `acceso`). Empieza en el paso 2. Cuando las credenciales estén validadas, mira en «Products» que RevenueCat encuentra los tres en Play Console.

1. En el proyecto **Persevera Tests**, «Apps», nueva app de Play Store: `Persevera Tests (Play Store)`, paquete `com.persevera.tests`.
2. «Service Account Credentials JSON»: sube el JSON de 11.5. La validación tarda hasta 36 horas, normalmente menos de 24; mientras, puede decir «Invalid Play Store credentials». Se mira con «Check credentials». Para acelerarla: cambia la descripción de un producto en Play Console, guarda y deshazlo [RC credenciales Google].
3. «Product catalog», «Products», «+ New», «Import Products», la app de Play Store de Tests: `tests_una:mensual`, `tests_una:semestral` y `tests_una:anual`. Si no salen, créalos a mano con el id de la suscripción (`tests_una`) y el del plan base (guía del día D, líneas 473-475). Adjúntalos a `acceso`.

### 11.8 Las notificaciones en tiempo real (10 min)

Pasos de [RC notificaciones Google].
1. En RevenueCat, en la app de Play Store de Tests, «Connect to Google»: elige un tema de Pub/Sub del proyecto `persevera-tests` o deja que RevenueCat lo cree. Copia el id del tema.
2. En Play Console, en Persevera Tests, «Monetizar con Play», «Configuración de monetización», «Notificaciones en tiempo real para desarrolladores»: pega el tema, elige el contenido que cubre suscripciones y compras anuladas, y «Guardar».
3. «Enviar notificación de prueba».
4. En RevenueCat tiene que salir «Last received» con la hora de ahora. Si falla, da a `google-play-developer-notifications@system.gserviceaccount.com` el papel «Pub/Sub Publisher» en el tema.
5. Si «Connect to Google» falla, espera a que acabe la validación de 11.7.

### Comprueba que (Google)

1. `tests_una` tiene tres planes «Activos», cada uno con su `prueba-7d` «Activa».
2. En España, los tres precios son exactamente 9,99, 46,99 y 79,99.
3. La app Persevera sigue como la anotaste en 11.0.
4. En RevenueCat, las credenciales de Play salen válidas, los tres productos están en `acceso` y hay «Last received».

> **PELIGRO (Google)**
> - Nada en la app Persevera: ni `premium`, ni las `tarifa_*`, ni sus notificaciones, ni su cuenta de servicio.
> - Nada de compras de varias unidades, periodo de gracia dinámico ni ofertas de retención o recuperación (guía del día D, líneas 348-351).
> - Los identificadores no se borran ni se reutilizan: cópialos.
> - No quites a nadie de «Pruebas de licencia».

### Devuelve (A11)

```
A11, GOOGLE
Persevera, periodo de gracia de cada plan de premium (solo mirado):
Persevera, Pausa habilitada: sí/no (solo mirado)
tests_una con 3 planes activos: sí/no
prueba-7d activa en los 3: sí/no
España, los 3 precios exactos: sí/no
Periodo de gracia puesto en cada plan:
¿Pide prueba cerrada?: sí/no/no se ve
Pruebas de licencia: cuántas cuentas mías hay
Proyecto de Google Cloud (nombre e ID del proyecto):
Cuenta de servicio (client_email, no es secreto):
Permisos: (a) de la cuenta / (b) solo de la app; ¿validó con ellos?: sí/no
RevenueCat, app de Play Store (app…):
Credenciales válidas el (fecha y hora):
Productos importados y en acceso: sí/no
Tema de Pub/Sub (id, no es secreto):
Last received: sí/no
Fecha:
```

---

## Bloque 12. RevenueCat: entitlement, ofertas, ajustes y claves (A13, sin la web, unos 25 min)

- **Espera a:** los bloques 10 y 11.
- **Desbloquea:** T14 en iOS y Android, que pide las ofertas por su id, y las claves de la app.

> **Ya hecho el 13-oct-2026 desde el hilo:** 12.1 y 12.2. `acceso` tiene los seis productos, y `default` (la actual) y `sin_prueba` tienen sus tres paquetes, Mensual (`$rc_monthly`), Semestral (`$rc_six_month`) y Anual (`$rc_annual`), con un producto de App Store y otro de Play Store de la misma duración. De este bloque te quedan 12.3 y 12.4.

### 12.1 El entitlement (5 min)

En «Product catalog», «Entitlements», `acceso`: tienen que estar los tres productos de App Store y los tres de Play Store. Si falta alguno, adjúntalo. Si no existe `acceso`, créalo como en 4.1, paso 5. Si el asistente creó otro con otro identificador, no le adjuntes nada: los productos van solo a `acceso`.

En Tests, el acceso lo decide el servidor (`tiene_acceso`, T2), no el entitlement. Pero sin productos adjuntos, las compras de prueba no darán el entitlement cuando 12.3 lo abra a las cuentas de prueba, y las gráficas de RevenueCat salen peor.

### 12.2 Las ofertas (10 min)

1. **`default`** (ya existe si la creó el asistente o el bloque 7; si no, «+ New», identificador `default`, que no se puede cambiar). Descripción: `Con prueba de 7 días`. Paquetes:

   | Paquete | App Store | Play Store |
   |---|---|---|
   | Monthly (`$rc_monthly`) | `com.persevera.tests.una.mensual` | `tests_una:mensual` |
   | Six Month (`$rc_six_month`) | `com.persevera.tests.una.semestral` | `tests_una:semestral` |
   | Annual (`$rc_annual`) | `com.persevera.tests.una.anual` | `tests_una:anual` |

   Los productos de la «Test Store» que trajera se pueden dejar: en Persevera siguen y no estorban (`TRAMITE_APPSTORE.md`, línea 38). La web se añade en el bloque 13.
2. **`sin_prueba`**: «+ New», identificador `sin_prueba`, descripción `Sin prueba`. Los mismos paquetes con los mismos productos de App Store y Play Store (o, si hiciste 10.9, los de `una_sinprueba` en App Store). En Android, la app compra el plan base sin la oferta (hoja, línea 249).
3. No marques como actual ninguna otra: `default` sigue siendo la actual. La app pide cada oferta por su id, nunca la actual del panel (`claude/dia-d`, `src/lib/revenuecat.ts`, líneas 16-19).

### 12.3 Los ajustes del proyecto (5 min)

En «Project settings», pestaña «General» [RC restaurar], [RC sandbox]:
- **«Restore behavior»:** «Transfer to new App User ID», que es lo que trae y lo que tiene Persevera (`claude/dia-d`, `docs/dia-d/especificacion.md`, línea 1463). Las otras son «Transfer if there are no active subscriptions» y «Keep with original App User ID». Elígelo a propósito, como pide la hoja (línea 417): con «Transfer», si alguien restaura en el iPhone con otra cuenta de Tests, la compra pasa a esa cuenta, y T13 atiende ese evento (`TRANSFER`). Si afecta a las compras web, la ayuda no lo dice (sin verificar).
- **«Allow testing entitlements and in-app currency for»:** «Nobody». Viene en «Anybody», que da el entitlement a cualquier compra de sandbox o de la Test Store [RC sandbox], y la hoja lo quiere solo para las cuentas de prueba (línea 417). Con «Nobody» no se lo da a nadie. No estorba: en Tests el acceso lo decide `tiene_acceso` (T2), y la prueba de la huella (bloque 7) no necesita el entitlement. Cuando existan las cuentas de `cuentas_de_prueba` (A6 y T12), y antes de P5 y de enviar nada a revisión, pasa a «Allowed App User IDs only» con sus ids (ver «Lo que no se hace todavía»). Si antes una conversación de Tests necesita una compra de sandbox con entitlement, se pasa a «Allowed App User IDs only» con el id de esa prueba.

### 12.4 Las claves públicas (5 min)

En «API keys» del proyecto Persevera Tests [RC autenticación]:
1. **Públicas:** la de App Store (`appl_…`) y la de Play Store (`goog_…`). Pégalas en `.env.local` de Tests como `VITE_REVENUECAT_IOS_KEY` y `VITE_REVENUECAT_ANDROID_KEY`. La de cada tienda es la suya: con la de iOS en Android, la compra da «issue with your configuration» (`TRAMITE_GOOGLEPLAY.md`, línea 43).
2. **La secreta v1 no se crea ahora.** La usan `sincronizar-compra` y el aviso de renovación (hoja, línea 418), que se despliegan en A15. Se crea en A15, justo antes de ponerla en los secretos del Supabase de Tests, con la misma regla que las claves de Resend (6.4): ninguna clave sin uso (ver «Lo que no se hace todavía»).

### Comprueba que (RevenueCat)

1. `acceso` tiene seis productos, todos de las apps de Tests.
2. `default` y `sin_prueba` tienen tres paquetes cada una, con un producto de App Store y otro de Play Store de la misma duración.
3. El proyecto Persevera sigue como lo anotaste en 4.0.

> **PELIGRO (RevenueCat)**
> - En el proyecto Persevera, nada.
> - Las claves secretas (`sk_`) nunca van a una conversación ni al repositorio.
> - Ni paywalls, ni experimentos, ni reglas de segmentación.

### Devuelve (A13, sin la web)

```
A13, ENTITLEMENT, OFERTAS Y CLAVES
Entitlement (identificador exacto): ; productos: 6 sí/no
default con 3 paquetes: sí/no
sin_prueba con 3 paquetes: sí/no
Restore behavior:
Allow testing entitlements… for: Nobody / otro:
Claves públicas appl_ y goog_ en .env.local: sí/no
Secreta v1: queda para A15
Fecha:
```

---

## Bloque 13. La web de pago: Stripe Tax y RevenueCat Billing (A12 y A13, unos 65 min)

- **Espera a:** la verificación de Stripe (bloque 3), la conexión de Stripe con RevenueCat (bloque 7), la web cargando (bloque 8) y el bloque 12 (hoja, línea 421).
- **Desbloquea:** el paywall web de T14 y el cobro web de P5.

### 13.0 Mira y anota, sin cambiar nada (2 min)

1. En Stripe, en la cuenta **Persevera Tests**, mira que la verificación está aceptada y que deja cobrar en modo real.
2. En RevenueCat, mira si la configuración web ya existe (si en el bloque 7 fuiste por el camino del modo de prueba).

### 13.1 Stripe Tax (10 min)

> **Ya hecho el 13-oct-2026 desde el hilo**, con el visto bueno de Blanca y el conector de Stripe: los pasos 1 a 3. La sede dice «Calle Doctor Fleming 21», 41210 Guillena, SE; impuestos incluidos y `txcd_10000000`; registro en España, estándar, como pequeño vendedor (`taxreg_1UQAONDBHlndqjVoj0sbwN9r`). Stripe Tax sale «active». Empieza en el paso 4.

En la cuenta Persevera Tests, en la configuración de impuestos («Configuración», «Impuestos», `https://dashboard.stripe.com/settings/tax`; el registro, en la pestaña «Ubicaciones» (Locations)) [Stripe Tax alta], [Stripe impuestos UE]:
1. Sede: la dirección de Brooks & Oo, S.L., con «Doctor».
2. Comportamiento por defecto: impuestos incluidos, código `txcd_10000000`, como Persevera (conector, 13-oct).
3. Registro: España. A la pregunta de si es pequeño vendedor (small seller), lo mismo que Persevera, que dijo que sí. El umbral de 10.000 € de ventas a otros países de la UE es de la sociedad entera, sumando las dos cuentas, y Stripe lo vigila cuenta por cuenta [Stripe impuestos UE]. Es una duda para el gestor («Lo que falta por saber»).
4. Activa el cálculo automático [RC impuestos].
5. En el modo de prueba (o el sandbox), un registro de prueba aparte [RC impuestos].

### 13.2 Los dominios de Apple Pay y Google Pay (5 min)

1. En Stripe, cuenta Persevera Tests, «Configuración», «Pagos», «Dominios de métodos de pago» (Payment Method Domains; `https://dashboard.stripe.com/settings/payment_method_domains`), «Añadir un dominio nuevo» (Add a new domain). Escribe `tests.perseveraoposiciones.com`, guarda y mira que sale «Enabled». Hace falta porque Tests cobra con el SDK web en su propio dominio: RevenueCat solo registra sus dominios (`pay.rev.cat` y `signup.cat`) y los de sus Funnels, y un dominio propio con el SDK web se añade a mano [RC medios de pago]. Los rótulos en español, sin verificar.
2. Si Stripe pide subir un fichero a la web para verificar el dominio, para y avisa (sin verificar si lo pide).

### 13.3 Los recibos de Stripe (3 min)

RevenueCat Billing manda sus propios recibos [RC correos]. En Stripe, cuenta Persevera Tests, «Configuración», «Empresa», «Correos a clientes» (Settings, Business, Customer emails), sección «Pagos» (Payments), mira «Pagos exitosos» (Successful payments) y «Reembolsos» (Refunds) [Stripe recibos]. Si están encendidos, apágalos para que no lleguen dos (sin verificar que Stripe los mande en estos cobros).

### 13.4 La configuración web (15 min)

**Antes, solo si en el bloque 7 fuiste por los sandboxes:** la app de RevenueCat solo está instalada en el sandbox, y para RevenueCat cada sandbox es una cuenta aparte («sandboxes function as standalone accounts») [RC conectar Stripe]. Sin esto, la cuenta real no sale para elegirla aquí, y en 13.5 no habrá permisos que aprobar. Repite los pasos 1 a 3 de 7.1 con la cuenta real:
1. En Stripe, sal del sandbox y mira arriba a la derecha que estás en **Persevera Tests**, la real.
2. Instala la app de RevenueCat del Stripe App Marketplace en esa cuenta.
3. «View Stripe app settings» y entra con RevenueCat desde la app, con el usuario dueño del proyecto (4.0).
4. Recarga los ajustes de la cuenta de RevenueCat: tienen que salir las dos, el sandbox y la real.

Si en el bloque 7 fuiste por el modo de prueba, la configuración ya existe: revisa estos campos. Si fuiste por los sandboxes, crea ahora la real: en el proyecto, «Web», nueva configuración de RevenueCat Billing [RC SDK web].
- Nombre: `Persevera Tests (Web)`.
- Cuenta de Stripe: **Persevera Tests**. Después de la primera suscripción ya no se cambia [RC comunidad Stripe].
- Moneda por defecto: EUR. Se usa cuando el país del cliente no tiene precio [RC monedas].
- Nombre de la app: `Persevera Tests`. Es el remitente de sus correos [RC correos].
- Correo de soporte: `hola@perseveraoposiciones.com`, el de 3.3. Es la dirección de respuesta de sus correos [RC correos].
- Pie de las facturas (pestaña «Settings», «App Information»): `Brooks & Oo, S.L. NIF B26969022. Calle Doctor Fleming, 21, 41210 Guillena (Sevilla), España.` Sale en todos los PDF [RC impuestos].

### 13.5 La pestaña «Billing» (5 min)

- **Tax:** encendido, «Stripe Tax», código `txcd_10000000`. Antes, aprueba en Stripe los permisos pendientes de la app de RevenueCat [RC impuestos].
- **Address collection:** «Always», como Persevera, que pide siempre la dirección (`claude/dia-d`, `supabase/functions/stripe-checkout/index.ts`, línea 203) (propuesto; la otra es «Only when required») [RC checkout].
- **Terms consent:** todavía no. Se enciende cuando exista `https://tests.perseveraoposiciones.com/terminos` (P1): pone una casilla obligatoria antes de pagar [RC checkout].
- **Correos opcionales** («Upcoming yearly subscription renewal», «Upcoming free trial expiry», «Introductory offer expiry»): apagados hasta decidirlo con T20 (propuesto).

### 13.6 Los productos web (15 min)

«Product catalog», «Products», «+ New», en la configuración web real [RC productos web]. Con cada fila. Si `tests_una_mensual` ya está, del bloque 7 por el camino del modo de prueba, no lo crees otra vez, pero mira que su periodo de gracia y sus cambios de suscripción son los de abajo:

| Identificador | Nombre | Duración | Precio | Prueba |
|---|---|---|---|---|
| `tests_una_mensual` | Persevera Tests mensual | 1 mes | 9,99 € | 7 días, «Didn't have any subscription yet» |
| `tests_una_semestral` | Persevera Tests semestral | 6 meses | 46,99 € | igual |
| `tests_una_anual` | Persevera Tests anual | 1 año | 79,99 € | igual |
| `tests_una_sinprueba_mensual` | Persevera Tests mensual | 1 mes | 9,99 € | ninguna |
| `tests_una_sinprueba_semestral` | Persevera Tests semestral | 6 meses | 46,99 € | ninguna |
| `tests_una_sinprueba_anual` | Persevera Tests anual | 1 año | 79,99 € | ninguna |

En cada uno:
- descripción `Los tests de tu oposición`;
- suscripción con renovación automática;
- precio en EUR. **Revísalo antes de guardar: después no se puede cambiar**, solo añadir monedas;
- periodo de gracia (propuesto): el mismo que Google, según la duración. RevenueCat reintenta el cobro hasta 30 días [RC ciclo de vida];
- cambios de suscripción: ninguno al lanzar (propuesto). Sin caminos definidos, el cliente no cambia de plan en el portal [RC productos web].

Los seis se crean siempre. En RevenueCat Billing la prueba va en el producto: en su pantalla, «Check this to enable a free trial period, and choose the duration» [RC productos web]. Así que la oferta `sin_prueba` necesita productos sin ella. Hacen falta también porque `prueba_disponible()` (T2) puede decir que no a quien RevenueCat ve como nuevo, por ejemplo quien borró su cuenta y abrió otra.

Si fuiste por los sandboxes, crea los mismos seis en la configuración `Persevera Tests (Web sandbox)` (el mensual ya está, del bloque 7). En 13.7, al elegir producto saldrán dos de cada uno, uno por configuración: se distinguen por el nombre de su configuración.

### 13.7 La web en las ofertas y el entitlement (5 min)

1. En `default`, en cada paquete, el producto web de `Persevera Tests (Web)`: `tests_una_mensual`, `tests_una_semestral` y `tests_una_anual`.
2. En `sin_prueba`, en cada paquete, `tests_una_sinprueba_mensual`, `tests_una_sinprueba_semestral` y `tests_una_sinprueba_anual`, también de `Persevera Tests (Web)`.
3. En `acceso`, adjunta los seis productos web.
4. **Si fuiste por los sandboxes,** cada paquete de `default` y de `sin_prueba` lleva además el producto de la misma duración de `Persevera Tests (Web sandbox)` (el mensual de `default` ya está desde 7.3), y los seis del sandbox van también a `acceso`. Cada paquete queda con un producto de cada configuración (deducción: la ayuda no habla de dos configuraciones en la misma oferta).

### 13.8 Las claves públicas de la web (5 min)

En «API keys»:
1. **Por el camino del modo de prueba:** la real (`rcb_…`) y la de sandbox (`rcb_sb_…`) de `Persevera Tests (Web)`. La de sandbox solo sirve para el SDK web (personal de RevenueCat, 25-feb-2026, [RC comunidad claves]). Pégalas en `.env.local` de Tests como `VITE_REVENUECAT_WEB_KEY` y `VITE_REVENUECAT_WEB_SANDBOX_KEY` (propuesto; el nombre lo fija T14).
2. **Por el camino de los sandboxes:** `VITE_REVENUECAT_WEB_KEY` es la real (`rcb_…`) de `Persevera Tests (Web)`, y `VITE_REVENUECAT_WEB_SANDBOX_KEY`, la clave de sandbox de `Persevera Tests (Web sandbox)`. La `rcb_sb_` de la configuración real no se usa: tiraría del modo de prueba de una cuenta que no lo tiene. Es una deducción: la ayuda no dice qué clave usar con un sandbox de Stripe [RC conectar Stripe]. Díselo a T14.
3. **La secreta v2 no se crea ahora.** Hace falta para lo que la v1 no hace con las compras web: cancelar y reembolsar, el enlace de un solo uso al portal del cliente («Gestionar suscripción» en la web) y, si T21 lo decide, borrar el cliente [RC API v2 suscripción], [RC API v2 cliente]. Se crea en A15, justo antes de ponerla en los secretos del Supabase de Tests, con los permisos que pidan entonces T13, T14 y T21 (ver «Lo que no se hace todavía»). Hoy serían `customer_information:subscriptions:read_write`, que ya incluye la lectura, y `customer_information:customers:read_write` solo si T21 decide borrar el cliente.

### Comprueba que (web de pago)

1. En Stripe, Persevera Tests tiene Stripe Tax con el registro de España, y el dominio sale «Enabled».
2. En RevenueCat, la configuración web usa la cuenta Persevera Tests, en EUR, con el pie de factura.
3. Hay seis productos web con su precio exacto. Los tres primeros, con 7 días de prueba; los «sinprueba», sin ella.
4. `default` y `sin_prueba` tienen su producto web en cada paquete, y `acceso` tiene doce productos (dieciocho si fuiste por los sandboxes, con los seis de `Persevera Tests (Web sandbox)`).
5. Si fuiste por los sandboxes, en los ajustes de la cuenta de RevenueCat salen las dos cuentas de Stripe, el sandbox y la real.
6. El Stripe de Persevera sigue sin la app de RevenueCat.

> **PELIGRO (web de pago)**
> - En el Stripe de Persevera, nada: ni la app de RevenueCat, ni impuestos, ni dominios.
> - En el Stripe de Tests, nada de productos, enlaces de pago ni tablas de precios: el catálogo vive en RevenueCat.
> - Un precio web guardado no se cambia. Si uno sale mal, no lo uses: apúntalo y se crea otro con `_v2` al final.
> - Ninguna compra real de prueba: solo sandbox.

### Devuelve (A12 y A13, la web)

```
A12 Y A13, LA WEB
Stripe verificado el:
Stripe Tax, registro de España, ¿small seller?: sí/no
Dominio en Payment Method Domains: Enabled sí/no; ¿pidió fichero?: sí/no
¿Recibos de Stripe apagados?: sí/no/no había
Cuenta real conectada a RevenueCat (camino de los sandboxes): sí/no/no hacía falta
Configuración web (app…), y la de sandbox si hay dos:
Moneda EUR, pie de factura: sí/no
Address collection:
6 productos web con su precio: sí/no (y los 6 del sandbox, si hay dos configuraciones)
default y sin_prueba con su producto web: sí/no; productos en acceso: 12 / 18
Claves públicas de la web en .env.local: sí/no; la de sandbox es de: Persevera Tests (Web) / Persevera Tests (Web sandbox)
Secreta v2: queda para A15
Fecha:
```

**Hecho (A13, salvo el webhook y las claves secretas)** cuando los productos, las ofertas y las claves públicas están puestos. El webhook espera a A2 (bloque 17), y las claves secretas v1 y v2 se crean en A15 (12.4 y 13.8). La compra de sandbox que llega al webhook es de P5 (hoja, línea 421).

---

## Bloque 14. La propuesta de la copia del banco (A5, primera parte, unos 20 min)

- **Espera a:** A1 y T9, esta guía (hoja, línea 370).
- **Desbloquea:** T10, que no espera a los secretos. Los secretos van en el bloque 18 (los de A4 y Resend) y en A6 (el de escritura de Tests).

La guía de decisiones dice que cómo se copia el banco lo decides tú (línea 59). La propuesta está en el **anexo A**.

1. Lee el anexo A entero.
2. Contesta los seis puntos de su apartado «Lo que decides tú». Puedes aprobar, cambiar o dejar algo abierto.
3. Pega las respuestas en una conversación del repo de Tests, que las apunta en la hoja junto a A5. T10 escribe la copia con lo que apruebes.

Una corrección a la hoja: dice que A5 acaba «con los secretos puestos» (línea 370). El de escritura de Tests (`TESTS_COPIA_URL`) no puede ponerse en A5, porque su rol nace con las migraciones de A6. Va en A6, justo después de `supabase db push`.

> **PELIGRO (A5)**
> - Ningún cron, función ni webhook de Persevera se toca.
> - La copia solo entra en Persevera con `lector_tests`, nunca con su clave secreta, su `service_role` ni su `postgres`.
> - No pongas restricciones de red en Persevera: GitHub no tiene una IP fija y la copia dejaría de entrar.

### Devuelve (A5, la propuesta)

```
A5, LA PROPUESTA DE LA COPIA
1. Qué copia y cómo: apruebo / cambio esto:
   Freno de retiradas: 2 % o 200 filas / otro:
   Deriva: parar y avisar / otro:
2. Dónde corre: A (GitHub Actions) / B (función de Supabase); hora: 04:20 / 04:00 / otra
3. Vigilancia de las 36 horas: pg_cron en Tests / servicio externo
4. A quién llegan los avisos (AVISO_COPIA_A):
5. Rol de escritura: copia_banco / postgres
6. Rúbrica de C2: (b) otra señal / (a) vista sí/no, que cambia A4 / (c) leer las columnas
Fecha:
```

---

# Después del día D (una noche sin fase; el encargo, antes)

## Bloque 15. El lector de Persevera (A4, unos 40 min)

- **Espera a:** A3 (bloque 2). El encargo de 15.1 se puede pasar antes, en cuanto A3 y esta guía estén en el repo de Tests (la guía la sube T9, justo después de T1): la hoja deja que una conversación de Persevera escriba A4 con el esquema de A3, para aplicarla después del día D (líneas 606-607). Para aplicarla (15.2 a 15.7), a la migración que escribe esa conversación.
- **Cuándo se aplica:** después del día D, en una noche sin fase. Si A6 llegara a necesitarla antes, en una noche libre antes del día D (hoja, línea 608). Nunca la misma noche que una fase (hoja, línea 362).
- **Desbloquea:** los secretos de A5 (bloque 18) y A6 (hoja, línea 362).
- **No espera a A5**, salvo que en A5 elijas la salida (a) de la rúbrica de C2 (anexo A, A.6): entonces A4 lleva además una vista y espera tu respuesta. Eso cambia la hoja («Lo que esta guía pide cambiar en la hoja», punto 11).

Es lo único de Tests que cambia algo en Persevera. La migración crea un rol, `lector_tests`, que lee solo esas columnas del contenido, más el catálogo de la base, que lee cualquier rol (por eso la búsqueda de 15.0), y nada de usuarios.

**Por qué no choca con el día D** (todo en `claude/dia-d`, 54e448e):
- La protección del día D es una política restrictiva `to authenticated` en cada tabla (`supabase/migrations/20261006090000_proteccion_1_nucleo.sql`, líneas 419-420 y 490-491). Una restrictiva solo se suma a los roles que nombra, así que no afecta a `lector_tests`. Se probó el 13-oct-2026 en un Postgres 16 de imitación.
- Su salvaguarda solo busca políticas de lectura permisivas para `authenticated` o `public` (mismo fichero, líneas 118-122). Una política para `lector_tests` no la hace saltar.
- El día D quita permisos a `anon` y `public` (mismo fichero, líneas 393-394), nunca a un rol con nombre propio.

**Por qué necesita su política:** un rol con `SELECT` y sin política propia ve 0 filas, sin dar error (hoja, línea 359; probado en la imitación). Por eso la copia tiene un freno de retiradas (anexo A).

### 15.0 Mira y anota, sin cambiar nada (5 min)

Se puede hacer ya, antes de pasar el encargo.

1. En el SQL Editor de **Persevera**, solo lectura:
   ```sql
   select rolname from pg_roles where rolname = 'lector_tests';
   ```
   Tiene que salir vacío. Si ya existe, para y avisa.
2. **Lo que `lector_tests` leerá del catálogo.** Como cualquier rol que entra con SQL, podrá leer el catálogo de la base: la definición de los disparadores y el texto de las funciones de todos los esquemas. Una clave pegada ahí la leería también. El grep de 2.5.4 solo mira las funciones de A3, así que esto se busca aparte. En el SQL Editor de **Persevera**, que entra como `postgres`. Solo lee y enseña dónde, nunca el valor:
   ```sql
   with patron(re) as (values (
     '(bearer\s+[a-z0-9._~+/=-]{12,}|sb_secret_|eyjhbgci|\m(sk|rk)_(live|test)_|\msk_[a-z0-9]{20,}|\mre_[a-z0-9_]{16,}|whsec_)'))
   select 'disparador' as donde, t.tgrelid::regclass::text as objeto, t.tgname::text as nombre
     from pg_trigger t, patron
    where not t.tgisinternal and pg_get_triggerdef(t.oid) ~* patron.re
   union all
   select 'función', n.nspname::text, p.oid::regprocedure::text
     from pg_proc p join pg_namespace n on n.oid = p.pronamespace, patron
    where n.nspname not in ('pg_catalog', 'information_schema') and p.prosrc ~* patron.re
    order by 1, 2, 3;
   ```
   Tiene que salir vacío, y puede que no salga. Persevera tiene dos Database Webhooks hechos desde el panel, sobre `lista_espera` y `psico_reportes`, con la cabecera `Authorization: Bearer <secreto>` (`claude/dia-d`, `supabase/functions/notify-lista-espera/index.ts`, líneas 11-15, y `supabase/functions/notify-reporte-psico/index.ts`, líneas 15-19). Supabase guarda esas cabeceras como argumentos del disparador que llama a `supabase_functions.http_request(...)` [Supabase webhooks], y cualquier rol las lee con `pg_get_triggerdef`. Con ese secreto se pueden lanzar esas funciones de Persevera, que mandan correos con su Resend. Esta consulta no se ha lanzado contra ninguna base (sin verificar).

   **Si sale algo:** apunta qué filas salen (sin el valor), avisa y no hagas 15.4 (la contraseña) hasta que esté resuelto. Hay dos salidas: que una conversación de Persevera cambie cómo se guarda ese secreto para que no quede en el catálogo (por ejemplo, en Vault), o que aceptes el riesgo por escrito en la hoja, junto a A4.

### 15.1 El encargo (5 min)

Se puede pasar en cuanto A3 y esta guía estén en el repo de Tests, porque el encargo remite a su anexo B: la conversación la escribe y queda sin aplicar hasta después del día D. Esa conversación trabaja en el repositorio de Persevera y no ve el de Tests. Antes de pegarlo, mira la ruta de la línea «Entrada»: es la de tu carpeta de A1. Si la conversación no puede leer fuera de su repositorio (por ejemplo, si va en Claude Code en la web), adjúntale los tres ficheros de `datos/` y `docs/guia-consolas.md`.

Abre una conversación en el repositorio de **Persevera** y pega esto entero:

````
Tarea: la migración de A4 de Persevera Tests, el rol `lector_tests`.

Persevera Tests es una app aparte, con su propio Supabase, que cada noche copia el banco de
Persevera en un solo sentido. Para leerlo necesita un rol de Postgres en Persevera que solo pueda
leer el contenido. Escríbelo como migración de Persevera, con su vuelta atrás y su prueba en
PGlite. NO LA APLIQUES. La aplica Álvaro en el SQL Editor, nunca la misma noche que una fase del
día D. No toques nada más de Persevera.

Entrada: tres ficheros de A3 del repo de Tests, `PabloAlgabaGranado/persevera-tests`, que no es
este repositorio: `datos/esquema-persevera.sql`, `datos/esquema-persevera-funciones.sql` y
`datos/esquema-persevera-dependencias.txt`, con su commit. En el Mac de Álvaro están en
`/Users/alvaroalgaba/Developer/persevera-tests/datos/`; si no puedes leer esa carpeta, te los
adjunta. Si no los tienes, pídelos y no sigas sin ellos. Si el día D aún no está aplicado,
escríbela con este A3: antes de aplicarla, Álvaro repite A3 y te pide comparar las columnas.

Qué lleva la migración (`supabase/migrations/<fecha>_lector_tests.sql`, con fecha posterior a las
del día D):

1. Una salvaguarda que aborta sin cambiar nada si:
   - faltan los roles de Supabase;
   - falta alguna de las 15 tablas;
   - `lector_tests` ya existe con algún atributo de más (superusuario, BYPASSRLS, CREATEROLE,
     CREATEDB o REPLICATION).
2. El rol, si no existe: `create role lector_tests with login nosuperuser nocreatedb nocreaterole
   noinherit noreplication nobypassrls connection limit 3`. Sin contraseña en el fichero: Álvaro se
   la pone después con `\password`. Sin `VALID UNTIL`, porque con la fecha pasada el pooler no deja
   entrar (https://supabase.com/docs/guides/troubleshooting/supavisor-connection-error-fatal-eauthquery-unsupported-or-invalid-secret-format-d23dd4).
3. Sus ajustes: `default_transaction_read_only = on`, `statement_timeout = '120s'`,
   `idle_in_transaction_session_timeout = '60s'`, `lock_timeout = '10s'` y un `comment on role`
   que diga para qué es.
4. `grant usage on schema public to lector_tests`.
5. `grant select (<columnas>) on public.<tabla> to lector_tests` en estas 15 tablas, y en ninguna
   más: `oposiciones`, `bloques`, `temas`, `epigrafes`, `tema_epigrafe`, `preguntas`, `minicasos`,
   `minicaso_preguntas`, `supuestos_originales`, `supuesto_original_preguntas`,
   `supuestos_oficiales`, `supuesto_oficial_preguntas`, `marcado_items`, `marcado_unidades` y
   `psico_items_graficos`.
   Las columnas son todas las que tiene cada tabla en A3, escritas una a una, menos estas:
   - la rúbrica del 2.º ejercicio: `enunciado_examen`, `respuesta_modelo` y `puntos_clave`, en
     `supuesto_original_preguntas` y `supuesto_oficial_preguntas`
     (`20260627000002_supuestos_rubrica.sql`, líneas 14-22). Busca en A3 si alguna otra tabla de
     la lista tiene columnas de rúbrica;
   - el texto del temario: `temario_contenido` no está en la lista. Busca en A3 si `temas` o
     `epigrafes` llevan prosa del temario, por ejemplo una columna `contenido`, `texto` o `*_md`,
     y déjala fuera;
   - cualquier columna que diga qué usuario de Persevera hizo algo, como una referencia a
     `auth.users`. La copia no lleva nada de usuarios.
   Si dudas de una columna, pregúntalo y no la des.
6. Una política por tabla, una tabla por transacción con `set local lock_timeout = '2s'`, como en
   el día D:
   ```sql
   drop policy if exists lector_tests_lee on public.<tabla>;
   create policy lector_tests_lee on public.<tabla> as permissive for select to lector_tests using (true);
   ```
   Va en las 15. Donde la RLS está apagada no hace nada, pero deja la copia a salvo si un día se
   enciende.
7. Una comprobación final que aborta si `lector_tests` puede escribir alguna de las 15 (INSERT,
   UPDATE, DELETE, TRUNCATE, REFERENCES o TRIGGER), si lee alguna columna excluida, si falta una
   política, si es miembro de otro rol o si `authenticator` puede hacerse `lector_tests`. Y que
   avise con un `notice`, sin tocarlo, de cada tabla que `lector_tests` lea fuera de su lista por
   un GRANT a PUBLIC.

Qué no lleva: ningún `revoke` a PUBLIC, `anon` ni `authenticated` en lo que ya existe; ningún
cambio en políticas existentes; ninguna función nueva; ningún permiso más que los de arriba (y,
solo si va el párrafo siguiente, los de su vista).

[Solo si Álvaro eligió la salida (a) de la rúbrica de C2, que cambia la hoja; si no, borra este párrafo:]
Añade una vista que solo diga sí o no por pregunta, en las dos tablas de preguntas de supuestos:
`id` y `coalesce(btrim(puntos_clave), '') <> '' or coalesce(btrim(respuesta_modelo), '') <> ''`
como `tiene_rubrica`. Mejor en un esquema propio no expuesto a la API que en `public`. Si va en
un esquema propio, `grant usage on schema <esquema> to lector_tests`. En la vista, `revoke all` a
PUBLIC, `anon` y `authenticated`, y `grant select` solo a `lector_tests`. Que la comprobación final
mire también que nadie más la lee, y que no la cuente en el aviso de «GRANT a PUBLIC».

También:
- la vuelta atrás en `supabase/revertir/<fecha>_lector_tests.sql`: borrar las 15 políticas (una por
  transacción), `revoke all` de las 15 tablas y del esquema a `lector_tests`, y
  `drop role lector_tests`;
- la prueba `scripts/probar-lector-tests.mjs` en PGlite, como `scripts/probar-rpc-sin-public.mjs`.
  Tiene que comprobar que lee `preguntas` también con la restrictiva del día D encendida, que no
  lee `respuestas_usuario` ni la rúbrica, que no escribe y que la migración se puede lanzar dos veces;
- no hacen falta notas para Álvaro: cómo aplicarla, ponerle la contraseña y probarla en producción
  está en la guía de Tests (`docs/guia-consolas.md`, bloque 15).

Hay un borrador del SQL, probado en un Postgres 16 de imitación, en el anexo B de la guía de Tests
(`docs/guia-consolas.md` del repo de Tests; en el Mac de Álvaro,
`/Users/alvaroalgaba/Developer/persevera-tests/docs/guia-consolas.md`, o adjunto). Úsalo como
punto de partida y comprueba cada columna contra A3.
````

La conversación de Persevera sigue sus propias reglas para la rama, el commit y la subida.

### 15.2 Antes de aplicarla: el día D y la revisión (10 min)

Después del día D, la noche en que la vayas a aplicar:
1. ¿Está el día D aplicado entero? ¿Hay fase esta noche? Si hay fase, para: A4 va otro día.
2. ¿El commit de A3 (bloque 2) es anterior al día D? Si lo es, repite A3 (5 min). En una terminal nueva `$PERSEVERA` está vacía y `pg_dump` puede no ser el de libpq, así que primero estas líneas de 2.1 (más un `git pull`, porque 2.6 sube un commit):
   ```bash
   export PATH="$(brew --prefix libpq)/bin:$PATH"
   cd "/Users/alvaroalgaba/Developer/persevera-tests"
   git switch main
   git pull
   PERSEVERA='postgresql://postgres.rljfcmjvulmjooxoxzxo@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require'
   ```
   Y después los pasos 2.2 a 2.6. Así salen las columnas nuevas del día D, como `es_muestra`. Pide a la conversación de Persevera que compare las columnas de la migración con el A3 nuevo y la ajuste.
3. Repite la búsqueda de 15.0, paso 2: el día D puede haber traído disparadores o funciones nuevos.

Después, mira que la migración:
1. Solo crea `lector_tests`, le da las 15 tablas por columnas y pone las 15 políticas `lector_tests_lee`. Y la vista de la rúbrica, con el `usage` de su esquema, si elegiste la (a).
2. No hay `password`, `valid until`, `revoke` a `public`, `anon` o `authenticated`, ni cambios en otras políticas.
3. En `supuesto_original_preguntas` y `supuesto_oficial_preguntas` no salen `enunciado_examen`, `respuesta_modelo` ni `puntos_clave`.
4. La conversación dice que `scripts/probar-lector-tests.mjs` pasa, y existe la vuelta atrás en `supabase/revertir/`.

Si algo no cuadra, díselo a esa conversación y no la apliques.

### 15.3 Aplicarla (5 min)

1. El fichero está en la rama de la conversación de Persevera, no en tu copia de trabajo. Cópialo sin cambiar de rama. En GitHub: la rama, el fichero `supabase/migrations/<fecha>_lector_tests.sql` y «Raw». O en la terminal (`fetch` no cambia tu rama ni tus ficheros):
   ```bash
   git -C "/Users/alvaroalgaba/Desktop/EXAMI/PRIMERA DESCARGA EN MAC/persevera" fetch origin <rama>
   git -C "/Users/alvaroalgaba/Desktop/EXAMI/PRIMERA DESCARGA EN MAC/persevera" show origin/<rama>:supabase/migrations/<fecha>_lector_tests.sql | pbcopy
   ```
   `<rama>` y `<fecha>` te los da esa conversación.
2. En el SQL Editor de **Persevera**, pega el fichero entero y lánzalo.
3. Tiene que acabar sin error, como mucho con algún `notice` («lector_tests lee … por un GRANT a PUBLIC»). Copia los `notice`: se miran en 15.5.
4. Si da error, copia el mensaje y para. La migración se puede volver a lanzar entera cuando esté corregida: está hecha para eso. Si el error sale en las políticas, las anteriores ya quedaron puestas, y no pasa nada.

### 15.4 La contraseña (5 min)

**Antes:** si la búsqueda de 15.0 (o la de 15.2) sacó algo, no sigas hasta que esté resuelto.

`\password` cifra la contraseña en tu Mac y la manda ya cifrada: «This makes sure that the new password does not appear in cleartext in the command history, the server log, or elsewhere» [psql]. Así no queda en el historial del SQL Editor ni en los registros. Que el SQL Editor la guardaría con `ALTER ROLE … PASSWORD` no está comprobado, y por eso no se usa.

```bash
export PATH="$(brew --prefix libpq)/bin:$PATH"
PERSEVERA='postgresql://postgres.rljfcmjvulmjooxoxzxo@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require'
openssl rand -hex 24          # 48 letras y números, sin símbolos que codificar en la cadena
psql "$PERSEVERA" -X          # entra como postgres y pide su contraseña
```
```
postgres=> \password lector_tests
postgres=> \q
```

Guarda la contraseña en tu gestor como «Persevera, lector_tests». Nunca en el chat ni en un fichero del repo. Si un día la cambias, el pooler puede rechazar la nueva unos 15 segundos, así que hazlo a una hora en que no corra la copia [Supabase contraseña y pooler].

### 15.5 La prueba como `postgres` (5 min)

En el SQL Editor de **Persevera**. Solo lee:

```sql
-- 1. Lo que lector_tests puede hacer en toda la base
select c.oid::regclass as tabla,
       has_any_column_privilege('lector_tests', c.oid, 'SELECT') as lee_columnas,
       has_table_privilege('lector_tests', c.oid, 'SELECT') as lee_tabla_entera,
       has_table_privilege('lector_tests', c.oid, 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as escribe,
       c.relrowsecurity as rls,
       exists (select 1 from pg_policy p where p.polrelid = c.oid and p.polname = 'lector_tests_lee') as su_politica
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
 where c.relkind in ('r','v','m','p','f') and n.nspname not in ('pg_catalog','information_schema')
   and (has_any_column_privilege('lector_tests', c.oid, 'SELECT')
        or has_table_privilege('lector_tests', c.oid, 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER'))
 order by 1;

-- 2. Funciones SECURITY DEFINER que lector_tests puede ejecutar (le llegan por PUBLIC), y si anon también
select p.oid::regprocedure as funcion, has_function_privilege('anon', p.oid, 'EXECUTE') as anon_tambien
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace
 where n.nspname not in ('pg_catalog','information_schema') and p.prosecdef
   and has_function_privilege('lector_tests', p.oid, 'EXECUTE')
 order by 1;

-- 3. El rol
select rolname, rolsuper, rolinherit, rolcreaterole, rolcreatedb, rolcanlogin, rolreplication,
       rolbypassrls, rolconnlimit, rolvaliduntil, rolconfig
  from pg_roles where rolname = 'lector_tests';

-- 4. Lo que no debe poder
select has_schema_privilege('lector_tests', 'public', 'CREATE') as crea_en_public,
       pg_has_role('authenticator', 'lector_tests', 'MEMBER') as authenticator_puede_serlo;
```

Lo que tiene que salir:

| Consulta | Lo esperado | Si no |
|---|---|---|
| 1 | Las 15 tablas, con `lee_columnas` verdadero, `lee_tabla_entera` falso, `escribe` falso y `su_politica` verdadero. Si elegiste la (a), también la vista de la rúbrica, con `lee_tabla_entera` verdadero y `su_politica` falso: en una vista es lo esperado | Si sale otra tabla, le llega por un GRANT a PUBLIC: apúntala. Si es de usuarios, para y avisa |
| 2 | Ninguna fila, o solo funciones con `anon_tambien` verdadero | Si alguna sale con `anon_tambien` falso, para y avisa |
| 3 | Todo falso salvo `rolcanlogin`; `rolconnlimit` 3; `rolvaliduntil` vacío; los cuatro ajustes en `rolconfig` | Para y avisa |
| 4 | Las dos, falso | Para y avisa |

En tablas y vistas, lo que `lector_tests` lee por PUBLIC también lo puede leer `anon` con la clave pública de Persevera, porque PUBLIC incluye a `anon` (deducción). El catálogo es otra cosa: `lector_tests` entra con SQL y lo lee entero, y `anon`, por la API, no. Por eso la búsqueda de 15.0.

### 15.6 La prueba como `lector_tests` (3 min)

Guarda esto como `prueba-lector.sql` en una carpeta fuera de los dos repositorios, por ejemplo `~/claves/persevera-tests/`:

```sql
\echo '--- quién soy y en qué modo'
select current_user, current_setting('default_transaction_read_only') as solo_lectura;
\echo '--- 1) lee preguntas: tiene que salir un número mayor que 0'
select count(*) as preguntas from public.preguntas;
\echo '--- 2) no lee respuestas_usuario: ERROR permission denied (42501)'
select count(*) from public.respuestas_usuario;
\echo '--- 3) no lee la rúbrica: ERROR permission denied (42501)'
select respuesta_modelo from public.supuesto_oficial_preguntas limit 1;
\echo '--- 4) no escribe: ERROR permission denied (42501). WHERE false no toca ninguna fila'
begin read write;
update public.preguntas set id = id where false;
rollback;
begin read write;
delete from public.preguntas where false;
rollback;
\echo '--- 5) sin abrir en escritura, para antes: ERROR cannot execute UPDATE in a read-only transaction (25006)'
update public.preguntas set id = id where false;
```

```bash
psql "postgresql://lector_tests.rljfcmjvulmjooxoxzxo@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require" \
  -X -f ~/claves/persevera-tests/prueba-lector.sql
```

Pide la contraseña de 15.4. Con un rol propio, el usuario del pooler es `<rol>.<ref>` [Supabase conexión].

Lo que tiene que salir:
- `lector_tests` y `solo_lectura` en `on`;
- en la 1, un número mayor que 0;
- en la 2, la 3 y la 4, `permission denied` (42501);
- en la 5, `cannot execute UPDATE in a read-only transaction` (25006).

La prueba 4 abre la transacción en escritura a propósito: si no, el modo de solo lectura para antes y no se ve si falta el permiso. Con `where false` no se toca ninguna fila aunque hubiera permiso. **Nunca pruebes `TRUNCATE` en vivo**: ese permiso ya lo mira la consulta 1 de 15.5.

### 15.7 La cadena para Tests (2 min)

Con la contraseña de 15.4, monta en tu gestor (no en un fichero del repo):

```
postgresql://lector_tests.rljfcmjvulmjooxoxzxo:<contraseña>@aws-1-eu-west-1.pooler.supabase.com:5432/postgres?sslmode=require
```

- Es secreta. Va al secreto de GitHub `PERSEVERA_LECTOR_URL` en el bloque 18 y, para la primera copia a mano de A6, al `.env.local` de Tests.
- Usa el pooler de sesión porque GitHub Actions no tiene IPv6 (hoja, línea 366).
- Nunca la clave secreta de Persevera (hoja, línea 360).
- **Si un día se filtra:** en el SQL Editor de Persevera, `alter role lector_tests nologin;`. La copia deja de entrar al momento, y se deshace con `alter role lector_tests login;`. Después, contraseña nueva (15.4).

### Comprueba que (A4)

1. Las cuatro consultas de 15.5 dan lo esperado.
2. La prueba de 15.6 da lo esperado.
3. En Persevera no ha cambiado nada más: la app entra, los tests cargan y el día D sigue igual.

> **PELIGRO (A4)**
> - Nunca la misma noche que una fase del día D.
> - Sin contraseña (15.4) mientras la búsqueda de 15.0 tenga algo sin resolver.
> - La contraseña, nunca en el SQL Editor ni en el chat: solo con `\password` y en tu gestor.
> - Ningún `revoke` a `public`, `anon` ni `authenticated`, aunque la consulta 1 enseñe tablas que le llegan por PUBLIC. Cerrar eso es otra tarea de Persevera.
> - No pruebes a escribir de verdad: solo con `where false`, y nunca `TRUNCATE`.
> - La vuelta atrás está en `supabase/revertir/` y no es una migración. Lo rápido, si hace falta, es `nologin`.

### Devuelve (A4)

```
A4, EL LECTOR DE PERSEVERA
Encargo pasado el (fecha), con A3 del commit:
Búsqueda en el catálogo (15.0 y 15.2): vacía / salió algo (qué filas, sin el valor) y qué se hizo
A3 repetido después del día D: sí / no hacía falta; commit:
Commit de la migración en persevera (rama y hash):
Aplicada el (fecha y hora), sin fase esa noche: sí/no
Notices al aplicarla (tablas que lee por PUBLIC):
15.5, consulta 1: 15 tablas ok / sale otra:
15.5, consulta 2: ninguna / alguna con anon_tambien falso:
15.5, consultas 3 y 4: ok / no:
15.6: lee preguntas (número): ; respuestas_usuario, rúbrica y escritura: denegado sí/no
Vista de la rúbrica (salida a): sí/no
Contraseña en el gestor: sí/no
```

**Hecho (A4)** cuando una consulta de prueba lee `preguntas` y no puede leer `respuestas_usuario` ni escribir nada (hoja, línea 362).

---

# Noviembre

## Bloque 16. El Supabase de Tests y la dirección de vuelta (A2 y A7, unos 35 min, más 20 si adelantas el SMTP)

- **Espera a:** nada. Pero no hace falta hasta noviembre, con T12 y A6, y el plan se cobra desde que se crea (hoja, línea 606). Créalo cuando una conversación de Tests lo pida, o cuando vayas a hacer A6.
- **Desbloquea:** A6, A7, A15 y las pruebas con la base real (hoja, línea 339). También el webhook (bloque 17) y, ya en A6, la cadena de escritura de la copia.

**Las decisiones:**
- **Plan de pago.** Un proyecto gratuito se pausa tras 7 días sin actividad y no tiene copias diarias. Pro guarda una copia diaria durante 7 días [Supabase precios], [Supabase copias]. Esto cierra el «comprobarlo» de la hoja (línea 339).
- **Coste.** Pro son 25 $ al mes por organización, con 10 $ de crédito de cómputo que se aplican una vez a la organización. Cada proyecto paga su cómputo: Micro, unos 10 $ al mes [Supabase cómputo]. En la organización que ya paga Pro con Persevera, Tests suma unos 10 $ al mes (deducción: el crédito ya lo gasta Persevera). En una organización nueva, unos 25 $. En cuál va, lo decides tú.
- **PITR, no** (propuesto). Cuesta unos 100 $ al mes por 7 días, pide al menos el cómputo Small y apaga las copias diarias [Supabase copias]. El banco se rehace desde Persevera, y con las copias diarias se perdería como mucho un día de respuestas.
- **Región West EU (Ireland), `eu-west-1`,** la misma que Persevera (`supabase/.temp/pooler-url`, en 54e448e). No la región general «Europe», que puede caer en Londres o en Zúrich, fuera de la UE [Supabase regiones].
- **Postgres 15 o más** (hoja, línea 339). Mejor 17, el de Persevera, para que la huella de la copia dé lo mismo en las dos bases.
- **Sin los GRANT automáticos.** Desde el 30-may-2026 los proyectos nuevos nacen sin ellos, y en el alta la casilla se llama «Automatically expose new tables» [Supabase GRANT]. Se deja sin marcar: las migraciones de T2 escriben sus GRANT.

### 16.0 Mira y anota, sin cambiar nada (3 min)

1. En el panel de Supabase, la organización de **Persevera**: su nombre, su plan y el cómputo de Persevera. Solo mirar.
2. En la carpeta de Tests, `git pull` y mira si están `scripts/comprobar-claves.mjs` y `supabase/config.toml`.
3. Apunta el puerto de `npm run dev` de Tests (lo fija T1; Oral usa el 5310, `persevera-oral/CLAUDE.md`).

### 16.1 El proyecto (10 min)

1. En https://supabase.com/dashboard, elige la organización y pulsa «New project». Los rótulos del formulario de hoy no los he podido ver (sin verificar).
2. Nombre: `Persevera Tests`.
3. Contraseña de la base: que la genere el panel. Guárdala en tu gestor como «Tests, postgres». Hace falta para `supabase link` y `db push` (A6). Si la escribes a mano, solo letras y números: los símbolos hay que codificarlos en la cadena [Supabase roles].
4. Región: West EU (Ireland).
5. Cómputo: Micro.
6. Si sale «Automatically expose new tables», déjala **sin marcar**.
7. Crea y espera a que esté listo.
8. En el SQL Editor de **Tests**: `select version();`. Tiene que ser 15 o más. Mejor si es 17.
9. Apunta el ref del proyecto (lo que va antes de `.supabase.co`) y, en «Connect», el host del pooler de sesión.

### 16.2 Las claves (5 min)

1. Settings, después «API Keys». Si no hay publicable o secreta, créalas ahí [Supabase claves].
   - La publicable empieza por `sb_publishable_` y puede ir en la app.
   - La secreta empieza por `sb_secret_`, se salta la RLS y es solo para el servidor. Supabase la rechaza con 401 si llega desde un navegador.
   - Supabase retira las antiguas `anon` y `service_role` a finales de 2026, y crear las nuevas no apaga las antiguas [Supabase claves]. Tests no usa las antiguas. Se desactivan cuando T12 confirme que nada las usa (propuesto).
2. En la carpeta de Tests, crea o completa `.env.local` (nunca se sube):
   ```
   VITE_SUPABASE_URL=https://<ref de Tests>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_…
   SUPABASE_SECRET_KEY=sb_secret_…
   ```
3. Mira que `git status` no enseña `.env.local`. Si lo enseña, para: falta en el `.gitignore` (el de Oral lo deja fuera, `persevera-oral/.gitignore`, línea 6).

### 16.3 Comprobar las claves (5 min)

```bash
cd "/Users/alvaroalgaba/Developer/persevera-tests"
node scripts/comprobar-claves.mjs
```

Si el script no está, pide a una conversación de Tests que lo copie de Oral con su cabecera de procedencia. La hoja lo copia en T12 (línea 220), pero A2 lo necesita antes. Es el de Oral (`persevera-oral/scripts/comprobar-claves.mjs`, 31 líneas, sin dependencias): lee `.env.local` y nunca imprime las claves.

Tiene que decir:

| Línea del script | Qué mira | Lo que sale |
|---|---|---|
| 17 | La dirección | «Dirección: puesta» |
| 18 y 19 | La forma de las dos claves | «con la forma correcta», dos veces |
| 26-27 | La publicable abre `/auth/v1/settings` | «La publicable abre la app: sí» |
| 28-29 | La secreta abre la administración | «La secreta abre la administración: sí» |
| 30-31 | La publicable no abre la administración | «La publicable NO abre la administración: correcto» |

**No comprueba que la dirección no sea la de Persevera.** Mira tú que el ref no es `rljfcmjvulmjooxoxzxo`. Propuesta para T12: que el script falle si lo es.

### 16.4 La dirección de vuelta (5 min)

Es la parte de A7 que solo espera a A2 (hoja, línea 386). En el Supabase de **Tests**, «Authentication», «URL Configuration» [Supabase redirect]:

1. **Site URL:** `https://tests.perseveraoposiciones.com`. De serie es `http://localhost:3000`, y es la que usan los correos de confirmación y de nueva contraseña.
2. **Redirect URLs**, añade estas tres:
   ```
   https://tests.perseveraoposiciones.com
   https://tests.perseveraoposiciones.com/confirmado.html
   http://localhost:<puerto de 16.0>/**
   ```
   Las dos primeras son las rutas de Persevera con el dominio de Tests (`claude/dia-d`, `src/components/views/AuthScreen.tsx`, líneas 187 y 210). Supabase recomienda la ruta exacta en producción y `**` solo en desarrollo [Supabase redirect]. Si T12 usa otra ruta, la añade a esta guía.
3. Nada con `app.perseveraoposiciones.com`, que es Persevera (hoja, línea 223). Nada con un esquema de la app (`…://`): eso es de A16.

### 16.5 La CLI enlazada a Tests (5 min)

1. En `supabase/config.toml` de Tests tiene que estar `project_id = "persevera-tests"`, como en Oral (`persevera-oral/supabase/config.toml`, línea 5). Si el fichero no existe, pídelo a una conversación de Tests.
2. En la carpeta de **Tests**, nunca en la de Persevera:
   ```bash
   cd "/Users/alvaroalgaba/Developer/persevera-tests"
   supabase link --project-ref <ref de Tests>
   ```
   Pide la contraseña de 16.1.
3. `git status`: no tiene que salir `supabase/.temp/`. Si sale, falta en el `.gitignore` (en Oral está, `persevera-oral/.gitignore`, línea 22); avisa y no lo subas.

### 16.6 Al día siguiente (2 min)

En el Supabase de Tests, «Database», «Backups»: tiene que salir la primera copia diaria [Supabase copias].

### 16.7 El SMTP de Supabase Auth (opcional ahora, 20 min; si no, con T12)

El SMTP es de A7 y espera a las plantillas de T12 (hoja, línea 386). Si lo adelantas, los correos de prueba salen con la plantilla de Supabase. Necesita el dominio de Resend verificado (bloque 6).

1. **La clave** (3 min). En Resend, equipo `Persevera Tests`, «API Keys», crea una (sin verificar el rótulo): nombre `supabase-auth-smtp`, permiso «Sending access», restringida al dominio `tests.perseveraoposiciones.com` [Resend claves API]. Empieza por `re_` y no se vuelve a ver [Resend claves]: a tu gestor. Que el SMTP acepte una clave de solo enviar no lo dice la ayuda (sin verificar). Si en el paso 4 falla la autenticación, avisa antes de crear una de acceso completo.
2. **El SMTP** (10 min). En el Supabase de **Tests**, «Authentication», «Notifications», «Email», «SMTP Settings» [Resend con Supabase], [Supabase SMTP]. Enciende el SMTP propio y rellena:
   - Sender email: `avisos@tests.perseveraoposiciones.com`
   - Sender name: `Persevera Tests`
   - Host: `smtp.resend.com`
   - Port: `465` [Resend SMTP]
   - Username: `resend`
   - Password: la clave del paso 1.

   Guarda. La documentación no nombra un campo para las respuestas (sin verificar): por eso T12 escribe en las plantillas a qué buzón escribir, el correo de soporte.
3. **El límite** (1 min). «Rate Limits»: déjalo en los 30 correos por hora con que empieza [Supabase SMTP]. Se sube antes de publicar (P13).
4. **La prueba** (5 min). En «Authentication», «Users», añade un usuario con invitación a `<tu buzón>+tests-prueba@gmail.com` (sin verificar los rótulos). Tiene que llegar de `Persevera Tests <avisos@tests.perseveraoposiciones.com>`. En Gmail, «Mostrar original»: SPF, DKIM y DMARC en «PASS». En Resend, «Emails», sale como entregado. Después borra ese usuario.

### Comprueba que (Supabase de Tests)

1. El proyecto `Persevera Tests` está en West EU (Ireland), en Micro, con Postgres 15 o más.
2. `comprobar-claves.mjs` da las seis líneas buenas, y el ref no es el de Persevera.
3. La Site URL y las tres Redirect URLs son las de 16.4, y ninguna lleva `app.perseveraoposiciones.com`.
4. `git status` en Tests no enseña `.env.local` ni `supabase/.temp/`.
5. En el Supabase de Persevera no ha cambiado nada.

> **PELIGRO (A2)**
> - Nunca `supabase link`, `db push` ni `db reset` en la carpeta de Persevera. Su `supabase/.temp/` está en git (54e448e) y la CLI quedaría apuntando a otro proyecto.
> - En el Supabase de Persevera no se cambia nada: ni su Site URL, ni su SMTP, ni sus plantillas, ni sus claves.
> - La clave `sb_secret_`, la contraseña de la base y la clave `re_` nunca van al chat ni al repositorio.
> - No marques «Automatically expose new tables».

### Devuelve (A2 y la dirección de vuelta)

```
A2, EL SUPABASE DE TESTS
Ref de Tests y URL (https://<ref>.supabase.co):
Organización: la de Persevera / otra:
Región, plan y cómputo:
Coste al mes apuntado:
PITR: no / sí
Postgres (select version()):
Host del pooler de sesión de Tests (de «Connect»):
comprobar-claves.mjs, las seis líneas: ok / falla:
Site URL y Redirect URLs puestas: sí/no (puerto de desarrollo: )
supabase link hecho en la carpeta de Tests: sí/no
Al día siguiente, primera copia diaria: sí/no
SMTP adelantado: no / sí, prueba con SPF, DKIM y DMARC en PASS: sí/no
Fecha:
```

**Hecho (A2)** cuando el script dice que las claves funcionan (hoja, línea 339).

---

## Bloque 17. El webhook de RevenueCat (A13, último paso, unos 10 min)

- **Espera a:** A2 (bloque 16) y el bloque 12.
- **Desbloquea:** A15, que despliega la función con el mismo secreto, y P5 (hoja, líneas 421 y 432).

En el proyecto **Persevera Tests** de RevenueCat, «Integrations», «Webhooks», uno nuevo [RC webhooks]:

1. Nombre: `Supabase Tests - suscripciones`.
2. URL: `https://<ref de Tests>.supabase.co/functions/v1/revenuecat-webhook`. Mira que el ref es el de Tests, nunca `rljfcmjvulmjooxoxzxo`.
3. Valor de la cabecera de autorización: un secreto nuevo, largo y aleatorio:
   ```bash
   openssl rand -hex 32
   ```
   A tu gestor como «Tests, secreto del webhook». En A15 va a los secretos del Supabase de Tests como `REVENUECAT_WEBHOOK_SECRET`, el nombre que usa Persevera (`claude/dia-d`, `supabase/functions/revenuecat-webhook/index.ts`, líneas 9-12 y 36).
4. Entorno: producción y sandbox. Apps: todas. Tipos de evento: todos. Como el de Persevera (leído con el conector el 13-oct-2026).
5. Firma HMAC: opcional. Si la enciendes, RevenueCat manda `X-RevenueCat-Webhook-Signature` y enseña su secreto una sola vez [RC webhooks]. La hoja no la pide: T13 autentica la cabecera `Authorization`. Propuesto: no, salvo que T13 la quiera.
6. Guarda. **No mandes el evento de prueba todavía:** hasta que A15 despliegue la función no hay quien conteste. RevenueCat reintenta 5 veces (a los 5, 10, 20, 40 y 80 minutos) y luego deja ese aviso [RC webhooks].

Los webhooks piden el plan Pro de RevenueCat [RC webhooks], y la cuenta lo tiene (leído con el conector el 13-oct-2026).

> **PELIGRO (webhook)**
> - Ni un cambio en el webhook del proyecto Persevera.
> - El secreto, nunca al chat ni al repositorio.

### Devuelve (A13, el webhook)

```
A13, EL WEBHOOK
Creado en el proyecto Persevera Tests: sí/no
URL con el ref de Tests: sí/no
Producción y sandbox, todas las apps, todos los tipos: sí/no
HMAC: sí/no
Secreto en el gestor: sí/no
Fecha:
```

**Hecho (A13)** cuando los productos, las ofertas, el webhook y las claves públicas están puestos. La hoja dice «las claves» (línea 421), pero las secretas v1 y v2 van en A15 (12.4 y 13.8; «Lo que esta guía pide cambiar en la hoja», punto 5). El evento de prueba va después de A15, y la compra de sandbox que llega al webhook es de P5.

---

## Bloque 18. Los secretos de la copia (A5, segunda parte, unos 10 min)

- **Espera a:** A4 (bloque 15), el dominio de Resend verificado (bloque 6) y tu respuesta del bloque 14. Si elegiste la opción B (una función de Supabase), estos pasos no valen: los secretos van a Supabase y T10 los añade a esta guía.
- **Desbloquea:** A5 hecho, salvo `TESTS_COPIA_URL`, que va en A6 justo después de `supabase db push` (ver bloque 14). Y A6.

### 18.1 La clave de Resend para la copia (2 min)

En Resend, equipo `Persevera Tests`, «API Keys», una nueva (propuesto): nombre `copia-banco`, «Sending access», restringida a `tests.perseveraoposiciones.com` [Resend claves API]. Es otra que la de Supabase Auth: así se puede revocar una sin tumbar la otra. Empieza por `re_` y no se vuelve a ver [Resend claves]: a tu gestor.

### 18.2 Los secretos en GitHub (5 min)

```bash
gh secret set PERSEVERA_LECTOR_URL --repo PabloAlgabaGranado/persevera-tests
gh secret set RESEND_API_KEY --repo PabloAlgabaGranado/persevera-tests
```

Sin `--body`, cada uno te pide el valor y lo pegas: la cadena de 15.7 y la clave de 18.1 [gh secret set]. Así no queda en el historial del terminal. Si lo prefieres, en GitHub: el repositorio, «Settings», «Secrets and variables», «Actions».

### 18.3 Las variables (2 min)

No son secretas:

```bash
gh variable set AVISO_COPIA_A --body "<el buzón de 14, punto 4>" --repo PabloAlgabaGranado/persevera-tests
gh variable set AVISO_COPIA_DE --body "Persevera Tests <avisos@tests.perseveraoposiciones.com>" --repo PabloAlgabaGranado/persevera-tests
```

[gh variable set]

### 18.4 Comprobar (1 min)

```bash
gh secret list --repo PabloAlgabaGranado/persevera-tests
gh variable list --repo PabloAlgabaGranado/persevera-tests
```

Tienen que salir los dos secretos y las dos variables. De los secretos solo salen el nombre y la fecha.

> **PELIGRO (secretos de la copia)**
> - Ni la clave secreta de Persevera, ni su `service_role`, ni su `postgres`: solo `lector_tests` (hoja, línea 360).
> - La clave de Resend es la de Tests, nunca la de Persevera (hoja, línea 382).
> - Nada de restricciones de red en Persevera: GitHub no tiene una IP fija.
> - Ningún valor en un fichero del repo, en un flujo de GitHub ni en el chat.

### Devuelve (A5, los secretos)

```
A5, LOS SECRETOS DE LA COPIA
PERSEVERA_LECTOR_URL puesto: sí/no
RESEND_API_KEY puesto (clave copia-banco): sí/no
AVISO_COPIA_A:
AVISO_COPIA_DE:
TESTS_COPIA_URL: queda para A6
Fecha:
```

**Hecho (A5)** cuando la propuesta está aprobada (bloque 14), está decidido dónde corre y estos secretos están puestos (hoja, línea 370). El de escritura de Tests, en A6.

---

# Lo que no se hace todavía

Lo apuntado en los bloques para más adelante, con su momento. La tarea de cada fila lo recuerda, y si añade pasos, los escribe en esta guía.

| Cuándo | Qué | Dónde se explica |
|---|---|---|
| Después del día D, antes de aplicar A4 | Repetir A3 (5 min), para que salgan las columnas del día D, y la búsqueda en el catálogo | Bloque 2, 15.0 y 15.2 |
| En A6 (T10 añade los pasos) | `\password copia_banco` y el secreto `TESTS_COPIA_URL`, justo después de `supabase db push`. La primera copia a mano, con `--ensayo` y de verdad. Activar la copia de cada noche y la vigilancia de las 36 horas | Bloque 14 y anexo A |
| Con T12 | El SMTP de Supabase Auth, si no lo adelantaste (16.7), y las plantillas de los correos con un bucket público y su icono en el Supabase de Tests | Bloque 16; T12 añade el resto de A7 |
| Con T12 | Desactivar las claves antiguas `anon` y `service_role` de Tests, cuando T12 confirme que nada las usa | 16.2 |
| Cuando exista P1 | «Terms consent» en la pestaña «Billing» de RevenueCat, y las URL de términos y privacidad en los datos públicos de Stripe | 13.5 y 3.3 |
| En A15 | Las claves secretas de RevenueCat: la v1 (`sincronizar-compra` y el aviso de renovación) y la v2 (las compras web), justo antes de ponerlas en los secretos del Supabase de Tests, con los permisos que pidan T13, T14 y T21 | 12.4 y 13.8 |
| Después de A15 | El evento de prueba del webhook | Bloque 17 |
| Cuando existan las cuentas de `cuentas_de_prueba`, antes de P5 y de enviar nada a revisión | «Allow testing entitlements and in-app currency for» de «Nobody» a «Allowed App User IDs only», con sus ids | 12.3 |
| En P7 | La captura buena de la pantalla de compra de cada producto de Apple y las notas de revisión definitivas (hoja, línea 399) | 10.4 |
| Antes de P13 | Resend a Pro, 20 $ al mes. Subir «Rate Limits» de Supabase Auth, que empieza en 30 correos por hora | 6.1 y 16.7 |
| En P13 | Añadir los tres productos de Apple a la primera versión que se envía, y enviar a revisión | 10.4 |
| En A16, si entra | «Sign In with Apple» en el App ID, los clientes OAuth y el registro de los remitentes en Apple para el relé de correo privado | 5.1; T12 añade los pasos |
| Lo añaden sus tareas | A6 (T10), el resto de A7 (T12), A14 (T23 y A14), A15 (T13, T19, T20 y T21) y A16 (T12) | «Qué cubre y qué no» |

---

# Lo que esta guía pide cambiar en la hoja

Ya aplicado en la hoja el 13-oct-2026, sin mover ninguna línea, así que las citas de esta guía siguen valiendo. Queda aquí como registro de por qué cambió cada tarea.

1. **A8 (línea 388) y P1 (línea 509) dicen que la web pública de Persevera está en Vercel.** Está en Cloudflare Pages: lo dicen `persevera-web/public/_headers` (línea 1), `src/data/fechaTema.ts` (línea 8), `src/data/site.ts` (líneas 52-54) y `src/pages/privacidad.astro` (línea 70). Solo `README.md` y `vercel.json` hablan de Vercel.
2. **A10 (línea 395):** sin la URL de sandbox, Apple manda los avisos de las dos a la de producción [Apple URL notificaciones]. En la práctica da igual: RevenueCat pone las dos con un botón (10.8).
3. **A5 (línea 370) y el calendario (línea 609):** el secreto de escritura de Tests, `TESTS_COPIA_URL`, no se puede poner en A5, porque su rol nace con las migraciones de A6. Va en A6, justo después de `supabase db push`.
4. **A11 (línea 403):** RevenueCat pide ahora cuatro permisos para la cuenta de servicio, no solo los financieros: también «Manage store presence». Los pide en «Permisos de la cuenta», que valen también para Persevera y Eroodite, y dos de ellos solo existen ahí [Google permisos]. Se elige en 11.6. Las credenciales tardan hasta 36 horas en validarse [RC credenciales Google].
5. **A13 (líneas 411-421):**
   - RevenueCat Billing no pide el NIF del cliente ni hace facturas para empresas [RC impuestos]. Queda como duda para el gestor.
   - La web tiene dos claves públicas, `rcb_` y `rcb_sb_`, y hace falta una clave secreta v2, además de la v1, para cancelar, reembolsar, abrir el portal y, si T21 lo decide, borrar el cliente de una compra web (13.8).
   - Las claves secretas v1 y v2 se crean en A15, justo antes de ponerlas en los secretos del Supabase de Tests, con los permisos que pidan T13, T14 y T21, y no en A13 (líneas 418 y 421). A13 se da por hecho con las claves públicas (12.4 y 13.8).
   - RevenueCat Billing no cobra aparte, y los ingresos de todos los proyectos de la cuenta se suman para los 2.500 $. Stripe Tax cobra 0,45 € por cobro web, un 4,5 % del mensual (4.2). La prueba se limita por usuario de RevenueCat, no por tarjeta; la huella se comprueba en el bloque 7.
   - «Allow testing entitlements…» queda en «Nobody» hasta que existan las cuentas de prueba, y después en «Allowed App User IDs only» (12.3).
6. **P4 (línea 523):** el botón final de pago de RevenueCat Billing no se puede rotular [RC localización]. La fórmula del art. 98.2 solo cabe en la pantalla previa de Tests. Lo valida el abogado.
7. **A2 (línea 339):** el «comprobarlo» queda resuelto. Los proyectos gratuitos se pausan a los 7 días sin actividad y no tienen copias diarias; Pro guarda 7 días [Supabase precios], [Supabase copias].
8. **T12 (línea 220):** `scripts/comprobar-claves.mjs` hace falta antes, en A2. Se copia de Oral cuando lo pida A2, o ya en T1.
9. **A9 (línea 390) y T1 (línea 24):** `@capacitor/android` no está en el `package.json` que sale de Oral. A9 lo instala con la versión de Persevera (9.3).
10. **T10 y T2:** los UNIQUE de las tablas copiadas tienen que ser parciales (`where retirada_at is null`), y las restricciones `_jugable` de las preguntas de supuestos usan `puntos_clave`, que no se copia (anexo A, A.3).
11. **C2 (línea 452) y A4:** C2 necesita saber qué preguntas tienen rúbrica, y A4 no deja leerla. Lo decides tú en A5 (anexo A, A.6). La propuesta es la (b), que no toca Persevera. Si eliges la (a), cambian A4 y su dependencia: A4 (líneas 357-362) lleva además una vista de sí o no, con el `usage` de su esquema, y pasa a esperar tu respuesta de A5, cosa que la hoja no pone.
12. **El correo de soporte.** Decidido por Blanca el 13-oct-2026: `hola@perseveraoposiciones.com`.

---

# Anexo A. La propuesta de la copia del banco (A5)

Para que la apruebes o la cambies en el bloque 14. La guía de decisiones deja en tus manos cómo se copia (línea 59). T10 escribe la copia con lo que apruebes (hoja, línea 163). La escritura, la retirada y la huella se probaron el 13-oct-2026 en un Postgres 16 de imitación, que no es Supabase.

## A.1 Qué copia

- **Las 15 tablas de T10** (hoja, líneas 166-168): `oposiciones`, `bloques`, `temas`, `epigrafes`, `tema_epigrafe`, `preguntas`, `minicasos`, `minicaso_preguntas`, `supuestos_originales`, `supuesto_original_preguntas`, `supuestos_oficiales`, `supuesto_oficial_preguntas`, `marcado_items`, `marcado_unidades` y `psico_items_graficos`. Con las columnas de A4 que pida T10, que cierra su lista con lo que leen los ficheros copiados y con A3 (hoja, línea 169).
- **Todas las filas, también las `pendiente`.** Qué se enseña lo deciden el alcance y la RLS de Tests (C4 y C8). Si C8 decide quitar las pendientes, se hace en la copia (hoja, línea 179).
- **Todas las oposiciones,** también las que no están activas. Qué se ofrece lo dice `catalogo_tests`, que la copia no toca.
- **Nada de usuarios:** ni respuestas, ni suscripciones, ni `usuario_oposicion` (hoja, línea 171). Ni la rúbrica ni el texto del temario.

## A.2 Cómo copia

1. **Un solo proceso,** `npm run copiar-banco` (`scripts/copiar-banco.mjs` de T10). Abre dos conexiones, las dos por el pooler de sesión, puerto 5432: la de lectura con `PERSEVERA_LECTOR_URL` y la de escritura con `TESTS_COPIA_URL`. El modo transacción del pooler no admite tablas temporales ni el estado de la sesión [Supabase conexión].
2. **Al empezar, en las dos sesiones,** `set time zone 'UTC'`, el mismo `DateStyle` y el mismo `extra_float_digits`. Así una fecha o un número se escriben igual en las dos bases y la huella cuadra.
3. **Comprueba las columnas antes de leer,** en `pg_attribute` y no en `information_schema.columns`, que a `lector_tests` le esconde las columnas sin permiso (probado en la imitación).
   - Si falta una columna de la lista o cambia su tipo, la copia **falla y avisa**.
   - Si hay una columna nueva, se apunta en `registro_copias` y se sigue (hoja, línea 195). Para leerla hace falta otra migración de Persevera que se la dé a `lector_tests`: es el precio de dar permisos por columna.
4. **La lectura, en una sola transacción** `repeatable read, read only`: cada tabla ordenada por su clave primaria, y la huella de cada tabla calculada allí mismo. `commit` en cuanto acaba. Todo sale de la misma foto (hoja, línea 174).
5. **La escritura, en una sola transacción en Tests** (hoja, línea 175):
   - `set local lock_timeout = '5s'` y un candado `pg_try_advisory_xact_lock`, para que nunca corran dos copias a la vez;
   - cada tabla a una tabla temporal, en el orden de las claves ajenas;
   - **primero retira:** `retirada_at = now()` en las filas vivas que ya no están en la foto. No se borra nada, para no romper las respuestas que lo apuntan (hoja, línea 177). En Persevera, borrar preguntas ya chocó con `respuestas_usuario` (`deploy/README.md`, líneas 50 y 57);
   - **después inserta, cambia y recupera** de un golpe: `insert … on conflict (<clave>) do update set …, retirada_at = null where (columnas) is distinct from (excluded.columnas) or retirada_at is not null`;
   - **conserva los UUID,** que van escritos en `oposicionesIds.ts` y en el motor (hoja, línea 176);
   - en la misma transacción, lo propio de Tests: `alcance_pregunta`, el origen y la muestra (hoja, líneas 181-187). La app nunca ve un estado a medias;
   - compara las huellas. Si cuadran, `commit`. Si no, `rollback`, lo apunta y avisa (hoja, línea 193).
6. **El freno de las retiradas** (nuevo, no está en la hoja). Si una pasada va a retirar más del 2 % de una tabla, o más de 200 filas, no confirma, deja la copia anterior y avisa. Para seguir, la lanzas con `--aceptar-retiradas`. Por dos motivos: un `lector_tests` sin su política lee 0 filas sin error, y eso retiraría el banco entero (probado); y en Persevera, un despliegue sin acotar habría borrado 7.189 preguntas (`deploy/README.md`, líneas 77-91). Los umbrales los fijas tú.
7. **`--ensayo`:** hace todo y al final `rollback`. Dice por tabla cuántas filas inserta, cambia, retira y recupera, con algunos códigos de ejemplo (hoja, línea 163).

## A.3 Lo que esto pide a T2

- **Cada UNIQUE de una tabla copiada, salvo la clave primaria, parcial:** `create unique index … (codigo) where retirada_at is null`. Si no, una fila nueva con el código de una retirada no entra. Persevera ya cruza filas por `codigo` (`deploy/README.md`, línea 50).
- **Las restricciones `_jugable`** de `supuesto_original_preguntas` y `supuesto_oficial_preguntas` usan `puntos_clave` (`claude/dia-d`, `supabase/migrations/20260814000000_supuesto_preguntas_solo_desarrollo.sql`, líneas 32-44), que no se copia. En Tests se reescriben solo con las opciones, o se quitan. Las preguntas solo de desarrollo las deja fuera el alcance (C3).
- **Las claves ajenas entre tablas copiadas,** mejor `deferrable initially deferred`, para que el orden no importe dentro de la transacción.
- **`tema_epigrafe` no tiene `id`:** su clave es `(tema_id, epigrafe_id)` (`supabase/migrations/20260619000002_tema_epigrafe.sql`, líneas 21-26). La huella y el `on conflict` van por la clave primaria de cada tabla.

## A.4 Cómo se comprueba

- **La huella por tabla,** en las dos bases y con las mismas columnas:
  ```sql
  select count(*) as filas,
         md5(coalesce(string_agg(md5(row(<columnas>)::text), '' order by <clave primaria>), '')) as huella
    from public.<tabla>            -- en Tests: ... where retirada_at is null
  ```
  Funciona con permisos por columna: `lector_tests` la calcula sin leer la tabla entera (probado). En Persevera, dentro de la transacción de lectura; en Tests, dentro de la de escritura, antes del `commit`. Tienen que coincidir las filas vivas y la huella de cada tabla (hoja, línea 192). Para eso los tipos de cada columna tienen que ser los mismos en las dos bases, como los copia T2 de A3.
- **La deriva.** Al empezar, la copia calcula la huella de Tests y la compara con la de la última pasada buena. Si no coincide, alguien tocó el contenido de Tests a mano: es la prueba «un cambio a mano hace fallar la comprobación» (hoja, línea 202). Propuesta: resultado `deriva`, no escribe y avisa. Se sigue con `--aceptar-deriva`.
- **`registro_copias`,** una fila por pasada, en una transacción aparte para que quede también cuando falla (hoja, línea 194): inicio, fin y duración; resultado (`ok`, `ensayo`, `fallo`, `deriva` o `frenada`) y motivo; por tabla, en `jsonb`, las filas, las dos huellas y lo insertado, cambiado, retirado y recuperado; las columnas nuevas; el commit del script; y el origen (`github` o `manual`). Con RLS y sin permisos para `anon` ni `authenticated`.
- **El aviso inmediato:** cada pasada que no sale `ok` manda un correo con el Resend de Tests (`RESEND_API_KEY`) a `AVISO_COPIA_A`. No basta el correo de GitHub cuando falla un trabajo: va a quien cambió por última vez la línea del cron [GitHub programadas], que puede ser una conversación y no tú.
- **La vigilancia de las 36 horas** (hoja, línea 196), aparte de la copia y fuera de GitHub: si GitHub no lanza la copia, tampoco lanzaría su vigilancia.
  - **Propuesta:** un trabajo de pg_cron en Tests, cada hora. Mira la última fila `ok` de `registro_copias`. Si tiene más de 36 horas y no se ha avisado en las últimas 24, manda el correo por `net.http_post` a la API de Resend, con la clave en Vault. Así lo hace ya Persevera con `avisar-renovacion` (`claude/dia-d`, `supabase/migrations/20261002150000_avisos_renovacion.sql`, líneas 48-57 y 153-155). Hay que mirar `net._http_response`, porque el cron sale «succeeded» aunque la llamada falle (`persevera-oral/docs/base-de-datos.md`, líneas 919-921).
  - **Otra salida:** un servicio externo de «aviso si no hay latido», al que la copia llama al acabar bien. Más simple, pero es otro proveedor.

## A.5 Dónde corre

### Opción A (recomendada): una tarea programada de GitHub Actions en el repo de Tests

Es la propuesta de la hoja (línea 366).

- **La hora: 04:20 de Madrid** (propuesto; la hoja dice 04:00). GitHub retrasa o pierde trabajos al principio de cada hora [GitHub programadas], y los cron de Persevera corren en el minuto 0 (`claude/dia-d`, `supabase/migrations/20260926190000_retos_cron_y_semanales.sql`, líneas 339-341). Ni las 04:00 ni las 04:20 caen en los huecos del cambio de hora (de 02:00 a 03:00). GitHub acepta la clave `timezone` con una zona IANA [GitHub sintaxis]:
  ```yaml
  on:
    schedule:
      - cron: '20 4 * * *'
        timezone: 'Europe/Madrid'
  ```
  Sin `timezone`, GitHub va en UTC: las 04:00 de Madrid son `0 3 * * *` en invierno (desde el 25-oct-2026 hasta el 28-mar-2027) y `0 2 * * *` en verano. Una sola línea en UTC correría una hora antes o después medio año. Si `timezone` no funcionara, se ponen las dos líneas y un primer paso que sale si `TZ=Europe/Madrid date +%H` no es `04`, como hace Persevera en pg_cron (mismo fichero, líneas 339-343). La copia empieza en noviembre, en horario de invierno.
- **Otras reglas:** solo corre en la rama por defecto, `main` [GitHub programadas]. En un repo público se apaga tras 60 días sin actividad; la página no lo dice de los privados (sin verificar).
- **El coste:** un repo privado tiene 2.000 minutos al mes gratis con GitHub Free [GitHub minutos]. Una copia de unos 3 minutos son unos 90 al mes (estimado; el tiempo real lo mide A6).
- **La red:** GitHub Actions solo tiene IPv4, así que las dos cadenas van por el pooler de sesión [Supabase IPv4].
- **Los secretos y las variables:**

  | Nombre | Qué es | Cuándo |
  |---|---|---|
  | `PERSEVERA_LECTOR_URL` (secreto) | La cadena de `lector_tests` (15.7) | Bloque 18 |
  | `RESEND_API_KEY` (secreto) | La clave `copia-banco` del Resend de Tests, nunca la de Persevera | Bloque 18 |
  | `TESTS_COPIA_URL` (secreto) | `postgresql://copia_banco.<ref de Tests>:<contraseña>@<pooler de Tests>:5432/postgres?sslmode=require` | En A6, después de `db push` |
  | `AVISO_COPIA_A` (variable) | A quién llegan los avisos. Propuesto: tu propia dirección, porque eres quien lo arregla | Bloque 18 |
  | `AVISO_COPIA_DE` (variable) | `Persevera Tests <avisos@tests.perseveraoposiciones.com>` | Bloque 18 |

- **El esbozo del flujo** (`.github/workflows/copia-banco.yml`; lo escribe T10):
  ```yaml
  name: Copia del banco
  on:
    schedule:
      - cron: '20 4 * * *'
        timezone: 'Europe/Madrid'
    workflow_dispatch:
      inputs:
        ensayo:
          type: boolean
          default: true
  concurrency:
    group: copia-banco
    cancel-in-progress: false
  permissions:
    contents: read
  jobs:
    copiar:
      runs-on: ubuntu-24.04
      timeout-minutes: 20
      steps:
        - uses: actions/checkout@<SHA entero de v4>     # fijada por commit, no por etiqueta; el SHA lo pone T10
        - uses: actions/setup-node@<SHA entero de v4>   # igual
          with:
            node-version: 22
            cache: npm
        - run: npm ci --ignore-scripts                  # sin los scripts de instalación de los paquetes
        - run: npm run copiar-banco -- ${{ inputs.ensayo && '--ensayo' || '' }}
          env:
            PERSEVERA_LECTOR_URL: ${{ secrets.PERSEVERA_LECTOR_URL }}
            TESTS_COPIA_URL: ${{ secrets.TESTS_COPIA_URL }}
            RESEND_API_KEY: ${{ secrets.RESEND_API_KEY }}
            AVISO_COPIA_A: ${{ vars.AVISO_COPIA_A }}
            AVISO_COPIA_DE: ${{ vars.AVISO_COPIA_DE }}
  ```
  Lanzada a mano, hace un ensayo salvo que se desmarque. La programada no lleva `inputs`, así que va de verdad.

  Este trabajo lleva las dos cadenas de conexión. Los secretos solo entran en el paso de la copia, pero un paquete que corriera código al instalarse, o una acción cambiada, podría dejar algo preparado para ese paso. Por eso `npm ci --ignore-scripts`, que no lanza los scripts de instalación de ningún paquete, y las acciones fijadas por el SHA entero de su commit, no por una etiqueta que se puede mover. El código de los paquetes que usa la copia sí corre con los secretos, así que conviene que sean pocos. T10 comprueba que la copia corre así, o le da un `package.json` mínimo solo con lo que use.
- **El rol de escritura en Tests, `copia_banco`** (propuesto). Lo crea una migración de Tests de T10, sin contraseña, como `lector_tests`. Tiene `select`, `insert` y `update` en las 15 tablas, sin `delete` ni `truncate`, y escribe también `alcance_pregunta`, `muestra_tema` y `registro_copias`, con sus políticas `to copia_banco`. `solo_servidor` le deja pasar (hoja, línea 178). Con `postgres` también funcionaría, pero ese secreto en GitHub daría la base de Tests entera, cuentas y compras incluidas.
- **El certificado.** Las versiones recientes del cliente `pg` de Node pueden tratar `sslmode=require` como `verify-full` (sin verificar). Si Node no reconoce el certificado del pooler, se le da el de Supabase, que está en el panel. Nunca se apaga la verificación. Lo prueba T10.

### Opción B: una función de Supabase con su cron, en el Supabase de Tests

La alternativa de la hoja (línea 367).

- **Los límites** [Supabase límites de funciones]: 400 s de reloj por ejecución en los planes de pago, **2 s de CPU** por petición (sin contar la espera de red), **256 MB** de memoria, y un 504 si no contesta en 150 s.
- **El cron:** pg_cron y pg_net en Tests, con el secreto en Vault [Supabase funciones programadas]. Supabase recomienda que cada trabajo no pase de 10 minutos [Supabase Cron]. La hora de Madrid, como en Persevera: cada hora con la condición de la hora de Madrid.
- **¿Cabe?** El reloj, seguramente. Los 2 s de CPU, probablemente no: hay que leer y volver a escribir unas 32.256 preguntas (hoja, línea 377) con enunciado, opciones y explicación, más las otras 14 tablas. Solo se sabe midiendo con el banco entero, en A6.

| | A. GitHub Actions | B. Función de Supabase con cron |
|---|---|---|
| ¿Cabe la copia? | Sí, con un tope de 20 minutos que se elige | Dudoso: 2 s de CPU y 256 MB. Hay que medirlo en A6 |
| Es lo que describe T10 | Sí: el mismo `npm run copiar-banco` que lanzas a mano en A6 | Hay que adaptarlo a Deno |
| Hora de Madrid | `timezone: 'Europe/Madrid'` | Cada hora con la condición de Madrid |
| Puntualidad | Puede retrasarse o perderse con carga, sobre todo en el minuto 0 | Más puntual (estimado) |
| Dónde están los secretos | En GitHub. Cualquier flujo de `main` los puede usar, y aquí las conversaciones suben a `main`. Por eso el flujo instala sin scripts y fija las acciones por commit | En Supabase (secretos de la función y Vault) |
| Por dónde pasan los datos | Por un servidor de GitHub, normalmente fuera de la UE (estimado). Es contenido, no datos personales | No salen de Supabase |
| Coste | Gratis dentro de los 2.000 minutos | Incluido en Pro, salvo que se pase de las invocaciones del plan (sin verificar el cupo) |
| Si falla la plataforma | La vigilancia de Tests lo detecta | Se caen a la vez la copia y su vigilancia |

**Recomendada: A,** con la vigilancia de las 36 horas en el pg_cron de Tests. B solo si A6 mide que cabe con holgura y prefieres no tener secretos en GitHub.

### Opción C, solo para que conste: todo dentro de Tests con `postgres_fdw`

La base de Tests leería Persevera directamente [Supabase postgres_fdw]. La contraseña de `lector_tests` quedaría guardada en la base de Tests y en sus copias, y se aparta del script de T10 y de sus pruebas con dos PGlite (hoja, líneas 163 y 198). No la recomiendo.

## A.6 La rúbrica de C2

C2 marca como «Supuesto de desarrollo adaptado a test» una pregunta con opciones de un supuesto **con rúbrica** (hoja, línea 452). La rúbrica son `respuesta_modelo` y `puntos_clave`, y A4 no deja leerlas: la copia no sabe cuáles la tienen. Y no todas la tienen: la migración de la rúbrica dice «originales 334 + oficiales 182» (`claude/dia-d`, `supabase/migrations/20260627000002_supuestos_rubrica.sql`, línea 11).

- **(b) Recomendada:** otra señal que no sea la rúbrica, por ejemplo que el supuesto sea de una oposición con ejercicio escrito (hoy solo Hacienda, `tieneEjercicioEscrito` en `src/lib/oposicionesIds.ts`, hoja, línea 452) y tenga opciones. No toca Persevera ni cambia A4. Hay que ver con C2 si cuadra con «181 y 454» (hoja, línea 455); si no cuadra, se vuelve a decidir.
- **(a)** Una vista en Persevera que solo diga sí o no por pregunta, en la misma migración de A4 y leída solo por `lector_tests` (15.1). No enseña la rúbrica, pero **cambia la hoja**: A4 solo lleva el rol, el `select` por columnas, las políticas y la cadena (líneas 357-362), y con la vista lleva un permiso más y pasa a esperar tu respuesta de A5. Una vista en `public` que corre con los permisos de su dueño la marca el asesor de seguridad de Supabase (estimado): mejor en un esquema propio no expuesto, con su `grant usage`. Si la eliges, va el párrafo de la salida (a) del encargo de 15.1, que pide también que la comprobación final de la migración la tenga en cuenta, y 15.2 y la consulta 1 de 15.5 ya dicen qué esperar de ella.
- **(c)** Leer las dos columnas y copiar solo el sí o el no. Choca con la hoja (línea 358).

## A.7 Lo que decides tú

Contéstalo en el «Devuelve» del bloque 14.

1. **Qué copia y cómo** (A.1 a A.4): apruebas o cambias, y en especial el freno de las retiradas (2 % o 200 filas) y qué se hace con la deriva.
2. **Dónde corre:** A o B, y a qué hora (04:20, 04:00 u otra).
3. **La vigilancia de las 36 horas:** pg_cron en Tests, o un servicio externo.
4. **A quién llegan los avisos:** `AVISO_COPIA_A`.
5. **El rol de escritura:** `copia_banco` o `postgres`, sabiendo que su secreto va en A6.
6. **La rúbrica de C2:** (b), la propuesta, (a) o (c). La (a) cambia A4 y tiene que ser antes de pasar el encargo de 15.1.

---

# Anexo B. El borrador del SQL de A4

Para la conversación de Persevera que escribe la migración (bloque 15.1). La misma estructura, con 7 tablas, se aplicó dos veces sin error el 13-oct-2026 en un Postgres 16 de imitación con los roles de Supabase creados a mano. No es Supabase, así que no sustituye a la prueba en PGlite ni a la de 15.5 y 15.6.

Las columnas de `marcado_items`, `marcado_unidades` y `psico_items_graficos` salen de sus migraciones (`claude/dia-d`, `supabase/migrations/20260721000000_marcado_orto_gram.sql`, líneas 28-58, y `20260721000001_psico_items_graficos.sql`, líneas 22-39). Las del resto, de A3. **Manda A3:** si A3 es posterior al día D, se añade `es_muestra` donde esté; si trae `psico_items_graficos.explicacion`, se añade.

## B.1 La migración

```sql
-- ----------------------------------------------------------------------------
-- PERSEVERA: el lector de Persevera Tests (A4 de su hoja de ruta)
-- ----------------------------------------------------------------------------
-- Persevera Tests copia cada noche el banco de Persevera a su propio Supabase.
-- Este rol solo LEE esas columnas del contenido, y nada de usuarios (como todo rol,
-- también lee el catálogo; ver la búsqueda de la guía, 15.0). No lleva
-- contraseña aquí: se pone aparte con \password. Lo restrictivo del día D va
-- `to authenticated` y no le afecta; sin su política propia vería 0 filas.
-- Vuelta atrás: supabase/revertir/<fecha>_lector_tests.sql.
-- ----------------------------------------------------------------------------

begin;
set local lock_timeout = '2s';

do $$
declare
  v_tablas constant text[] := array['oposiciones','bloques','temas','epigrafes','tema_epigrafe','preguntas',
    'minicasos','minicaso_preguntas','supuestos_originales','supuesto_original_preguntas',
    'supuestos_oficiales','supuesto_oficial_preguntas','marcado_items','marcado_unidades','psico_items_graficos'];
  t text; v_mal text := '';
begin
  if not exists (select 1 from pg_roles where rolname = 'anon')
     or not exists (select 1 from pg_roles where rolname = 'authenticated')
     or not exists (select 1 from pg_roles where rolname = 'authenticator') then
    raise exception 'Solo para la base de Supabase (faltan los roles de la API)';
  end if;
  foreach t in array v_tablas loop
    if to_regclass('public.' || t) is null then v_mal := v_mal || format(E'\n  %s: no existe', t); end if;
  end loop;
  if exists (select 1 from pg_roles where rolname = 'lector_tests'
              and (rolsuper or rolbypassrls or rolcreaterole or rolcreatedb or rolreplication)) then
    v_mal := v_mal || E'\n  lector_tests ya existe con atributos de más';
  end if;
  if v_mal <> '' then raise exception 'No se aplica, y no se ha cambiado nada:%', v_mal; end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'lector_tests') then
    create role lector_tests with login nosuperuser nocreatedb nocreaterole noinherit
      noreplication nobypassrls connection limit 3;
  end if;
end $$;
alter role lector_tests set default_transaction_read_only = on;
alter role lector_tests set statement_timeout = '120s';
alter role lector_tests set idle_in_transaction_session_timeout = '60s';
alter role lector_tests set lock_timeout = '10s';
comment on role lector_tests is
  'Persevera Tests: lee el banco cada noche. Solo SELECT por columnas en las 15 tablas del contenido (A4).';

grant usage on schema public to lector_tests;

-- Las columnas, todas las de A3 menos la rúbrica, el texto del temario y lo que nombre a un usuario.
-- Una columna que no exista hace fallar el GRANT, y no se aplica nada.
grant select (/* columnas de A3 */) on public.oposiciones to lector_tests;
grant select (/* columnas de A3 */) on public.bloques to lector_tests;
grant select (/* columnas de A3, sin prosa del temario */) on public.temas to lector_tests;
grant select (/* columnas de A3, sin prosa del temario */) on public.epigrafes to lector_tests;
grant select (tema_id, epigrafe_id, orden /* comprobar en A3 */) on public.tema_epigrafe to lector_tests;
grant select (/* columnas de A3 */) on public.preguntas to lector_tests;
grant select (/* columnas de A3 */) on public.minicasos to lector_tests;
grant select (/* columnas de A3 */) on public.minicaso_preguntas to lector_tests;
grant select (/* columnas de A3 */) on public.supuestos_originales to lector_tests;
grant select (/* columnas de A3, sin enunciado_examen, respuesta_modelo ni puntos_clave */)
  on public.supuesto_original_preguntas to lector_tests;
grant select (/* columnas de A3 */) on public.supuestos_oficiales to lector_tests;
grant select (/* columnas de A3, sin enunciado_examen, respuesta_modelo ni puntos_clave */)
  on public.supuesto_oficial_preguntas to lector_tests;
grant select (id, oposicion_id, tipo, fuente, convocatoria_fuente, instruccion, frase, tema_id,
              dificultad, estado, created_at /* + es_muestra tras el día D */)
  on public.marcado_items to lector_tests;
grant select (id, item_id, orden, texto, es_incorrecto, forma_correcta, explicacion)
  on public.marcado_unidades to lector_tests;
grant select (id, oposicion_id, tipo, modulo, enunciado, enunciado_svg, opciones, opciones_son_texto,
              correcta, dificultad, estado, created_at /* + explicacion y es_muestra si A3 las trae */)
  on public.psico_items_graficos to lector_tests;
commit;

-- Las políticas: una tabla por transacción (CREATE POLICY bloquea la tabla un instante).
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.oposiciones;
create policy lector_tests_lee on public.oposiciones as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.bloques;
create policy lector_tests_lee on public.bloques as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.temas;
create policy lector_tests_lee on public.temas as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.epigrafes;
create policy lector_tests_lee on public.epigrafes as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.tema_epigrafe;
create policy lector_tests_lee on public.tema_epigrafe as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.preguntas;
create policy lector_tests_lee on public.preguntas as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.minicasos;
create policy lector_tests_lee on public.minicasos as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.minicaso_preguntas;
create policy lector_tests_lee on public.minicaso_preguntas as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.supuestos_originales;
create policy lector_tests_lee on public.supuestos_originales as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.supuesto_original_preguntas;
create policy lector_tests_lee on public.supuesto_original_preguntas as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.supuestos_oficiales;
create policy lector_tests_lee on public.supuestos_oficiales as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.supuesto_oficial_preguntas;
create policy lector_tests_lee on public.supuesto_oficial_preguntas as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.marcado_items;
create policy lector_tests_lee on public.marcado_items as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.marcado_unidades;
create policy lector_tests_lee on public.marcado_unidades as permissive for select to lector_tests using (true);
commit;
begin; set local lock_timeout = '2s';
drop policy if exists lector_tests_lee on public.psico_items_graficos;
create policy lector_tests_lee on public.psico_items_graficos as permissive for select to lector_tests using (true);
commit;

-- Comprobación final: si algo no ha quedado como debe, lo dice y para.
do $$
declare
  v_tablas constant text[] := array['oposiciones','bloques','temas','epigrafes','tema_epigrafe','preguntas',
    'minicasos','minicaso_preguntas','supuestos_originales','supuesto_original_preguntas',
    'supuestos_oficiales','supuesto_oficial_preguntas','marcado_items','marcado_unidades','psico_items_graficos'];
  v_prohibidas constant text[][] := array[
    ['supuesto_original_preguntas','enunciado_examen'], ['supuesto_original_preguntas','respuesta_modelo'],
    ['supuesto_original_preguntas','puntos_clave'],
    ['supuesto_oficial_preguntas','enunciado_examen'], ['supuesto_oficial_preguntas','respuesta_modelo'],
    ['supuesto_oficial_preguntas','puntos_clave']
    /* + las de prosa del temario o de usuario que salgan en A3 */];
  v_mal text := ''; t text; i int; r record;
begin
  foreach t in array v_tablas loop
    if has_table_privilege('lector_tests', 'public.' || t, 'INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') then
      v_mal := v_mal || format(E'\n  %s: lector_tests puede escribir', t);
    end if;
    if not exists (select 1 from pg_policy p
                    where p.polrelid = ('public.' || t)::regclass and p.polname = 'lector_tests_lee'
                      and p.polpermissive and p.polcmd = 'r'
                      and p.polroles = array[(select oid from pg_roles where rolname = 'lector_tests')]::oid[]) then
      v_mal := v_mal || format(E'\n  %s: falta su política lector_tests_lee', t);
    end if;
  end loop;
  for i in 1 .. array_length(v_prohibidas, 1) loop
    if has_column_privilege('lector_tests', 'public.' || v_prohibidas[i][1], v_prohibidas[i][2], 'SELECT') then
      v_mal := v_mal || format(E'\n  %s.%s: lector_tests la puede leer', v_prohibidas[i][1], v_prohibidas[i][2]);
    end if;
  end loop;
  if exists (select 1 from pg_auth_members m where m.member = 'lector_tests'::regrole)
     or pg_has_role('authenticator', 'lector_tests', 'MEMBER') then
    v_mal := v_mal || E'\n  lector_tests es miembro de otro rol, o authenticator puede hacerse lector_tests';
  end if;
  if v_mal <> '' then raise exception 'lector_tests no ha quedado como debe:%', v_mal; end if;
  for r in select c.oid::regclass as tabla
             from pg_class c join pg_namespace n on n.oid = c.relnamespace
            where c.relkind in ('r','v','m','p','f') and n.nspname not in ('pg_catalog','information_schema')
              and has_any_column_privilege('lector_tests', c.oid, 'SELECT')
              and not (n.nspname = 'public' and c.relname = any (v_tablas)) loop
    raise notice 'lector_tests lee % por un GRANT a PUBLIC (no lo da esta migración)', r.tabla;
  end loop;
end $$;
```

## B.2 Ayuda para escribir las columnas

Si la conversación no las quiere sacar a mano de A3, puedes lanzar esta consulta en el SQL Editor de Persevera. Solo lee, y saca los `GRANT` ya escritos con todas las columnas de hoy menos la rúbrica. Después se quitan a mano las de prosa del temario o de usuario que diga A3:

```sql
select format('grant select (%s) on public.%I to lector_tests;',
              string_agg(quote_ident(a.attname), ', ' order by a.attnum), c.relname)
  from pg_class c join pg_namespace n on n.oid = c.relnamespace
  join pg_attribute a on a.attrelid = c.oid and a.attnum > 0 and not a.attisdropped
 where n.nspname = 'public'
   and c.relname = any (array['oposiciones','bloques','temas','epigrafes','tema_epigrafe','preguntas',
     'minicasos','minicaso_preguntas','supuestos_originales','supuesto_original_preguntas',
     'supuestos_oficiales','supuesto_oficial_preguntas','marcado_items','marcado_unidades','psico_items_graficos'])
   and not (c.relname in ('supuesto_original_preguntas','supuesto_oficial_preguntas')
            and a.attname in ('enunciado_examen','respuesta_modelo','puntos_clave'))
 group by c.relname order by c.relname;
```

## B.3 La vuelta atrás

No es una migración: va en `supabase/revertir/` y la lanzas tú en el SQL Editor si hiciera falta. `revoke all` en una tabla quita también los permisos por columna.

```sql
-- NO es una migración. La lanza Álvaro en el SQL Editor si hiciera falta.
-- Lo rápido, sin bloqueos: alter role lector_tests nologin;  (la copia deja de entrar; se deshace con login)
begin; set local lock_timeout = '2s'; drop policy if exists lector_tests_lee on public.oposiciones; commit;
-- … igual con las otras 14 tablas …
revoke all on public.oposiciones, public.bloques, public.temas, public.epigrafes, public.tema_epigrafe,
  public.preguntas, public.minicasos, public.minicaso_preguntas, public.supuestos_originales,
  public.supuesto_original_preguntas, public.supuestos_oficiales, public.supuesto_oficial_preguntas,
  public.marcado_items, public.marcado_unidades, public.psico_items_graficos from lector_tests;
revoke usage on schema public from lector_tests;
drop role lector_tests;
```

---

# Anexo C. Para Claude: por qué estos nombres y qué piden a otras tareas

Este anexo no es para la consola: es para las conversaciones de Tests que escriben el código.

## C.1 Por qué estos nombres

- **`una` es la clave de dentro de la línea, como el tramo en Persevera.** La decisión 5 deja para después un producto «2 oposiciones» en el mismo grupo (guía de decisiones, línea 121; hoja, D6). Con `una` puesto, ese producto será `com.persevera.tests.dos.mensual` y `tests_dos:mensual`, y los dos caben en la misma expresión regular, como en Persevera (`claude/dia-d`, `supabase/functions/_shared/cobro/productos.ts`, líneas 88-89). Con `com.persevera.tests.mensual` a secas, el de dos oposiciones abriría otra forma, como pasó con `premium` y `tarifa`.
- **Apple no deja cambiar ni reutilizar un ID de producto,** y admite hasta 100 caracteres de letras, números, guiones, puntos y guion bajo [Apple campos]. El más largo, `com.persevera.tests.una.semestral`, tiene 33.
- **Google tampoco:** los ID son únicos en la app y no se cambian ni se reutilizan; empiezan por minúscula o número, admiten guion bajo y punto, y tienen 40 caracteres como mucho [Google suscripciones]. Las suscripciones, los planes y las ofertas no se borran [Google ofertas]. El prefijo `tests_` deja claro en RevenueCat, en los registros y en las alertas que el producto es de Tests. RevenueCat dice además que un ID de Google no se puede volver a usar en ninguna de tus apps [RC productos Android].
- **RevenueCat Billing no admite guiones:** hasta 100 caracteres alfanuméricos, puntos o guiones bajos [RC productos web]. Por eso `tests_una_mensual`, con la forma de la clave de búsqueda de Stripe de Persevera (`tarifa_cross_mensual`). Un precio guardado no se cambia: para cambiarlo se crea otro producto, por ejemplo `tests_una_mensual_v2`.
- **Planes base y oferta, iguales que en Persevera** (`mensual`, `semestral`, `anual` y `prueba-7d`), para que lo copiado de `revenuecat.ts` y `decidir.ts` cambie lo mínimo. `PERIODOS` ya trae `P6M` y `P1Y` (`claude/dia-d`, `src/lib/revenuecat.ts`, líneas 123-125).
- **El entitlement, `acceso`, escrito a mano,** para que no se quede con un nombre puesto sin querer, como «Persevera Premium» (`TRAMITE_APPSTORE.md`, línea 38). En Tests el acceso lo decide el servidor (`tiene_acceso`, T2).

Las expresiones para el código (T2 y T13):

```
APPLE  = /^com\.persevera\.tests\.(una|dos)\.(mensual|semestral|anual)$/
GOOGLE = /^tests_(una|dos):(mensual|semestral|anual)$/
WEB    = /^tests_(una|dos)(?:_sinprueba)?_(mensual|semestral|anual)$/
```

Si se crean los productos de Apple sin prueba (10.9), APPLE tiene que admitir también `una_sinprueba`.

**Reservado, sin crear:** `com.persevera.tests.dos.*`, `tests_dos` y `tests_dos_*` (D6); `com.persevera.tests.una_sinprueba.*` (solo si se cierra el hueco de A13).

## C.2 Lo que piden a cada tarea

- **T1:** el `.gitignore` de 9.3 (keystore, `.env.local`, `supabase/.temp/`); el puerto fijo de `npm run dev`, que va en las Redirect URLs (16.4); y, propuesto, una cabecera `X-Robots-Tag: noindex` en `public/_headers` hasta publicar.
- **T2:**
  - la CHECK de `productos_tienda` con las expresiones de C.1;
  - `pruebas_usadas` según lo que salga en el bloque 7. Con la regla de RevenueCat, la prueba web ya es una por usuario de Tests y cruza canales; `pruebas_usadas` añade lo que sobrevive al borrado y, si hay huella, la tarjeta;
  - lo de A.3: UNIQUE parciales, `_jugable` sin `puntos_clave`, claves ajenas aplazables y la clave de `tema_epigrafe`.
- **T10:** la propuesta del anexo A tal como la apruebes; la migración de `copia_banco`; y los pasos de A6 en esta guía.
- **T12:**
  - las rutas de vuelta de 16.4, o añade las suyas a esta guía;
  - las plantillas no pueden cargar el icono del Storage de Persevera (`claude/dia-d`, `supabase/email-templates/confirmar-email.html`, línea 23, y las otras dos): hace falta un bucket público en el Supabase de Tests;
  - el remitente no tiene buzón, así que el texto dice a qué dirección escribir (el correo de soporte);
  - `comprobar-claves.mjs` ya puede estar copiado desde A2; propuesta: que falle si el ref es `rljfcmjvulmjooxoxzxo`.
- **T13:**
  - `RC_BILLING` como tercera tienda, con `environment` `SANDBOX` o `PRODUCTION` [RC eventos];
  - un reembolso web llega como `CANCELLATION` con `cancel_reason: CUSTOMER_SUPPORT`;
  - `sincronizar-compra` tiene que mirar también las compras web en `GET /v1/subscribers/{uid}` (con qué nombre de tienda salen ahí, sin verificar);
  - la cabecera `Authorization` igual a `REVENUECAT_WEBHOOK_SECRET`; la firma HMAC, si se encendió en el bloque 17;
  - lo copiado de Persevera manda desde `Persevera <hola@perseveraoposiciones.com>` por defecto (`claude/dia-d`, `supabase/functions/_shared/cobro/aplicar.ts`, línea 552, y `avisar-renovacion/index.ts`, línea 200). En Tests, `Persevera Tests <avisos@tests.perseveraoposiciones.com>` con `reply_to` al correo de soporte, porque la raíz está en el Resend de Persevera.
- **T14:**
  - en la web hay dos claves públicas, la real y la de sandbox; los nombres propuestos son `VITE_REVENUECAT_WEB_KEY` y `VITE_REVENUECAT_WEB_SANDBOX_KEY`, y T14 los fija;
  - las ofertas se piden por id: `offerings.all["default"]` y `offerings.all["sin_prueba"]` [RC SDK web];
  - para Stripe Tax, el SDK web 1.4.3 o posterior [RC impuestos];
  - «Gestionar suscripción» en la web es el enlace de un solo uso de la API v2, que se pide desde el servidor con la clave v2 [RC API v2 suscripción];
  - el botón de pago no se rotula; `selectedLocale: 'es'` existe [RC localización];
  - en Android, quien ya gastó la prueba compra el plan base sin la oferta `prueba-7d` (hoja, línea 249).
- **T20:** RevenueCat Billing manda sus propios correos de alta y de prueba en las compras web [RC correos]. Hay que decidir si conviven con el de la Ley 10/2025 de Tests (hoja, línea 314). El aviso de renovación de RevenueCat es solo del anual: el de Tests sigue haciendo falta para el semestral.
- **T21:** al borrar la cuenta, la suscripción web se cancela con `actions/cancel`, que la deja hasta el final del periodo; cortarla al momento sería con un reembolso. Borrar el cliente de RevenueCat (clave v2) es asíncrono, y la ayuda no dice qué pasa con sus suscripciones vivas (sin verificar) [RC API v2 cliente].
- **P2:** Resend guarda los datos de la cuenta en EE. UU. aunque envíe desde Irlanda [Resend regiones]. Cloudflare sirve la web. GitHub Actions mueve contenido, no datos personales. Hay que mirar los acuerdos de tratamiento de Supabase, RevenueCat, Resend y Stripe (hoja, línea 519).
- **P4:** la fórmula del art. 98.2 solo cabe en la pantalla previa de Tests.
- **P13:** lo de «Lo que no se hace todavía».

---

# Lo verificado y lo que no

**Verificado el 13-oct-2026:**
- **En el código y los documentos,** con su ruta y su línea en cada paso: `persevera` en 54e448e (`claude/dia-d`) y en 2b3ed1d (`main`), `persevera-oral` en b8e151a y `persevera-web` en d9a5ee5. Solo lectura: ni checkout, ni commit.
- **Con los conectores, solo lectura:** en RevenueCat, los proyectos de la cuenta y el proyecto Persevera (`proj79841c3c`: apps, productos, entitlement, ofertas, webhook y colaboradores) y la facturación de la cuenta; en Stripe, la cuenta `acct_1TXmFMRzkoCyGZtc` (impuestos y registros).
- **En un Postgres 16 de imitación** (no es Supabase): el borrador de A4 aplicado dos veces, la prueba de `lector_tests`, la consulta de permisos, las consultas de A3 salvo la de los `enum` (corregida en 2.4 y sin volver a probar), lo que saca `pg_dump -t`, y la escritura de la copia con su huella. La búsqueda en el catálogo de 15.0 no se ha probado.
- **En la ayuda oficial:** lo que lleva una marca entre corchetes, con su URL abajo.

**No verificado:** está marcado «(sin verificar)», «(estimado)» o «(deducción)» en su paso. Lo que importa para seguir está en «Lo que falta por saber». La API de GitHub respondió para `persevera-oral` (privado, creado el 10-oct-2026), pero dio 403 para `persevera-tests`, porque ese repositorio no está conectado a esta sesión. Eso no dice si existe: lo miras en 1.0.

Esta guía sale de cuatro informes de trabajo del 13-oct-2026 que no están en el repositorio. Cada dato lleva aquí su fuente: la ruta y la línea, la URL, el conector o la prueba en el Postgres de imitación.

## Fuentes de fuera del código

Consultadas el 13-oct-2026. La fecha entre paréntesis es la de la página, cuando la da.

**Apple**
- [Apple campos] https://developer.apple.com/help/app-store-connect/reference/in-app-purchases-and-subscriptions/in-app-purchase-information/
- [Apple App ID] https://developer.apple.com/help/account/identifiers/register-an-app-id/
- [Apple nueva app] https://developer.apple.com/help/app-store-connect/create-an-app-record/add-a-new-app
- [Apple info app] https://developer.apple.com/help/app-store-connect/reference/app-information/app-information
- [Apple sandbox] https://developer.apple.com/help/app-store-connect/test-in-app-purchases/create-a-sandbox-apple-account
- [Apple oferta intro] https://developer.apple.com/help/app-store-connect/manage-subscriptions/set-up-introductory-offers-for-auto-renewable-subscriptions/
- [Apple gracia] https://developer.apple.com/help/app-store-connect/manage-subscriptions/enable-billing-grace-period-for-auto-renewable-subscriptions
- [Apple URL notificaciones] https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/enter-server-urls-for-app-store-server-notifications
- [Apple claves IAP] https://developer.apple.com/help/app-store-connect/configure-in-app-purchase-settings/generate-keys-for-in-app-purchases
- [Apple API ASC] https://developer.apple.com/help/app-store-connect/get-started/app-store-connect-api
- [Apple SBP] https://developer.apple.com/app-store/small-business-program/
- [mjtsai] https://mjtsai.com/blog/2023/02/01/renewing-the-app-store-small-business-program/ (1-feb-2023; blog de un desarrollador, no es de Apple)

**Google Play y Android**
- [Google suscripciones] https://support.google.com/googleplay/android-developer/answer/140504?hl=es
- [Google ofertas] https://support.google.com/googleplay/android-developer/answer/12154973?hl=en
- [Google prueba cerrada] https://support.google.com/googleplay/android-developer/answer/14151465?hl=es
- [Google permisos] https://support.google.com/googleplay/android-developer/answer/9844686
- [Play crear app] https://support.google.com/googleplay/android-developer/answer/9859152?hl=es
- [Play prueba interna] https://support.google.com/googleplay/android-developer/answer/9845334?hl=es
- [Play versión] https://support.google.com/googleplay/android-developer/answer/9859348?hl=es
- [Android verificación] https://developer.android.com/developer-verification/guides/google-play-console (30-sep-2026)
- [Android firma] https://developer.android.com/studio/publish/app-signing (6-mar-2026)
- [Android API] https://developer.android.com/google/play/requirements/target-sdk (1-oct-2026)
- [Android ciclo de vida] https://developer.android.com/google/play/billing/lifecycle/subscriptions (6-oct-2026)
- [Flutter Android] https://docs.flutter.dev/deployment/android (10-sep-2026)
- [Capacitor Android] https://capacitorjs.com/docs/android

**RevenueCat**
- [RC web] https://www.revenuecat.com/docs/web/overview
- [RC precios] https://www.revenuecat.com/pricing/
- [RC productos web] https://www.revenuecat.com/docs/web/web-billing/product-setup
- [RC productos Android] https://www.revenuecat.com/docs/getting-started/entitlements/android-products
- [RC ciclo de vida] https://www.revenuecat.com/docs/web/web-billing/subscription-lifecycle
- [RC impuestos] https://www.revenuecat.com/docs/web/web-billing/tax
- [RC checkout] https://www.revenuecat.com/docs/web/web-billing/checkout
- [RC localización] https://www.revenuecat.com/docs/web/web-billing/localization
- [RC correos] https://www.revenuecat.com/docs/web/web-billing/lifecycle-emails
- [RC conectar Stripe] https://www.revenuecat.com/docs/web/connect-stripe-account
- [RC medios de pago] https://www.revenuecat.com/docs/web/web-billing/payment-methods
- [RC enlaces de compra] https://www.revenuecat.com/docs/web/web-billing/web-purchase-links
- [RC pruebas web] https://www.revenuecat.com/docs/web/web-billing/testing
- [RC SDK web] https://www.revenuecat.com/docs/web/web-billing/web-sdk
- [RC monedas] https://www.revenuecat.com/docs/web/web-billing/multi-currency-support
- [RC eventos] https://www.revenuecat.com/docs/integrations/webhooks/event-types-and-fields
- [RC webhooks] https://www.revenuecat.com/docs/integrations/webhooks
- [RC API v2 suscripción] https://www.revenuecat.com/docs/api-v2/subscription
- [RC API v2 cliente] https://www.revenuecat.com/docs/api-v2/customer
- [RC autenticación] https://www.revenuecat.com/docs/projects/authentication
- [RC restaurar] https://www.revenuecat.com/docs/projects/restore-behavior
- [RC sandbox] https://www.revenuecat.com/docs/projects/sandbox-access
- [RC clave IAP] https://www.revenuecat.com/docs/service-credentials/itunesconnect-app-specific-shared-secret/in-app-purchase-key-configuration
- [RC clave ASC] https://www.revenuecat.com/docs/service-credentials/itunesconnect-app-specific-shared-secret/app-store-connect-api-key-configuration
- [RC notificaciones Apple] https://www.revenuecat.com/docs/platform-resources/server-notifications/apple-server-notifications
- [RC credenciales Google] https://www.revenuecat.com/docs/service-credentials/creating-play-service-credentials
- [RC notificaciones Google] https://www.revenuecat.com/docs/platform-resources/server-notifications/google-server-notifications
- Comunidad de RevenueCat (respuestas del personal de RevenueCat, no es documentación):
  - [RC comunidad productos] https://community.revenuecat.com/general-questions-7/do-i-actually-need-to-create-products-in-stripe-for-rc-web-7049 (31-oct-2025)
  - [RC comunidad Stripe] https://community.revenuecat.com/general-questions-7/selling-my-app-how-do-i-transfer-web-billing-smoothly-7497 (marzo de 2026)
  - [RC comunidad claves] https://community.revenuecat.com/sdks-51/sandbox-grant-entitlement-via-rest-secret-v-sandbox-keys-7475 (25-feb-2026)

**Stripe**
- [Stripe varias cuentas] https://docs.stripe.com/get-started/account/multiple-accounts
- [Stripe organizaciones] https://docs.stripe.com/get-started/account/orgs/build
- [Stripe alta] https://docs.stripe.com/get-started/account/set-up
- [Stripe checklist] https://docs.stripe.com/get-started/account/checklist
- [Stripe impuestos UE] https://docs.stripe.com/tax/supported-countries/european-union y https://docs.stripe.com/tax/registering
- [Stripe precios] https://stripe.com/es/pricing
- [Stripe Tax precios] https://stripe.com/es/tax/pricing
- [Stripe Tax alta] https://docs.stripe.com/tax/set-up
- [Stripe recibos] https://docs.stripe.com/receipts

**Supabase**
- [Supabase conexión] https://supabase.com/docs/guides/database/connecting-to-postgres (13-oct-2026)
- [Supabase volcados] https://supabase.com/docs/guides/platform/migrating-within-supabase/backup-restore (13-oct-2026)
- [Supabase roles] https://supabase.com/docs/guides/database/postgres/roles (12-oct-2026)
- [Supabase claves] https://supabase.com/docs/guides/api/api-keys (13-oct-2026)
- [Supabase GRANT] https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically (28-abr-2026)
- [Supabase copias] https://supabase.com/docs/guides/platform/backups (12-oct-2026)
- [Supabase precios] https://supabase.com/pricing
- [Supabase cómputo] https://supabase.com/docs/guides/platform/manage-your-usage/compute (12-oct-2026)
- [Supabase regiones] https://supabase.com/docs/guides/platform/regions (13-oct-2026)
- [Supabase redirect] https://supabase.com/docs/guides/auth/redirect-urls (12-oct-2026)
- [Supabase SMTP] https://supabase.com/docs/guides/auth/auth-smtp (13-oct-2026)
- [Supabase límites de funciones] https://supabase.com/docs/guides/functions/limits (12-oct-2026)
- [Supabase funciones programadas] https://supabase.com/docs/guides/functions/schedule-functions (12-oct-2026)
- [Supabase Cron] https://supabase.com/docs/guides/cron (13-oct-2026)
- [Supabase IPv4] https://supabase.com/docs/guides/troubleshooting/supabase--your-network-ipv4-and-ipv6-compatibility-cHe3BP.md
- [Supabase contraseña y pooler] https://supabase.com/docs/guides/troubleshooting/supavisor-error-password-authentication-failed-after-password-rotation (12-oct-2026)
- [Supabase postgres_fdw] https://supabase.com/docs/guides/database/extensions/postgres_fdw (8-oct-2026)
- [Supabase webhooks] https://supabase.com/docs/guides/database/webhooks
- El error del pooler con `VALID UNTIL` (en el encargo de 15.1): https://supabase.com/docs/guides/troubleshooting/supavisor-connection-error-fatal-eauthquery-unsupported-or-invalid-secret-format-d23dd4

**PostgreSQL y Homebrew**
- [pg_dump] https://www.postgresql.org/docs/current/app-pgdump.html (documentación de la 18.6)
- [pg_dump código] https://raw.githubusercontent.com/postgres/postgres/REL_17_STABLE/src/bin/pg_dump/pg_dump.c
- [psql] https://www.postgresql.org/docs/current/app-psql.html (la orden `\password`)
- [Postgres 17.6] https://www.postgresql.org/docs/release/17.6/ (14-ago-2025)
- [Homebrew libpq] https://formulae.brew.sh/formula/libpq

**GitHub**
- [GitHub crear] https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- [gh repo create] https://cli.github.com/manual/gh_repo_create
- [gh secret set] https://cli.github.com/manual/gh_secret_set
- [gh variable set] https://cli.github.com/manual/gh_variable_set
- [GitHub sintaxis] https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax (sin fecha)
- [GitHub programadas] https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
- [GitHub minutos] https://docs.github.com/en/billing/concepts/product-billing/github-actions

**Resend**
- [Resend dominios] https://resend.com/docs/dashboard/domains/introduction
- [Resend claim] https://www.resend.com/docs/dashboard/domains/claim
- [Resend equipos] https://www.resend.com/docs/dashboard/settings/team
- [Resend precios] https://resend.com/pricing
- [Resend regiones] https://resend.com/docs/dashboard/domains/regions
- [Resend Cloudflare] https://resend.com/docs/guides/dns/cloudflare
- [Resend DMARC] https://resend.com/docs/dashboard/domains/dmarc
- [Resend claves] https://resend.com/docs/dashboard/api-keys/introduction
- [Resend claves API] https://resend.com/docs/api-reference/api-keys/create-api-key
- [Resend SMTP] https://resend.com/docs/send-with-smtp
- [Resend con Supabase] https://www.resend.com/docs/send-with-supabase-smtp

**Cloudflare y DNS**
- [CF dominios] https://developers.cloudflare.com/pages/configuration/custom-domains/ (21-abr-2026)
- [CF subida directa] https://developers.cloudflare.com/pages/get-started/direct-upload/ (21-abr-2026)
- [wrangler pages] https://developers.cloudflare.com/workers/wrangler/commands/pages/ (23-abr-2026)
- [RFC 1034] https://datatracker.ietf.org/doc/html/rfc1034#section-3.6.2
- [RFC 7489] https://datatracker.ietf.org/doc/html/rfc7489#section-6.6.3

---

# Lo que falta por saber

1. **Que la redirección del correo de soporte sigue funcionando.** Blanca eligió `hola@perseveraoposiciones.com` el 13-oct-2026, que se redirige a `hola@brooksoo.com`. Antes de publicar, se comprueba que un correo a esa dirección llega (hoja, línea 559). Lo nombran los datos públicos de Stripe (3.3), Play Console (9.2), RevenueCat Billing (13.4), las plantillas de T12, el `reply_to` de T13, T19 y T20, y P1 y P2.
2. **Si el repositorio `PabloAlgabaGranado/persevera-tests` ya existe.** Desde aquí no se pudo mirar: no está conectado a esta sesión. Lo miras en 1.0.
3. **Las comprobaciones de A13 que no tienen respuesta en la ayuda:**
   - si se puede leer la huella de la tarjeta en el Stripe de Tests, y con qué id se casa con un evento (bloque 7);
   - confirmar en la primera factura de Stripe que Stripe Tax cobra 0,45 € por cobro web, como se espera (4.2);
   - si «Restore behavior» y el acceso de sandbox afectan a las compras web;
   - si los correos obligatorios de RevenueCat Billing se pueden apagar, y en qué idioma salen;
   - si se pueden hacer reembolsos parciales, y qué pasa si se reembolsa desde Stripe;
   - con qué nombre de tienda salen las compras web en `GET /v1/subscribers/{uid}`;
   - si el asistente del proyecto nuevo pide el entitlement y crea la oferta `default`;
   - si la prueba web se elige como «7 días» o como «1 semana»;
   - si Stripe manda sus propios recibos en estos cobros;
   - si un enlace de compra web se puede borrar o desactivar (7.5);
   - qué clave pública usar para el sandbox si hay dos configuraciones web (13.8; es una deducción);
   - que la prueba no se repita entre canales con el mismo usuario (se ve en P5).
4. **De Apple y Google:**
   - tu rol en Apple: registrar el App ID y generar las dos claves de 5.4 piden Account Holder o Admin, y el documento del dominio propio dice que la cuenta buena es la de tu hermano (`claude/dia-d`, `docs/dominio-propio-supabase.md`, líneas 225-226; 5.0);
   - si la oferta de introducción admite «Sin fecha de fin»;
   - si App Review pone pegas a tres productos sin prueba al mismo precio (10.9);
   - si la cuenta está en el Small Business Program: no hay pantalla que lo diga (5.5);
   - que 9,99, 46,99 y 79,99 estén en la rejilla de precios de Apple (sale de la regla de la guía del día D, línea 604);
   - si «Persevera Tests» se ve entero bajo el icono del iPhone;
   - si RevenueCat valida con los permisos de la app de Tests (salida b de 11.6) o hacen falta los de la cuenta (salida a), y si una cuenta de servicio puede servir a dos apps;
   - dónde se ve en Play Console si la cuenta es personal o de organización, y si pide prueba cerrada;
   - el periodo de gracia de Google en Persevera: `TRAMITE_GOOGLEPLAY.md` (línea 40) dice 14 días y RevenueCat da 7;
   - si Google pide de verdad un AAB antes de las suscripciones: lo dicen Persevera y RevenueCat, pero no la ayuda de Google;
   - la ruta de `keytool` dentro de Android Studio y los valores de `versionCode` y `versionName` que pone `npx cap add android`;
   - los rótulos en español de Apple, Google Play y RevenueCat.
5. **De la web y el correo:**
   - el DNS de hoy: los NS, si `tests.` está libre, los CAA y el DMARC de la raíz (6.0 y 8.0);
   - en qué cuenta de Cloudflare está `persevera-app`, si puedes editar el DNS de la zona, y si el CNAME entre dos cuentas va con proxy o sin él;
   - si `persevera-tests.pages.dev` está libre;
   - si Resend deja a otro equipo añadir un subdominio de un dominio que está en el equipo de Persevera;
   - quién es el dueño del Resend de Persevera y desde qué región envía;
   - si el SMTP de Resend acepta una clave de solo enviar, y si la pantalla de SMTP de Supabase tiene un campo para las respuestas;
   - si el seguimiento de clics de Resend rompe los enlaces de Auth (deducción);
   - si Stripe acepta la verificación antes de que cargue `tests.perseveraoposiciones.com`.
6. **De la base y la copia:**
   - si tienes la contraseña de la base de Persevera: sin ella, A3 se para (2.0);
   - si la búsqueda en el catálogo de 15.0 saca los dos Database Webhooks con su secreto, y qué se hace entonces: guardarlo de otra forma en Persevera o aceptar el riesgo por escrito;
   - el esquema real de las tablas creadas fuera de las migraciones: es A3, y el borrador de A4 lleva sus columnas como huecos;
   - en qué organización de Supabase está Persevera, con qué plan y qué cómputo, y por tanto el coste exacto de añadir Tests;
   - los rótulos del alta de un proyecto en el panel de Supabase de hoy;
   - si un `ALTER ROLE … PASSWORD` escrito en el SQL Editor queda en su historial o en los registros (por eso `\password`);
   - si en el `public` de Supabase PUBLIC tiene `USAGE` (el borrador lo da a `lector_tests` igualmente);
   - si el cliente `pg` de Node valida el certificado del pooler con el de Supabase;
   - el tamaño real del banco y lo que tarda la copia: lo mide A6, y de eso depende la opción B;
   - si los repos privados también apagan los cron tras 60 días sin actividad, y desde cuándo existe la clave `timezone` de GitHub (la página no tiene fecha).
7. **Para el gestor y el abogado:**
   - **Facturas con NIF.** RevenueCat Billing solo emite recibos y facturas sin el NIF del cliente, y Persevera hoy deja ponerlo. ¿Hace falta dar factura completa a quien la pida, y cómo se emite fuera de RevenueCat?
   - **El umbral de 10.000 €** de ventas a consumidores de otros países de la UE es de Brooks & Oo, sumando la web de Persevera y la de Tests, y Stripe lo vigila por cuenta. ¿Sigue valiendo la opción de pequeño vendedor en las dos cuentas, y quién vigila la suma?
   - **Si el aviso de la Ley 10/2025 alcanza a la prueba,** abierta en Persevera, vale también aquí (hoja, línea 511).
   - **P4:** si basta la fórmula del art. 98.2 en la pantalla previa, ya que el botón de RevenueCat Billing no se rotula.
   - **P2:** Resend guarda los datos de la cuenta en EE. UU.
8. **Lo que decides tú, además de A5:**
   - dónde va la carpeta en el Mac (propuesto: `/Users/alvaroalgaba/Developer/persevera-tests`, fuera de iCloud);
   - claves nuevas de Apple para Tests o las de Persevera (5.4);
   - los permisos de la cuenta de servicio de Google: (a) los de la cuenta, como dice RevenueCat, o (b) solo los de la app (11.6; propuesto: b);
   - el periodo de gracia de Apple (10.6), y el de Google y la web;
   - los productos de Apple sin prueba (10.9; propuesto: ahora no);
   - la firma HMAC del webhook, con T13 (bloque 17);
   - en qué organización de Supabase va Tests, y si quieres PITR (bloque 16);
   - un dominio propio para el Supabase de Tests, 10 $ al mes con plan de pago, para que los enlaces de los correos no enseñen `<ref>.supabase.co`, que en Persevera «se lee como una estafa» (`claude/dia-d`, `docs/dominio-propio-supabase.md`, líneas 77 y 533);
   - los nombres visibles y la descripción de los productos, que son propuestos.
9. **Para Blanca:** Stripe Tax se lleva 0,45 € de cada cobro web: un 4,5 % del mensual, frente al 1 % del semestral y el 0,6 % del anual (4.2).

---

# Lo que deja T2 para A6

T2 (13-oct-2026) dejó el esquema de Tests en `supabase/migrations/`, probado solo en local con `npm run probar:esquema`. No está aplicado en ningún Supabase. Esto es lo suyo en A6; el resto de A6 lo añade T10.

1. **No subas las migraciones antes de T10.** Van todas juntas con las de T10 en el mismo `supabase db push` de A6. Las tablas del contenido llevan RLS sin políticas, y la app no vería ninguna pregunta hasta que T10 ponga las suyas.
2. **El catálogo, después de la primera copia buena.** `catalogo_tests` dice qué oposiciones ofrece Tests y en qué orden, y su clave ajena pide que la oposición ya exista. En el SQL Editor de Tests (el orden es una propuesta, Blanca puede cambiarlo):
   ```sql
   insert into public.catalogo_tests (oposicion_id, orden) values
     ('1fd3dcce-78b1-423c-bbcb-3c0649eda113', 1),  -- Administrativo del Estado
     ('bed5cc28-f50a-44fb-9229-a347030dcd56', 2),  -- Administrativo de la Seguridad Social
     ('1a415277-3259-468b-9e2f-df5ff59aa562', 3),  -- Agente de Hacienda
     ('d1da10aa-7671-4684-9445-727504e7baf1', 4),  -- Auxiliar Administrativo del Estado
     ('693d45f5-e110-416f-9c9f-72d58b5778c9', 5);  -- Guardia Civil
   select c.orden, o.nombre from public.catalogo_tests c join public.oposiciones o on o.id = c.oposicion_id order by 1;
   ```
   Tienen que salir los cinco nombres. Si alguno falta, la copia no trajo esa oposición: no sigas y dilo en la conversación.
3. **La versión mínima** arranca en 0.0.0 en iOS y Android, así que no obliga a nadie. No hay que hacer nada.
4. **Los términos, cuando P1 los publique.** Hasta entonces, `registrar_aceptacion` no apunta nada y da error. Con la versión que diga P1:
   ```sql
   insert into public.version_terminos (version) values ('<versión de P1>');
   ```
5. **Las cuentas de prueba, cuando T12 las cree.** Solo ellas cuentan las compras de sandbox. Con el id de cada una (en Authentication del panel de Tests):
   ```sql
   insert into public.cuentas_de_prueba (user_id, tipo, nota, caduca_at) values
     ('<id>', 'revisor', 'revisor de Apple', '<fecha de fin de la revisión>');  -- o 'qa', sin caduca_at
   ```
   Después, el ajuste de RevenueCat a «Allowed App User IDs only» con esos mismos ids (12.3).
