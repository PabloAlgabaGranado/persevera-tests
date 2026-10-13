-- =============================================================================
-- PERSEVERA TESTS: la oposición de cada uno, el cobro y el acceso (T2)
-- =============================================================================
-- Escrita el 13-oct-2026. Probada solo en local (scripts/probar-esquema.mjs, con
-- PGlite). No está aplicada en ningún Supabase: la aplica Álvaro en A6, con las
-- demás, después de T10.
--
-- Lo que guarda, en una línea por tabla:
--   catalogo_tests         qué oposiciones se ofrecen, en qué orden y desde cuándo
--   eleccion_oposicion     la oposición de cada usuario (plaza 1)
--   cambios_oposicion      el historial de esas elecciones
--   productos_tienda       los productos de Apple, Google y la web, con su importe
--   suscripciones          una fila por compra, la escriben los webhooks
--   cuentas_de_prueba      las cuentas que pueden usar el sandbox (revisor y qa)
--   pruebas_usadas         quién ha gastado la prueba de 7 días, en cualquier canal
--   eventos_pago           cada aviso de RevenueCat, tal como llega
--   version_terminos       la versión vigente de los términos (una fila)
--   aceptaciones_terminos  quién aceptó qué versión, cuándo y dónde
--   avisos_renovacion      los avisos de renovación ya enviados (T20)
-- Y las funciones tiene_acceso(usuario, oposicion), prueba_disponible() y
-- registrar_aceptacion(canal, origen).
--
-- De dónde sale (copiar, nunca mover; todo de solo lectura):
--   - suscripciones, de persevera-oral (main, b8e151a),
--     supabase/migrations/20261008120000_esquema_inicial.sql, líneas 1478-1542.
--     Cambiado: la columna del usuario es user_id; plataforma web (RevenueCat
--     Billing) en vez de stripe; entorno, duracion, en_prueba y renueva nuevos;
--     el estado «prueba» pasa a la columna en_prueba; las fechas, creada_at y
--     actualizada_at; el producto tiene que estar en productos_tienda; 24 horas
--     de margen al renovar, como el contrato del día D.
--   - cuentas_de_prueba, tipo_cuenta_de_prueba y soy_cuenta_de_prueba,
--     cambios_oposicion, productos_tienda, eventos_pago y aceptaciones_terminos,
--     de persevera (claude/dia-d, 54e448e),
--     supabase/migrations/20261005090000_cobro_1_catalogo_contrato.sql, líneas
--     183-270, 384-422 y 451-464. Cambiado: cambios_oposicion va por usuario y
--     plaza, sin suscripción, con los motivos de Tests; productos_tienda, con los
--     identificadores de la guía de consolas (anexo C.1) y sin tramos;
--     eventos_pago, solo de RevenueCat; aceptaciones_terminos, sin el origen
--     «stripe»; pruebas_usadas sale de huellas_prueba (línea 396).
--   - registrar_aceptacion, de 20261005091000_cobro_2_rpc.sql (claude/dia-d),
--     líneas 437-463. Cambiado: la versión sale de version_terminos, porque
--     Tests no tiene interruptor_tarifas.
--   - avisos_renovacion, de 20261002150000_avisos_renovacion.sql (claude/dia-d),
--     solo la tabla (líneas 110-130). Cambiado: plataforma web en vez de stripe y
--     duración semestral o anual. El cron y la función son de T20.
--
-- QUIÉN ESCRIBE QUÉ. La app entra con la clave publicable (anon sin sesión,
-- authenticated con sesión). Los webhooks y las funciones del servidor, con la
-- secreta (service_role, que se salta la RLS). Todo lo de esta migración lo
-- escribe solo el servidor, o una función SECURITY DEFINER: la app lee lo suyo
-- y nada más. Los disparadores solo_servidor son la segunda cerradura, por si
-- algún día alguien da un GRANT de más.
--
-- PERMISOS. Como en Oral: a cada tabla se le quita todo (también lo que Supabase
-- daba solo hasta el 30-oct-2026) y se da lo justo; a service_role, siempre
-- leer, crear, cambiar y borrar. Cada función se cierra a PUBLIC y a anon.
-- =============================================================================


-- =============================================================================
-- 1. LA OPOSICIÓN DE CADA USUARIO
-- =============================================================================

-- Qué oposiciones se ofrecen. Es de Tests: la copia del banco no la toca. El
-- onboarding (T15) la lee, así que una oposición nueva entra sin publicar otra
-- versión. Una fila con «desde» en el futuro todavía no se ve. Se carga en A6,
-- después de la primera copia (la clave ajena pide que la oposición exista).
create table public.catalogo_tests (
  oposicion_id  uuid primary key references public.oposiciones (id),
  orden         smallint not null check (orden >= 1),
  desde         timestamptz not null default now(),
  creada_at     timestamptz not null default now(),
  constraint catalogo_tests_orden_unico unique (orden) deferrable initially deferred
);

create trigger solo_servidor before insert or update or delete on public.catalogo_tests
  for each row execute function public.solo_servidor();

alter table public.catalogo_tests enable row level security;
create policy catalogo_tests_ver on public.catalogo_tests
  for select to authenticated using (desde <= now());

revoke all on public.catalogo_tests from public, anon, authenticated, service_role;
grant select on public.catalogo_tests to authenticated;
grant select, insert, update, delete on public.catalogo_tests to service_role;

-- La oposición de cada usuario. Una suscripción da una oposición (decisión del
-- 13-oct-2026), así que hay una sola plaza; la 2 queda para «Añadir otra» (D6),
-- que la abrirá en su migración junto con tiene_acceso. La app la lee y nunca
-- la escribe: la cambia la función de T17 (SECURITY DEFINER).
--   elegida_at                  cuándo se eligió la oposición de ahora
--   ultimo_cambio_que_cuenta_at el último cambio que gasta los 30 días; la
--                               primera elección, los cambios en la prueba y los
--                               de quien no paga no cuentan (T17)
create table public.eleccion_oposicion (
  user_id                      uuid not null references auth.users (id) on delete cascade,
  plaza                        smallint not null default 1 constraint eleccion_oposicion_una_plaza check (plaza = 1),
  oposicion_id                 uuid not null references public.oposiciones (id),
  elegida_at                   timestamptz not null default now(),
  ultimo_cambio_que_cuenta_at  timestamptz,
  primary key (user_id, plaza)
);

create trigger solo_servidor before insert or update or delete on public.eleccion_oposicion
  for each row execute function public.solo_servidor();

alter table public.eleccion_oposicion enable row level security;
create policy eleccion_oposicion_ver on public.eleccion_oposicion
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on public.eleccion_oposicion from public, anon, authenticated, service_role;
grant select on public.eleccion_oposicion to authenticated;
grant select, insert, update, delete on public.eleccion_oposicion to service_role;

-- El historial: una fila por elección o cambio. Solo el servidor.
create table public.cambios_oposicion (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  plaza         smallint not null default 1 check (plaza = 1),
  de_oposicion  uuid references public.oposiciones (id),       -- null en la primera elección
  a_oposicion   uuid not null references public.oposiciones (id),
  cuenta        boolean not null,                               -- si gasta el cambio de los 30 días
  motivo        text not null check (motivo in ('eleccion_inicial', 'cambio', 'exento_prueba', 'exento_sin_pago', 'soporte')),
  creado_at     timestamptz not null default now(),
  -- Solo un cambio con pago gasta los 30 días; soporte decide en cada caso
  constraint cambios_oposicion_cuenta_segun_motivo check (motivo = 'soporte' or cuenta = (motivo = 'cambio'))
);
create index cambios_oposicion_usuario on public.cambios_oposicion (user_id, creado_at desc);

create trigger solo_servidor before insert or update or delete on public.cambios_oposicion
  for each row execute function public.solo_servidor();

alter table public.cambios_oposicion enable row level security;
revoke all on public.cambios_oposicion from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.cambios_oposicion to service_role;


-- =============================================================================
-- 2. LOS PRODUCTOS
-- =============================================================================
-- Los identificadores son los de la guía de consolas (tabla del principio y
-- anexo C.1), los mismos que Álvaro crea en las tiendas y en RevenueCat. Una
-- compra de un producto que no esté aquí no entra en suscripciones: el webhook
-- da 500 y avisa (T13). El importe es el que dice el aviso de renovación (T20).
-- Los de «dos» oposiciones (D6) caben en la CHECK, pero no se crean.
create table public.productos_tienda (
  plataforma        text not null check (plataforma in ('apple', 'google', 'web')),
  product_id        text not null,
  duracion          text not null check (duracion in ('mensual', 'semestral', 'anual')),
  importe_centimos  integer not null check (importe_centimos > 0),
  primary key (plataforma, product_id),
  constraint productos_tienda_id_valido check (
       (plataforma = 'apple'  and product_id ~ '^com\.persevera\.tests\.(una|dos)\.(mensual|semestral|anual)$')
    or (plataforma = 'google' and product_id ~ '^tests_(una|dos):(mensual|semestral|anual)$')
    or (plataforma = 'web'    and product_id ~ '^tests_(una|dos)(_sinprueba)?_(mensual|semestral|anual)$')),
  constraint productos_tienda_duracion_del_id check (product_id ~ ('[.:_]' || duracion || '$')),
  -- para la clave ajena de suscripciones, que comprueba también la duración
  constraint productos_tienda_con_duracion unique (plataforma, product_id, duracion)
);

insert into public.productos_tienda (plataforma, product_id, duracion, importe_centimos) values
  ('apple',  'com.persevera.tests.una.mensual',   'mensual',    999),
  ('apple',  'com.persevera.tests.una.semestral', 'semestral', 4699),
  ('apple',  'com.persevera.tests.una.anual',     'anual',     7999),
  ('google', 'tests_una:mensual',                 'mensual',    999),
  ('google', 'tests_una:semestral',               'semestral', 4699),
  ('google', 'tests_una:anual',                   'anual',     7999),
  ('web',    'tests_una_mensual',                 'mensual',    999),
  ('web',    'tests_una_semestral',               'semestral', 4699),
  ('web',    'tests_una_anual',                   'anual',     7999),
  ('web',    'tests_una_sinprueba_mensual',       'mensual',    999),
  ('web',    'tests_una_sinprueba_semestral',     'semestral', 4699),
  ('web',    'tests_una_sinprueba_anual',         'anual',     7999);

create trigger solo_servidor before insert or update or delete on public.productos_tienda
  for each row execute function public.solo_servidor();

alter table public.productos_tienda enable row level security;
revoke all on public.productos_tienda from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.productos_tienda to service_role;


-- =============================================================================
-- 3. LAS SUSCRIPCIONES
-- =============================================================================
-- Una fila por compra: Apple, Google y la web llegan todas por RevenueCat (la web
-- cobra con RevenueCat Billing sobre el Stripe de Tests). Las escribe el webhook
-- (T13) con la clave secreta; el usuario solo lee las suyas.
-- Estados que dan acceso, hasta fin_periodo: activa, gracia (cobro fallido, la
-- tienda aún da acceso) y cancelada (no se renueva, pero está pagada hasta
-- fin_periodo). Estados que no: pausada, caducada, reembolsada. La prueba de 7
-- días es una fila activa con en_prueba.
-- Un estado que da acceso lleva siempre fecha de fin: si un webhook la deja
-- vacía por un error de mapeo, la fila no entra. La única excepción es un acceso
-- 'manual' 'activa' sin fecha, que se da a mano y a propósito.
-- Una fila de sandbox solo da acceso a las cuentas de cuentas_de_prueba, y solo
-- ellas la ven (como «ver mis suscripciones» en el día D).
create table public.suscripciones (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  plataforma       text not null check (plataforma in ('apple', 'google', 'web', 'manual')),
  entorno          text not null default 'produccion' check (entorno in ('produccion', 'sandbox')),
  -- el producto y su duración, de productos_tienda; en una manual, los dos nulos
  producto         text,
  duracion         text check (duracion in ('mensual', 'semestral', 'anual')),
  estado           text not null check (estado in ('activa', 'gracia', 'cancelada', 'pausada', 'caducada', 'reembolsada')),
  en_prueba        boolean not null default false,
  renueva          boolean,                       -- null: no se sabe
  inicio           timestamptz,
  fin_periodo      timestamptz,
  -- la compra en la tienda (original_transaction_id de Apple, token de compra de
  -- Google, la suscripción de RevenueCat Billing): el webhook actualiza por aquí
  id_externo       text not null check (char_length(btrim(id_externo)) >= 1),
  -- el cliente en RevenueCat (app_user_id)
  cliente_externo  text,
  creada_at        timestamptz not null default now(),
  actualizada_at   timestamptz not null default now(),
  constraint suscripciones_compra unique (plataforma, id_externo),
  constraint suscripciones_producto_conocido foreign key (plataforma, producto, duracion)
    references public.productos_tienda (plataforma, product_id, duracion),
  constraint suscripciones_producto_de_tienda check (
    case when plataforma = 'manual' then producto is null and duracion is null and entorno = 'produccion' and not en_prueba
         else producto is not null and duracion is not null end),
  constraint suscripciones_con_fin check (fin_periodo is not null
    or estado in ('pausada', 'caducada', 'reembolsada')
    or (plataforma = 'manual' and estado = 'activa'))
);
create index suscripciones_usuario on public.suscripciones (user_id, estado);

create trigger fechas_fijas before insert or update on public.suscripciones
  for each row execute function public.fechas_fijas();
create trigger solo_servidor before insert or update or delete on public.suscripciones
  for each row execute function public.solo_servidor();


-- =============================================================================
-- 4. LAS CUENTAS DE PRUEBA
-- =============================================================================
-- revisor: compra en sandbox y con eso tiene acceso (el revisor de Apple, la
--          cuenta demo).
-- qa:      lo mismo, para las pruebas del equipo.
-- Solo el servidor: se dan de alta a mano, desde el SQL Editor.
create table public.cuentas_de_prueba (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  tipo       text not null check (tipo in ('revisor', 'qa')),
  nota       text,
  creada_at  timestamptz not null default now(),
  caduca_at  timestamptz                               -- revisor: mientras dura la revisión
);

create trigger solo_servidor before insert or update or delete on public.cuentas_de_prueba
  for each row execute function public.solo_servidor();

alter table public.cuentas_de_prueba enable row level security;
revoke all on public.cuentas_de_prueba from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.cuentas_de_prueba to service_role;

create function public.tipo_cuenta_de_prueba(p_uid uuid) returns text
language sql stable security definer set search_path = '' as $$
  select c.tipo from public.cuentas_de_prueba c
   where c.user_id = p_uid and (c.caduca_at is null or c.caduca_at > now())
$$;
revoke all on function public.tipo_cuenta_de_prueba(uuid) from public, anon, authenticated, service_role;
grant execute on function public.tipo_cuenta_de_prueba(uuid) to service_role;

create function public.soy_cuenta_de_prueba() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.tipo_cuenta_de_prueba((select auth.uid())) is not null
$$;
revoke all on function public.soy_cuenta_de_prueba() from public, anon, authenticated, service_role;
grant execute on function public.soy_cuenta_de_prueba() to authenticated, service_role;

-- Ahora que existe soy_cuenta_de_prueba: cada uno lee sus suscripciones, y las
-- de sandbox solo si es una cuenta de prueba.
alter table public.suscripciones enable row level security;
create policy suscripciones_ver on public.suscripciones
  for select to authenticated
  using (user_id = (select auth.uid()) and (entorno = 'produccion' or (select public.soy_cuenta_de_prueba())));

revoke all on public.suscripciones from public, anon, authenticated, service_role;
grant select on public.suscripciones to authenticated;
grant select, insert, update, delete on public.suscripciones to service_role;


-- =============================================================================
-- 5. EL ACCESO
-- =============================================================================
-- ¿Puede este usuario practicar esta oposición entera ahora? Sí, si es la que
-- eligió (eleccion_oposicion, plaza 1) y tiene una suscripción vigente:
--   - activa, gracia o cancelada, con fin_periodo en el futuro; o con 24 horas
--     de margen en las tres tiendas, por si el aviso de la renovación llega
--     tarde (como el contrato del día D, cobro_1, líneas 451-464); o 'manual'
--     'activa' sin fecha;
--   - de producción, o de sandbox si es una cuenta de prueba.
-- Sin fecha de fin no hay acceso, salvo la manual (falla cerrada, aunque alguien
-- quite la CHECK suscripciones_con_fin).
-- La usan la app (T5) y la RLS del contenido (T10). Es SECURITY DEFINER porque
-- lee cuentas_de_prueba, que la app no ve. Por eso mismo, con sesión solo
-- contesta de uno mismo: preguntar por otro usuario da false, para que nadie
-- sepa si otra cuenta paga. Sin sesión (el servidor) contesta de cualquiera.
create function public.tiene_acceso(p_usuario uuid, p_oposicion uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when p_usuario is null or p_oposicion is null then false
    when (select auth.uid()) is not null and p_usuario <> (select auth.uid()) then false
    else exists (
           select 1 from public.eleccion_oposicion e
            where e.user_id = p_usuario and e.plaza = 1 and e.oposicion_id = p_oposicion)
     and exists (
           select 1 from public.suscripciones s
            where s.user_id = p_usuario
              and s.estado in ('activa', 'gracia', 'cancelada')
              and (s.fin_periodo > now()
                   or (s.plataforma <> 'manual' and s.fin_periodo > now() - interval '24 hours')
                   or (s.fin_periodo is null and s.plataforma = 'manual' and s.estado = 'activa'))
              and (s.entorno = 'produccion' or public.tipo_cuenta_de_prueba(p_usuario) is not null))
  end
$$;
revoke all on function public.tiene_acceso(uuid, uuid) from public, anon, authenticated, service_role;
grant execute on function public.tiene_acceso(uuid, uuid) to authenticated, service_role;


-- =============================================================================
-- 6. LA PRUEBA DE 7 DÍAS: UNA POR PERSONA, EN CUALQUIER CANAL
-- =============================================================================
-- Una fila por prueba empezada, en cualquier canal. La escribe el webhook (T13)
-- al ver la compra con prueba. Si se borra la cuenta, la fila se queda sin
-- usuario: lo que impide repetir la prueba sobrevive al borrado, como
-- huellas_prueba en el día D (cobro_1, línea 396). En Apple y Google la tienda
-- ya da una prueba por cuenta de la tienda; en la web, RevenueCat da una por
-- usuario de Tests, así que quien borra la cuenta y abre otra la tendría otra
-- vez. Para eso está la huella de la tarjeta, si el bloque 7 de la guía de
-- consolas (A13) dice que se puede leer: no da el nombre, pero es un dato
-- seudónimo, y P2 lo declara. Hasta saberlo, huella_tarjeta queda vacía.
create table public.pruebas_usadas (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid references auth.users (id) on delete set null,
  plataforma      text not null check (plataforma in ('apple', 'google', 'web')),
  entorno         text not null default 'produccion' check (entorno in ('produccion', 'sandbox')),
  id_externo      text not null check (char_length(btrim(id_externo)) >= 1),  -- la compra con la que empezó
  huella_tarjeta  text,
  empezada_at     timestamptz not null default now(),
  constraint pruebas_usadas_compra unique (plataforma, id_externo),
  -- la huella de la tarjeta solo existe en la web
  constraint pruebas_usadas_huella_solo_web check (huella_tarjeta is null or plataforma = 'web')
);
create index pruebas_usadas_usuario on public.pruebas_usadas (user_id) where user_id is not null;
create index pruebas_usadas_huella on public.pruebas_usadas (huella_tarjeta) where huella_tarjeta is not null;

create trigger solo_servidor before insert or update or delete on public.pruebas_usadas
  for each row execute function public.solo_servidor();

alter table public.pruebas_usadas enable row level security;
revoke all on public.pruebas_usadas from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.pruebas_usadas to service_role;

-- ¿Se le puede ofrecer la prueba a quien pregunta? (T14). No, si ya empezó una
-- o si ya tuvo una suscripción de tienda, en cualquier canal: es la regla de
-- RevenueCat («Didn't have any subscription yet»), que cuenta todas las apps del
-- proyecto. Lo de sandbox solo cuenta para las cuentas de prueba, que son las
-- únicas a las que da acceso. Sin sesión, false.
create function public.prueba_disponible() returns boolean
language sql stable security definer set search_path = '' as $$
  with yo as (
    select (select auth.uid()) as uid,
           public.tipo_cuenta_de_prueba((select auth.uid())) is not null as de_prueba)
  select yo.uid is not null
     and not exists (select 1 from public.pruebas_usadas p
                      where p.user_id = yo.uid and (p.entorno = 'produccion' or yo.de_prueba))
     and not exists (select 1 from public.suscripciones s
                      where s.user_id = yo.uid and s.plataforma <> 'manual'
                        and (s.entorno = 'produccion' or yo.de_prueba))
    from yo
$$;
revoke all on function public.prueba_disponible() from public, anon, authenticated, service_role;
grant execute on function public.prueba_disponible() to authenticated, service_role;


-- =============================================================================
-- 7. LOS AVISOS DE PAGO
-- =============================================================================
-- Cada aviso de RevenueCat, tal como llega (T13). Un reintento suma intentos y
-- uno ya procesado se contesta sin hacer nada. user_id va sin clave ajena, como
-- en el día D: qué hacer con estas filas al borrar la cuenta lo decide T21.
create table public.eventos_pago (
  fuente        text not null check (fuente in ('revenuecat')),
  evento_id     text not null,
  tipo          text not null,
  user_id       uuid,
  entorno       text,
  recibido_at   timestamptz not null default now(),
  procesado_at  timestamptz,
  intentos      integer not null default 1,
  error         text,
  payload       jsonb not null,
  primary key (fuente, evento_id)
);

create trigger solo_servidor before insert or update or delete on public.eventos_pago
  for each row execute function public.solo_servidor();

alter table public.eventos_pago enable row level security;
revoke all on public.eventos_pago from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.eventos_pago to service_role;


-- =============================================================================
-- 8. LOS TÉRMINOS
-- =============================================================================
-- La versión vigente, una sola fila. La pone el servidor cuando se publican los
-- términos (P1); hasta entonces no hay ninguna y registrar_aceptacion no apunta
-- nada. Ningún binario la lleva escrita.
create table public.version_terminos (
  id            boolean primary key default true check (id),
  version       text not null check (char_length(btrim(version)) between 1 and 40),
  publicada_at  timestamptz not null default now()
);

create trigger solo_servidor before insert or update or delete on public.version_terminos
  for each row execute function public.solo_servidor();

alter table public.version_terminos enable row level security;
revoke all on public.version_terminos from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.version_terminos to service_role;

-- Quién aceptó qué versión, cuándo y desde dónde: al registrarse y, antes de
-- pagar, en el paywall («muro»). Solo la escribe registrar_aceptacion.
create table public.aceptaciones_terminos (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  version      text not null,
  canal        text not null check (canal in ('web', 'ios', 'android')),
  origen       text not null check (origen in ('registro', 'muro')),
  aceptado_at  timestamptz not null default now()
);
create index aceptaciones_terminos_usuario on public.aceptaciones_terminos (user_id, aceptado_at desc);

create trigger solo_servidor before insert or update or delete on public.aceptaciones_terminos
  for each row execute function public.solo_servidor();

alter table public.aceptaciones_terminos enable row level security;
revoke all on public.aceptaciones_terminos from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.aceptaciones_terminos to service_role;

-- La versión la pone el servidor: el que llama no puede elegirla.
create function public.registrar_aceptacion(p_canal text, p_origen text)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid uuid := (select auth.uid());
  v_version text;
begin
  if v_uid is null then
    raise exception 'registrar_aceptacion: sin sesión' using errcode = '42501';
  end if;
  if p_canal is null or p_canal not in ('web', 'ios', 'android') then
    raise exception 'registrar_aceptacion: canal no válido (%)', p_canal using errcode = '22023';
  end if;
  if p_origen is null or p_origen not in ('registro', 'muro') then
    raise exception 'registrar_aceptacion: origen no válido (%)', p_origen using errcode = '22023';
  end if;
  select v.version into v_version from public.version_terminos v where v.id;
  if v_version is null then
    raise exception 'registrar_aceptacion: todavía no hay términos publicados';
  end if;
  insert into public.aceptaciones_terminos (user_id, version, canal, origen)
  values (v_uid, v_version, p_canal, p_origen);
end $$;
revoke all on function public.registrar_aceptacion(text, text) from public, anon, authenticated, service_role;
grant execute on function public.registrar_aceptacion(text, text) to authenticated, service_role;


-- =============================================================================
-- 9. LOS AVISOS DE RENOVACIÓN (la tabla; el cron y la función son de T20)
-- =============================================================================
-- Un apunte por correo enviado, con UNIQUE en (user_id, plataforma,
-- fecha_renovacion): es lo que impide escribir dos veces por la misma
-- renovación. Solo se avisa en el semestral y el anual (T20).
create table public.avisos_renovacion (
  id                uuid primary key default gen_random_uuid(),
  -- si se borra la cuenta, se borra su apunte: sin el cascade, el borrado de
  -- cuenta fallaría por la clave ajena
  user_id           uuid not null references auth.users (id) on delete cascade,
  plataforma        text not null check (plataforma in ('apple', 'google', 'web')),
  fecha_renovacion  date not null,          -- el día del cobro, en fecha de Madrid
  product_id        text,
  duracion          text check (duracion in ('semestral', 'anual')),
  importe_centimos  integer check (importe_centimos > 0),
  resend_id         text,                   -- el id del correo en Resend: la prueba de que salió
  enviado_at        timestamptz not null default now(),
  constraint avisos_renovacion_una_vez unique (user_id, plataforma, fecha_renovacion)
);

create trigger solo_servidor before insert or update or delete on public.avisos_renovacion
  for each row execute function public.solo_servidor();

alter table public.avisos_renovacion enable row level security;
revoke all on public.avisos_renovacion from public, anon, authenticated, service_role;
grant select, insert, update, delete on public.avisos_renovacion to service_role;
