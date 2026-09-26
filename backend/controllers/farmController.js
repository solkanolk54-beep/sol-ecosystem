/**
 * ==============================================================================
 * SOL ECOSYSTEM - Farms Controller
 * File: backend/controllers/farmController.js
 * ==============================================================================
 */

const db = require('../config/db');

// In-Memory Fallback Farm Data
const FALLBACK_FARM = {
  id: 'b1000000-0000-0000-0000-000000000001',
  name: 'Domaine Olicole de Mila - Beni Haroun Basin',
  code: 'SOL-FARM-DZ-MILA-01',
  areaHectares: 25.00,
  latitude: 36.4503,
  longitude: 6.2644,
  region: 'Mila Agro-Industrial Basin, Algeria',
  countryCode: 'DZA',
  soilType: 'Silty Loam & Agricultural Alluvial Soil',
  irrigationSource: 'Beni Haroun Dam Catchment & Solar Powered Drip Line',
  certifications: ['Bio-Algerie Cert #DZ-BIO-14', 'GlobalGAP v6', 'Protected Geographical Indication (PGI) Mila'],
  stats: {
    totalTrees: 4250,
    healthyTrees: 3820,
    needsAttentionTrees: 320,
    diseasedTrees: 110,
    totalLivestock: 680,
    cattleCount: 220,
    sheepCount: 460
  }
};

/**
 * GET /api/farms/:id
 * Fetches farm metadata with dynamic aggregations (tree count, livestock count, batch count)
 */
const getFarmById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sqlQuery = `
      SELECT
        f.id,
        f.name,
        f.code,
        f.area_hectares AS "areaHectares",
        f.latitude,
        f.longitude,
        f.region,
        f.country_code AS "countryCode",
        f.soil_type AS "soilType",
        f.irrigation_source AS "irrigationSource",
        f.certifications,
        u.full_name AS "ownerName",
        u.email AS "ownerEmail",
        COUNT(DISTINCT t.id)::int AS "treeCount",
        COUNT(DISTINCT l.id)::int AS "livestockCount",
        COUNT(DISTINCT hr.id)::int AS "harvestBatchCount",
        -- Health status breakdown
        COUNT(DISTINCT CASE WHEN t.health_status = 'healthy' THEN t.id END)::int AS "healthyTreeCount",
        COUNT(DISTINCT CASE WHEN t.health_status = 'needs_attention' THEN t.id END)::int AS "attentionTreeCount",
        COUNT(DISTINCT CASE WHEN t.health_status = 'diseased' THEN t.id END)::int AS "diseasedTreeCount"
      FROM farms f
      LEFT JOIN users u ON f.owner_id = u.id
      LEFT JOIN trees t ON t.farm_id = f.id
      LEFT JOIN livestock l ON l.farm_id = f.id
      LEFT JOIN harvest_records hr ON hr.farm_id = f.id
      WHERE f.id::text = $1 OR f.code = $1
      GROUP BY f.id, u.full_name, u.email
      LIMIT 1;
    `;

    try {
      const result = await db.query(sqlQuery, [id]);
      if (result.rows.length > 0) {
        return res.status(200).json({
          success: true,
          source: 'postgresql',
          farm: result.rows[0]
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL Farm Query Error, using fallback]:', dbErr.message);
    }

    // Check fallback
    if (id === FALLBACK_FARM.id || id === FALLBACK_FARM.code || id === 'current' || id === '1') {
      return res.status(200).json({
        success: true,
        source: 'memory_cache',
        farm: {
          ...FALLBACK_FARM,
          treeCount: FALLBACK_FARM.stats.totalTrees,
          livestockCount: FALLBACK_FARM.stats.totalLivestock,
          harvestBatchCount: 1,
          healthyTreeCount: FALLBACK_FARM.stats.healthyTrees,
          attentionTreeCount: FALLBACK_FARM.stats.needsAttentionTrees,
          diseasedTreeCount: FALLBACK_FARM.stats.diseasedTrees
        }
      });
    }

    return res.status(404).json({
      success: false,
      error: 'NotFound',
      message: `Farm holding with ID '${id}' was not found in registry.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/farms
 * List all registered farms
 */
const getAllFarms = async (req, res, next) => {
  try {
    try {
      const result = await db.query('SELECT * FROM farms ORDER BY created_at DESC');
      if (result.rows.length > 0) {
        return res.status(200).json({
          success: true,
          count: result.rows.length,
          farms: result.rows
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL list farms query fallback]:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      count: 1,
      farms: [FALLBACK_FARM]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFarmById,
  getAllFarms
};
