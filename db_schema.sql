-- =====================================================
-- رايا - نظام الراية الزرقاء المحاسبي
-- PostgreSQL Schema
-- =====================================================

-- ===== الموارد / المواد =====
CREATE TABLE IF NOT EXISTS items (
  code        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  cat         TEXT,
  unit        TEXT DEFAULT 'وحدة',
  price       NUMERIC(18,2) DEFAULT 0,
  min_qty     NUMERIC(18,3) DEFAULT 0,
  qty         NUMERIC(18,3) DEFAULT 0,
  cost        NUMERIC(18,2) DEFAULT 0,
  cost_method TEXT DEFAULT 'average'  CHECK (cost_method IN ('average','fifo','batch')),
  track_serial BOOLEAN DEFAULT FALSE,
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ===== طبقات التكلفة (FIFO / Batch) =====
CREATE TABLE IF NOT EXISTS cost_layers (
  id            SERIAL PRIMARY KEY,
  item_code     TEXT REFERENCES items(code) ON DELETE CASCADE,
  batch_id      TEXT,
  qty           NUMERIC(18,3) NOT NULL,
  remaining_qty NUMERIC(18,3) NOT NULL,
  cost_per_unit NUMERIC(18,4) NOT NULL,
  layer_date    DATE NOT NULL,
  ref           TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_cost_layers_item ON cost_layers(item_code, layer_date);

-- ===== حركات المخزن =====
CREATE TABLE IF NOT EXISTS inv_movements (
  id        TEXT PRIMARY KEY,
  mov_date  DATE NOT NULL,
  item_code TEXT,
  item_name TEXT,
  mov_type  TEXT, -- in/out/adj/transfer
  qty       NUMERIC(18,3),
  cost      NUMERIC(18,2),
  ref       TEXT,
  notes     TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_inv_mov_item ON inv_movements(item_code, mov_date);

-- ===== أرقام السيريل =====
CREATE TABLE IF NOT EXISTS serials (
  sn         TEXT PRIMARY KEY,
  item_code  TEXT,
  item_name  TEXT,
  status     TEXT DEFAULT 'stock' CHECK (status IN ('stock','sold','reserved','scrapped')),
  date_in    DATE,
  po_ref     TEXT,
  date_out   DATE,
  inv_ref    TEXT,
  customer   TEXT,
  notes      TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_serials_item ON serials(item_code);
CREATE INDEX IF NOT EXISTS idx_serials_status ON serials(status);

-- ===== الزبائن =====
CREATE TABLE IF NOT EXISTS customers (
  id           TEXT PRIMARY KEY,
  code         TEXT UNIQUE,
  name         TEXT NOT NULL,
  account_code TEXT,
  phone        TEXT,
  city         TEXT,
  debt         NUMERIC(18,2) DEFAULT 0,
  notes        TEXT,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ===== الموردين =====
CREATE TABLE IF NOT EXISTS suppliers (
  id           TEXT PRIMARY KEY,
  code         TEXT UNIQUE,
  name         TEXT NOT NULL,
  account_code TEXT,
  phone        TEXT,
  city         TEXT,
  balance      NUMERIC(18,2) DEFAULT 0,
  notes        TEXT,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ===== القيود المحاسبية =====
CREATE TABLE IF NOT EXISTS journal_entries (
  id           TEXT PRIMARY KEY,
  entry_date   DATE NOT NULL,
  journal      TEXT,
  ref          TEXT,
  customer     TEXT,
  customer_id  TEXT,
  supplier     TEXT,
  supplier_id  TEXT,
  entry_type   TEXT,
  method       TEXT,
  narration    TEXT,
  lines        JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_journal_date ON journal_entries(entry_date DESC);
CREATE INDEX IF NOT EXISTS idx_journal_customer ON journal_entries(customer_id);

-- ===== طلبات الصيانة =====
CREATE TABLE IF NOT EXISTS maint_requests (
  id           TEXT PRIMARY KEY,
  customer     TEXT,
  serial       TEXT,
  description  TEXT,
  status       TEXT DEFAULT 'open',
  req_date     DATE,
  cost         NUMERIC(18,2) DEFAULT 0,
  notes        TEXT,
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ===== الرواتب =====
CREATE TABLE IF NOT EXISTS payroll_records (
  id         TEXT PRIMARY KEY,
  pay_month  TEXT,
  emp_name   TEXT,
  emp_id     TEXT,
  salary     NUMERIC(18,2) DEFAULT 0,
  additions  NUMERIC(18,2) DEFAULT 0,
  deductions NUMERIC(18,2) DEFAULT 0,
  net        NUMERIC(18,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ===== تدفق العمل (Workflow Orders) =====
CREATE TABLE IF NOT EXISTS wf_orders (
  id         TEXT PRIMARY KEY,
  ord_date   DATE,
  cust_id    TEXT,
  cust_name  TEXT,
  stage      TEXT DEFAULT 'sales',
  amount     NUMERIC(18,2) DEFAULT 0,
  pay_method TEXT,
  items      JSONB,
  notes      TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== عقود التقسيط =====
CREATE TABLE IF NOT EXISTS installments (
  id           TEXT PRIMARY KEY,
  inst_date    DATE,
  cust_id      TEXT,
  cust_name    TEXT,
  inv_ref      TEXT,
  total_amt    NUMERIC(18,2) DEFAULT 0,
  down_payment NUMERIC(18,2) DEFAULT 0,
  num_inst     INTEGER DEFAULT 6,
  payments     JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ===== المستخدمين =====
CREATE TABLE IF NOT EXISTS app_users (
  id         TEXT PRIMARY KEY,
  username   TEXT UNIQUE NOT NULL,
  pass       TEXT,
  full_name  TEXT,
  role       TEXT,
  perms      JSONB DEFAULT '{}',
  last_login TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ===== وحدات الصلاحيات =====
CREATE TABLE IF NOT EXISTS perm_modules (
  key        TEXT PRIMARY KEY,
  label      TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- ===== جدول الإعدادات العامة =====
CREATE TABLE IF NOT EXISTS app_settings (
  key   TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Initial data timestamp
INSERT INTO app_settings (key, value) VALUES ('data_ts', extract(epoch from now())::bigint::text)
ON CONFLICT (key) DO NOTHING;

SELECT 'Schema created successfully' AS result;
