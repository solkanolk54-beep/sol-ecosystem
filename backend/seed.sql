-- ============================================================================
-- SOL ECOSYSTEM - Smart Agriculture & Livestock Management Platform
-- Database: PostgreSQL 14+
-- File: backend/seed.sql
-- Region: Mila, Algeria
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. DATABASE CREATION & EXTENSIONS SETUP (Run as postgres superuser if needed)
-- ----------------------------------------------------------------------------
-- CREATE DATABASE sol_db WITH ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';
-- \c sol_db;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. SEED USERS (1 Admin + 1 Farm Manager)
-- ----------------------------------------------------------------------------
INSERT INTO users (id, email, password_hash, full_name, phone, role, is_active)
VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'admin@solecosystem.agri',
    '$2b$12$e8YkYmR7l.W7/r8ZqXq9b.9oYc4gN9B4E3R0K2vJ9hP7qLmN5uTaa', -- bcrypt hash for 'Admin@Sol2026!'
    'Karim Benali',
    '+213 550 123 456',
    'admin',
    TRUE
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'manager.mila@solecosystem.agri',
    '$2b$12$f9ZlZnS8m.X8/s9ArYr0c.0pZd5hO0C5F4S1L3wK0iQ8rMnO6vUbb', -- bcrypt hash for 'Manager@Mila2026!'
    'Dr. Amine Mansouri',
    '+213 661 789 012',
    'farm_manager',
    TRUE
  )
ON CONFLICT (email) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;

-- ----------------------------------------------------------------------------
-- 2. SEED FARM (Mila, Algeria - 25 Hectares, Silty Loam)
-- ----------------------------------------------------------------------------
INSERT INTO farms (
  id,
  owner_id,
  name,
  code,
  area_hectares,
  latitude,
  longitude,
  region,
  country_code,
  soil_type,
  irrigation_source,
  certifications
)
VALUES
  (
    'b1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002', -- Managed by Dr. Amine Mansouri
    'Domaine Olicole de Mila - Beni Haroun Basin',
    'SOL-FARM-DZ-MILA-01',
    25.00,
    36.4503000,
    6.2644000,
    'Mila Agro-Industrial Basin, Algeria',
    'DZA',
    'Silty Loam & Agricultural Alluvial Soil',
    'Beni Haroun Dam Catchment & Solar Powered Drip Line',
    '["Bio-Algerie Cert #DZ-BIO-14", "GlobalGAP v6", "Protected Geographical Indication (PGI) Mila"]'::jsonb
  )
ON CONFLICT (code) DO UPDATE SET
  area_hectares = EXCLUDED.area_hectares,
  soil_type = EXCLUDED.soil_type;

-- ----------------------------------------------------------------------------
-- 3. SEED 10 OLIVE TREES (Chemlali & Picholine varieties across health statuses)
-- ----------------------------------------------------------------------------
INSERT INTO trees (
  id,
  farm_id,
  tag_code,
  species,
  variety,
  planting_date,
  parcel_zone,
  row_index,
  col_index,
  latitude,
  longitude,
  health_status,
  irrigation_status,
  soil_moisture_percentage,
  canopy_diameter_meters,
  last_harvest_date,
  notes
)
VALUES
  -- 1. Chemlali - Healthy
  (
    'c1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-CHM-001',
    'Olive',
    'Chemlali',
    '2014-03-15',
    'Parcel Nord-A1 (Coteaux Beni Haroun)',
    1, 1,
    36.4504100, 6.2644200,
    'healthy',
    'optimal',
    41.2,
    3.8,
    '2025-11-18',
    'Vigorous tree with excellent fruit set and healthy leaf luster.'
  ),
  -- 2. Chemlali - Healthy
  (
    'c1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-CHM-002',
    'Olive',
    'Chemlali',
    '2014-03-15',
    'Parcel Nord-A1 (Coteaux Beni Haroun)',
    1, 2,
    36.4504300, 6.2644500,
    'healthy',
    'optimal',
    39.8,
    3.7,
    '2025-11-18',
    'Regular production record.'
  ),
  -- 3. Chemlali - Needs Attention (Deficit moisture)
  (
    'c1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-CHM-003',
    'Olive',
    'Chemlali',
    '2016-04-10',
    'Parcel Nord-A2 (Terrasses Hautes)',
    2, 1,
    36.4505100, 6.2645000,
    'needs_attention',
    'deficit',
    23.4,
    3.1,
    '2025-11-20',
    'Low root-zone moisture; scheduled for 3.5h supplemental drip irrigation.'
  ),
  -- 4. Chemlali - Diseased (Peacock Spot)
  (
    'c1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-CHM-004',
    'Olive',
    'Chemlali',
    '2015-11-02',
    'Parcel Sud-B1 (Bas-Fonds Humides)',
    3, 1,
    36.4501200, 6.2643100,
    'diseased',
    'optimal',
    44.0,
    3.4,
    '2025-11-21',
    'Exhibiting circular peacock spot lesions on lower canopy.'
  ),
  -- 5. Chemlali - Healthy
  (
    'c1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-CHM-005',
    'Olive',
    'Chemlali',
    '2017-02-28',
    'Parcel Nord-A1 (Coteaux Beni Haroun)',
    1, 3,
    36.4504600, 6.2644900,
    'healthy',
    'optimal',
    38.5,
    2.9,
    '2025-11-19',
    'Young productive Chemlali with strong canopy architecture.'
  ),
  -- 6. Picholine - Healthy
  (
    'c1000000-0000-0000-0000-000000000006',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-PCH-006',
    'Olive',
    'Picholine',
    '2015-03-20',
    'Parcel Est-C1 (Intensive Groves)',
    1, 1,
    36.4507000, 6.2648000,
    'healthy',
    'optimal',
    40.1,
    3.5,
    '2025-11-22',
    'Large drupe yield for dual-purpose table olive & extra virgin oil.'
  ),
  -- 7. Picholine - Healthy
  (
    'c1000000-0000-0000-0000-000000000007',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-PCH-007',
    'Olive',
    'Picholine',
    '2015-03-20',
    'Parcel Est-C1 (Intensive Groves)',
    1, 2,
    36.4507200, 6.2648300,
    'healthy',
    'optimal',
    37.9,
    3.6,
    '2025-11-22',
    'High vigor, uniform fruit distribution.'
  ),
  -- 8. Picholine - Needs Attention (Irrigation Deficit)
  (
    'c1000000-0000-0000-0000-000000000008',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-PCH-008',
    'Olive',
    'Picholine',
    '2018-05-12',
    'Parcel Est-C2 (Pente Est)',
    2, 2,
    36.4508100, 6.2649000,
    'needs_attention',
    'deficit',
    21.8,
    2.7,
    '2025-11-24',
    'Drip line emitter calcification detected; pressure flush required.'
  ),
  -- 9. Picholine - Diseased (Anthracnose / Gloeosporium)
  (
    'c1000000-0000-0000-0000-000000000009',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-PCH-009',
    'Olive',
    'Picholine',
    '2016-10-18',
    'Parcel Sud-B2 (Vallon")',
    3, 2,
    36.4500900, 6.2642800,
    'diseased',
    'optimal',
    42.6,
    3.2,
    '2025-11-25',
    'Anthracnose necrotic spots detected on ripening olives.'
  ),
  -- 10. Picholine - Healthy
  (
    'c1000000-0000-0000-0000-000000000010',
    'b1000000-0000-0000-0000-000000000001',
    'MILA-OLV-PCH-010',
    'Olive',
    'Picholine',
    '2019-01-25',
    'Parcel Est-C1 (Intensive Groves)',
    1, 3,
    36.4507400, 6.2648700,
    'healthy',
    'optimal',
    43.0,
    2.4,
    '2025-11-22',
    'Young healthy crown, pruned to vase shape.'
  )
ON CONFLICT (tag_code) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. SEED 5 LIVESTOCK (3 Cattle, 2 Sheep) WITH JSONB HISTORY & VACCINATIONS
-- ----------------------------------------------------------------------------
INSERT INTO livestock (
  id,
  farm_id,
  tag_rfid,
  name_or_alias,
  species,
  breed,
  gender,
  birth_date,
  current_weight_kg,
  target_weight_kg,
  pasture_zone,
  health_condition,
  feed_plan,
  yield_metric_name,
  current_yield_value,
  vaccination_schedule,
  weight_history
)
VALUES
  -- 1. Cattle (Holstein Dairy Heifer)
  (
    'd1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'DZ-RFID-CTL-0101',
    'Kahina Prima',
    'cattle',
    'Holstein Friesian',
    'female',
    '2022-03-10',
    648.50,
    650.00,
    'Prairie Alluviale Nord (Beni Haroun)',
    'lactating',
    'High-Energy Clover Silage + 2.5kg Organic Barley & Mineral Blend',
    'Daily Milk Yield (L)',
    31.20,
    '[
      {"vaccine": "Foot-and-Mouth (Aphtous Fever)", "date": "2026-01-15", "status": "completed"},
      {"vaccine": "Bovine Viral Diarrhea (BVD)", "date": "2026-02-10", "status": "completed"},
      {"vaccine": "Mastitis Polyvalent Booster", "date": "2026-08-25", "status": "scheduled"}
    ]'::jsonb,
    '[
      {"date": "2025-11-10", "weight_kg": 622.0},
      {"date": "2025-12-20", "weight_kg": 634.5},
      {"date": "2026-01-30", "weight_kg": 642.0},
      {"date": "2026-03-15", "weight_kg": 648.5}
    ]'::jsonb
  ),
  -- 2. Cattle (Montbeliarde Dairy/Meat)
  (
    'd1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'DZ-RFID-CTL-0102',
    'Cirta Belle',
    'cattle',
    'Montbeliarde',
    'female',
    '2022-09-14',
    615.00,
    630.00,
    'Prairie Alluviale Nord (Beni Haroun)',
    'pregnant',
    'Meadow Hay + Protein-rich Alfalfa Pellets + Vitamin ADE Premix',
    'Gestation Progress (Days)',
    195.00,
    '[
      {"vaccine": "Foot-and-Mouth Inactivated", "date": "2026-01-15", "status": "completed"},
      {"vaccine": "Clostridial 8-Way Multivalent", "date": "2026-03-01", "status": "completed"}
    ]'::jsonb,
    '[
      {"date": "2025-11-10", "weight_kg": 585.0},
      {"date": "2026-01-15", "weight_kg": 602.0},
      {"date": "2026-03-15", "weight_kg": 615.0}
    ]'::jsonb
  ),
  -- 3. Cattle (Black Angus Beef Bull)
  (
    'd1000000-0000-0000-0000-000000000003',
    'b1000000-0000-0000-0000-000000000001',
    'DZ-RFID-CTL-0103',
    'Numidia Rex',
    'cattle',
    'Black Angus Prime',
    'male',
    '2023-02-18',
    740.00,
    780.00,
    'Paddock D Engraissement (Mila)',
    'healthy',
    'Free-range Grazing + Organic Sorghum Mash & Sea Salt Lick',
    'Estimated Carcass Score',
    4.20,
    '[
      {"vaccine": "Bovine Rhinotracheitis (IBR)", "date": "2026-02-05", "status": "completed"},
      {"vaccine": "Anthrax Spore Vaccine", "date": "2025-10-12", "status": "completed"}
    ]'::jsonb,
    '[
      {"date": "2025-10-01", "weight_kg": 680.0},
      {"date": "2025-12-15", "weight_kg": 710.0},
      {"date": "2026-02-28", "weight_kg": 740.0}
    ]'::jsonb
  ),
  -- 4. Sheep (Ouled Djellal Heritage Algerian Ram)
  (
    'd1000000-0000-0000-0000-000000000004',
    'b1000000-0000-0000-0000-000000000001',
    'DZ-RFID-SHP-0201',
    'El-Batal (Ouled Djellal)',
    'sheep',
    'Ouled Djellal Heritage',
    'male',
    '2023-01-20',
    96.50,
    100.00,
    'Parcours Steppique Est (Mila)',
    'healthy',
    'Wild Herb & Artemisia Pasture + 450g Whole Algerian Barley Ration',
    'Average Daily Gain (g/day)',
    360.00,
    '[
      {"vaccine": "Enterotoxemia (Pulpy Kidney)", "date": "2025-11-20", "status": "completed"},
      {"vaccine": "Sheep Pox Annual Booster", "date": "2026-01-25", "status": "completed"}
    ]'::jsonb,
    '[
      {"date": "2025-10-15", "weight_kg": 85.0},
      {"date": "2025-12-20", "weight_kg": 91.0},
      {"date": "2026-03-10", "weight_kg": 96.5}
    ]'::jsonb
  ),
  -- 5. Sheep (Barbarine Fat-Tailed Ewe)
  (
    'd1000000-0000-0000-0000-000000000005',
    'b1000000-0000-0000-0000-000000000001',
    'DZ-RFID-SHP-0202',
    'Mila Rose (Barbarine)',
    'sheep',
    'Barbarine Fat-Tailed',
    'female',
    '2023-05-12',
    67.00,
    70.00,
    'Sous-Bois Olicole Pâturé Sud',
    'pregnant',
    'Fresh Orchard Understory Grass + 300g Concentrated Alfalfa Meal',
    'Gestation Day (out of 150)',
    118.00,
    '[
      {"vaccine": "Enzootic Abortion (Chlamydiosis)", "date": "2025-10-05", "status": "completed"},
      {"vaccine": "Clostridial Lambing Booster", "date": "2026-02-14", "status": "completed"}
    ]'::jsonb,
    '[
      {"date": "2025-10-01", "weight_kg": 58.0},
      {"date": "2026-01-10", "weight_kg": 63.5},
      {"date": "2026-03-10", "weight_kg": 67.0}
    ]'::jsonb
  )
ON CONFLICT (tag_rfid) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. SEED 2 AI HEALTH LOGS (1 Olive Tree Diagnostic, 1 Livestock Record)
-- ----------------------------------------------------------------------------
INSERT INTO health_logs (
  id,
  farm_id,
  entity_type,
  tree_id,
  livestock_id,
  inspector_id,
  inspection_date,
  diagnosis_type,
  detected_condition,
  pathogen_name,
  confidence_score,
  severity,
  symptoms_observed,
  recommended_treatment,
  medication_prescribed,
  dosage_instructions,
  treatment_status,
  sample_image_url
)
VALUES
  -- 1. AI Vision Diagnosis for Olive Tree MILA-OLV-CHM-004
  (
    'e1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'tree',
    'c1000000-0000-0000-0000-000000000004',
    NULL,
    'a1000000-0000-0000-0000-000000000002', -- Inspected by Dr. Amine Mansouri
    NOW() - INTERVAL '4 days',
    'ai_vision',
    'Olive Peacock Spot (Spilocaea oleagina)',
    'Venturia oleaginea / Spilocaea oleagina',
    0.9520,
    'moderate',
    'Circular chlorotic halo spots with soot-colored fungal centers on 14% of adaxial leaf surfaces.',
    'Apply Copper Hydroxide spray (250g per 100L water) after spring rainfall. Perform crown thinning to improve airflow.',
    'Bordeaux Mixture / Copper Hydroxide 50% WP',
    '2.5 kg/ha applied with calibrated orchard tractor sprayer',
    'in_progress',
    'https://storage.solecosystem.agri/samples/mila_peacock_spot_004.jpg'
  ),
  -- 2. Veterinary Check for Cattle DZ-RFID-CTL-0101
  (
    'e1000000-0000-0000-0000-000000000002',
    'b1000000-0000-0000-0000-000000000001',
    'livestock',
    NULL,
    'd1000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000002',
    NOW() - INTERVAL '12 days',
    'veterinary_check',
    'Subclinical Post-Calving Mammary Congestion',
    'None (Non-infectious physiological edema)',
    0.9850,
    'low',
    'Mild swelling in right rear quarter post peak lactation surge; somatic cell count (SCC) within safe thresholds (< 180k/mL).',
    'Perform post-milking botanical balm massage (Peppermint & Arnica). Monitor conductivity sensor on milking pipeline.',
    'Phyto-Mammary Therapeutic Balm & Electrolytes',
    'Apply 50ml topical massage twice daily for 5 consecutive days',
    'resolved',
    'https://storage.solecosystem.agri/samples/vet_check_ctl_0101.jpg'
  )
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. SEED 1 TRACEABILITY PRODUCTION BATCH & CONSUMER QR RECORD
-- ----------------------------------------------------------------------------
INSERT INTO harvest_records (
  id,
  farm_id,
  batch_code,
  product_type,
  product_commercial_name,
  harvest_date,
  pressing_or_packaging_date,
  quantity,
  unit,
  quality_grade,
  lab_acidity_pct,
  lab_polyphenols_ppm,
  lab_peroxide_value,
  storage_tank_id,
  certifications_included,
  source_parcel_zone,
  public_qr_url,
  blockchain_hash
)
VALUES
  (
    'f1000000-0000-0000-0000-000000000001',
    'b1000000-0000-0000-0000-000000000001',
    'BATCH-DZ-MILA-EVOO-2026-001',
    'olive_oil',
    'SOL Réserve Terroir de Mila - Extra Virgin Cold Pressed',
    '2025-11-20',
    '2025-11-21',
    3800.00,
    'Liters',
    'Extra Virgin Ultra-Premium (Acidity < 0.2%)',
    0.170,
    580,
    5.20,
    'SILO-SS-MILA-02',
    'Indication Géographique Protégée (IGP) Mila, 100% Single-Estate Cold Extracted at 21°C',
    'Parcel Nord-A1 & Est-C1 (Beni Haroun Coteaux)',
    'https://sol-ecosystem.agri/passport/BATCH-DZ-MILA-EVOO-2026-001',
    '0x7c9f82d1b54a3e208c9018f4a13d7890b41c0e86b245781a95e2d67a123f4c8b'
  )
ON CONFLICT (batch_code) DO NOTHING;
