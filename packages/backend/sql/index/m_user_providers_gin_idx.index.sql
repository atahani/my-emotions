CREATE INDEX IF NOT EXISTS m_user_providers_gin_idx ON m_user USING gin (providers jsonb_path_ops);

