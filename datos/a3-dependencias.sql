-- A3: lo que necesitan las tablas y vistas de A3 y no sale con pg_dump -t (funciones y tipos).
-- De docs/guia-consolas.md, bloque 2.3. Lo lanza datos/a3.sh.
-- Solo lee: la sesión entera va en modo solo lectura.
set session characteristics as transaction read only;
set search_path = pg_catalog;  -- así los nombres salen con su esquema (public.x)
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
