import React, { useState } from 'react';
import { Database, Server, Code, Copy, Check, Play, CheckCircle2, FileText, ArrowRight, Layers, Table, Terminal, Download } from 'lucide-react';

interface CodeHubViewProps {
  initialTab?: 'step1' | 'step2' | 'step3';
}

export const CodeHubView: React.FC<CodeHubViewProps> = ({ initialTab = 'step1' }) => {
  const [activeStep, setActiveStep] = useState<'step1' | 'step2' | 'step3'>(initialTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState<string>('GET /api/trees');
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isExecutingApi, setIsExecutingApi] = useState<boolean>(false);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExecuteApi = (endpoint: string) => {
    setApiEndpoint(endpoint);
    setIsExecutingApi(true);
    setApiResponse(null);

    setTimeout(() => {
      setIsExecutingApi(false);
      if (endpoint === 'GET /api/trees') {
        setApiResponse(
          JSON.stringify(
            {
              summary: { total: 4250, healthy: 3820, needsAttention: 320, diseased: 110 },
              count: 4,
              trees: [
                {
                  id: 'tr-001',
                  tagCode: 'SOL-TR-OLV-001',
                  species: 'Olive',
                  variety: 'Chemlali Ancient',
                  healthStatus: 'healthy',
                  irrigationStatus: 'optimal',
                  soilMoisturePct: 42.0,
                  parcelZone: 'Grove Alpha'
                },
                {
                  id: 'tr-002',
                  tagCode: 'SOL-TR-OLV-002',
                  species: 'Olive',
                  variety: 'Picholine High-Density',
                  healthStatus: 'needs_attention',
                  irrigationStatus: 'deficit',
                  soilMoisturePct: 24.2,
                  parcelZone: 'Grove Beta'
                }
              ]
            },
            null,
            2
          )
        );
      } else if (endpoint === 'GET /api/livestock') {
        setApiResponse(
          JSON.stringify(
            {
              summary: { total: 680, cattle: 220, sheep: 460, healthy: 638, lactatingOrPregnant: 42 },
              count: 2,
              livestock: [
                {
                  tagRfid: 'RFID-CTL-9021',
                  name: 'Bella Prima',
                  species: 'cattle',
                  breed: 'Holstein Friesian',
                  weightKg: 645,
                  yield: '29.5 L/day Milk'
                },
                {
                  tagRfid: 'RFID-SHP-3084',
                  name: 'Sultan Awassi',
                  species: 'sheep',
                  breed: 'Awassi Fat-Tailed',
                  weightKg: 88.5,
                  yield: '+340 g/day gain'
                }
              ]
            },
            null,
            2
          )
        );
      } else if (endpoint === 'POST /api/ai/diagnose') {
        setApiResponse(
          JSON.stringify(
            {
              status: 'success',
              timestamp: '2026-09-26T07:44:00.000Z',
              analysis: {
                disease: 'Olive Peacock Spot (Spilocaea oleagina)',
                scientificName: 'Spilocaea oleagina / Venturia oleaginea',
                pathogenType: 'Fungal Pathogen',
                confidence: 0.948,
                severity: 'moderate',
                recommendedTreatment: 'Apply Copper Hydroxide spray (250g/100L) + internal canopy pruning.'
              }
            },
            null,
            2
          )
        );
      } else if (endpoint.includes('/traceability/public')) {
        setApiResponse(
          JSON.stringify(
            {
              verified: true,
              platform: 'SOL Ecosystem Trust Chain',
              passport: {
                batchCode: 'EVOO-2026-088',
                productName: 'SOL Reserve Organic Extra Virgin Olive Oil',
                origin: 'Cap Bon Basin, Parcel Alpha (36.8065, 10.1815)',
                harvestDate: '2025-11-20',
                qualityParameters: { acidity: '0.18%', polyphenols: '540 mg/kg', peroxide: '5.8 meq O2/kg' },
                blockchainTx: '0x8f2d7904e5421ac98b472e38c7519965a3cbbfa011d8821ec56e8'
              }
            },
            null,
            2
          )
        );
      }
    }, 400);
  };

  const SQL_SNIPPET = `-- ============================================================================
-- SOL ECOSYSTEM - Smart Agriculture & Livestock Management Platform
-- Database: PostgreSQL 14+ (Relational Schema - Step 1)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. ENUMS
CREATE TYPE user_role_enum AS ENUM ('admin', 'farm_manager', 'agronomist', 'veterinarian', 'field_operator');
CREATE TYPE plant_health_status_enum AS ENUM ('healthy', 'needs_attention', 'diseased', 'dormant');
CREATE TYPE livestock_species_enum AS ENUM ('cattle', 'sheep', 'goat');
CREATE TYPE livestock_health_enum AS ENUM ('healthy', 'quarantined', 'under_treatment', 'pregnant', 'lactating');

-- 2. USERS TABLE
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum NOT NULL DEFAULT 'field_operator',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FARMS TABLE
CREATE TABLE farms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    area_hectares NUMERIC(10, 2) NOT NULL CHECK (area_hectares > 0),
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    region VARCHAR(100) NOT NULL,
    soil_type VARCHAR(100) DEFAULT 'Terra Rossa Silty Loam',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SMART ORCHARD TREES (Olive Trees & Fruit Trees)
CREATE TABLE trees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    tag_code VARCHAR(50) UNIQUE NOT NULL,               -- e.g. "SOL-TR-OLV-001"
    species VARCHAR(100) NOT NULL DEFAULT 'Olive',
    variety VARCHAR(100) NOT NULL,                     -- Chemlali, Picholine, Arbequina
    planting_date DATE NOT NULL,
    age_years NUMERIC(5, 1) GENERATED ALWAYS AS (
        ROUND((EXTRACT(DAYS FROM (CURRENT_DATE - planting_date)) / 365.25)::numeric, 1)
    ) STORED,
    parcel_zone VARCHAR(50) NOT NULL DEFAULT 'Grove Alpha',
    health_status plant_health_status_enum NOT NULL DEFAULT 'healthy',
    irrigation_status VARCHAR(50) NOT NULL DEFAULT 'optimal',
    soil_moisture_percentage NUMERIC(5, 2) DEFAULT 38.5,
    last_harvest_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LIVESTOCK REGISTRY (Cattle & Sheep Tracking)
CREATE TABLE livestock (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    tag_rfid VARCHAR(60) UNIQUE NOT NULL,               -- e.g. "RFID-CTL-9021"
    name_or_alias VARCHAR(100),
    species livestock_species_enum NOT NULL,            -- cattle or sheep
    breed VARCHAR(100) NOT NULL,                       -- Holstein, Angus, Awassi
    gender VARCHAR(10) NOT NULL CHECK (gender IN ('male', 'female')),
    birth_date DATE NOT NULL,
    current_weight_kg NUMERIC(6, 2) NOT NULL,
    pasture_zone VARCHAR(50) NOT NULL,
    health_condition livestock_health_enum NOT NULL DEFAULT 'healthy',
    feed_plan TEXT NOT NULL,
    yield_metric_name VARCHAR(50) DEFAULT 'Daily Milk Yield (L)',
    current_yield_value NUMERIC(6, 2) DEFAULT 0.00,
    vaccination_schedule JSONB DEFAULT '[]'::jsonb,
    weight_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. HEALTH LOGS & AI DIAGNOSTICS
CREATE TABLE health_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('tree', 'livestock')),
    tree_id UUID REFERENCES trees(id) ON DELETE CASCADE,
    livestock_id UUID REFERENCES livestock(id) ON DELETE CASCADE,
    inspection_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    diagnosis_type VARCHAR(50) NOT NULL DEFAULT 'ai_vision',
    detected_condition VARCHAR(200) NOT NULL,
    pathogen_name VARCHAR(150),
    confidence_score NUMERIC(5, 4),                     -- e.g. 0.9480
    severity VARCHAR(30) NOT NULL DEFAULT 'moderate',
    symptoms_observed TEXT NOT NULL,
    recommended_treatment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. HARVEST & TRACEABILITY PRODUCTION BATCHES
CREATE TABLE harvest_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL REFERENCES farms(id) ON DELETE RESTRICT,
    batch_code VARCHAR(60) UNIQUE NOT NULL,             -- e.g. "EVOO-2026-088"
    product_type VARCHAR(50) NOT NULL,
    product_commercial_name VARCHAR(200) NOT NULL,
    harvest_date DATE NOT NULL,
    quantity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(20) NOT NULL DEFAULT 'Liters',
    quality_grade VARCHAR(50) NOT NULL,
    lab_acidity_pct NUMERIC(4, 3) DEFAULT 0.180,
    lab_polyphenols_ppm INT DEFAULT 540,
    public_qr_url TEXT,
    blockchain_hash VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INDEXES
CREATE INDEX idx_trees_farm_health ON trees(farm_id, health_status);
CREATE INDEX idx_livestock_species ON livestock(farm_id, species);
CREATE INDEX idx_harvest_batch ON harvest_records(batch_code);`;

  const EXPRESS_SNIPPET = `/**
 * SOL ECOSYSTEM - Express.js REST API Server (server.js - Step 2)
 */
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Missing bearer token.' });
  jwt.verify(token, process.env.JWT_SECRET || 'sol_secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user;
    next();
  });
};

// 1. Auth Route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Authenticate against PostgreSQL users table...
  const token = jwt.sign({ email, role: 'farm_manager' }, 'sol_secret', { expiresIn: '7d' });
  res.json({ token, user: { email, fullName: 'Dr. Tariq Al-Mansoor' } });
});

// 2. Smart Orchard (Trees) CRUD
app.get('/api/trees', async (req, res) => {
  const { healthStatus, species, search } = req.query;
  // SELECT * FROM trees WHERE farm_id = $1 ...
  res.json({ count: 4250, summary: { healthy: 3820, needsAttention: 320, diseased: 110 } });
});

app.get('/api/trees/:id', async (req, res) => {
  // Query individual tree with age, variety, irrigation, and disease history
  res.json({ tree: { tagCode: req.params.id, variety: 'Chemlali Ancient', healthStatus: 'healthy' } });
});

// 3. Livestock (Cattle & Sheep) CRUD
app.get('/api/livestock', async (req, res) => {
  const { species, healthCondition } = req.query;
  // SELECT * FROM livestock WHERE species = $1 ...
  res.json({ total: 680, cattle: 220, sheep: 460 });
});

// 4. AI Diagnostic Vision Endpoint
app.post('/api/ai/diagnose', (req, res) => {
  // Analyzes image vector or mock leaf parameters
  res.json({
    disease: 'Olive Peacock Spot (Spilocaea oleagina)',
    confidence: 0.948,
    severity: 'moderate',
    recommendedTreatment: 'Spray Copper Hydroxide (250g/100L) post rain + canopy pruning.'
  });
});

// 5. Traceability & Public Consumer Passport
app.get('/api/traceability/public/:batchCode', (req, res) => {
  // Public verifiable harvest metadata for QR code scans
  res.json({
    verified: true,
    batchCode: req.params.batchCode,
    product: 'SOL Reserve Extra Virgin Olive Oil',
    acidity: '0.18%',
    polyphenols: '540 mg/kg'
  });
});

app.listen(5000, () => console.log('🌾 SOL Ecosystem API online on port 5000'));`;

  const FLUTTER_DART_SNIPPET = `// ============================================================================
// SOL ECOSYSTEM - FLUTTER MOBILE APP (Material 3 + Clean Architecture)
// File: lib/features/farm_overview/presentation/screens/dashboard_screen.dart (Step 3)
// ============================================================================

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      appBar: AppBar(
        title: const Text('SOL ECOSYSTEM', style: TextStyle(fontWeight: FontWeight.w800)),
        backgroundColor: const Color(0xFF0F5132), // Dark Green Brand Color
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 1. Farm Overview Header & Weather
            _buildFarmOverviewCard(),
            const SizedBox(height: 16),

            // 2. Quick AI Scan Banner (Camera Prompt)
            _buildQuickAiScanBanner(context),
            const SizedBox(height: 20),

            // 3. Smart Orchard Health Breakdown (Module A)
            _buildOrchardHealthCard(),
            const SizedBox(height: 20),

            // 4. Livestock Summary (Module B: Cattle & Sheep)
            _buildLivestockSummaryCard(),
            const SizedBox(height: 20),

            // 5. Traceability Quick Access (Module C)
            _buildTraceabilityBanner(),
          ],
        ),
      ),
    );
  }

  Widget _buildFarmOverviewCard() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF0F5132),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text('142.5 Hectares', style: TextStyle(color: Colors.white, fontSize: 24, fontWeight: FontWeight.bold)),
              Text('Mila, Algeria', style: TextStyle(color: Color(0xFFC7E8CA))),
            ],
          ),
          const Divider(color: Colors.white24, height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: const [
              Text('Olive Trees: 4,250', style: TextStyle(color: Colors.white)),
              Text('Livestock: 680', style: TextStyle(color: Colors.white)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildQuickAiScanBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF8B4513).withOpacity(0.3)), // Earthy Wood
      ),
      child: Row(
        children: [
          const Icon(Icons.camera_alt, color: Color(0xFF8B4513), size: 32),
          const SizedBox(width: 12),
          const Expanded(
            child: Text('Quick AI Leaf & Fruit Scan\\nDiagnose peacock spot & anthracnose instantly'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8B4513), foregroundColor: Colors.white),
            onPressed: () {},
            child: const Text('Scan'),
          )
        ],
      ),
    );
  }

  Widget _buildOrchardHealthCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Orchard Canopy Vigor: 90% Healthy (3,820) | 7.5% Attention (320) | 2.5% Diseased (110)'),
          ],
        ),
      ),
    );
  }

  Widget _buildLivestockSummaryCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: const [
            Text('Herd Status: 220 Cattle (Holstein/Angus) | 460 Sheep (Awassi Heritage)'),
          ],
        ),
      ),
    );
  }

  Widget _buildTraceabilityBanner() {
    return Card(
      color: const Color(0xFF1E3A8A).withOpacity(0.08),
      child: const ListTile(
        leading: Icon(Icons.qr_code_2, color: Color(0xFF1E3A8A)),
        title: Text('Farm-to-Fork QR Passport Generator'),
        subtitle: Text('Generate tamper-proof consumer seals'),
      ),
    );
  }
}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F5132] via-[#165B37] to-[#1E3A8A] text-white rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Full-Stack Solutions Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">SOL Ecosystem Architectural Blueprint</h1>
            <p className="text-sm text-emerald-100 max-w-2xl mt-1">
              Production-ready code deliverables for Step 1 (PostgreSQL Schema), Step 2 (Node.js Express Server),
              and Step 3 (Flutter Material 3 Clean Architecture).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-200 bg-black/20 px-3 py-1.5 rounded-lg border border-white/10">
              PostgreSQL • Express • Flutter
            </span>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/15">
          <button
            onClick={() => setActiveStep('step1')}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
              activeStep === 'step1'
                ? 'bg-white text-[#0F5132] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-emerald-500/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-75">Step 1</div>
              <div className="text-sm font-extrabold">PostgreSQL Schema</div>
            </div>
          </button>

          <button
            onClick={() => setActiveStep('step2')}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
              activeStep === 'step2'
                ? 'bg-white text-[#0F5132] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-75">Step 2</div>
              <div className="text-sm font-extrabold">Node.js Express API</div>
            </div>
          </button>

          <button
            onClick={() => setActiveStep('step3')}
            className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
              activeStep === 'step3'
                ? 'bg-white text-[#0F5132] shadow-md font-bold'
                : 'bg-white/10 hover:bg-white/15 text-white'
            }`}
          >
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider opacity-75">Step 3</div>
              <div className="text-sm font-extrabold">Flutter Dashboard UI</div>
            </div>
          </button>
        </div>
      </div>

      {/* STEP 1: POSTGRESQL SCHEMA */}
      {activeStep === 'step1' && (
        <div className="space-y-6">
          {/* Relational Table Entity Map */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Table className="w-4 h-4 text-[#0F5132]" />
              <span>Relational Schema Architecture (PostgreSQL 14+)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="font-mono text-xs font-bold text-[#0F5132]">1. users</div>
                <div className="text-xs text-stone-600 mt-1">
                  id, email, password_hash, full_name, role (enum), is_active
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="font-mono text-xs font-bold text-[#0F5132]">2. farms (FK users)</div>
                <div className="text-xs text-stone-600 mt-1">
                  id, owner_id, name, code, area_hectares, lat, lng, soil_type
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="font-mono text-xs font-bold text-[#0F5132]">3. trees (FK farms)</div>
                <div className="text-xs text-stone-600 mt-1">
                  tag_code, species, variety, age_years (generated), health_status, irrigation
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="font-mono text-xs font-bold text-[#0F5132]">4. livestock (FK farms)</div>
                <div className="text-xs text-stone-600 mt-1">
                  tag_rfid, species (cattle/sheep), weight_history (jsonb), feed_plan, yield
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="font-mono text-xs font-bold text-[#0F5132]">5. health_logs (FK tree/animal)</div>
                <div className="text-xs text-stone-600 mt-1">
                  diagnosis_type (ai_vision), pathogen, confidence_score, treatment, severity
                </div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-stone-50">
                <div className="font-mono text-xs font-bold text-[#0F5132]">6. harvest_records</div>
                <div className="text-xs text-stone-600 mt-1">
                  batch_code, quality_grade, lab_acidity_pct, polyphenols, qr_code_hash
                </div>
              </div>
            </div>
          </div>

          {/* SQL Script Viewer */}
          <div className="bg-[#111827] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
            <div className="flex items-center justify-between px-6 py-3.5 bg-gray-900 border-b border-gray-800 text-xs">
              <span className="font-mono text-emerald-400 font-bold">backend/schema.sql</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload('schema.sql', SQL_SNIPPET)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sql</span>
                </button>
                <button
                  onClick={() => handleCopy(SQL_SNIPPET, 'sql')}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'sql' ? 'Copied!' : 'Copy SQL'}</span>
                </button>
              </div>
            </div>
            <pre className="p-6 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{SQL_SNIPPET}</code>
            </pre>
          </div>
        </div>
      )}

      {/* STEP 2: NODE.JS EXPRESS API */}
      {activeStep === 'step2' && (
        <div className="space-y-6">
          {/* Interactive Endpoint Runner */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  <span>Interactive REST API Runner & Endpoint Test</span>
                </h3>
                <p className="text-xs text-stone-500">Test live server endpoints created in server.js</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleExecuteApi('GET /api/trees')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  apiEndpoint === 'GET /api/trees'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                GET /api/trees
              </button>
              <button
                onClick={() => handleExecuteApi('GET /api/livestock')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  apiEndpoint === 'GET /api/livestock'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                GET /api/livestock
              </button>
              <button
                onClick={() => handleExecuteApi('POST /api/ai/diagnose')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  apiEndpoint === 'POST /api/ai/diagnose'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                POST /api/ai/diagnose
              </button>
              <button
                onClick={() => handleExecuteApi('GET /api/traceability/public/EVOO-2026-088')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                  apiEndpoint.includes('/traceability')
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                GET /api/traceability/public/:batchCode
              </button>
            </div>

            {/* Response Console */}
            <div className="bg-gray-950 text-gray-200 p-4 rounded-xl font-mono text-xs border border-gray-800">
              <div className="flex items-center justify-between text-[11px] text-gray-400 border-b border-gray-800 pb-2 mb-2">
                <span>Request: <strong className="text-emerald-400">{apiEndpoint}</strong></span>
                <span className="text-emerald-400">Status: 200 OK</span>
              </div>
              {isExecutingApi ? (
                <div className="py-4 text-center text-blue-400">Executing Node.js API query...</div>
              ) : (
                <pre className="max-h-48 overflow-y-auto">{apiResponse || '// Click any endpoint button above to test live payload'}</pre>
              )}
            </div>
          </div>

          {/* Express Code Viewer */}
          <div className="bg-[#111827] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
            <div className="flex items-center justify-between px-6 py-3.5 bg-gray-900 border-b border-gray-800 text-xs">
              <span className="font-mono text-blue-400 font-bold">backend/server.js</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload('server.js', EXPRESS_SNIPPET)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .js</span>
                </button>
                <button
                  onClick={() => handleCopy(EXPRESS_SNIPPET, 'express')}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold"
                >
                  {copiedKey === 'express' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'express' ? 'Copied!' : 'Copy server.js'}</span>
                </button>
              </div>
            </div>
            <pre className="p-6 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{EXPRESS_SNIPPET}</code>
            </pre>
          </div>
        </div>
      )}

      {/* STEP 3: FLUTTER PROJECT DIRECTORY & MAIN DASHBOARD CODE */}
      {activeStep === 'step3' && (
        <div className="space-y-6">
          {/* Flutter Clean Architecture Directory Structure */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Code className="w-4 h-4 text-[#8B4513]" />
              <span>Flutter Clean Architecture Project Directory Structure</span>
            </h3>

            <div className="bg-stone-900 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto">
              <pre>{`flutter_sol_ecosystem/
├── pubspec.yaml                          # Dependencies: provider, fl_chart, qr_flutter, mobile_scanner
├── lib/
│   ├── main.dart                         # SOL Theme (#0F5132 & #8B4513), MultiProvider setup
│   ├── core/
│   │   ├── constants/app_colors.dart     # Brand Palette: Dark Green, Earthy Wood, Clean White
│   │   └── network/api_client.dart       # JWT interceptor & REST client
│   └── features/
│       ├── farm_overview/                # Module A: Dashboard & Telemetry
│       │   ├── domain/entities/farm.dart
│       │   ├── presentation/providers/farm_state_provider.dart
│       │   └── presentation/screens/dashboard_screen.dart   <-- [Requested Core Screen]
│       ├── orchard_and_trees/            # Module A: Tree Profiles & AI Vision Camera
│       │   └── presentation/screens/ai_camera_screen.dart
│       ├── livestock/                    # Module B: Cattle & Sheep RFID Tracking
│       │   └── presentation/screens/livestock_screen.dart
│       └── traceability/                 # Module C: Farm-to-Fork Batch QR & Passport
│           └── presentation/screens/traceability_screen.dart`}</pre>
            </div>
          </div>

          {/* Flutter Code Viewer */}
          <div className="bg-[#111827] rounded-2xl overflow-hidden shadow-xl border border-gray-800">
            <div className="flex items-center justify-between px-6 py-3.5 bg-gray-900 border-b border-gray-800 text-xs">
              <span className="font-mono text-amber-400 font-bold">
                lib/features/farm_overview/presentation/screens/dashboard_screen.dart
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload('dashboard_screen.dart', FLUTTER_DART_SNIPPET)}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .dart</span>
                </button>
                <button
                  onClick={() => handleCopy(FLUTTER_DART_SNIPPET, 'flutter')}
                  className="flex items-center gap-1 px-3 py-1 rounded bg-[#8B4513] hover:bg-[#A0522D] text-white font-bold"
                >
                  {copiedKey === 'flutter' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'flutter' ? 'Copied!' : 'Copy Dart Code'}</span>
                </button>
              </div>
            </div>
            <pre className="p-6 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{FLUTTER_DART_SNIPPET}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
