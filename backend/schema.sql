-- ============================================================================
-- SOL ECOSYSTEM - Smart Agriculture & Livestock Management Platform
-- Database: PostgreSQL 14+
-- Module: Core Relational Schema (Step 1)
-- ============================================================================

-- Enable UUID extension for cryptographically secure, collision-resistant identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. ENUM TYPES DEFINITION
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
        'admin', 
        'farm_manager', 
        'agronomist', 
        'veterinarian', 
        'field_operator', 
        'auditor'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE plant_health_status_enum AS ENUM (
        'healthy', 
        'needs_attention', 
        'diseased', 
        'dormant'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE irrigation_status_enum AS ENUM (
        'optimal', 
        'deficit', 
        'overirrigated', 
        'scheduled'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE livestock_species_enum AS ENUM (
        'cattle', 
        'sheep', 
        'goat'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE livestock_health_enum AS ENUM (
        'healthy', 
        'quarantined', 
        'under_treatment', 
        'pregnant', 
        'lactating'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE entity_type_enum AS ENUM (
        'tree', 
        'livestock'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE diagnosis_type_enum AS ENUM (
        'ai_vision', 
        'veterinary_check', 
        'agronomist_field_inspection', 
        'routine_screening'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE severity_level_enum AS ENUM (
        'low', 
        'moderate', 
        'severe', 
        'critical'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE harvest_product_enum AS ENUM (
        'olive_oil', 
        'fresh_olives', 
        'citrus_fruit', 
        'pomegranate', 
        'raw_milk', 
        'organic_meat', 
        'wool'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 2. USERS & OPERATORS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    role user_role_enum NOT NULL DEFAULT 'field_operator',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. FARMS & AGRICULTURAL HOLDINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    area_hectares NUMERIC(10, 2) NOT NULL CHECK (area_hectares > 0),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    region VARCHAR(100) NOT NULL,
    country_code VARCHAR(3) DEFAULT 'TUN',
    soil_type VARCHAR(100) DEFAULT 'Clay-Loam Mediterranean Soil',
    irrigation_source VARCHAR(100) DEFAULT 'Solar Deep Well & Drip System',
    certifications JSONB DEFAULT '["ISO-22000", "GlobalGAP", "BioOrganic"]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. SMART ORCHARD TREES TABLE (Focus: Olive Trees & Fruit Trees)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    tag_code VARCHAR(50) UNIQUE NOT NULL,               -- e.g. "SOL-TR-OLV-001"
    species VARCHAR(100) NOT NULL DEFAULT 'Olive',     -- Olive, Citrus, Fig, Pomegranate
    variety VARCHAR(100) NOT NULL,                     -- Chemlali, Picholine, Mission, Arbequina
    planting_date DATE NOT NULL,
    age_years NUMERIC(5, 1) GENERATED ALWAYS AS (
        ROUND((EXTRACT(DAYS FROM (CURRENT_DATE - planting_date)) / 365.25)::numeric, 1)
    ) STORED,
    parcel_zone VARCHAR(50) NOT NULL DEFAULT 'North Parcel A1',
    row_index INT,
    col_index INT,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    health_status plant_health_status_enum NOT NULL DEFAULT 'healthy',
    irrigation_status irrigation_status_enum NOT NULL DEFAULT 'optimal',
    soil_moisture_percentage NUMERIC(5, 2) DEFAULT 38.5,
    canopy_diameter_meters NUMERIC(4, 2) DEFAULT 3.2,
    last_harvest_date DATE,
    last_fertilized_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. LIVESTOCK REGISTRY TABLE (Cattle & Sheep Tracking)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS livestock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    tag_rfid VARCHAR(60) UNIQUE NOT NULL,               -- e.g. "RFID-982-CTL-4029"
    name_or_alias VARCHAR(100),
    species livestock_species_enum NOT NULL,            -- cattle or sheep
    breed VARCHAR(100) NOT NULL,                       -- Holstein, Angus, Awassi, Barbarine
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    birth_date DATE NOT NULL,
    current_weight_kg NUMERIC(6, 2) NOT NULL CHECK (current_weight_kg > 0),
    target_weight_kg NUMERIC(6, 2),
    pasture_zone VARCHAR(50) NOT NULL DEFAULT 'Pasture Hill C',
    health_condition livestock_health_enum NOT NULL DEFAULT 'healthy',
    feed_plan TEXT NOT NULL DEFAULT 'Organic Pasture Clover + 1.8kg Concentrated Lucerne Ration',
    yield_metric_name VARCHAR(50) DEFAULT 'Daily Milk Yield (L)',
    current_yield_value NUMERIC(6, 2) DEFAULT 0.00,
    vaccination_schedule JSONB DEFAULT '[]'::jsonb,     -- [{ "vaccine": "Foot-and-Mouth", "date": "2026-03-15", "status": "administered" }]
    weight_history JSONB DEFAULT '[]'::jsonb,           -- [{ "date": "2026-08-01", "weight_kg": 520 }]
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. HEALTH LOGS & AI DIAGNOSTICS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    entity_type entity_type_enum NOT NULL,              -- 'tree' OR 'livestock'
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    livestock_id UUID REFERENCES livestock(id) ON DELETE CASCADE,
    inspector_id UUID REFERENCES users(id) ON DELETE SET NULL,
    inspection_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diagnosis_type diagnosis_type_enum NOT NULL DEFAULT 'ai_vision',
    detected_condition VARCHAR(200) NOT NULL,           -- e.g., "Olive Peacock Spot (Spilocaea oleagina)" or "Bovine Mastitis Early Stage"
    pathogen_name VARCHAR(150),
    confidence_score NUMERIC(5, 4) CHECK (confidence_score >= 0 AND confidence_score <= 1.0), -- 0.9420 (94.2%)
    severity severity_level_enum NOT NULL DEFAULT 'moderate',
    symptoms_observed TEXT NOT NULL,
    recommended_treatment TEXT NOT NULL,
    medication_prescribed VARCHAR(200),
    dosage_instructions TEXT,
    treatment_status VARCHAR(50) NOT NULL DEFAULT 'in_progress', -- 'pending', 'in_progress', 'resolved'
    sample_image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Enforce either tree_id or livestock_id depending on entity_type
    CONSTRAINT chk_health_entity_integrity CHECK (
        (entity_type = 'tree' AND tree_id IS NOT NULL AND livestock_id IS NULL) OR
        (entity_type = 'livestock' AND livestock_id IS NOT NULL AND tree_id IS NULL)
    )
);

-- ----------------------------------------------------------------------------
-- 7. HARVEST & TRACEABILITY PRODUCTION BATCHES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS harvest_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE RESTRICT,
    batch_code VARCHAR(60) UNIQUE NOT NULL,             -- e.g. "BATCH-EVOO-2026-088"
    product_type harvest_product_enum NOT NULL,
    product_commercial_name VARCHAR(200) NOT NULL,      -- "SOL Terroir Cold-Pressed Extra Virgin Olive Oil"
    harvest_date DATE NOT NULL,
    pressing_or_packaging_date DATE,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'Liters',        -- Liters, kg, tons
    quality_grade VARCHAR(50) NOT NULL DEFAULT 'Extra Virgin Premium (Acidity < 0.3%)',
    lab_acidity_pct NUMERIC(4, 3) DEFAULT 0.210,        -- 0.21%
    lab_polyphenols_ppm INT DEFAULT 485,                -- 485 mg/kg (high antioxidant)
    lab_peroxide_value NUMERIC(5, 2) DEFAULT 6.4,
    storage_tank_id VARCHAR(50) DEFAULT 'SILO-SS-04',
    certifications_included VARCHAR(200) DEFAULT 'Single Estate, Unfiltered, Cold-Extracted 22°C',
    source_parcel_zone VARCHAR(100) DEFAULT 'Parcel Alpha - Century Ancient Grove',
    public_qr_url TEXT,
    blockchain_hash VARCHAR(128),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_farms_owner ON farms(owner_id);
CREATE INDEX IF NOT EXISTS idx_trees_farm_health ON trees(farm_id, health_status);
CREATE INDEX IF NOT EXISTS idx_trees_tag_code ON trees(tag_code);
CREATE INDEX IF NOT EXISTS idx_livestock_farm_species ON livestock(farm_id, species, health_condition);
CREATE INDEX IF NOT EXISTS idx_livestock_rfid ON livestock(tag_rfid);
CREATE INDEX IF NOT EXISTS idx_health_logs_tree ON health_logs(tree_id) WHERE tree_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_health_logs_livestock ON health_logs(livestock_id) WHERE livestock_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_health_logs_inspection_date ON health_logs(inspection_date DESC);
CREATE INDEX IF NOT EXISTS idx_harvest_batch_code ON harvest_records(batch_code);

-- ----------------------------------------------------------------------------
-- 9. AUTO-UPDATE TIMESTAMP TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
    CREATE TRIGGER trg_users_updated BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER trg_farms_updated BEFORE UPDATE ON farms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER trg_trees_updated BEFORE UPDATE ON trees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER trg_livestock_updated BEFORE UPDATE ON livestock FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER trg_health_logs_updated BEFORE UPDATE ON health_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    CREATE TRIGGER trg_harvest_records_updated BEFORE UPDATE ON harvest_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ----------------------------------------------------------------------------
-- 10. REALISTIC SEED DATA FOR DEMO & TESTING
-- ----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, full_name, phone, role)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'lead.agronomist@solecosystem.agri', '$2b$10$wT5gQ9...mockhash', 'Dr. Tariq Al-Mansoor', '+216 98 123 456', 'farm_manager')
ON CONFLICT (email) DO NOTHING;

INSERT INTO farms (id, owner_id, name, code, area_hectares, latitude, longitude, region, soil_type)
VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'SOL Green Valley Agro-Estate', 'SOL-FARM-01', 142.50, 36.8065, 10.1815, 'Cap Bon Mediterranean Basin', 'Rich Terra Rossa & Silty Loam')
ON CONFLICT (code) DO NOTHING;

-- Seed Sample Olive & Fruit Trees
INSERT INTO trees (id, farm_id, tag_code, species, variety, planting_date, parcel_zone, health_status, irrigation_status, soil_moisture_percentage, canopy_diameter_meters, last_harvest_date)
VALUES 
('c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'SOL-TR-OLV-001', 'Olive', 'Chemlali Ancient', '2012-03-10', 'Grove Alpha (Ancient)', 'healthy', 'optimal', 42.0, 4.2, '2025-11-20'),
('c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'SOL-TR-OLV-002', 'Olive', 'Picholine High-Density', '2018-05-14', 'Grove Beta (Modern)', 'needs_attention', 'deficit', 28.4, 2.8, '2025-11-22'),
('c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'SOL-TR-OLV-003', 'Olive', 'Arbequina Super-Intensive', '2020-04-18', 'Grove Gamma', 'diseased', 'optimal', 39.1, 2.4, '2025-11-25'),
('c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000001', 'SOL-TR-CIT-104', 'Citrus', 'Blood Orange Maltaise', '2019-02-11', 'Citrus Orchard South', 'healthy', 'optimal', 44.5, 3.1, '2026-01-15')
ON CONFLICT (tag_code) DO NOTHING;

-- Seed Sample Livestock (Cattle & Sheep)
INSERT INTO livestock (id, farm_id, tag_rfid, name_or_alias, species, breed, gender, birth_date, current_weight_kg, pasture_zone, health_condition, feed_plan, yield_metric_name, current_yield_value)
VALUES 
('d0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'RFID-CTL-9021', 'Bella Prima', 'cattle', 'Holstein Friesian', 'female', '2022-04-12', 645.00, 'Green Meadow Zone 1', 'lactating', 'High-Protein Organic Alfalfa & Fermented Sorghum', 'Daily Milk Yield (L)', 29.5),
('d0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000001', 'RFID-SHP-3084', 'Sultan-Awassi', 'sheep', 'Awassi Fat-Tailed', 'male', '2023-01-19', 88.50, 'Hillside Pasture B', 'healthy', 'Wild Herb Grazing + Organic Barley Supplements', 'Weight Gain (g/day)', 320.0),
('d0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000001', 'RFID-CTL-8812', 'Maximus Angus', 'cattle', 'Black Angus Beef', 'male', '2022-11-05', 730.00, 'Fattening Paddock 4', 'healthy', 'Free-range Meadow Grazing + Clover Hay', 'Meat Yield Estimate', 410.0)
ON CONFLICT (tag_rfid) DO NOTHING;

-- Seed Sample Harvest Record & Traceability Batch
INSERT INTO harvest_records (id, farm_id, batch_code, product_type, product_commercial_name, harvest_date, pressing_or_packaging_date, quantity, unit, quality_grade, lab_acidity_pct, lab_polyphenols_ppm, public_qr_url)
VALUES
('e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'BATCH-EVOO-2026-088', 'olive_oil', 'SOL Reserve Extra Virgin Olive Oil - Chemlali Cru', '2025-11-20', '2025-11-21', 4500.00, 'Liters', 'Extra Virgin Ultra-Premium', 0.185, 540, 'https://sol-ecosystem.agri/passport/BATCH-EVOO-2026-088')
ON CONFLICT (batch_code) DO NOTHING;
