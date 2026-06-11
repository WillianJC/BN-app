CREATE TABLE IF NOT EXISTS credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  "credentialId" TEXT NOT NULL UNIQUE,
  "publicKey" TEXT NOT NULL,
  counter INTEGER NOT NULL DEFAULT 0,
  transports TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credentials_userId ON credentials("userId");
CREATE INDEX IF NOT EXISTS idx_credentials_credentialId ON credentials("credentialId");
