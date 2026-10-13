-- =============================================================================
-- PERSEVERA TESTS: los reportes, el embudo y la versión mínima (T2)
-- =============================================================================
-- Escrita el 13-oct-2026. Probada solo en local (scripts/probar-esquema.mjs, con
-- PGlite). No está aplicada en ningún Supabase.
--
--   reportes_pregunta   «Reportar esta pregunta» (T19, propuesto)
--   embudo              muestra empezada, paywall visto y compra empezada (T22)
--   version_minima_app  obliga a actualizar cuando un arreglo del motor lo pide
--
-- De dónde sale:
--   - reportes_pregunta, del modelo de psico_reportes de persevera (claude/dia-d,
--     54e448e), supabase/migrations/20260619000001_psico_reportes.sql, líneas
--     9-18, y 20260930120000_psico_reportes_elegida_y_explicacion.sql. Es nueva:
--     vale para todas las preguntas, con motivo, texto, estado y tope diario.
--   - version_minima_app, copiada de persevera (claude/dia-d, 54e448e),
--     supabase/migrations/20261001120000_version_minima_app.sql. Cambiado: los
--     permisos se quitan antes de darlos (como en todo Tests) y lleva la segunda
--     cerradura.
-- =============================================================================


-- =============================================================================
-- 1. REPORTAR UNA PREGUNTA (T19, propuesto)
-- =============================================================================
-- Quién reporta, qué pregunta (su tabla y su id), un motivo de una lista corta,
-- un texto opcional de hasta 500 letras y el estado de la revisión. Las
-- preguntas se corrigen en Persevera: el equipo lo lee aquí (o en el correo de
-- T19) y lo arregla allí.
-- Los psicotécnicos que se generan en la app no tienen id en la base: se guarda
-- una copia del ítem, como psico_reportes. Cada uno crea y ve los suyos, nunca
-- los de otro; no los cambia ni los borra. Una pregunta, un reporte por persona,
-- y como mucho 20 al día (propuesto).
create table public.reportes_pregunta (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null default auth.uid() references auth.users (id) on delete cascade,
  tabla        text not null check (tabla in ('preguntas', 'minicaso_preguntas', 'supuesto_original_preguntas',
                                              'supuesto_oficial_preguntas', 'marcado_items', 'psico_items_graficos',
                                              'psicotecnico_generado')),
  -- el id en su tabla, como texto (unas usan uuid y otras un código)
  pregunta_id  text check (pregunta_id is null or char_length(pregunta_id) between 1 and 100),
  -- la copia de un psicotécnico generado: enunciado, opciones, correcta, la que
  -- marcó y la resolución
  item         jsonb check (item is null or (jsonb_typeof(item) = 'object' and octet_length(item::text) <= 20000)),
  motivo       text not null check (motivo in ('respuesta', 'enunciado', 'explicacion', 'desactualizada', 'otro')),
  texto        text check (texto is null or char_length(texto) <= 500),
  estado       text not null default 'pendiente' check (estado in ('pendiente', 'corregida', 'descartada')),
  creado_at    timestamptz not null default now(),
  revisado_at  timestamptz,
  constraint reportes_pregunta_id_o_copia check (
    case when tabla = 'psicotecnico_generado' then pregunta_id is null and item is not null
         else pregunta_id is not null and item is null end)
);
create unique index reportes_pregunta_una_vez on public.reportes_pregunta (user_id, tabla, pregunta_id)
  where pregunta_id is not null;
create unique index reportes_pregunta_una_vez_copia on public.reportes_pregunta (user_id, md5(item::text))
  where item is not null;
create index reportes_pregunta_pendientes on public.reportes_pregunta (creado_at) where estado = 'pendiente';

-- El tope diario, con un candado por usuario: dos reportes a la vez no pasan
-- los dos con el tope en el último hueco. El servidor no tiene tope.
create function public.reportes_pregunta_tope()
returns trigger language plpgsql set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated') then
    perform pg_advisory_xact_lock(hashtextextended('reportes_pregunta:' || new.user_id::text, 0));
    if (select count(*) from public.reportes_pregunta r
         where r.user_id = new.user_id and r.creado_at > now() - interval '1 day') >= 20 then
      raise exception 'Has llegado al tope de reportes de hoy.' using errcode = '23514';
    end if;
  end if;
  return new;
end
$$;
revoke all on function public.reportes_pregunta_tope() from public, anon, authenticated, service_role;

create trigger reportes_pregunta_tope before insert on public.reportes_pregunta
  for each row execute function public.reportes_pregunta_tope();

alter table public.reportes_pregunta enable row level security;
create policy reportes_pregunta_crear on public.reportes_pregunta
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy reportes_pregunta_ver on public.reportes_pregunta
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on public.reportes_pregunta from public, anon, authenticated, service_role;
grant select on public.reportes_pregunta to authenticated;
grant insert (tabla, pregunta_id, item, motivo, texto) on public.reportes_pregunta to authenticated;
grant select, insert, update, delete on public.reportes_pregunta to service_role;


-- =============================================================================
-- 2. EL EMBUDO (T22)
-- =============================================================================
-- Cuántos hacen la muestra, cuántos ven el paywall y cuántos empiezan a comprar,
-- por canal y por oposición. La prueba y el pago salen de RevenueCat. Sin más
-- dato personal que el id del usuario. La app solo apunta; no lee. Un mismo
-- paso cuenta una vez al día por persona y oposición: la repetición se ignora
-- sin error, así la app apunta sin mirar.
create table public.embudo (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null default auth.uid() references auth.users (id) on delete cascade,
  paso          text not null check (paso in ('muestra_empezada', 'paywall_visto', 'compra_empezada')),
  canal         text not null check (canal in ('web', 'ios', 'android')),
  oposicion_id  uuid references public.oposiciones (id),
  dia           date not null default (now() at time zone 'Europe/Madrid')::date,
  creado_at     timestamptz not null default now()
);
create unique index embudo_una_vez_al_dia on public.embudo (user_id, paso, oposicion_id, dia) nulls not distinct;
create index embudo_dia on public.embudo (dia, paso);

-- SECURITY DEFINER porque la app no puede leer embudo, y para saber si el paso
-- ya está apuntado hay que leerlo. Es de disparador: no se llama por RPC.
create function public.embudo_una_vez_al_dia()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if exists (select 1 from public.embudo e
              where e.user_id = new.user_id and e.paso = new.paso and e.dia = new.dia
                and e.oposicion_id is not distinct from new.oposicion_id) then
    return null;
  end if;
  return new;
end
$$;
revoke all on function public.embudo_una_vez_al_dia() from public, anon, authenticated, service_role;

create trigger embudo_una_vez_al_dia before insert on public.embudo
  for each row execute function public.embudo_una_vez_al_dia();

alter table public.embudo enable row level security;
create policy embudo_apuntar on public.embudo
  for insert to authenticated with check (user_id = (select auth.uid()));

revoke all on public.embudo from public, anon, authenticated, service_role;
grant insert (paso, canal, oposicion_id) on public.embudo to authenticated;
grant select, insert, update, delete on public.embudo to service_role;


-- =============================================================================
-- 3. LA VERSIÓN MÍNIMA DE LA APP
-- =============================================================================
-- La app (src/lib/versionMinima.ts, que copia T16) la lee al abrirse y al volver
-- a primer plano: si la instalada es más vieja, enseña que hay una versión nueva
-- con el botón a su tienda, en vez de entrar. Sirve cuando un arreglo del motor
-- tiene que llegar a todos (D7).
-- Arranca en 0.0.0: no obliga a nadie. Para subirla (en el SQL Editor):
--   update public.version_minima_app set version = '1.1.0', actualizado = now()
--   where plataforma in ('ios', 'android');
-- Si la app no puede leerla (sin red), deja entrar: nunca bloquea por un fallo
-- nuestro.
create table public.version_minima_app (
  plataforma  text primary key check (plataforma in ('ios', 'android')),
  version     text not null check (version ~ '^[0-9]+(\.[0-9]+){0,2}$'),
  actualizado timestamptz not null default now()
);

create trigger solo_servidor before insert or update or delete on public.version_minima_app
  for each row execute function public.solo_servidor();

alter table public.version_minima_app enable row level security;
-- La lee la app antes de iniciar sesión (anon) y después (authenticated). No es
-- un secreto. Nadie la escribe desde la app.
create policy version_minima_app_lectura on public.version_minima_app
  for select to anon, authenticated using (true);

revoke all on public.version_minima_app from public, anon, authenticated, service_role;
grant select on public.version_minima_app to anon, authenticated;
grant select, insert, update, delete on public.version_minima_app to service_role;

insert into public.version_minima_app (plataforma, version)
values ('ios', '0.0.0'), ('android', '0.0.0');
