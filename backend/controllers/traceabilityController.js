/**
 * ==============================================================================
 * SOL ECOSYSTEM - Traceability & Farm-to-Fork Passport Controller
 * File: backend/controllers/traceabilityController.js
 * ==============================================================================
 */

const db = require('../config/db');

// In-Memory Fallback Batches
const FALLBACK_BATCHES = [
  {
    batchCode: 'BATCH-DZ-MILA-EVOO-2026-001',
    productName: 'SOL Réserve Terroir de Mila - Extra Virgin Cold Pressed',
    variety: 'Chemlali & Picholine Estate Blend',
    origin: 'Domaine Olicole de Mila, Beni Haroun Basin, Algeria',
    harvestDate: '2025-11-20',
    processingDate: '2025-11-21 (Cold-Pressed at 21°C within 6h)',
    quantity: '3,800 Liters (Numbered Bottles 0001 - 7600)',
    qualityParameters: {
      acidity: '0.17% (Ultra-Low Acidity, EU Extra Virgin threshold < 0.8%)',
      peroxide: '5.20 meq O2/kg (Threshold < 20)',
      polyphenols: '580 mg/kg (High Antioxidant Cardioprotective Content)',
      sensoryProfile: 'Fresh artichoke, green almond, freshly mown grass, peppery oleocanthal finish'
    },
    certifications: [
      'Protected Geographical Indication (PGI) Mila',
      'Bio-Algerie Organic Certified #DZ-BIO-14',
      'GlobalGAP v6 Certified'
    ],
    blockchainTx: '0x7c9f82d1b54a3e208c9018f4a13d7890b41c0e86b245781a95e2d67a123f4c8b',
    farmCoordinates: { latitude: 36.4503, longitude: 6.2644 }
  }
];

/**
 * GET /api/traceability/public/:batchCode
 * Fetch public verification passport for consumers scanning QR code
 */
const getPublicBatchPassport = async (req, res, next) => {
  try {
    const { batchCode } = req.params;

    const sql = `
      SELECT
        hr.id,
        hr.batch_code AS "batchCode",
        hr.product_type AS "productType",
        hr.product_commercial_name AS "productName",
        hr.harvest_date AS "harvestDate",
        hr.pressing_or_packaging_date AS "processingDate",
        hr.quantity,
        hr.unit,
        hr.quality_grade AS "qualityGrade",
        hr.lab_acidity_pct AS "labAcidityPct",
        hr.lab_polyphenols_ppm AS "labPolyphenolsPpm",
        hr.lab_peroxide_value AS "labPeroxideValue",
        hr.certifications_included AS "certifications",
        hr.source_parcel_zone AS "originParcel",
        hr.blockchain_hash AS "blockchainHash",
        hr.public_qr_url AS "publicQrUrl",
        f.name AS "farmName",
        f.region AS "farmRegion",
        f.latitude,
        f.longitude
      FROM harvest_records hr
      JOIN farms f ON hr.farm_id = f.id
      WHERE LOWER(hr.batch_code) = LOWER($1)
      LIMIT 1;
    `;

    try {
      const result = await db.query(sql, [batchCode]);
      if (result.rows.length > 0) {
        const row = result.rows[0];
        return res.status(200).json({
          verified: true,
          platform: 'SOL Ecosystem Trust Chain (Mila, Algeria)',
          timestamp: new Date().toISOString(),
          source: 'postgresql',
          passport: {
            batchCode: row.batchCode,
            productName: row.productName,
            origin: `${row.farmName}, ${row.farmRegion}`,
            coordinates: { latitude: row.latitude, longitude: row.longitude },
            harvestDate: row.harvestDate,
            processingDate: row.processingDate,
            quantity: `${row.quantity} ${row.unit}`,
            qualityParameters: {
              acidity: `${row.labAcidityPct}% (Ultra-Low Acidity)`,
              polyphenols: `${row.labPolyphenolsPpm} mg/kg (High Antioxidants)`,
              peroxideValue: `${row.labPeroxideValue} meq O2/kg`,
              qualityGrade: row.qualityGrade
            },
            certifications: row.certifications,
            blockchainSeal: row.blockchainHash,
            qrVerificationUrl: row.publicQrUrl
          }
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL batch query error, using fallback]:', dbErr.message);
    }

    // Fallback matching
    const fallbackMatch = FALLBACK_BATCHES.find(
      b => b.batchCode.toLowerCase() === batchCode.toLowerCase()
    );

    if (fallbackMatch) {
      return res.status(200).json({
        verified: true,
        platform: 'SOL Ecosystem Trust Chain (Mila, Algeria)',
        timestamp: new Date().toISOString(),
        source: 'memory_cache',
        passport: fallbackMatch
      });
    }

    return res.status(404).json({
      verified: false,
      error: 'NotFound',
      message: `Batch code '${batchCode}' could not be verified in the traceability registry. Please check QR code.`
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/traceability/batches
 * Internal list of all production batches
 */
const listBatches = async (req, res, next) => {
  try {
    try {
      const result = await db.query('SELECT * FROM harvest_records ORDER BY harvest_date DESC');
      if (result.rows.length > 0) {
        return res.status(200).json({
          success: true,
          count: result.rows.length,
          batches: result.rows
        });
      }
    } catch (dbErr) {
      console.warn('⚠️ [PostgreSQL list batches fallback]:', dbErr.message);
    }

    return res.status(200).json({
      success: true,
      count: FALLBACK_BATCHES.length,
      batches: FALLBACK_BATCHES
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPublicBatchPassport,
  listBatches
};
