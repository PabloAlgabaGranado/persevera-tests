-- Sacado de Persevera, producción (rljfcmjvulmjooxoxzxo), el 13-10-2026 23:11 (hora de Madrid), desde el editor SQL del panel
-- con datos/a3-editor.sql: solo el catálogo, sin ninguna fila. Postgres 17.6.
-- Tablas y vistas de A3 encontradas: 23 de 23.
-- Arreglado en el repo el 13-10-2026: sin el formato CSV del panel, y con preguntas_aleatorias después de las
-- vistas porque devuelve filas de preguntas, que es como lo ordena ahora a3-editor.sql. Carga en un Postgres vacío.
set check_function_bodies = off;

-- public.set_respuesta_oposicion_id() (SECURITY DEFINER, de postgres)
-- permisos: {=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}
CREATE OR REPLACE FUNCTION public.set_respuesta_oposicion_id()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog', 'public'
AS $function$
BEGIN
  NEW.oposicion_id := COALESCE(
    (SELECT b.oposicion_id
       FROM public.preguntas p
       JOIN public.temas   t ON t.id = p.tema_id
       JOIN public.bloques b ON b.id = t.bloque_id
      WHERE p.id = NEW.pregunta_id),
    -- Si la pregunta no resuelve a una oposición (sin tema), conservamos lo que
    -- venga (o el DEFAULT de la columna): nunca dejamos NULL por sorpresa.
    NEW.oposicion_id
  );
  RETURN NEW;
END;
$function$
;

CREATE TABLE public.bloques (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    oposicion_id uuid NOT NULL,
    numero integer NOT NULL,
    nombre text NOT NULL,
    descripcion text,
    peso_examen real DEFAULT 0.0,
    created_at timestamp with time zone DEFAULT now(),
    peso_test numeric(5,4),
    peso_practico numeric(5,4)
);

CREATE TABLE public.epigrafes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tema_id uuid NOT NULL,
    numero integer NOT NULL,
    titulo text NOT NULL,
    titulo_original text,
    num_flashcards integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.marcado_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    oposicion_id uuid NOT NULL,
    tipo text NOT NULL,
    fuente text DEFAULT 'propia'::text NOT NULL,
    convocatoria_fuente text,
    instruccion text NOT NULL,
    frase text,
    tema_id uuid,
    dificultad integer,
    estado text DEFAULT 'activa'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.marcado_unidades (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    item_id uuid NOT NULL,
    orden integer NOT NULL,
    texto text NOT NULL,
    es_incorrecto boolean NOT NULL,
    forma_correcta text,
    explicacion text
);

CREATE TABLE public.minicaso_preguntas (
    id_pregunta text NOT NULL,
    id_caso text NOT NULL,
    num_pregunta integer NOT NULL,
    enunciado text NOT NULL,
    opcion_a text NOT NULL,
    opcion_b text NOT NULL,
    opcion_c text NOT NULL,
    opcion_d text NOT NULL,
    correcta character(1) NOT NULL,
    explicacion text,
    articulo_base text,
    revisado_por text,
    fecha_revision date
);

CREATE TABLE public.minicasos (
    id_caso text NOT NULL,
    bloque text NOT NULL,
    tema integer NOT NULL,
    epigrafes text,
    epigrafe_principal numeric GENERATED ALWAYS AS (((regexp_match(COALESCE(epigrafes, ''::text), '(\d+(?:\.\d+)?)'::text))[1])::numeric) STORED,
    titulo text NOT NULL,
    modo text,
    densidad text,
    num_preguntas integer NOT NULL,
    normas text,
    enunciado text NOT NULL,
    fecha_verificacion_boe date,
    orden integer GENERATED ALWAYS AS (("substring"(id_caso, 'CP-MC-(\d+)'::text))::integer) STORED,
    created_at timestamp with time zone DEFAULT now(),
    oposicion_id uuid
);

CREATE TABLE public.oposiciones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    nombre text NOT NULL,
    nombre_corto text NOT NULL,
    grupo text NOT NULL,
    organismo text DEFAULT 'Administración General del Estado'::text NOT NULL,
    num_preguntas integer NOT NULL,
    num_preguntas_reserva integer DEFAULT 5,
    duracion_minutos integer NOT NULL,
    penalizacion_denominador integer DEFAULT 3 NOT NULL,
    num_opciones integer DEFAULT 4 NOT NULL,
    nota_minima real DEFAULT 25.0,
    metadata jsonb DEFAULT '{}'::jsonb,
    activa boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    version_so text
);

CREATE TABLE public.pregunta_respondida (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tipo_pregunta text NOT NULL,
    id_pregunta text NOT NULL,
    id_caso text,
    respuesta character(1) NOT NULL,
    es_correcta boolean NOT NULL,
    modo text NOT NULL,
    tiempo_segundos integer,
    respondida_at timestamp with time zone DEFAULT now()
);

CREATE TABLE public.preguntas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    codigo text,
    tema_id uuid NOT NULL,
    subtema_id uuid,
    enunciado text,
    opcion_a text,
    opcion_b text,
    opcion_c text,
    opcion_d text,
    respuesta_correcta character(1) NOT NULL,
    explicacion text,
    ref_legal text,
    dificultad integer DEFAULT 3 NOT NULL,
    fuente text DEFAULT 'propia'::text NOT NULL,
    convocatoria_fuente text,
    estado text DEFAULT 'pendiente'::text NOT NULL,
    oposiciones_aplicables text[] DEFAULT ARRAY[]::text[],
    notas_internas text,
    revisado_por text,
    fecha_alta date DEFAULT CURRENT_DATE,
    dificultad_real real,
    tasa_acierto real,
    num_veces_respondida integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    epigrafe_id uuid,
    version_so text,
    oposicion_id uuid,
    orden_examen smallint,
    fecha_revision date
);

CREATE TABLE public.psico_items_graficos (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    oposicion_id uuid NOT NULL,
    tipo text NOT NULL,
    modulo integer,
    enunciado text NOT NULL,
    enunciado_svg jsonb DEFAULT '[]'::jsonb NOT NULL,
    opciones jsonb NOT NULL,
    opciones_son_texto boolean DEFAULT false NOT NULL,
    correcta text NOT NULL,
    dificultad integer,
    estado text DEFAULT 'activa'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    explicacion text
);

CREATE TABLE public.respuestas_usuario (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    pregunta_id uuid NOT NULL,
    respuesta character(1),
    es_correcta boolean NOT NULL,
    modo text NOT NULL,
    sesion_id uuid,
    tiempo_segundos integer,
    tipo_fallo text,
    uso_comodin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    oposicion_id uuid DEFAULT '1fd3dcce-78b1-423c-bbcb-3c0649eda113'::uuid
);

CREATE TABLE public.simulacro_sesiones (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    oposicion_id uuid NOT NULL,
    prueba text NOT NULL,
    fuente text DEFAULT 'generado'::text NOT NULL,
    convocatoria text,
    fecha timestamp with time zone DEFAULT now() NOT NULL,
    duracion_segundos integer,
    por_tiempo boolean DEFAULT false NOT NULL,
    apto boolean NOT NULL,
    puntuacion numeric(6,2),
    maximo_posible numeric(6,2),
    detalle jsonb DEFAULT '[]'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE public.simulacros (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    oposicion_id uuid NOT NULL,
    num_preguntas integer NOT NULL,
    aciertos integer DEFAULT 0 NOT NULL,
    errores integer DEFAULT 0 NOT NULL,
    en_blanco integer DEFAULT 0 NOT NULL,
    nota_bruta real,
    nota_penalizada real,
    nota_corte_referencia real,
    posicion_estimada integer,
    duracion_segundos integer,
    fecha timestamp with time zone DEFAULT now(),
    respuestas jsonb DEFAULT '[]'::jsonb,
    resultado_por_bloque jsonb DEFAULT '{}'::jsonb
);

CREATE TABLE public.study_activity_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    tipo text NOT NULL,
    duracion_min integer DEFAULT 0 NOT NULL,
    completado boolean DEFAULT true NOT NULL,
    started_at timestamp with time zone NOT NULL,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    bloque_id uuid,
    tema_id uuid,
    plan_id uuid,
    step_id uuid,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    oposicion_id uuid DEFAULT '1fd3dcce-78b1-423c-bbcb-3c0649eda113'::uuid
);

CREATE TABLE public.supuesto_oficial_preguntas (
    id_pregunta text NOT NULL,
    id_caso text NOT NULL,
    tipo text,
    orden integer NOT NULL,
    enunciado text NOT NULL,
    opcion_a text,
    opcion_b text,
    opcion_c text,
    opcion_d text,
    correcta character(1),
    estado text,
    dificultad integer,
    articulo_base text,
    explicacion text,
    enunciado_examen text,
    respuesta_modelo text,
    puntos_clave text,
    revisado_por text,
    fecha_revision date
);

CREATE TABLE public.supuesto_original_preguntas (
    id_pregunta text NOT NULL,
    id_caso text NOT NULL,
    tipo text,
    orden integer NOT NULL,
    enunciado text NOT NULL,
    opcion_a text,
    opcion_b text,
    opcion_c text,
    opcion_d text,
    correcta character(1),
    dificultad integer,
    articulo_base text,
    explicacion text,
    enunciado_examen text,
    respuesta_modelo text,
    puntos_clave text,
    revisado_por text,
    fecha_revision date
);

CREATE TABLE public.supuestos_oficiales (
    id_caso text NOT NULL,
    tipo text NOT NULL,
    bloque text NOT NULL,
    tema text NOT NULL,
    subtema text,
    titulo text NOT NULL,
    enunciado text NOT NULL,
    dificultad integer,
    anio_convocatoria integer,
    convocatoria text NOT NULL,
    num_supuesto integer,
    par_caso text,
    cuerpo text,
    turno text,
    url_boe text,
    observaciones text,
    created_at timestamp with time zone DEFAULT now(),
    oposicion_id uuid
);

CREATE TABLE public.supuestos_originales (
    id_caso text NOT NULL,
    tipo text NOT NULL,
    bloque text NOT NULL,
    tema text NOT NULL,
    subtema text,
    titulo text NOT NULL,
    enunciado text NOT NULL,
    dificultad integer,
    convocatoria text,
    orden integer GENERATED ALWAYS AS (("substring"(id_caso, 'CP-SIM-(\d+)'::text))::integer) STORED,
    created_at timestamp with time zone DEFAULT now(),
    oposicion_id uuid
);

CREATE TABLE public.tema_epigrafe (
    tema_id uuid NOT NULL,
    epigrafe_id uuid NOT NULL,
    orden integer
);

CREATE TABLE public.temas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bloque_id uuid NOT NULL,
    oposicion_id uuid NOT NULL,
    numero integer NOT NULL,
    titulo text NOT NULL,
    legislacion_base text,
    transversal_c1_c2 boolean DEFAULT false,
    dificultad_estimada integer DEFAULT 3,
    peso_examen real DEFAULT 1.0,
    num_preguntas_banco integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    pct_tiempo numeric(5,4),
    peso_test numeric(5,4),
    peso_practico numeric(5,4),
    dificultad smallint,
    densidad smallint,
    num_palabras integer,
    titulo_corto text
);

CREATE TABLE public.usuario_oposicion (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    oposicion_id uuid NOT NULL,
    convocatoria_id uuid,
    modo_planificador text DEFAULT 'exam_date'::text,
    fecha_examen date,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

CREATE VIEW public.v_casos_para_revisar WITH (security_invoker=on) AS
 WITH ultima_respuesta AS (
         SELECT DISTINCT ON (pregunta_respondida.user_id, pregunta_respondida.tipo_pregunta, pregunta_respondida.id_caso, pregunta_respondida.id_pregunta) pregunta_respondida.user_id,
            pregunta_respondida.tipo_pregunta,
            pregunta_respondida.id_caso,
            pregunta_respondida.id_pregunta,
            pregunta_respondida.es_correcta,
            pregunta_respondida.respondida_at
           FROM pregunta_respondida
          WHERE pregunta_respondida.id_caso IS NOT NULL AND (pregunta_respondida.tipo_pregunta = ANY (ARRAY['minicaso'::text, 'original'::text, 'oficial'::text]))
          ORDER BY pregunta_respondida.user_id, pregunta_respondida.tipo_pregunta, pregunta_respondida.id_caso, pregunta_respondida.id_pregunta, pregunta_respondida.respondida_at DESC
        )
 SELECT user_id,
    tipo_pregunta,
    id_caso,
    count(*)::integer AS contestadas,
    sum(
        CASE
            WHEN es_correcta THEN 1
            ELSE 0
        END)::integer AS aciertos,
    round(sum(
        CASE
            WHEN es_correcta THEN 1
            ELSE 0
        END)::numeric / NULLIF(count(*), 0)::numeric * 100::numeric, 1) AS pct_aciertos,
    max(respondida_at) AS ultima_at
   FROM ultima_respuesta
  GROUP BY user_id, tipo_pregunta, id_caso
 HAVING count(*) >= 1 AND (sum(
        CASE
            WHEN es_correcta THEN 1
            ELSE 0
        END)::numeric / count(*)::numeric * 100::numeric) < 80::numeric;

CREATE VIEW public.v_estado_pregunta_usuario WITH (security_invoker=on) AS
 WITH ultima AS (
         SELECT DISTINCT ON (respuestas_usuario.user_id, respuestas_usuario.pregunta_id) respuestas_usuario.user_id,
            respuestas_usuario.pregunta_id,
            respuestas_usuario.es_correcta,
            respuestas_usuario.created_at
           FROM respuestas_usuario
          ORDER BY respuestas_usuario.user_id, respuestas_usuario.pregunta_id, respuestas_usuario.created_at DESC
        ), historico AS (
         SELECT respuestas_usuario.user_id,
            respuestas_usuario.pregunta_id,
            count(*) AS veces_vista,
            count(*) FILTER (WHERE respuestas_usuario.es_correcta = false) AS veces_fallada,
            count(*) FILTER (WHERE respuestas_usuario.es_correcta = true) AS veces_acertada,
            max(respuestas_usuario.created_at) FILTER (WHERE respuestas_usuario.es_correcta = false) AS ultimo_fallo_at
           FROM respuestas_usuario
          GROUP BY respuestas_usuario.user_id, respuestas_usuario.pregunta_id
        ), tema_stats AS (
         SELECT r.user_id,
            p_1.tema_id,
            count(*) AS vistas_tema,
            count(*) FILTER (WHERE r.es_correcta = false) AS fallos_tema
           FROM respuestas_usuario r
             JOIN preguntas p_1 ON p_1.id = r.pregunta_id
          WHERE p_1.tema_id IS NOT NULL
          GROUP BY r.user_id, p_1.tema_id
        )
 SELECT u.user_id,
    u.pregunta_id,
    u.es_correcta AS ultima_correcta,
    u.created_at AS ultima_respuesta_at,
    h.veces_vista,
    h.veces_fallada,
    h.veces_acertada,
    h.ultimo_fallo_at,
        CASE
            WHEN u.es_correcta = false THEN 'pendiente'::text
            WHEN u.es_correcta = true AND h.veces_fallada = 0 THEN 'acertada'::text
            WHEN u.es_correcta = true AND h.veces_acertada < 2 THEN 'en_refuerzo'::text
            ELSE 'dominada'::text
        END AS estado,
    p.tema_id,
    p.dificultad,
    COALESCE(ts.fallos_tema::numeric / NULLIF(ts.vistas_tema, 0)::numeric, 0::numeric) AS debilidad_tema,
    0.45::double precision * LEAST(ln((1 + h.veces_fallada)::double precision) / ln(6::double precision), 1.0::double precision) + (0.30 * COALESCE(exp((- EXTRACT(epoch FROM now() - h.ultimo_fallo_at)) / (14.0 * 86400::numeric)), 0::numeric))::double precision + (0.15 * ((4.0 - COALESCE(p.dificultad, 2)::numeric) / 3.0))::double precision + (0.10 * COALESCE(ts.fallos_tema::numeric / NULLIF(ts.vistas_tema, 0)::numeric, 0::numeric))::double precision AS prioridad_score,
    p.epigrafe_id
   FROM ultima u
     JOIN historico h USING (user_id, pregunta_id)
     LEFT JOIN preguntas p ON p.id = u.pregunta_id
     LEFT JOIN tema_stats ts ON ts.user_id = u.user_id AND ts.tema_id = p.tema_id;

-- public.preguntas_aleatorias(p_epigrafes uuid[], p_excluir uuid[], p_n integer, p_incluir_oficiales boolean) (SECURITY INVOKER, de postgres)
-- permisos: {=X/postgres,postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}
CREATE OR REPLACE FUNCTION public.preguntas_aleatorias(p_epigrafes uuid[], p_excluir uuid[] DEFAULT '{}'::uuid[], p_n integer DEFAULT 20, p_incluir_oficiales boolean DEFAULT false)
 RETURNS SETOF preguntas
 LANGUAGE sql
 STABLE
AS $function$
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
$function$
;

ALTER TABLE ONLY public.bloques ADD CONSTRAINT bloques_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.bloques ADD CONSTRAINT bloques_unique UNIQUE (oposicion_id, numero);

ALTER TABLE ONLY public.epigrafes ADD CONSTRAINT epigrafes_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.epigrafes ADD CONSTRAINT epigrafes_tema_id_titulo_original_key UNIQUE (tema_id, titulo_original);

ALTER TABLE ONLY public.marcado_items ADD CONSTRAINT marcado_items_dificultad_check CHECK (((dificultad >= 1) AND (dificultad <= 3)));

ALTER TABLE ONLY public.marcado_items ADD CONSTRAINT marcado_items_fuente_check CHECK ((fuente = ANY (ARRAY['propia'::text, 'conv_real'::text])));

ALTER TABLE ONLY public.marcado_items ADD CONSTRAINT marcado_items_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.marcado_items ADD CONSTRAINT marcado_items_tipo_check CHECK ((tipo = ANY (ARRAY['ortografia'::text, 'gramatica'::text])));

ALTER TABLE ONLY public.marcado_unidades ADD CONSTRAINT marcado_unidades_item_id_orden_key UNIQUE (item_id, orden);

ALTER TABLE ONLY public.marcado_unidades ADD CONSTRAINT marcado_unidades_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.minicaso_preguntas ADD CONSTRAINT minicaso_preguntas_correcta_check CHECK ((correcta = ANY (ARRAY['a'::bpchar, 'b'::bpchar, 'c'::bpchar, 'd'::bpchar])));

ALTER TABLE ONLY public.minicaso_preguntas ADD CONSTRAINT minicaso_preguntas_id_caso_num_pregunta_key UNIQUE (id_caso, num_pregunta);

ALTER TABLE ONLY public.minicaso_preguntas ADD CONSTRAINT minicaso_preguntas_pkey PRIMARY KEY (id_pregunta);

ALTER TABLE ONLY public.minicasos ADD CONSTRAINT minicasos_modo_check CHECK ((modo = ANY (ARRAY['hilado'::text, 'suelto'::text])));

ALTER TABLE ONLY public.minicasos ADD CONSTRAINT minicasos_pkey PRIMARY KEY (id_caso);

ALTER TABLE ONLY public.oposiciones ADD CONSTRAINT oposiciones_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.oposiciones ADD CONSTRAINT oposiciones_slug_key UNIQUE (slug);

ALTER TABLE ONLY public.oposiciones ADD CONSTRAINT oposiciones_version_so_check CHECK ((version_so = ANY (ARRAY['win10'::text, 'win11'::text])));

ALTER TABLE ONLY public.pregunta_respondida ADD CONSTRAINT pregunta_respondida_modo_check CHECK ((modo = ANY (ARRAY['practica'::text, 'repaso_fallos'::text, 'examen_real'::text, 'simulacro'::text, 'supuesto'::text])));

ALTER TABLE ONLY public.pregunta_respondida ADD CONSTRAINT pregunta_respondida_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.pregunta_respondida ADD CONSTRAINT pregunta_respondida_respuesta_check CHECK ((respuesta = ANY (ARRAY['a'::bpchar, 'b'::bpchar, 'c'::bpchar, 'd'::bpchar, 'A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar])));

ALTER TABLE ONLY public.pregunta_respondida ADD CONSTRAINT pregunta_respondida_tipo_pregunta_check CHECK ((tipo_pregunta = ANY (ARRAY['test'::text, 'minicaso'::text, 'original'::text, 'oficial'::text])));

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_codigo_key UNIQUE (codigo);

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_dificultad_check CHECK (((dificultad >= 1) AND (dificultad <= 5)));

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_estado_check CHECK ((estado = ANY (ARRAY['pendiente'::text, 'verificada'::text, 'retirada'::text])));

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_fuente_check CHECK ((fuente = ANY (ARRAY['conv_real'::text, 'propia'::text, 'ia_revisada'::text, 'adaptada'::text])));

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_respuesta_correcta_check CHECK ((respuesta_correcta = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar])));

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_version_so_check CHECK ((version_so = ANY (ARRAY['win10'::text, 'win11'::text])));

ALTER TABLE ONLY public.psico_items_graficos ADD CONSTRAINT psico_graficos_4_opciones CHECK ((jsonb_array_length(opciones) = 4));

ALTER TABLE ONLY public.psico_items_graficos ADD CONSTRAINT psico_items_graficos_correcta_check CHECK ((correcta = ANY (ARRAY['A'::text, 'B'::text, 'C'::text, 'D'::text])));

ALTER TABLE ONLY public.psico_items_graficos ADD CONSTRAINT psico_items_graficos_dificultad_check CHECK (((dificultad >= 1) AND (dificultad <= 3)));

ALTER TABLE ONLY public.psico_items_graficos ADD CONSTRAINT psico_items_graficos_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.respuestas_usuario ADD CONSTRAINT respuestas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.respuestas_usuario ADD CONSTRAINT respuestas_usuario_modo_check CHECK ((modo = ANY (ARRAY['practica'::text, 'examen'::text, 'examen_real'::text, 'simulacro'::text, 'repaso_fallos'::text, 'sesion_expres'::text, 'test_rapido'::text])));

ALTER TABLE ONLY public.respuestas_usuario ADD CONSTRAINT respuestas_usuario_respuesta_check CHECK ((respuesta = ANY (ARRAY['A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar, NULL::bpchar])));

ALTER TABLE ONLY public.respuestas_usuario ADD CONSTRAINT respuestas_usuario_tipo_fallo_check CHECK ((tipo_fallo = ANY (ARRAY['no_sabia'::text, 'confusion_opciones'::text, 'trampa_enunciado'::text, NULL::text])));

ALTER TABLE ONLY public.simulacro_sesiones ADD CONSTRAINT simulacro_sesiones_detalle_no_vacio CHECK ((jsonb_array_length(detalle) > 0));

ALTER TABLE ONLY public.simulacro_sesiones ADD CONSTRAINT simulacro_sesiones_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.simulacros ADD CONSTRAINT simulacros_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_duracion_min_check CHECK ((duracion_min >= 0));

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_tipo_check CHECK ((tipo = ANY (ARRAY['pomodoro_focus'::text, 'test'::text, 'flashcards'::text, 'simulacro'::text, 'supuesto'::text, 'minicaso'::text, 'lectura'::text, 'marcado'::text, 'psico'::text])));

ALTER TABLE ONLY public.supuesto_oficial_preguntas ADD CONSTRAINT supuesto_oficial_preguntas_correcta_check CHECK ((correcta = ANY (ARRAY['a'::bpchar, 'b'::bpchar, 'c'::bpchar, 'd'::bpchar, 'A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar])));

ALTER TABLE ONLY public.supuesto_oficial_preguntas ADD CONSTRAINT supuesto_oficial_preguntas_dificultad_check CHECK (((dificultad >= 1) AND (dificultad <= 3)));

ALTER TABLE ONLY public.supuesto_oficial_preguntas ADD CONSTRAINT supuesto_oficial_preguntas_id_caso_orden_key UNIQUE (id_caso, orden);

ALTER TABLE ONLY public.supuesto_oficial_preguntas ADD CONSTRAINT supuesto_oficial_preguntas_jugable CHECK ((((opcion_a IS NOT NULL) AND (opcion_b IS NOT NULL) AND (opcion_c IS NOT NULL) AND (opcion_d IS NOT NULL) AND (correcta IS NOT NULL)) OR (COALESCE(btrim(puntos_clave), ''::text) <> ''::text)));

ALTER TABLE ONLY public.supuesto_oficial_preguntas ADD CONSTRAINT supuesto_oficial_preguntas_pkey PRIMARY KEY (id_pregunta);

ALTER TABLE ONLY public.supuesto_original_preguntas ADD CONSTRAINT supuesto_original_preguntas_jugable CHECK ((((opcion_a IS NOT NULL) AND (opcion_b IS NOT NULL) AND (opcion_c IS NOT NULL) AND (opcion_d IS NOT NULL) AND (correcta IS NOT NULL)) OR (COALESCE(btrim(puntos_clave), ''::text) <> ''::text)));

ALTER TABLE ONLY public.supuesto_original_preguntas ADD CONSTRAINT supuesto_persevera_preguntas_correcta_check CHECK ((correcta = ANY (ARRAY['a'::bpchar, 'b'::bpchar, 'c'::bpchar, 'd'::bpchar, 'A'::bpchar, 'B'::bpchar, 'C'::bpchar, 'D'::bpchar])));

ALTER TABLE ONLY public.supuesto_original_preguntas ADD CONSTRAINT supuesto_persevera_preguntas_dificultad_check CHECK (((dificultad >= 1) AND (dificultad <= 3)));

ALTER TABLE ONLY public.supuesto_original_preguntas ADD CONSTRAINT supuesto_persevera_preguntas_id_caso_orden_key UNIQUE (id_caso, orden);

ALTER TABLE ONLY public.supuesto_original_preguntas ADD CONSTRAINT supuesto_persevera_preguntas_pkey PRIMARY KEY (id_pregunta);

ALTER TABLE ONLY public.supuestos_oficiales ADD CONSTRAINT supuestos_oficiales_dificultad_check CHECK (((dificultad >= 1) AND (dificultad <= 3)));

ALTER TABLE ONLY public.supuestos_oficiales ADD CONSTRAINT supuestos_oficiales_num_supuesto_check CHECK (((num_supuesto IS NULL) OR ((num_supuesto >= 1) AND (num_supuesto <= 20))));

ALTER TABLE ONLY public.supuestos_oficiales ADD CONSTRAINT supuestos_oficiales_pkey PRIMARY KEY (id_caso);

ALTER TABLE ONLY public.supuestos_originales ADD CONSTRAINT supuestos_persevera_dificultad_check CHECK (((dificultad >= 1) AND (dificultad <= 3)));

ALTER TABLE ONLY public.supuestos_originales ADD CONSTRAINT supuestos_persevera_pkey PRIMARY KEY (id_caso);

ALTER TABLE ONLY public.tema_epigrafe ADD CONSTRAINT tema_epigrafe_pkey PRIMARY KEY (tema_id, epigrafe_id);

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_densidad_range CHECK (((densidad IS NULL) OR ((densidad >= 1) AND (densidad <= 5))));

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_dificultad_estimada_check CHECK (((dificultad_estimada >= 1) AND (dificultad_estimada <= 5)));

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_dificultad_range CHECK (((dificultad IS NULL) OR ((dificultad >= 1) AND (dificultad <= 5))));

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_pct_tiempo_range CHECK (((pct_tiempo IS NULL) OR ((pct_tiempo >= (0)::numeric) AND (pct_tiempo <= (1)::numeric))));

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_peso_practico_range CHECK (((peso_practico IS NULL) OR ((peso_practico >= (0)::numeric) AND (peso_practico <= (1)::numeric))));

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_peso_test_range CHECK (((peso_test IS NULL) OR ((peso_test >= (0)::numeric) AND (peso_test <= (1)::numeric))));

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_unique UNIQUE (bloque_id, numero);

ALTER TABLE ONLY public.usuario_oposicion ADD CONSTRAINT usuario_oposicion_modo_planificador_check CHECK ((modo_planificador = ANY (ARRAY['exam_date'::text, 'libre'::text])));

ALTER TABLE ONLY public.usuario_oposicion ADD CONSTRAINT usuario_oposicion_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.usuario_oposicion ADD CONSTRAINT usuario_oposicion_user_id_key UNIQUE (user_id);

ALTER TABLE ONLY public.bloques ADD CONSTRAINT bloques_oposicion_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.epigrafes ADD CONSTRAINT epigrafes_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.marcado_items ADD CONSTRAINT marcado_items_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.marcado_items ADD CONSTRAINT marcado_items_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.marcado_unidades ADD CONSTRAINT marcado_unidades_item_id_fkey FOREIGN KEY (item_id) REFERENCES marcado_items(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.minicaso_preguntas ADD CONSTRAINT minicaso_preguntas_id_caso_fkey FOREIGN KEY (id_caso) REFERENCES minicasos(id_caso) ON DELETE CASCADE;

ALTER TABLE ONLY public.minicasos ADD CONSTRAINT minicasos_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.pregunta_respondida ADD CONSTRAINT pregunta_respondida_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_epigrafe_id_fkey FOREIGN KEY (epigrafe_id) REFERENCES epigrafes(id);

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_subtema_fkey FOREIGN KEY (subtema_id) REFERENCES subtemas(id);

ALTER TABLE ONLY public.preguntas ADD CONSTRAINT preguntas_tema_fkey FOREIGN KEY (tema_id) REFERENCES temas(id);

ALTER TABLE ONLY public.psico_items_graficos ADD CONSTRAINT psico_items_graficos_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.respuestas_usuario ADD CONSTRAINT respuestas_pregunta_fkey FOREIGN KEY (pregunta_id) REFERENCES preguntas(id);

ALTER TABLE ONLY public.respuestas_usuario ADD CONSTRAINT respuestas_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.respuestas_usuario ADD CONSTRAINT respuestas_usuario_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.simulacro_sesiones ADD CONSTRAINT simulacro_sesiones_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.simulacro_sesiones ADD CONSTRAINT simulacro_sesiones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.simulacros ADD CONSTRAINT simulacros_oposicion_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.simulacros ADD CONSTRAINT simulacros_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_bloque_id_fkey FOREIGN KEY (bloque_id) REFERENCES bloques(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES study_plans(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_step_id_fkey FOREIGN KEY (step_id) REFERENCES study_sessions(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE SET NULL;

ALTER TABLE ONLY public.study_activity_log ADD CONSTRAINT study_activity_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.supuesto_oficial_preguntas ADD CONSTRAINT supuesto_oficial_preguntas_id_caso_fkey FOREIGN KEY (id_caso) REFERENCES supuestos_oficiales(id_caso) ON DELETE CASCADE;

ALTER TABLE ONLY public.supuesto_original_preguntas ADD CONSTRAINT supuesto_original_preguntas_id_caso_fkey FOREIGN KEY (id_caso) REFERENCES supuestos_originales(id_caso) ON DELETE CASCADE;

ALTER TABLE ONLY public.supuestos_oficiales ADD CONSTRAINT supuestos_oficiales_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.supuestos_oficiales ADD CONSTRAINT supuestos_oficiales_par_caso_fkey FOREIGN KEY (par_caso) REFERENCES supuestos_oficiales(id_caso) DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE ONLY public.supuestos_originales ADD CONSTRAINT supuestos_originales_oposicion_id_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.tema_epigrafe ADD CONSTRAINT tema_epigrafe_epigrafe_id_fkey FOREIGN KEY (epigrafe_id) REFERENCES epigrafes(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.tema_epigrafe ADD CONSTRAINT tema_epigrafe_tema_id_fkey FOREIGN KEY (tema_id) REFERENCES temas(id) ON DELETE CASCADE;

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_bloque_fkey FOREIGN KEY (bloque_id) REFERENCES bloques(id);

ALTER TABLE ONLY public.temas ADD CONSTRAINT temas_oposicion_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.usuario_oposicion ADD CONSTRAINT usuario_oposicion_oposicion_fkey FOREIGN KEY (oposicion_id) REFERENCES oposiciones(id);

ALTER TABLE ONLY public.usuario_oposicion ADD CONSTRAINT usuario_oposicion_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

CREATE INDEX idx_bloques_oposicion ON public.bloques USING btree (oposicion_id);

CREATE INDEX idx_epigrafes_tema ON public.epigrafes USING btree (tema_id);

CREATE INDEX idx_marcado_items_fuente ON public.marcado_items USING btree (oposicion_id, tipo, fuente, convocatoria_fuente);

CREATE INDEX idx_marcado_items_opo_tipo ON public.marcado_items USING btree (oposicion_id, tipo, estado);

CREATE INDEX idx_marcado_unidades_item ON public.marcado_unidades USING btree (item_id, orden);

CREATE INDEX minicaso_preguntas_id_caso_idx ON public.minicaso_preguntas USING btree (id_caso);

CREATE INDEX idx_minicasos_oposicion ON public.minicasos USING btree (oposicion_id);

CREATE INDEX minicasos_bloque_tema_epigrafe_principal_orden_idx ON public.minicasos USING btree (bloque, tema, epigrafe_principal, orden);

CREATE INDEX pregunta_respondida_user_id_es_correcta_respondida_at_idx ON public.pregunta_respondida USING btree (user_id, es_correcta, respondida_at DESC);

CREATE INDEX pregunta_respondida_user_id_modo_idx ON public.pregunta_respondida USING btree (user_id, modo);

CREATE INDEX pregunta_respondida_user_id_tipo_pregunta_id_caso_idx ON public.pregunta_respondida USING btree (user_id, tipo_pregunta, id_caso);

CREATE INDEX pregunta_respondida_user_id_tipo_pregunta_id_pregunta_idx ON public.pregunta_respondida USING btree (user_id, tipo_pregunta, id_pregunta);

CREATE INDEX idx_preguntas_dificultad ON public.preguntas USING btree (dificultad);

CREATE INDEX idx_preguntas_epigrafe_id ON public.preguntas USING btree (epigrafe_id);

CREATE INDEX idx_preguntas_estado ON public.preguntas USING btree (estado);

CREATE INDEX idx_preguntas_oposicion ON public.preguntas USING btree (oposicion_id);

CREATE INDEX idx_preguntas_oposiciones ON public.preguntas USING gin (oposiciones_aplicables);

CREATE INDEX idx_preguntas_tema ON public.preguntas USING btree (tema_id);

CREATE INDEX idx_preguntas_version_so ON public.preguntas USING btree (version_so) WHERE (version_so IS NOT NULL);

CREATE INDEX preguntas_conv_orden_idx ON public.preguntas USING btree (oposicion_id, convocatoria_fuente, orden_examen) WHERE (fuente = 'conv_real'::text);

CREATE INDEX idx_psico_graficos_opo_tipo ON public.psico_items_graficos USING btree (oposicion_id, tipo, estado);

CREATE INDEX idx_respuestas_created ON public.respuestas_usuario USING btree (created_at DESC);

CREATE INDEX idx_respuestas_pregunta ON public.respuestas_usuario USING btree (pregunta_id);

CREATE INDEX idx_respuestas_user ON public.respuestas_usuario USING btree (user_id);

CREATE INDEX idx_respuestas_usuario_oposicion ON public.respuestas_usuario USING btree (user_id, oposicion_id);

CREATE INDEX idx_simulacro_sesiones_user_opo_fecha ON public.simulacro_sesiones USING btree (user_id, oposicion_id, fecha DESC);

CREATE INDEX idx_simulacros_fecha ON public.simulacros USING btree (fecha DESC);

CREATE INDEX idx_simulacros_user ON public.simulacros USING btree (user_id);

CREATE INDEX idx_sal_user_bloque ON public.study_activity_log USING btree (user_id, bloque_id) WHERE (bloque_id IS NOT NULL);

CREATE INDEX idx_sal_user_day ON public.study_activity_log USING btree (user_id, (((started_at AT TIME ZONE 'UTC'::text))::date));

CREATE INDEX idx_sal_user_started ON public.study_activity_log USING btree (user_id, started_at DESC);

CREATE INDEX idx_sal_user_step ON public.study_activity_log USING btree (user_id, step_id) WHERE (step_id IS NOT NULL);

CREATE INDEX idx_sal_user_tema ON public.study_activity_log USING btree (user_id, tema_id) WHERE (tema_id IS NOT NULL);

CREATE INDEX idx_sal_user_tipo_started ON public.study_activity_log USING btree (user_id, tipo, started_at DESC);

CREATE INDEX idx_study_activity_log_user_oposicion ON public.study_activity_log USING btree (user_id, oposicion_id);

CREATE INDEX supuesto_oficial_preguntas_id_caso_idx ON public.supuesto_oficial_preguntas USING btree (id_caso);

CREATE INDEX supuesto_original_preguntas_id_caso_idx ON public.supuesto_original_preguntas USING btree (id_caso);

CREATE INDEX idx_sup_ofi_oposicion ON public.supuestos_oficiales USING btree (oposicion_id);

CREATE INDEX supuestos_oficiales_anio_convocatoria_convocatoria_num_supu_idx ON public.supuestos_oficiales USING btree (anio_convocatoria, convocatoria, num_supuesto);

CREATE INDEX idx_sup_orig_oposicion ON public.supuestos_originales USING btree (oposicion_id);

CREATE INDEX supuestos_originales_bloque_orden_idx ON public.supuestos_originales USING btree (bloque, orden);

CREATE INDEX idx_tema_epigrafe_epigrafe ON public.tema_epigrafe USING btree (epigrafe_id);

CREATE INDEX idx_temas_oposicion ON public.temas USING btree (oposicion_id);

ALTER TABLE public.bloques ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.epigrafes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.marcado_items ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.marcado_unidades ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.minicaso_preguntas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.minicasos ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.oposiciones ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.pregunta_respondida ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.preguntas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.psico_items_graficos ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.respuestas_usuario ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.simulacro_sesiones ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.simulacros ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.study_activity_log ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.supuesto_oficial_preguntas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.supuesto_original_preguntas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.supuestos_oficiales ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.supuestos_originales ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.tema_epigrafe ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.temas ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.usuario_oposicion ENABLE ROW LEVEL SECURITY;

CREATE POLICY read_authenticated ON public.bloques AS PERMISSIVE FOR SELECT TO public
  USING ((auth.role() = 'authenticated'::text));

CREATE POLICY "Epigrafes legibles por todos" ON public.epigrafes AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY marcado_items_read ON public.marcado_items AS PERMISSIVE FOR SELECT TO authenticated
  USING (true);

CREATE POLICY marcado_unidades_read ON public.marcado_unidades AS PERMISSIVE FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Lectura pública minicaso_preg" ON public.minicaso_preguntas AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY "Lectura pública minicasos" ON public.minicasos AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY read_authenticated ON public.oposiciones AS PERMISSIVE FOR SELECT TO public
  USING ((auth.role() = 'authenticated'::text));

CREATE POLICY own_delete ON public.pregunta_respondida AS PERMISSIVE FOR DELETE TO public
  USING ((auth.uid() = user_id));

CREATE POLICY own_insert ON public.pregunta_respondida AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY own_select ON public.pregunta_respondida AS PERMISSIVE FOR SELECT TO public
  USING ((auth.uid() = user_id));

CREATE POLICY own_update ON public.pregunta_respondida AS PERMISSIVE FOR UPDATE TO public
  USING ((auth.uid() = user_id));

CREATE POLICY read_verified_only ON public.preguntas AS PERMISSIVE FOR SELECT TO public
  USING (((auth.role() = 'authenticated'::text) AND (estado = 'verificada'::text)));

CREATE POLICY psico_items_graficos_read ON public.psico_items_graficos AS PERMISSIVE FOR SELECT TO authenticated
  USING (true);

CREATE POLICY own_data ON public.respuestas_usuario AS PERMISSIVE FOR ALL TO public
  USING ((auth.uid() = user_id));

CREATE POLICY simulacro_sesiones_insert_propias ON public.simulacro_sesiones AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY simulacro_sesiones_select_propias ON public.simulacro_sesiones AS PERMISSIVE FOR SELECT TO authenticated
  USING ((auth.uid() = user_id));

CREATE POLICY own_data ON public.simulacros AS PERMISSIVE FOR ALL TO public
  USING ((auth.uid() = user_id));

CREATE POLICY sal_insert_own ON public.study_activity_log AS PERMISSIVE FOR INSERT TO public
  WITH CHECK ((auth.uid() = user_id));

CREATE POLICY sal_select_own ON public.study_activity_log AS PERMISSIVE FOR SELECT TO public
  USING ((auth.uid() = user_id));

CREATE POLICY "Lectura pública real_preg" ON public.supuesto_oficial_preguntas AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY "Lectura pública sim_preg" ON public.supuesto_original_preguntas AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY "Lectura pública real" ON public.supuestos_oficiales AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY "Lectura pública sim" ON public.supuestos_originales AS PERMISSIVE FOR SELECT TO public
  USING (true);

CREATE POLICY read_authenticated ON public.tema_epigrafe AS PERMISSIVE FOR SELECT TO authenticated
  USING (true);

CREATE POLICY read_authenticated ON public.temas AS PERMISSIVE FOR SELECT TO public
  USING ((auth.role() = 'authenticated'::text));

CREATE POLICY own_data ON public.usuario_oposicion AS PERMISSIVE FOR ALL TO public
  USING ((auth.uid() = user_id));

CREATE POLICY usuario_oposicion_insert_own ON public.usuario_oposicion AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK ((user_id = auth.uid()));

CREATE POLICY usuario_oposicion_select_own ON public.usuario_oposicion AS PERMISSIVE FOR SELECT TO authenticated
  USING ((user_id = auth.uid()));

CREATE POLICY usuario_oposicion_update_own ON public.usuario_oposicion AS PERMISSIVE FOR UPDATE TO authenticated
  USING ((user_id = auth.uid()))
  WITH CHECK ((user_id = auth.uid()));

CREATE TRIGGER trg_respuesta_oposicion_id BEFORE INSERT ON public.respuestas_usuario FOR EACH ROW EXECUTE FUNCTION set_respuesta_oposicion_id();

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.bloques TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.bloques TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.bloques TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.epigrafes TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.epigrafes TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.marcado_items TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.marcado_items TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.marcado_items TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.marcado_unidades TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.marcado_unidades TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.marcado_unidades TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.minicaso_preguntas TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.minicaso_preguntas TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.minicasos TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.minicasos TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.oposiciones TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.oposiciones TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.oposiciones TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.pregunta_respondida TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.pregunta_respondida TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.pregunta_respondida TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.preguntas TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.preguntas TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.preguntas TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.psico_items_graficos TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.psico_items_graficos TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.psico_items_graficos TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.respuestas_usuario TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.respuestas_usuario TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.respuestas_usuario TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.simulacro_sesiones TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.simulacro_sesiones TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.simulacro_sesiones TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.simulacros TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.simulacros TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.simulacros TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.study_activity_log TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.study_activity_log TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.study_activity_log TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuesto_oficial_preguntas TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuesto_oficial_preguntas TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuesto_original_preguntas TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuesto_original_preguntas TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuestos_oficiales TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuestos_oficiales TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuestos_originales TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.supuestos_originales TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.tema_epigrafe TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.tema_epigrafe TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.tema_epigrafe TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.temas TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.temas TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.temas TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.usuario_oposicion TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.usuario_oposicion TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.usuario_oposicion TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.v_casos_para_revisar TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.v_casos_para_revisar TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.v_casos_para_revisar TO service_role;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.v_estado_pregunta_usuario TO anon;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.v_estado_pregunta_usuario TO authenticated;

GRANT DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE ON TABLE public.v_estado_pregunta_usuario TO service_role;

-- dependencia: public.bloques | política read_authenticated | auth.role() | 

-- dependencia: public.oposiciones | política read_authenticated | auth.role() | 

-- dependencia: public.pregunta_respondida | política own_delete | auth.uid() | 

-- dependencia: public.pregunta_respondida | política own_insert | auth.uid() | 

-- dependencia: public.pregunta_respondida | política own_select | auth.uid() | 

-- dependencia: public.pregunta_respondida | política own_update | auth.uid() | 

-- dependencia: public.preguntas | política read_verified_only | auth.role() | 

-- dependencia: public.respuestas_usuario | disparador trg_respuesta_oposicion_id | public.set_respuesta_oposicion_id() | 

-- dependencia: public.respuestas_usuario | política own_data | auth.uid() | 

-- dependencia: public.simulacro_sesiones | política simulacro_sesiones_insert_propias | auth.uid() | 

-- dependencia: public.simulacro_sesiones | política simulacro_sesiones_select_propias | auth.uid() | 

-- dependencia: public.simulacros | política own_data | auth.uid() | 

-- dependencia: public.study_activity_log | política sal_insert_own | auth.uid() | 

-- dependencia: public.study_activity_log | política sal_select_own | auth.uid() | 

-- dependencia: public.temas | política read_authenticated | auth.role() | 

-- dependencia: public.usuario_oposicion | política own_data | auth.uid() | 

-- dependencia: public.usuario_oposicion | política usuario_oposicion_insert_own | auth.uid() | 

-- dependencia: public.usuario_oposicion | política usuario_oposicion_select_own | auth.uid() | 

-- dependencia: public.usuario_oposicion | política usuario_oposicion_update_own | auth.uid() | 

-- FIN del esquema de A3.
