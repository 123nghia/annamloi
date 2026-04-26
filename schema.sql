CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE NOT NULL,
  kyc_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (kyc_status IN ('pending', 'submitted', 'verified', 'rejected')),
  role VARCHAR(20) NOT NULL DEFAULT 'investor'
    CHECK (role IN ('investor', 'tenant', 'admin', 'ops')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE deals (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  total_kwp NUMERIC(10,2) NOT NULL CHECK (total_kwp >= 300),
  min_kwp NUMERIC(10,2) NOT NULL DEFAULT 100 CHECK (min_kwp >= 100),
  roi_monthly_min NUMERIC(5,2) NOT NULL DEFAULT 1.80,
  roi_monthly_max NUMERIC(5,2) NOT NULL DEFAULT 2.00,
  status VARCHAR(20) NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'funding', 'closed', 'commissioning', 'operating', 'paused')),
  start_at TIMESTAMPTZ,
  end_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE investments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  deal_id BIGINT NOT NULL REFERENCES deals(id),
  kwp NUMERIC(10,2) NOT NULL CHECK (kwp >= 100),
  amount NUMERIC(18,2) NOT NULL CHECK (amount > 0),
  ownership_ratio NUMERIC(10,6) NOT NULL CHECK (ownership_ratio > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'booked'
    CHECK (status IN ('booked', 'paid', 'cancelled', 'active')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, deal_id)
);

CREATE TABLE contracts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  deal_id BIGINT NOT NULL REFERENCES deals(id),
  signed_status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (signed_status IN ('pending', 'sent', 'signed', 'rejected')),
  contract_url TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE payments (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  deal_id BIGINT NOT NULL REFERENCES deals(id),
  amount NUMERIC(18,2) NOT NULL CHECK (amount >= 0),
  month DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'paid', 'failed')),
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, deal_id, month)
);

CREATE INDEX idx_deals_status_end_at ON deals(status, end_at);
CREATE INDEX idx_investments_user ON investments(user_id);
CREATE INDEX idx_investments_deal ON investments(deal_id);
CREATE INDEX idx_contracts_user_deal ON contracts(user_id, deal_id);
CREATE INDEX idx_payments_user_month ON payments(user_id, month);
