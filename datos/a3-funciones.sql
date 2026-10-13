-- A3: el texto de las funciones de public de las que dependen las tablas y vistas de A3, las que
-- esas funciones llaman por dentro (a cualquier profundidad), las que se piden por nombre y los enum
-- propios. De docs/guia-consolas.md, bloque 2.4, con la búsqueda de las llamadas ya hecha aquí en vez
-- de a mano. Lo lanza datos/a3.sh. Solo lee: la sesión entera va en modo solo lectura.
set session characteristics as transaction read only;
set search_path = pg_catalog;  -- así los nombres salen con su esquema (public.x)
\pset tuples_only on
\pset format unaligned
with recursive objetivo(rel) as (
  select c.oid from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relname = any (array[
     'oposiciones','bloques','temas','epigrafes','tema_epigrafe','preguntas',
     'minicasos','minicaso_preguntas','supuestos_originales','supuesto_original_preguntas',
     'supuestos_oficiales','supuesto_oficial_preguntas','marcado_items','marcado_unidades','psico_items_graficos',
     'usuario_oposicion','respuestas_usuario','pregunta_respondida','study_activity_log','simulacros','simulacro_sesiones',
     'v_casos_para_revisar','v_estado_pregunta_usuario'])
),
-- Las funciones de public que no son de una extensión: son las únicas cuyo cuerpo se lee.
propias(oid, proname, prosrc) as (
  select p.oid, p.proname, p.prosrc from pg_proc p
   where p.pronamespace = 'public'::regnamespace and p.prokind in ('f', 'p')
     and not exists (select 1 from pg_depend e
                      where e.classid = 'pg_proc'::regclass and e.objid = p.oid and e.deptype = 'e')
),
base(fn) as (
  select t.tgfoid from pg_trigger t where not t.tgisinternal and t.tgrelid in (select rel from objetivo)
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
  select oid from propias where proname = any (array['preguntas_aleatorias'])  -- pedidas por nombre
),
-- Y las que llaman por dentro: su nombre seguido de «(» en el cuerpo de una que ya está.
-- Puede traer alguna de más (un nombre en un comentario), nunca de menos salvo llamadas con EXECUTE.
cierre(fn) as (
  select fn from base
  union
  select q.oid
    from cierre c
    join propias p on p.oid = c.fn
    join propias q on p.prosrc ~ ('\m' || q.proname || '\s*\(')
)
select case
         when exists (select 1 from pg_depend e
                       where e.classid = 'pg_proc'::regclass and e.objid = p.oid and e.deptype = 'e')
         then format(E'-- FUNCTION %s es de la extensión %s: no se copia, se instala la extensión.\n',
                     p.oid::regprocedure,
                     (select x.extname from pg_depend e join pg_extension x on x.oid = e.refobjid
                       where e.classid = 'pg_proc'::regclass and e.objid = p.oid and e.deptype = 'e' limit 1))
         else format(E'-- %s (%s, de %s)\n-- permisos: %s\n%s;\n',
                     p.oid::regprocedure,
                     case when p.prosecdef then 'SECURITY DEFINER' else 'SECURITY INVOKER' end,
                     pg_get_userbyid(p.proowner),
                     coalesce(p.proacl::text, 'los de serie (EXECUTE para PUBLIC)'),
                     pg_get_functiondef(p.oid))
       end
  from cierre join pg_proc p on p.oid = cierre.fn join pg_namespace n on n.oid = p.pronamespace
 where n.nspname = 'public' and p.prokind in ('f', 'p')
 order by p.oid::regprocedure::text;
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
 group by t.oid
 order by t.oid::regtype::text;
