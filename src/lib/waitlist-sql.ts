/**
 * Every statement the waitlist runs, in one place.
 *
 * Plain parameterised SQL rather than the driver's tagged templates, so the
 * exact same strings can be run against a throwaway Postgres in the test suite.
 * A query that only exists inside a template literal cannot be tested without
 * standing up the whole app.
 */

export const SCHEMA = `
  create table if not exists waitlist (
    id              bigint generated always as identity primary key,
    email           text        not null unique,
    source          text        not null,
    consent_text    text        not null,
    consent_version text        not null,
    consent_at      timestamptz not null default now(),
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
  );

  create index if not exists waitlist_created_at_idx
    on waitlist (created_at desc);
`;

/**
 * Sign-up, or a repeat sign-up from someone already on the list.
 *
 * The unique constraint on email makes the address the identity, so a second
 * submission updates one row instead of creating a duplicate.
 *
 * On conflict the consent columns are deliberately left alone. They are the
 * evidence that this person opted in and what they were shown at the time;
 * overwriting them with today's wording would destroy the proof Article 7(1)
 * requires. created_at is left alone for the same reason.
 */
export const UPSERT = `
  insert into waitlist (email, source, consent_text, consent_version)
  values ($1, $2, $3, $4)
  on conflict (email) do update
    set source     = excluded.source,
        updated_at = now()
  returning (xmax = 0) as is_new
`;

/** Article 17. Erasure removes the row; it does not flag it as inactive. */
export const DELETE_BY_EMAIL = `
  delete from waitlist where email = $1
`;

/** Used by the export script on launch day. */
export const SELECT_ALL = `
  select email, source, consent_text, consent_version,
         consent_at, created_at, updated_at
  from waitlist
  order by created_at asc
`;
