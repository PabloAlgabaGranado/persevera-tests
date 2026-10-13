-- =============================================================================
-- PERSEVERA TESTS: lo que el motor de tests lee y escribe de cada usuario (T2)
-- =============================================================================
-- Escrita el 13-oct-2026. Probada solo en local (scripts/probar-esquema.mjs, con
-- PGlite). No está aplicada en ningún Supabase.
--
-- El motor se copia de Persevera (T5 a T8) y lee estas tablas con el mismo
-- nombre y las mismas columnas, para que la copia del código no cambie:
--   respuestas_usuario         cada respuesta a una pregunta del banco (test y
--                              simulacro)
--   pregunta_respondida        cada respuesta a una pregunta de un caso
--                              (minicaso, supuesto original u oficial)
--   study_activity_log         cada test, caso, simulacro, marcado o
--                              psicotécnico terminado
--   simulacros                 la tabla vieja de simulacros, vacía (abajo)
--   simulacro_sesiones         cada simulacro, con su veredicto y su desglose
--   v_estado_pregunta_usuario  el estado de cada pregunta para cada usuario
--   v_casos_para_revisar       los casos con menos del 80 % de aciertos
--   preguntas_aleatorias       un lote de preguntas sorteado en la base
--
-- De dónde sale. De persevera, rama claude/dia-d, commit 54e448e (solo lectura):
--   - simulacro_sesiones: 20260722000001_simulacro_sesiones.sql, líneas 24-80.
--   - v_estado_pregunta_usuario: 20260620000001_v_estado_epigrafe.sql, líneas
--     17-67 (la versión final: 20260804140000 no la cambia).
--   - set_respuesta_oposicion_id y su disparador:
--     20260803120000_respuestas_oposicion_id_trigger.sql, líneas 26-52.
--   - la CHECK de study_activity_log.tipo: 20260722000000_activity_log_marcado_psico.sql,
--     líneas 38-45.
--   - preguntas_aleatorias: 20260723000000_preguntas_aleatorias.sql, líneas 25-54.
--   - respuestas_usuario, pregunta_respondida, study_activity_log, simulacros y
--     v_casos_para_revisar se crearon en Persevera fuera de las migraciones. Se
--     escriben con lo que leen y escriben los ficheros que se copian (TakeTest,
--     SupuestoPlayer y supuestos.ts, SimulacroResultado, simulacroGC/guardar.ts,
--     activityLog.ts, casosRepaso.ts, MisFallosView y userStats.ts), y se
--     cierran con A3 (datos/esquema-persevera.sql), en una migración nueva.
--     study_activity_log lleva solo las columnas que escribe activityLog.ts
--     (líneas 145-160 en 54e448e) y su id.
--
-- Cambiado aquí, en todo lo copiado: cada tabla se cierra y se le da lo justo
-- (Persevera no escribe sus GRANT); las políticas usan (select auth.uid()); las
-- funciones fijan search_path = ''; las columnas de oposicion_id no llevan el
-- valor por defecto del Administrativo que tienen en Persevera; las claves
-- ajenas al contenido no se borran en cascada, porque la copia del banco nunca
-- borra (retira, T10). La app solo puede dar de alta las columnas que manda el
-- motor: las fechas y la oposición las pone la base.
--
-- LO QUE NO SE COPIA:
--   - El disparador que «rellena simulacros desde study_activity_log»: en
--     Persevera nunca existió. Lo comprobó persevera el 5-sep-2026
--     (src/lib/simulacroGC/__tests__/persistencia.test.ts, líneas 104-112: sin
--     ningún CREATE TRIGGER y con la tabla vacía), y lo dicen userStats.ts
--     (líneas 241-244) y activityLog.ts. Los simulacros se guardan en
--     simulacro_sesiones, y userStats suma las dos tablas: con el disparador,
--     cada simulacro contaría dos veces. simulacros se crea vacía para que su
--     lectura no dé error, y nadie la escribe.
--   - usuario_oposicion: en Tests, la oposición sale de eleccion_oposicion (T3).
--   - psico_reportes: los reportes van a reportes_pregunta (T19).
--   - marcado_respuestas: ningún fichero que se copia la lee ni la escribe.
--   - Las funciones de reinicio del progreso: ningún fichero que se copia las
--     llama.
-- =============================================================================


-- =============================================================================
-- 1. LAS RESPUESTAS A LAS PREGUNTAS DEL BANCO
-- =============================================================================
-- Las escribe TakeTest (al confirmar cada pregunta; en modo examen, todas al
-- final) y SimulacroResultado (el test del simulacro). La respuesta va en
-- mayúscula ('A' a 'D'). modo: practica, repaso_fallos, examen_real,
-- sesion_expres o simulacro. Sin CHECK en respuesta ni en modo, como en
-- Persevera (modo 'sesion_expres' llegó sin migración).
create table public.respuestas_usuario (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  pregunta_id      uuid not null references public.preguntas (id),
  respuesta        text not null,
  es_correcta      boolean not null,
  modo             text,
  tiempo_segundos  integer,
  created_at       timestamptz not null default now(),
  -- la oposición del tema de la pregunta; la pone el disparador de abajo
  oposicion_id     uuid references public.oposiciones (id)
);
create index idx_respuestas_usuario_oposicion on public.respuestas_usuario (user_id, oposicion_id);
-- Para el DISTINCT ON de v_estado_pregunta_usuario (nuevo en Tests)
create index respuestas_usuario_ultima on public.respuestas_usuario (user_id, pregunta_id, created_at desc);

-- La oposición del tema de la pregunta. SECURITY DEFINER para leer preguntas,
-- temas y bloques sin la RLS del contenido (T10). Es de disparador: no se
-- llama por RPC.
create function public.set_respuesta_oposicion_id()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  new.oposicion_id := coalesce(
    (select b.oposicion_id
       from public.preguntas p
       join public.temas   t on t.id = p.tema_id
       join public.bloques b on b.id = t.bloque_id
      where p.id = new.pregunta_id),
    -- si la pregunta no resuelve a una oposición (sin tema), se conserva lo que venga
    new.oposicion_id
  );
  return new;
end;
$$;
revoke all on function public.set_respuesta_oposicion_id() from public, anon, authenticated, service_role;

create trigger trg_respuesta_oposicion_id before insert on public.respuestas_usuario
  for each row execute function public.set_respuesta_oposicion_id();

alter table public.respuestas_usuario enable row level security;
create policy respuestas_usuario_ver on public.respuestas_usuario
  for select to authenticated using (user_id = (select auth.uid()));
create policy respuestas_usuario_crear on public.respuestas_usuario
  for insert to authenticated with check (user_id = (select auth.uid()));

revoke all on public.respuestas_usuario from public, anon, authenticated, service_role;
grant select on public.respuestas_usuario to authenticated;
grant insert (user_id, pregunta_id, respuesta, es_correcta, modo, tiempo_segundos) on public.respuestas_usuario to authenticated;
grant select, insert, update, delete on public.respuestas_usuario to service_role;


-- =============================================================================
-- 2. LAS RESPUESTAS A LAS PREGUNTAS DE LOS CASOS
-- =============================================================================
-- Las escribe saveRespuesta (supuestos.ts, desde SupuestoPlayer) y
-- SimulacroResultado (el supuesto del simulacro). No se deriva de
-- respuestas_usuario: son dos tablas paralelas. tipo_pregunta: minicaso,
-- original u oficial; id_pregunta e id_caso son los códigos de texto de los
-- casos (sin clave ajena: apuntan a tres tablas). La respuesta va en minúscula.
-- No lleva oposición: sale del caso.
create table public.pregunta_respondida (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references auth.users (id) on delete cascade,
  tipo_pregunta    text not null,
  id_pregunta      text not null,
  id_caso          text,
  respuesta        text not null,
  es_correcta      boolean not null,
  modo             text,
  tiempo_segundos  integer,
  respondida_at    timestamptz not null default now()
);
create index pregunta_respondida_caso on public.pregunta_respondida (user_id, tipo_pregunta, id_caso, respondida_at desc);

alter table public.pregunta_respondida enable row level security;
create policy pregunta_respondida_ver on public.pregunta_respondida
  for select to authenticated using (user_id = (select auth.uid()));
create policy pregunta_respondida_crear on public.pregunta_respondida
  for insert to authenticated with check (user_id = (select auth.uid()));

revoke all on public.pregunta_respondida from public, anon, authenticated, service_role;
grant select on public.pregunta_respondida to authenticated;
grant insert (user_id, tipo_pregunta, id_pregunta, id_caso, respuesta, es_correcta, modo, tiempo_segundos)
  on public.pregunta_respondida to authenticated;
grant select, insert, update, delete on public.pregunta_respondida to service_role;


-- =============================================================================
-- 3. LA ACTIVIDAD
-- =============================================================================
-- Una fila por cada test, caso, simulacro, marcado o psicotécnico terminado.
-- Solo de alta: no se cambia ni se borra desde la app. En Tests la escribe el
-- registrarActividad de T5, que manda lo mismo que activityLog.ts; plan_id y
-- step_id van siempre a null (Tests no tiene plan), pero tienen que existir:
-- PostgREST rechaza un alta con una columna que no existe.
create table public.study_activity_log (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users (id) on delete cascade,
  tipo          text not null,
  duracion_min  integer,
  completado    boolean,
  started_at    timestamptz,
  completed_at  timestamptz,
  bloque_id     uuid references public.bloques (id),
  tema_id       uuid,
  plan_id       uuid,
  step_id       uuid,
  oposicion_id  uuid references public.oposiciones (id),
  metadata      jsonb not null default '{}'::jsonb,
  constraint study_activity_log_tipo_check check (tipo in (
    'pomodoro_focus', 'test', 'flashcards', 'simulacro',
    'supuesto', 'minicaso', 'lectura',
    'marcado',   -- ortografía y gramática (Guardia Civil)
    'psico'      -- psicotécnicos gráficos (Guardia Civil, Auxiliar)
  ))
);
create index idx_study_activity_log_user_oposicion on public.study_activity_log (user_id, oposicion_id);

alter table public.study_activity_log enable row level security;
create policy study_activity_log_ver on public.study_activity_log
  for select to authenticated using (user_id = (select auth.uid()));
create policy study_activity_log_crear on public.study_activity_log
  for insert to authenticated with check (user_id = (select auth.uid()));

revoke all on public.study_activity_log from public, anon, authenticated, service_role;
grant select on public.study_activity_log to authenticated;
grant insert (user_id, tipo, duracion_min, completado, started_at, completed_at, bloque_id, tema_id,
              plan_id, step_id, oposicion_id, metadata) on public.study_activity_log to authenticated;
grant select, insert, update, delete on public.study_activity_log to service_role;


-- =============================================================================
-- 4. LOS SIMULACROS
-- =============================================================================
-- La tabla vieja: la lee userStats.ts y nadie la escribe (ver la cabecera). Se
-- crea vacía para que la lectura no falle; la app solo lee las suyas.
create table public.simulacros (
  id                     uuid primary key default gen_random_uuid(),
  user_id                uuid not null references auth.users (id) on delete cascade,
  oposicion_id           uuid references public.oposiciones (id),
  fecha                  timestamptz not null default now(),
  nota_penalizada        numeric,
  nota_corte_referencia  numeric
);
create index idx_simulacros_user_oposicion on public.simulacros (user_id, oposicion_id);

alter table public.simulacros enable row level security;
create policy simulacros_ver on public.simulacros
  for select to authenticated using (user_id = (select auth.uid()));

revoke all on public.simulacros from public, anon, authenticated, service_role;
grant select on public.simulacros to authenticated;
grant select, insert, update, delete on public.simulacros to service_role;

-- Una sesión de simulacro con su veredicto. Pensada para cualquier oposición con
-- examen de varias pruebas, no solo para Guardia Civil (prueba es texto libre y
-- el desglose va en jsonb). La escribe simulacroGC/guardar.ts.
create table public.simulacro_sesiones (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users (id) on delete cascade,
  oposicion_id    uuid not null references public.oposiciones (id),

  -- Qué sesión del examen es: 'simulacro', y en Guardia Civil 'gc_teorico' o
  -- 'gc_psico'. Texto y no enum para que una oposición nueva no exija migrar.
  prueba          text not null,
  fuente          text not null default 'generado',   -- 'generado' | 'oficial'
  convocatoria    text,

  fecha           timestamptz not null default now(),
  duracion_segundos integer,
  -- true si se acabó el tiempo y se entregó sola
  por_tiempo      boolean not null default false,

  -- El veredicto. Un booleano y no una nota: en un examen con pruebas
  -- eliminatorias, «apto» no se deduce de ningún número.
  apto            boolean not null,

  -- Suma de las pruebas que puntúan y el máximo de las realizadas. Sirven para
  -- la evolución; el veredicto no sale de aquí.
  puntuacion      numeric(6,2),
  maximo_posible  numeric(6,2),

  -- Una entrada por prueba, en el orden del examen:
  --   { clave, etiqueta, tipo: 'puntuable'|'eliminatoria', apto,
  --     puntuacion?, minimo?, maximo?, aciertos?, errores?, fallos?, limite? }
  detalle         jsonb not null default '[]'::jsonb,

  created_at      timestamptz not null default now(),

  -- Una sesión sin pruebas no significa nada
  constraint simulacro_sesiones_detalle_no_vacio check (jsonb_array_length(detalle) > 0)
);
create index idx_simulacro_sesiones_user_opo_fecha on public.simulacro_sesiones (user_id, oposicion_id, fecha desc);

-- Cada usuario ve y escribe lo suyo. Sin update ni delete: un resultado de
-- examen no se retoca; si se repite, es una sesión nueva.
alter table public.simulacro_sesiones enable row level security;
create policy simulacro_sesiones_select_propias on public.simulacro_sesiones
  for select to authenticated using (user_id = (select auth.uid()));
create policy simulacro_sesiones_insert_propias on public.simulacro_sesiones
  for insert to authenticated with check (user_id = (select auth.uid()));

revoke all on public.simulacro_sesiones from public, anon, authenticated, service_role;
grant select on public.simulacro_sesiones to authenticated;
grant insert (user_id, oposicion_id, prueba, fuente, convocatoria, duracion_segundos, por_tiempo, apto,
              puntuacion, maximo_posible, detalle) on public.simulacro_sesiones to authenticated;
grant select, insert, update, delete on public.simulacro_sesiones to service_role;


-- =============================================================================
-- 5. LAS VISTAS
-- =============================================================================
-- Las dos son security_invoker: se leen con la RLS de quien pregunta, así que
-- cada uno ve solo lo suyo.

-- El estado de cada pregunta del banco para cada usuario (pendiente, acertada,
-- en_refuerzo o dominada) y su prioridad para repasar. Copiada tal cual; solo
-- se han puesto los nombres con su esquema.
create view public.v_estado_pregunta_usuario
with (security_invoker = on) as
 with ultima as (
         select distinct on (respuestas_usuario.user_id, respuestas_usuario.pregunta_id) respuestas_usuario.user_id,
            respuestas_usuario.pregunta_id,
            respuestas_usuario.es_correcta,
            respuestas_usuario.created_at
           from public.respuestas_usuario
          order by respuestas_usuario.user_id, respuestas_usuario.pregunta_id, respuestas_usuario.created_at desc
        ), historico as (
         select respuestas_usuario.user_id,
            respuestas_usuario.pregunta_id,
            count(*) as veces_vista,
            count(*) filter (where respuestas_usuario.es_correcta = false) as veces_fallada,
            count(*) filter (where respuestas_usuario.es_correcta = true) as veces_acertada,
            max(respuestas_usuario.created_at) filter (where respuestas_usuario.es_correcta = false) as ultimo_fallo_at
           from public.respuestas_usuario
          group by respuestas_usuario.user_id, respuestas_usuario.pregunta_id
        ), tema_stats as (
         select r.user_id,
            p_1.tema_id,
            count(*) as vistas_tema,
            count(*) filter (where r.es_correcta = false) as fallos_tema
           from public.respuestas_usuario r
             join public.preguntas p_1 on p_1.id = r.pregunta_id
          where p_1.tema_id is not null
          group by r.user_id, p_1.tema_id
        )
 select u.user_id,
    u.pregunta_id,
    u.es_correcta as ultima_correcta,
    u.created_at as ultima_respuesta_at,
    h.veces_vista,
    h.veces_fallada,
    h.veces_acertada,
    h.ultimo_fallo_at,
        case
            when u.es_correcta = false then 'pendiente'::text
            when u.es_correcta = true and h.veces_fallada = 0 then 'acertada'::text
            when u.es_correcta = true and h.veces_acertada < 2 then 'en_refuerzo'::text
            else 'dominada'::text
        end as estado,
    p.tema_id,
    p.dificultad,
    coalesce(ts.fallos_tema::numeric / nullif(ts.vistas_tema, 0)::numeric, 0::numeric) as debilidad_tema,
    0.45::double precision * least(ln((1 + h.veces_fallada)::double precision) / ln(6::double precision), 1.0::double precision) + (0.30 * coalesce(exp((- extract(epoch from now() - h.ultimo_fallo_at)) / (14.0 * 86400::numeric)), 0::numeric))::double precision + (0.15 * ((4.0 - coalesce(p.dificultad, 2)::numeric) / 3.0))::double precision + (0.10 * coalesce(ts.fallos_tema::numeric / nullif(ts.vistas_tema, 0)::numeric, 0::numeric))::double precision as prioridad_score,
    p.epigrafe_id
   from ultima u
     join historico h using (user_id, pregunta_id)
     left join public.preguntas p on p.id = u.pregunta_id
     left join tema_stats ts on ts.user_id = u.user_id and ts.tema_id = p.tema_id;

revoke all on public.v_estado_pregunta_usuario from public, anon, authenticated, service_role;
grant select on public.v_estado_pregunta_usuario to authenticated, service_role;

-- Los casos (minicasos, supuestos originales y oficiales) con menos de un 80 %
-- de aciertos en la última respuesta a cada pregunta. Solo agrega
-- pregunta_respondida; la app pone luego el título del caso.
-- Reconstruida: en las migraciones de persevera no está su CREATE (se hizo en el
-- panel). Sale de lo que lee src/lib/casosRepaso.ts (claude/dia-d, 54e448e,
-- líneas 39-61: user_id, tipo_pregunta, id_caso, contestadas, aciertos,
-- pct_aciertos y ultima_at, «% < 80%») y de que es security_invoker
-- (20260615000000_rls_unrestricted.sql, línea 54). Se coteja con A3.
create view public.v_casos_para_revisar
with (security_invoker = on) as
 with ultima as (
         select distinct on (r.user_id, r.tipo_pregunta, r.id_caso, r.id_pregunta)
                r.user_id, r.tipo_pregunta, r.id_caso, r.id_pregunta, r.es_correcta, r.respondida_at
           from public.pregunta_respondida r
          where r.id_caso is not null and r.tipo_pregunta in ('minicaso', 'original', 'oficial')
          order by r.user_id, r.tipo_pregunta, r.id_caso, r.id_pregunta, r.respondida_at desc
        ), agregado as (
         select ultima.user_id,
            ultima.tipo_pregunta,
            ultima.id_caso,
            count(*)::integer as contestadas,
            (count(*) filter (where ultima.es_correcta))::integer as aciertos,
            round(100.0 * count(*) filter (where ultima.es_correcta) / count(*), 1) as pct_aciertos,
            max(ultima.respondida_at) as ultima_at
           from ultima
          group by ultima.user_id, ultima.tipo_pregunta, ultima.id_caso
        )
 select user_id, tipo_pregunta, id_caso, contestadas, aciertos, pct_aciertos, ultima_at
   from agregado
  where pct_aciertos < 80;

revoke all on public.v_casos_para_revisar from public, anon, authenticated, service_role;
grant select on public.v_casos_para_revisar to authenticated, service_role;


-- =============================================================================
-- 6. EL SORTEO DE PREGUNTAS
-- =============================================================================
-- Copiada de persevera (claude/dia-d, 54e448e),
-- supabase/migrations/20260723000000_preguntas_aleatorias.sql, líneas 25-54.
-- Cambiado: lleva search_path vacío y los permisos se quitan antes de darlos.
-- Ojo, tal cual en persevera: con p_incluir_oficiales en false también deja
-- fuera las preguntas con fuente vacía (null <> 'conv_real' no es verdad). Si es
-- un fallo, se arregla allí y se vuelve a copiar.
create function public.preguntas_aleatorias(
  p_epigrafes uuid[],
  p_excluir   uuid[] default '{}',
  p_n         int    default 20,
  -- Las de examen oficial no son material de práctica: fuera por defecto.
  p_incluir_oficiales boolean default false
)
returns setof public.preguntas
language sql
stable
security invoker
set search_path = ''
as $$
  select p.*
    from public.preguntas p
   where p.estado = 'verificada'
     and (p_epigrafes is null or array_length(p_epigrafes, 1) is null
          or p.epigrafe_id = any(p_epigrafes))
     and (p_excluir is null or array_length(p_excluir, 1) is null
          or p.id <> all(p_excluir))
     and (p_incluir_oficiales or p.fuente <> 'conv_real')
   order by random()
   limit greatest(p_n, 0);
$$;

revoke all on function public.preguntas_aleatorias(uuid[], uuid[], int, boolean) from public, anon, authenticated, service_role;
grant execute on function public.preguntas_aleatorias(uuid[], uuid[], int, boolean) to authenticated, service_role;
