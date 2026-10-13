-- =============================================================================
-- PERSEVERA TESTS: las dos funciones comunes y las tablas del contenido (T2)
-- =============================================================================
-- Escrita el 13-oct-2026. Probada solo en local (scripts/probar-esquema.mjs, con
-- PGlite). No está aplicada en ningún Supabase: la aplica Álvaro en A6, con las
-- demás, después de T10.
--
-- Va la primera: las demás migraciones usan solo_servidor() y fechas_fijas(), y
-- apuntan a oposiciones, bloques, temas, epigrafes y preguntas.
--
-- LAS TABLAS DEL CONTENIDO son las 15 que la copia del banco (T10) trae cada
-- noche de Persevera, con el mismo nombre, las mismas columnas y los mismos ids,
-- para que el motor copiado las lea sin cambios:
--   oposiciones, bloques, temas, epigrafes, tema_epigrafe y preguntas
--   minicasos y minicaso_preguntas
--   supuestos_originales y supuesto_original_preguntas
--   supuestos_oficiales y supuesto_oficial_preguntas
--   marcado_items, marcado_unidades y psico_items_graficos
--
-- De dónde salen las columnas. De persevera, rama claude/dia-d, commit 54e448e
-- (solo lectura):
--   - marcado_items y marcado_unidades: 20260721000000_marcado_orto_gram.sql,
--     líneas 28-58. psico_items_graficos: 20260721000001_psico_items_graficos.sql,
--     líneas 22-39, más explicacion (20260930120000_psico_reportes_elegida_y_
--     explicacion.sql, líneas 26-27). es_muestra en las dos:
--     20261006093000_proteccion_4_muestra_psico.sql, líneas 86-87.
--   - tema_epigrafe: 20260619000002_tema_epigrafe.sql, líneas 22-30.
--   - Las otras diez se crearon en Persevera desde el panel, sin migración. Se
--     escriben con lo que leen los ficheros que se copian, los scripts de volcado
--     y las migraciones que las cambian después: version_so
--     (20260620000002_version_so.sql), los temas para el plan
--     (20260523000000_add_tema_planning_cols.sql, líneas 6-30, y
--     20260606000000_tema_planning_data.sql, línea 23), oposicion_id de los casos
--     (20260625000000_casos_oposicion_id.sql) y de preguntas
--     (20260628000002_preguntas_oposicion_id.sql), num_supuesto
--     (20260625000001_oficiales_num_supuesto.sql), orden_examen
--     (20260806120000_preguntas_orden_examen.sql) y las _jugable
--     (20260814000000_supuesto_preguntas_solo_desarrollo.sql, líneas 32-44).
--     Lo que falta por confirmar va marcado «sin ver» y lo cierra A3
--     (datos/esquema-persevera.sql): cuando T10 cierre su lista de columnas,
--     ajusta estas tablas en su propia migración. Donde no se sabe si una
--     columna admite vacíos, la admite: la copia no puede rechazar una fila que
--     Persevera acepta.
--
-- LO QUE NO SE COPIA (anexo A de la guía de consolas, A.1):
--   - La rúbrica: enunciado_examen, respuesta_modelo y puntos_clave de las dos
--     tablas de preguntas de supuestos. Por eso sus _jugable se adaptan (abajo).
--   - El texto del temario: vive en otras tablas de Persevera
--     (temario_contenido, tema_rubrica), que no se copian.
--   - oposiciones.tramo, su CHECK y su disparador: son del cobro de Persevera.
--   - Los sellos de revisión de las tablas donde solo se intuyen (preguntas,
--     supuestos originales y minicasos). En supuesto_oficial_preguntas sí
--     constan, y van.
--   - Ninguna de estas tablas apunta a auth.users: no hay nada de usuarios.
--
-- CAMBIADO AQUÍ, en todas (guía de consolas, anexo A, A.3):
--   - Cada una lleva retirada_at. La copia nunca borra: retira lo que ya no está
--     en Persevera, para no romper las respuestas que lo apuntan.
--   - Cada UNIQUE que no es la clave primaria es parcial (where retirada_at is
--     null): una fila nueva puede reusar el código de una retirada.
--   - Las claves ajenas entre ellas son deferrable initially deferred, para que
--     el orden no importe dentro de la transacción de la copia, y ninguna borra
--     en cascada (en Persevera, las de marcado, psicotécnicos y tema_epigrafe sí).
--   - Las _jugable de las preguntas de supuestos, sin puntos_clave.
--   - RLS activada y sin políticas: hasta T10, la app no ve ninguna fila. Sus
--     políticas, su copia y lo que se calcula sobre ellas son de T10.
--   - Permisos: la app solo lee (y la RLS decide qué); el servidor, todo. Nadie
--     las escribe desde la app, y solo_servidor es la segunda cerradura.
-- =============================================================================


-- =============================================================================
-- 0. LAS DOS FUNCIONES DE LOS DISPARADORES
-- =============================================================================
-- Copiadas de persevera-oral (main, b8e151a),
-- supabase/migrations/20261008120000_esquema_inicial.sql, líneas 63-89.
-- Cambiado: en fechas_fijas, las columnas se llaman creada_at y actualizada_at.

-- Las fechas de alta y de cambio las pone la base. En un alta de la app, la
-- base pone la hora, diga lo que diga la petición. actualizada_at la pone
-- siempre la base.
create function public.fechas_fijas()
returns trigger language plpgsql set search_path = '' as $$
begin
  if tg_op = 'INSERT' then
    if current_user in ('anon', 'authenticated') then
      new.creada_at := now();
      new.actualizada_at := now();
    end if;
    return new;
  end if;
  if new.creada_at is distinct from old.creada_at then
    raise exception 'La fecha de creación no se cambia.' using errcode = '23514';
  end if;
  new.actualizada_at := now();
  return new;
end
$$;

-- Tablas que solo escribe el servidor. Los permisos ya se lo impiden a la app;
-- esto es la segunda cerradura, por si algún día alguien da un GRANT de más.
create function public.solo_servidor()
returns trigger language plpgsql set search_path = '' as $$
begin
  if current_user in ('anon', 'authenticated') then
    raise exception 'La tabla % solo la escribe el servidor.', tg_table_name using errcode = '42501';
  end if;
  return coalesce(new, old);
end
$$;

-- Son de disparador: nadie las llama.
revoke all on function public.fechas_fijas() from public, anon, authenticated, service_role;
revoke all on function public.solo_servidor() from public, anon, authenticated, service_role;


-- =============================================================================
-- 1. OPOSICIONES, BLOQUES, TEMAS Y EPÍGRAFES
-- =============================================================================

create table public.oposiciones (
  id                        uuid primary key default gen_random_uuid(),
  slug                      text not null,          -- 'c1_age_libre', 'guardia_civil_libre'...
  nombre                    text not null,
  nombre_corto              text,
  grupo                     text not null,          -- 'C1', 'C2', 'A2'
  organismo                 text,
  -- los parámetros del examen (TakeTest lee penalizacion_denominador)
  num_preguntas             integer,                -- tipo sin ver
  num_preguntas_reserva     integer,                -- tipo sin ver
  duracion_minutos          integer,                -- tipo sin ver
  penalizacion_denominador  integer,                -- tipo sin ver
  num_opciones              integer,                -- tipo sin ver
  nota_minima               numeric,                -- tipo sin ver
  -- datos de la convocatoria y la bandera psicotecnicos
  metadata                  jsonb,
  activa                    boolean not null default false,
  version_so                text check (version_so in ('win10', 'win11')),
  retirada_at               timestamptz
);
-- El UNIQUE de slug solo se ha visto en las imitaciones de Persevera.
create unique index oposiciones_slug_vivo on public.oposiciones (slug) where retirada_at is null;

create table public.bloques (
  id             uuid primary key default gen_random_uuid(),
  oposicion_id   uuid not null references public.oposiciones (id) deferrable initially deferred,
  numero         integer not null,
  nombre         text not null,
  -- del plan de Persevera; lo copiado lee peso_test (simulacroBuilder) y
  -- peso_practico (userStats). Tipos sin ver.
  peso_examen    numeric,
  peso_test      numeric,
  peso_practico  numeric,
  retirada_at    timestamptz
);
create index bloques_oposicion on public.bloques (oposicion_id);

create table public.temas (
  id                   uuid primary key default gen_random_uuid(),
  bloque_id            uuid not null references public.bloques (id) deferrable initially deferred,
  oposicion_id         uuid references public.oposiciones (id) deferrable initially deferred,
  -- empieza en 1 en cada bloque, salvo Guardia Civil, que va de 1 a 24 seguidos
  numero               integer not null,
  titulo               text not null,
  -- del plan de Persevera: ningún fichero copiado las lee
  peso_examen          numeric,                     -- tipo sin ver
  pct_tiempo           numeric(5,4),
  peso_test            numeric(5,4),
  peso_practico        numeric(5,4),
  dificultad           smallint,
  densidad             smallint,
  num_palabras         integer,
  num_preguntas_banco  integer,                     -- tipo sin ver
  retirada_at          timestamptz,
  constraint temas_pct_tiempo_range check (pct_tiempo is null or (pct_tiempo >= 0 and pct_tiempo <= 1)),
  constraint temas_peso_test_range check (peso_test is null or (peso_test >= 0 and peso_test <= 1)),
  constraint temas_peso_practico_range check (peso_practico is null or (peso_practico >= 0 and peso_practico <= 1)),
  constraint temas_dificultad_range check (dificultad is null or dificultad between 1 and 5),
  constraint temas_densidad_range check (densidad is null or densidad between 1 and 5)
);
create index temas_bloque on public.temas (bloque_id);
create index temas_oposicion on public.temas (oposicion_id);

create table public.epigrafes (
  id               uuid primary key default gen_random_uuid(),
  -- el tema «dueño»; el reparto entre temas va por tema_epigrafe
  tema_id          uuid references public.temas (id) deferrable initially deferred,
  numero           integer,
  titulo           text,
  -- el título del programa oficial (BOE): un título, no el texto del temario
  titulo_original  text,
  num_flashcards   integer,
  retirada_at      timestamptz
);
create index epigrafes_tema on public.epigrafes (tema_id);

-- Un epígrafe puede colgar de varios temas de varias oposiciones. Sin id: su
-- clave es (tema_id, epigrafe_id).
create table public.tema_epigrafe (
  tema_id      uuid not null references public.temas (id) deferrable initially deferred,
  epigrafe_id  uuid not null references public.epigrafes (id) deferrable initially deferred,
  orden        integer,
  retirada_at  timestamptz,
  primary key (tema_id, epigrafe_id)
);
create index idx_tema_epigrafe_epigrafe on public.tema_epigrafe (epigrafe_id);


-- =============================================================================
-- 2. LAS PREGUNTAS DEL BANCO
-- =============================================================================
-- Sin es_muestra (la muestra de Tests la calcula T10) y sin columnas de texto
-- para el bloque o el subtema: el bloque sale de temas.bloque_id.
create table public.preguntas (
  id                      uuid primary key default gen_random_uuid(),
  -- la clave del despliegue de Persevera ('C1-ACTO-0019'). No se ha visto si es
  -- UNIQUE: si A3 lo trae, T10 lo añade parcial. La copia va por id.
  codigo                  text,
  tema_id                 uuid references public.temas (id) deferrable initially deferred,
  epigrafe_id             uuid references public.epigrafes (id) deferrable initially deferred,
  -- vacía: común a las oposiciones que comparten el tema; con valor: examen
  -- oficial de esa oposición
  oposicion_id            uuid references public.oposiciones (id) deferrable initially deferred,
  enunciado               text not null,
  opcion_a                text,
  opcion_b                text,
  opcion_c                text,
  opcion_d                text,
  respuesta_correcta      text,                     -- 'A' a 'D', en mayúscula; sin CHECK visto
  explicacion             text,
  ref_legal               text,
  dificultad              smallint,                 -- 1 a 3; tipo sin ver
  fuente                  text,                     -- 'propia' o 'conv_real'
  convocatoria_fuente     text,                     -- solo en las de examen oficial
  -- el orden en el examen oficial: 1..N, y 101.. las de reserva
  orden_examen            smallint,
  version_so              text check (version_so in ('win10', 'win11')),
  estado                  text not null default 'pendiente',  -- 'verificada' o 'pendiente'
  -- editoriales: ningún fichero copiado las lee
  fecha_alta              date,
  fecha_revision          date,
  oposiciones_aplicables  text[],                   -- tipo sin ver (text[], uuid[] o jsonb)
  notas_internas          text,
  retirada_at             timestamptz
);
create index preguntas_tema on public.preguntas (tema_id);
create index preguntas_epigrafe on public.preguntas (epigrafe_id);
create index idx_preguntas_oposicion on public.preguntas (oposicion_id);
create index idx_preguntas_version_so on public.preguntas (version_so) where version_so is not null;
create index preguntas_conv_orden_idx on public.preguntas (oposicion_id, convocatoria_fuente, orden_examen)
  where fuente = 'conv_real';


-- =============================================================================
-- 3. MINICASOS Y SUPUESTOS
-- =============================================================================
-- Sus claves son de texto (id_caso, id_pregunta), como en Persevera. «tema» es
-- un número en minicasos y un texto en los supuestos («T8», «Tema 6. ...»).

create table public.minicasos (
  id_caso                 text primary key,
  oposicion_id            uuid references public.oposiciones (id) deferrable initially deferred,
  bloque                  text,                     -- empieza por el romano: 'III', 'IV. ...'
  tema                    integer,
  epigrafes               text,
  epigrafe_principal      integer,
  titulo                  text,
  modo                    text,                     -- 'hilado' o 'suelto'
  densidad                text,
  num_preguntas           integer,
  normas                  text,
  enunciado               text,
  fecha_verificacion_boe  date,
  orden                   integer,
  created_at              timestamptz default now(),
  retirada_at             timestamptz
);
create index idx_minicasos_oposicion on public.minicasos (oposicion_id);

-- Tiene id (la clave de PostgREST) e id_pregunta (la del despliegue, y la que
-- guarda pregunta_respondida). Cuál es la clave primaria en Persevera no se ha
-- visto; aquí, id, con id_pregunta único entre las vivas.
create table public.minicaso_preguntas (
  id             uuid primary key default gen_random_uuid(),
  id_pregunta    text not null,
  id_caso        text references public.minicasos (id_caso) deferrable initially deferred,
  num_pregunta   integer,
  enunciado      text,
  opcion_a       text not null,
  opcion_b       text not null,
  opcion_c       text not null,
  opcion_d       text not null,
  correcta       text not null,                     -- 'a' a 'd', en minúscula
  explicacion    text,
  articulo_base  text,
  retirada_at    timestamptz
);
create unique index minicaso_preguntas_id_pregunta_viva on public.minicaso_preguntas (id_pregunta)
  where retirada_at is null;
create index minicaso_preguntas_caso on public.minicaso_preguntas (id_caso, num_pregunta);

-- Sin num_preguntas: el recuento sale de sus preguntas.
create table public.supuestos_originales (
  id_caso       text primary key,
  oposicion_id  uuid references public.oposiciones (id) deferrable initially deferred,
  tipo          text,
  bloque        text,                               -- 'III. Derecho...', 'Combinado'...
  tema          text,
  subtema       text,
  titulo        text,
  enunciado     text,
  dificultad    integer,
  convocatoria  text,
  orden         integer,
  created_at    timestamptz default now(),
  retirada_at   timestamptz
);
create index idx_sup_orig_oposicion on public.supuestos_originales (oposicion_id);

-- Las de los supuestos de Persevera pueden traer las opciones, la rúbrica o las
-- dos. Aquí van sin la rúbrica y sin estado (en Persevera no lo tienen).
create table public.supuesto_original_preguntas (
  id_pregunta    text primary key,
  id_caso        text references public.supuestos_originales (id_caso) deferrable initially deferred,
  tipo           text,
  orden          integer not null,
  enunciado      text,
  opcion_a       text,
  opcion_b       text,
  opcion_c       text,
  opcion_d       text,
  correcta       text,                              -- 'a' a 'd', en minúscula
  dificultad     integer,
  articulo_base  text,
  explicacion    text,
  retirada_at    timestamptz,
  -- En Persevera: o trae las cuatro opciones y la correcta, o trae puntos_clave
  -- (se juega solo en el escrito). Sin puntos_clave queda lo que se puede
  -- comprobar: la que trae letra correcta trae sus cuatro opciones. Las que solo
  -- son de desarrollo (sin letra) entran, y las deja fuera el alcance (C3).
  constraint supuesto_original_preguntas_jugable check (
    correcta is null
    or (opcion_a is not null and opcion_b is not null and opcion_c is not null and opcion_d is not null))
);
create index supuesto_original_preguntas_caso on public.supuesto_original_preguntas (id_caso, orden);

-- Los supuestos de examen real. par_caso apunta a la pareja (las dos filas se
-- apuntan entre sí: por eso la clave ajena se comprueba al final).
-- observaciones se queda porque lo copiado la pide por nombre (simulacroBuilder,
-- rama de Gestión Civil); qué trae la decide T10.
create table public.supuestos_oficiales (
  id_caso            text primary key,
  oposicion_id       uuid references public.oposiciones (id) deferrable initially deferred,
  tipo               text,
  bloque             text,
  tema               text,
  subtema            text,
  titulo             text,
  enunciado          text,
  dificultad         integer,
  anio_convocatoria  integer,
  convocatoria       text,
  num_supuesto       integer,
  par_caso           text references public.supuestos_oficiales (id_caso) deferrable initially deferred,
  cuerpo             text,
  turno              text,
  url_boe            text,
  observaciones      text,
  created_at         timestamptz default now(),
  retirada_at        timestamptz,
  constraint supuestos_oficiales_num_supuesto_check check (
    num_supuesto is null or (num_supuesto >= 1 and num_supuesto <= 20))
);
create index idx_sup_ofi_oposicion on public.supuestos_oficiales (oposicion_id);

create table public.supuesto_oficial_preguntas (
  id_pregunta     text primary key,
  id_caso         text references public.supuestos_oficiales (id_caso) deferrable initially deferred,
  tipo            text,
  orden           integer not null,
  enunciado       text,
  opcion_a        text,
  opcion_b        text,
  opcion_c        text,
  opcion_d        text,
  correcta        text,                             -- 'a' a 'd', en minúscula
  -- 'vigente', 'vigente-con-matiz' o 'anulada-en-examen-oficial'
  estado          text,
  dificultad      integer,
  articulo_base   text,
  explicacion     text,
  -- el sello de la última revisión ('plantilla-definitiva-sep2026'), no una persona
  revisado_por    text,
  fecha_revision  date,
  retirada_at     timestamptz,
  -- La misma adaptación que en supuesto_original_preguntas.
  constraint supuesto_oficial_preguntas_jugable check (
    correcta is null
    or (opcion_a is not null and opcion_b is not null and opcion_c is not null and opcion_d is not null))
);
create index supuesto_oficial_preguntas_caso on public.supuesto_oficial_preguntas (id_caso, orden);


-- =============================================================================
-- 4. ORTOGRAFÍA, GRAMÁTICA Y PSICOTÉCNICOS CON FIGURAS (Guardia Civil)
-- =============================================================================

create table public.marcado_items (
  id                   uuid primary key default gen_random_uuid(),
  oposicion_id         uuid not null references public.oposiciones (id) deferrable initially deferred,
  tipo                 text not null check (tipo in ('ortografia', 'gramatica')),
  fuente               text not null default 'propia' check (fuente in ('propia', 'conv_real')),
  convocatoria_fuente  text,
  instruccion          text not null,
  -- solo en ortografía: la frase entera con las unidades subrayadas
  frase                text,
  tema_id              uuid references public.temas (id) deferrable initially deferred,
  dificultad           int check (dificultad between 1 and 3),
  estado               text not null default 'activa',
  created_at           timestamptz not null default now(),
  -- el lote gratis de Persevera; ningún fichero copiado lo lee
  es_muestra           boolean not null default false,
  retirada_at          timestamptz
);
create index idx_marcado_items_opo_tipo on public.marcado_items (oposicion_id, tipo, estado);
create index idx_marcado_items_fuente on public.marcado_items (oposicion_id, tipo, fuente, convocatoria_fuente);

create table public.marcado_unidades (
  id              uuid primary key default gen_random_uuid(),
  item_id         uuid not null references public.marcado_items (id) deferrable initially deferred,
  orden           int  not null,
  texto           text not null,
  -- la verdad: si esta unidad está mal escrita
  es_incorrecto   boolean not null,
  forma_correcta  text,
  explicacion     text,
  retirada_at     timestamptz
);
create unique index marcado_unidades_item_orden_viva on public.marcado_unidades (item_id, orden)
  where retirada_at is null;

create table public.psico_items_graficos (
  id                  uuid primary key default gen_random_uuid(),
  oposicion_id        uuid not null references public.oposiciones (id) deferrable initially deferred,
  -- la familia: 'serie_figuras', 'matriz', 'rotacion', 'conteo'...
  tipo                text not null,
  modulo              int,
  enunciado           text not null,
  -- los SVG del estímulo; vacío cuando la figura va en las opciones
  enunciado_svg       jsonb not null default '[]'::jsonb,
  opciones            jsonb not null,
  opciones_son_texto  boolean not null default false,
  correcta            text not null check (correcta in ('A', 'B', 'C', 'D')),
  dificultad          int check (dificultad between 1 and 3),
  estado              text not null default 'activa',
  created_at          timestamptz not null default now(),
  explicacion         text,
  -- el lote gratis de Persevera; ningún fichero copiado lo lee
  es_muestra          boolean not null default false,
  retirada_at         timestamptz,
  constraint psico_graficos_4_opciones check (jsonb_array_length(opciones) = 4)
);
create index idx_psico_graficos_opo_tipo on public.psico_items_graficos (oposicion_id, tipo, estado);


-- =============================================================================
-- 5. LA RLS, LA SEGUNDA CERRADURA Y LOS PERMISOS DE LAS 15
-- =============================================================================
-- Lo mismo para todas: RLS activada y sin políticas (las pone T10), la app solo
-- puede leer (y hasta T10 no ve nada), anon nada, y el servidor todo.
create trigger solo_servidor before insert or update or delete on public.oposiciones
  for each row execute function public.solo_servidor();
alter table public.oposiciones enable row level security;
revoke all on public.oposiciones from public, anon, authenticated, service_role;
grant select on public.oposiciones to authenticated;
grant select, insert, update, delete on public.oposiciones to service_role;

create trigger solo_servidor before insert or update or delete on public.bloques
  for each row execute function public.solo_servidor();
alter table public.bloques enable row level security;
revoke all on public.bloques from public, anon, authenticated, service_role;
grant select on public.bloques to authenticated;
grant select, insert, update, delete on public.bloques to service_role;

create trigger solo_servidor before insert or update or delete on public.temas
  for each row execute function public.solo_servidor();
alter table public.temas enable row level security;
revoke all on public.temas from public, anon, authenticated, service_role;
grant select on public.temas to authenticated;
grant select, insert, update, delete on public.temas to service_role;

create trigger solo_servidor before insert or update or delete on public.epigrafes
  for each row execute function public.solo_servidor();
alter table public.epigrafes enable row level security;
revoke all on public.epigrafes from public, anon, authenticated, service_role;
grant select on public.epigrafes to authenticated;
grant select, insert, update, delete on public.epigrafes to service_role;

create trigger solo_servidor before insert or update or delete on public.tema_epigrafe
  for each row execute function public.solo_servidor();
alter table public.tema_epigrafe enable row level security;
revoke all on public.tema_epigrafe from public, anon, authenticated, service_role;
grant select on public.tema_epigrafe to authenticated;
grant select, insert, update, delete on public.tema_epigrafe to service_role;

create trigger solo_servidor before insert or update or delete on public.preguntas
  for each row execute function public.solo_servidor();
alter table public.preguntas enable row level security;
revoke all on public.preguntas from public, anon, authenticated, service_role;
grant select on public.preguntas to authenticated;
grant select, insert, update, delete on public.preguntas to service_role;

create trigger solo_servidor before insert or update or delete on public.minicasos
  for each row execute function public.solo_servidor();
alter table public.minicasos enable row level security;
revoke all on public.minicasos from public, anon, authenticated, service_role;
grant select on public.minicasos to authenticated;
grant select, insert, update, delete on public.minicasos to service_role;

create trigger solo_servidor before insert or update or delete on public.minicaso_preguntas
  for each row execute function public.solo_servidor();
alter table public.minicaso_preguntas enable row level security;
revoke all on public.minicaso_preguntas from public, anon, authenticated, service_role;
grant select on public.minicaso_preguntas to authenticated;
grant select, insert, update, delete on public.minicaso_preguntas to service_role;

create trigger solo_servidor before insert or update or delete on public.supuestos_originales
  for each row execute function public.solo_servidor();
alter table public.supuestos_originales enable row level security;
revoke all on public.supuestos_originales from public, anon, authenticated, service_role;
grant select on public.supuestos_originales to authenticated;
grant select, insert, update, delete on public.supuestos_originales to service_role;

create trigger solo_servidor before insert or update or delete on public.supuesto_original_preguntas
  for each row execute function public.solo_servidor();
alter table public.supuesto_original_preguntas enable row level security;
revoke all on public.supuesto_original_preguntas from public, anon, authenticated, service_role;
grant select on public.supuesto_original_preguntas to authenticated;
grant select, insert, update, delete on public.supuesto_original_preguntas to service_role;

create trigger solo_servidor before insert or update or delete on public.supuestos_oficiales
  for each row execute function public.solo_servidor();
alter table public.supuestos_oficiales enable row level security;
revoke all on public.supuestos_oficiales from public, anon, authenticated, service_role;
grant select on public.supuestos_oficiales to authenticated;
grant select, insert, update, delete on public.supuestos_oficiales to service_role;

create trigger solo_servidor before insert or update or delete on public.supuesto_oficial_preguntas
  for each row execute function public.solo_servidor();
alter table public.supuesto_oficial_preguntas enable row level security;
revoke all on public.supuesto_oficial_preguntas from public, anon, authenticated, service_role;
grant select on public.supuesto_oficial_preguntas to authenticated;
grant select, insert, update, delete on public.supuesto_oficial_preguntas to service_role;

create trigger solo_servidor before insert or update or delete on public.marcado_items
  for each row execute function public.solo_servidor();
alter table public.marcado_items enable row level security;
revoke all on public.marcado_items from public, anon, authenticated, service_role;
grant select on public.marcado_items to authenticated;
grant select, insert, update, delete on public.marcado_items to service_role;

create trigger solo_servidor before insert or update or delete on public.marcado_unidades
  for each row execute function public.solo_servidor();
alter table public.marcado_unidades enable row level security;
revoke all on public.marcado_unidades from public, anon, authenticated, service_role;
grant select on public.marcado_unidades to authenticated;
grant select, insert, update, delete on public.marcado_unidades to service_role;

create trigger solo_servidor before insert or update or delete on public.psico_items_graficos
  for each row execute function public.solo_servidor();
alter table public.psico_items_graficos enable row level security;
revoke all on public.psico_items_graficos from public, anon, authenticated, service_role;
grant select on public.psico_items_graficos to authenticated;
grant select, insert, update, delete on public.psico_items_graficos to service_role;
