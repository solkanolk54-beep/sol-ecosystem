/**
 * ==============================================================================
 * SOL ECOSYSTEM - Smart Orchard & Trees Controller
 * File: backend/controllers/treeController.js
 * ==============================================================================
 */

const db = require('../config/db');

// In-Memory Seed Fallback for Tree Entities
const FALLBACK_TREES = [
  {
    id: 'c1000000-0000-0000-0000-000000000001',
    tagCode: 'MILA-OLV-CHM-001',
    species: 'Olive',
    variety: 'Chemlali',
    ageYears: 12.0,
    parcelZone: 'Parcel Nord-A1 (Coteaux Beni Haroun)',
    healthStatus: 'healthy',
    irrigationStatus: 'optimal',
    soilMoisturePct: 41.2,
    canopyDiameterMeters: 3.8,
    lastHarvestDate: '2025-11-18'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000002',
    tagCode: 'MILA-OLV-CHM-002',
    species: 'Olive',
    variety: 'Chemlali',
    ageYears: 12.0,
    parcelZone: 'Parcel Nord-A1 (Coteaux Beni Haroun)',
    healthStatus: 'healthy',
    irrigationStatus: 'optimal',
    soilMoisturePct: 39.8,
    canopyDiameterMeters: 3.7,
    lastHarvestDate: '2025-11-18'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000003',
    tagCode: 'MILA-OLV-CHM-003',
    species: 'Olive',
    variety: 'Chemlali',
    ageYears: 10.0,
    parcelZone: 'Parcel Nord-A2 (Terrasses Hautes)',
    healthStatus: 'needs_attention',
    irrigationStatus: 'deficit',
    soilMoisturePct: 23.4,
    canopyDiameterMeters: 3.1,
    lastHarvestDate: '2025-11-20'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000004',
    tagCode: 'MILA-OLV-CHM-004',
    species: 'Olive',
    variety: 'Chemlali',
    ageYears: 10.5,
    parcelZone: 'Parcel Sud-B1 (Bas-Fonds Humides)',
    healthStatus: 'diseased',
    irrigationStatus: 'optimal',
    soilMoisturePct: 44.0,
    canopyDiameterMeters: 3.4,
    lastHarvestDate: '2025-11-21'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000006',
    tagCode: 'MILA-OLV-PCH-006',
    species: 'Olive',
    variety: 'Picholine',
    ageYears: 11.0,
    parcelZone: 'Parcel Est-C1 (Intensive Groves)',
    healthStatus: 'healthy',
    irrigationStatus: 'optimal',
    soilMoisturePct: 40.1,
    canopyDiameterMeters: 3.5,
    lastHarvestDate: '2025-11-22'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000008',
    tagCode: 'MILA-OLV-PCH-008',
    species: 'Olive',
    variety: 'Picholine',
    ageYears: 8.0,
    parcelZone: 'Parcel Est-C2 (Pente Est)',
    healthStatus: 'needs_attention',
    irrigationStatus: 'deficit',
    soilMoisturePct: 21.8,
    canopyDiameterMeters: 2.7,
    lastHarvestDate: '2025-11-24'
  },
  {
    id: 'c1000000-0000-0000-0000-000000000009',
    tagCode: 'MILA-OLV-PCH-009',
    species: 'Olive',
    variety: 'Picholine',
    ageYears: 9.5,
    parcelZone: 'Parcel Sud-B2 (Vallon)',
    healthStatus: 'diseased',
    irrigationStatus: 'optimal',
    soilMoisturePct: 42.6,
    canopyDiameterMeters: 3.2,
    lastHarvestDate: '2025-11-25'
  }
];

/**
 * GET /api/trees
 * List trees with filtering by healthStatus, species, variety, and search query
 */
const getTrees = async (req, res, next) => {
  try {
    const { healthStatus, species, variety, farmId, search } = req.query;

    const queryConditions = [];
    const queryParams = [];

    if (healthStatus && healthStatus !== 'all') {
      queryParams.push(healthStatus);
      queryConditions.push(`t.health_status = $${queryParams.length}`);
    }

    if (species && species !== 'all') {
      queryParams.push(species);
      queryConditions.push(`LOWER(t.species) = LOWER($${queryParams.length})`);
    }

    if (variety && variety !== 'all') {
      queryParams.push(variety);
      queryConditions.push(`LOWER(t.variety) = LOWER($${queryParams.length})`);
    }

    if (farmId) {
      queryParams.push(farmId);
      queryConditions.push(`t.farm_id::text = $${queryParams.length}`);
    }

    if (search) {
      queryParams.push(`%${search.trim().toLowerCase()}%`);
      queryConditions.push(
        `(LOWER(t.tag_code) LIKE $${queryParams.length} OR LOWER(t.variety) LIKE $${queryParams.length} OR LOWER(t.parcel_zone) LIKE $${queryParams.length})`
      );
    }

    const whereClause = queryConditions.length > 0 ? `WHERE ${queryConditions.join(' AND ')}` : '';

    const sql = `
      SELECT
        t.id,
        t.farm_id AS "farmId",
        t.tag_code AS "tagCode",
        t.species,
        t.variety,
        t.planting_date AS "plantingDate",
        t.age_years AS "ageYears",
        t.parcel_zone AS "parcelZone",
        t.health_status AS "healthStatus",
        t.irrigation_status AS "irrigationStatus",
        t.soil_moisture_percentage AS "soilMoisturePct",
        t.canopy_diameter_meters AS "canopyDiameterMeters",
        t.last_harvest_date AS "lastHarvestDate",
        t.notes
      FROM trees t
      ${whereClause}
      ORDER BY t.tag_code ASC;
    `;

    try {
      const result = await db.query(sql, queryParams);
      if (result.rows.length > 0) {
        // Rollup summary breakdown
        const summary = {
          total: result.rows.length,
          healthy: result.rows.filter(t => t.healthStatus === 'healthy').length,
          needsAttention: result.rows.filter(t => t.healthStatus === 'needs_attention').length,
          diseased: result.rows.filter(t => t.healthStatus === 'diseased').length
        };

        return res.status(200).json({
          success: true,
          source: 'postgresql',
          summary,
          count: result.rows.length,
          trees: result.rows
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL trees query error, using fallback]:', dbErr.message);
    }

    // In-memory filter fallback
    let fallbackResults = [...FALLBACK_TREES];
    if (healthStatus && healthStatus !== 'all') {
      fallbackResults = fallbackResults.filter(t => t.healthStatus === healthStatus);
    }
    if (species && species !== 'all') {
      fallbackResults = fallbackResults.filter(t => t.species.toLowerCase() === species.toLowerCase());
    }
    if (search) {
      const q = search.toLowerCase();
      fallbackResults = fallbackResults.filter(t =>
        t.tagCode.toLowerCase().includes(q) || t.variety.toLowerCase().includes(q)
      );
    }

    const summary = {
      total: fallbackResults.length,
      healthy: fallbackResults.filter(t => t.healthStatus === 'healthy').length,
      needsAttention: fallbackResults.filter(t => t.healthStatus === 'needs_attention').length,
      diseased: fallbackResults.filter(t => t.healthStatus === 'diseased').length
    };

    return res.status(200).json({
      success: true,
      source: 'memory_cache',
      summary,
      count: fallbackResults.length,
      trees: fallbackResults
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/trees/:id
 * Fetches tree profile with historical health logs
 */
const getTreeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT
        t.*,
        COALESCE(
          json_agg(
            json_build_object(
              'id', hl.id,
              'date', hl.inspection_date,
              'diagnosisType', hl.diagnosis_type,
              'condition', hl.detected_condition,
              'pathogen', hl.pathogen_name,
              'confidence', hl.confidence_score,
              'severity', hl.severity,
              'treatment', hl.recommended_treatment,
              'status', hl.treatment_status
            )
          ) FILTER (WHERE hl.id IS NOT NULL),
          '[]'::json
        ) AS "diseaseHistory"
      FROM trees t
      LEFT JOIN health_logs hl ON hl.tree_id = t.id
      WHERE t.id::text = $1 OR t.tag_code = $1
      GROUP BY t.id
      LIMIT 1;
    `;

    try {
      const result = await db.query(sql, [id]);
      if (result.rows.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'postgresql',
          tree: result.rows[0]
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL get tree by id error, using fallback]:', dbErr.message);
    }

    const found = FALLBACK_TREES.find(t => t.id === id || t.tagCode === id);
    if (!found) {
      return res.status(404).json({
        success: false,
        error: 'NotFound',
        message: `Tree with tag/ID '${id}' was not found.`
      });
    }

    return res.status(200).json({
      success: true,
      source: 'memory_cache',
      tree: {
        ...found,
        diseaseHistory: [
          {
            date: '2024-04-12',
            condition: 'Olive Peacock Spot (Spilocaea oleagina)',
            treatment: 'Apply Copper Hydroxide spray (250g/100L) + internal pruning.',
            status: 'resolved'
          }
        ]
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTrees,
  getTreeById
};
