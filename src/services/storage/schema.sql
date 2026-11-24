CREATE TABLE IF NOT EXISTS vitality_job_catalog (
  id boolean PRIMARY KEY DEFAULT true CHECK (id),
  snapshot jsonb,
  failed_at timestamptz,
  lease_token uuid,
  lease_until timestamptz
);

INSERT INTO vitality_job_catalog (id) VALUES (true) ON CONFLICT DO NOTHING;

