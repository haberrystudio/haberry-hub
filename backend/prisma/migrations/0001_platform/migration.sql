BEGIN;

CREATE TABLE platform_admins (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE CHECK (email = lower(email)),
  password_hash text NOT NULL,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE platform_sessions (
  token_hash text PRIMARY KEY,
  admin_id bigint NOT NULL REFERENCES platform_admins(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);

CREATE INDEX platform_sessions_expiry_idx ON platform_sessions (expires_at);

COMMIT;
