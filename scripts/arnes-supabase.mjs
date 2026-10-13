// =========================================================================
// PERSEVERA TESTS: lo de Supabase para probar la base en PGlite
// =========================================================================
// Copiado de persevera-oral/scripts/arnes-supabase.mjs (rama main, commit
// b8e151a), el 13-oct-2026. Cambiado aquí: solo esta cabecera. Lo usa
// scripts/probar-esquema.mjs. El arnés es el de Persevera
// (scripts/probar-retos-sin-trampas.mjs y probar-cante-*-blindaje.mjs):
//
//   - Los roles de Supabase: anon, authenticated, service_role (BYPASSRLS),
//     authenticator (con el que entra la API y desde el que cambia de rol en
//     cada petición) y supabase_auth_admin, dueño de auth.users, que es quien
//     la borra cuando se borra una cuenta.
//   - Un auth mínimo (auth.users, auth.uid() y auth.role() como los de
//     Supabase) y un storage mínimo (buckets, objects con RLS, foldername).
//   - Cada petición de la app o del servidor, como la hace PostgREST: sesión
//     de authenticator, transacción con SET LOCAL ROLE y el JWT en
//     request.jwt.claims.
// =========================================================================
/** El SQL que deja un Postgres vacío como uno de Supabase, con o sin los GRANT automáticos de antes del 30-oct-2026. */
export const SUPABASE = conGrantsAutomaticos => `
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
create role authenticator login noinherit; grant anon, authenticated, service_role to authenticator;
create role supabase_auth_admin login noinherit;

create schema auth; grant usage on schema auth to anon, authenticated, service_role, supabase_auth_admin;
create table auth.users (id uuid primary key, email text);
alter table auth.users owner to supabase_auth_admin;
create function auth.uid() returns uuid language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub'))::uuid $$;
create function auth.role() returns text language sql stable as $$
  select coalesce(nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role'))::text $$;

grant usage on schema public to anon, authenticated, service_role;
${conGrantsAutomaticos ? `
-- Lo que Supabase da por defecto a lo que se crea en public (hasta el 30-oct-2026).
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;` : ''}

create schema storage; grant usage on schema storage to anon, authenticated, service_role;
create table storage.buckets (id text primary key, name text not null, public boolean default false,
  file_size_limit bigint, allowed_mime_types text[],
  created_at timestamptz default now(), updated_at timestamptz default now());
create table storage.objects (id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id), name text, owner uuid,
  created_at timestamptz default now(), updated_at timestamptz default now(),
  last_accessed_at timestamptz default now(), metadata jsonb, unique (bucket_id, name));
alter table storage.objects enable row level security;
grant all on storage.buckets, storage.objects to anon, authenticated, service_role;
create function storage.foldername(name text) returns text[] language plpgsql as $$
declare _parts text[];
begin
  select string_to_array(name, '/') into _parts;
  return _parts[1:array_length(_parts, 1) - 1];
end $$;
create function storage.filename(name text) returns text language plpgsql as $$
declare _parts text[];
begin
  select string_to_array(name, '/') into _parts;
  return _parts[array_length(_parts, 1)];
end $$;
`

/** Una petición como la hace PostgREST. quien = uuid (con sesión), 'anon' o 'service_role'. */
export async function pedir(db, quien, sql, params = []) {
  const rol = quien === 'anon' || quien === 'service_role' ? quien : 'authenticated'
  const claims = rol === 'authenticated' ? { sub: quien, role: rol } : { role: rol }
  await db.exec('set session authorization authenticator')
  try {
    return await db.transaction(async tx => {
      await tx.exec(`set local role ${rol}`)
      await tx.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify(claims)])
      return (await tx.query(sql, params)).rows
    })
  } finally {
    await db.exec('set session authorization postgres')
  }
}

/** Lo mismo, pero devuelve {filas} o {error} en vez de lanzar. */
export const intenta = async (...a) => { try { return { filas: await pedir(...a) } } catch (e) { return { error: e.message } } }
