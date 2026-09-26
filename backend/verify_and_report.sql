-- ============================================================================
-- SOL ECOSYSTEM - PostgreSQL Execution Plan & Verification Script
-- Database: PostgreSQL 14+
-- File: backend/verify_and_report.sql
-- ============================================================================

-- ============================================================================
-- QUERY 1: FARM INTEGRITY & SUMMARY ROLLUP
-- Validates: Foreign keys between users -> farms -> trees / livestock,
-- area checking, and dynamic summary aggregation.
-- ============================================================================
SELECT
    f.id AS farm_uuid,
    f.name AS farm_name,
    f.code AS farm_code,
    f.region,
    f.soil_type,
    f.area_hectares,
    u.full_name AS farm_manager_name,
    u.email AS farm_manager_email,
    COUNT(DISTINCT t.id) AS total_trees_registered,
    COUNT(DISTINCT l.id) AS total_livestock_registered,
    COUNT(DISTINCT h.id) AS total_production_batches
FROM farms f
JOIN users u ON f.owner_id = u.id
LEFT JOIN trees t ON t.farm_id = f.id
LEFT JOIN livestock l ON l.farm_id = f.id
LEFT JOIN harvest_records h ON h.farm_id = f.id
WHERE f.code = 'SOL-FARM-DZ-MILA-01'
GROUP BY f.id, f.name, f.code, f.region, f.soil_type, f.area_hectares, u.full_name, u.email;

-- ============================================================================
-- QUERY 2: SMART ORCHARD HEALTH & AGRONOMIC METRICS BREAKDOWN
-- Validates: Variety distribution, age generation, health status classification,
-- and moisture sensors.
-- ============================================================================
SELECT
    t.variety,
    t.health_status,
    COUNT(*) AS tree_count,
    ROUND(AVG(t.age_years), 1) AS avg_age_years,
    ROUND(AVG(t.soil_moisture_percentage), 1) AS avg_soil_moisture_pct,
    COUNT(hl.id) AS active_pathology_logs
FROM trees t
LEFT JOIN health_logs hl ON hl.tree_id = t.id AND hl.treatment_status IN ('pending', 'in_progress')
JOIN farms f ON t.farm_id = f.id
WHERE f.code = 'SOL-FARM-DZ-MILA-01'
GROUP BY t.variety, t.health_status
ORDER BY t.variety ASC, t.health_status ASC;

-- ============================================================================
-- QUERY 3: LIVESTOCK BIOSENSOR TELEMETRY & TRACEABILITY BATCH RECONCILIATION
-- Validates: JSONB query extraction (latest weight & upcoming vaccinations),
-- breed metrics, and cross-reference with harvest traceability.
-- ============================================================================
SELECT
    l.tag_rfid,
    l.name_or_alias,
    l.species,
    l.breed,
    l.health_condition,
    l.current_weight_kg AS latest_recorded_weight_kg,
    -- Extract the first historical weight from JSONB
    (l.weight_history->0->>'weight_kg')::numeric AS initial_recorded_weight_kg,
    -- Calculate weight delta directly from JSONB history
    ROUND(l.current_weight_kg - (l.weight_history->0->>'weight_kg')::numeric, 1) AS net_weight_gain_kg,
    -- Count of scheduled / completed vaccines inside JSONB array
    jsonb_array_length(l.vaccination_schedule) AS total_vaccines_logged,
    l.yield_metric_name,
    l.current_yield_value
FROM livestock l
JOIN farms f ON l.farm_id = f.id
WHERE f.code = 'SOL-FARM-DZ-MILA-01'
ORDER BY l.species ASC, l.current_weight_kg DESC;
