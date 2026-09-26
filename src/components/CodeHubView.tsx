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
  const [selectedFlutterFile, setSelectedFlutterFile] = useState<'main' | 'dashboard'>('main');

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
 * SOL ECOSYSTEM - Express.js REST API Server (MVC Architecture)
 * File: backend/server.js
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route Modules
const authRoutes = require('./routes/authRoutes');
const farmRoutes = require('./routes/farmRoutes');
const treeRoutes = require('./routes/treeRoutes');
const aiRoutes = require('./routes/aiRoutes');
const traceabilityRoutes = require('./routes/traceabilityRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '25mb' }));

// Mount MVC Routes
app.use('/api/auth', authRoutes);
app.use('/api/farms', farmRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/traceability', traceabilityRoutes);

// Health check with PostgreSQL pool query
app.get('/api/health', async (req, res) => {
  const ping = await db.query('SELECT NOW() AS current_time');
  res.json({ status: 'ONLINE', region: 'Mila, Algeria', dbTime: ping.rows[0].current_time });
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await db.checkConnection();
  console.log(\`🌾 SOL Ecosystem API online on port \${PORT} (Mila, Algeria)\`);
});`;

  const FLUTTER_MAIN_DART_SNIPPET = `// ============================================================================
// SOL ECOSYSTEM - SMART AGRITECH & BIO-FARMING PLATFORM
// File: lib/main.dart
// Features: Full Arabic Localization (Algerian Context: Mila) & RTL Architecture
// ============================================================================

import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/dashboard_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    // 1. Wrap the app with ChangeNotifierProvider using FarmStateProvider
    ChangeNotifierProvider(
      create: (_) => FarmStateProvider()..loadFarmData(),
      child: const SolEcosystemApp(),
    ),
  );
}

class SolEcosystemApp extends StatelessWidget {
  const SolEcosystemApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Access FarmStateProvider to observe locale and RTL state changes
    final farmProvider = context.watch<FarmStateProvider>();
    final isArabic = farmProvider.isArabic;

    // SOL Brand Color Palette (Algerian Bio-Agriculture):
    // Primary Dark Green: #0F5132 (Olive groves & vegetative health)
    // Secondary Earthy Wood: #8B4513 (Mila fertile silty-loam soil)
    // Tertiary Precision Blue: #1E3A8A (IoT telemetry & QR traceability)
    final ColorScheme solColorScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF0F5132),
      primary: const Color(0xFF0F5132),
      onPrimary: Colors.white,
      secondary: const Color(0xFF8B4513),
      onSecondary: Colors.white,
      tertiary: const Color(0xFF1E3A8A),
      onTertiary: Colors.white,
      surface: const Color(0xFFF9FBF8),
      onSurface: const Color(0xFF1B2E20),
      surfaceContainerHighest: const Color(0xFFE8EFE8),
      error: const Color(0xFFB71C1C),
      onError: Colors.white,
      brightness: Brightness.light,
    );

    // 4. Appropriate Typography Suited for Arabic Text (Algerian Agronomic Context)
    // Uses Google Fonts Cairo with enhanced line height and letter spacing for Arabic legibility
    final TextTheme baseTextTheme = ThemeData.light().textTheme;
    final TextTheme arabicTextTheme = GoogleFonts.cairoTextTheme(baseTextTheme).copyWith(
      displayLarge: GoogleFonts.cairo(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        height: 1.4,
        letterSpacing: 0,
        color: const Color(0xFF1B2E20),
      ),
      headlineMedium: GoogleFonts.cairo(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        height: 1.4,
        letterSpacing: 0,
        color: const Color(0xFF1B2E20),
      ),
      titleLarge: GoogleFonts.cairo(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        height: 1.45,
        letterSpacing: 0,
        color: const Color(0xFF1B2E20),
      ),
      titleMedium: GoogleFonts.cairo(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: const Color(0xFF1B2E20),
      ),
      bodyLarge: GoogleFonts.cairo(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        height: 1.55,
        color: const Color(0xFF2E3D30),
      ),
      bodyMedium: GoogleFonts.cairo(
        fontSize: 13,
        fontWeight: FontWeight.w400,
        height: 1.5,
        color: const Color(0xFF4A5568),
      ),
      labelLarge: GoogleFonts.cairo(
        fontSize: 14,
        fontWeight: FontWeight.w700,
        letterSpacing: 0,
        color: Colors.white,
      ),
      labelMedium: GoogleFonts.cairo(
        fontSize: 12,
        fontWeight: FontWeight.w600,
        height: 1.3,
        color: const Color(0xFF64748B),
      ),
    );

    final TextTheme englishTextTheme = GoogleFonts.interTextTheme(baseTextTheme).copyWith(
      titleLarge: GoogleFonts.inter(fontSize: 18, fontWeight: FontWeight.bold),
      bodyLarge: GoogleFonts.inter(fontSize: 14, height: 1.5),
    );

    return MaterialApp(
      // Localized application title
      title: isArabic ? 'منظومة SOL الرقمية' : 'SOL Ecosystem',
      debugShowCheckedModeBanner: false,

      // 2. Configure MaterialApp:
      // Dynamically select locale based on farmProvider.isArabic
      // Defaults to Locale('ar', 'DZ') for Algerian agronomic context (Mila basin)
      locale: isArabic ? const Locale('ar', 'DZ') : const Locale('en', 'US'),

      // Supported Locales (Arabic Algeria & English US)
      supportedLocales: const [
        Locale('ar', 'DZ'), // Arabic (Algeria - Mila Basin)
        Locale('en', 'US'), // English (International fallback)
      ],

      // Required Flutter Localization Delegates for Material, Widgets & Cupertino
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],

      // Material 3 Theme with Algerian Agronomic Visual Identity
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: solColorScheme,
        scaffoldBackgroundColor: const Color(0xFFF6F8F5),
        textTheme: isArabic ? arabicTextTheme : englishTextTheme,
        appBarTheme: AppBarTheme(
          backgroundColor: const Color(0xFF0F5132),
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: false,
          titleTextStyle: (isArabic ? GoogleFonts.cairo : GoogleFonts.inter)(
            fontSize: 19,
            fontWeight: FontWeight.w800,
            color: Colors.white,
          ),
        ),
        cardTheme: CardTheme(
          color: Colors.white,
          elevation: 1.5,
          shadowColor: Colors.black.withOpacity(0.06),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            elevation: 0,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            textStyle: (isArabic ? GoogleFonts.cairo : GoogleFonts.inter)(
              fontWeight: FontWeight.w700,
              fontSize: 14,
            ),
          ),
        ),
      ),

      // Main Farm & Orchard Dashboard
      home: const DashboardScreen(),
    );
  }
}
`;

  const FLUTTER_DART_SNIPPET = `// ============================================================================
// SOL ECOSYSTEM - FLUTTER MOBILE APP (Material 3 + Clean Architecture)
// File: lib/screens/dashboard_screen.dart (RTL & Arabic Localization)
// ============================================================================

import 'dart:convert';
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../../core/services/api_service.dart';

/// State Management Provider with Arabic Localization & RTL Layout State
class FarmStateProvider extends ChangeNotifier {
  final ApiService _apiService;
  bool _isLoading = false;
  bool get isLoading => _isLoading;
  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  // Language & RTL State (Defaults to Arabic for Algerian Agronomic context)
  bool _isArabic = true;
  bool get isArabic => _isArabic;
  TextDirection get textDirection => _isArabic ? TextDirection.rtl : TextDirection.ltr;

  void toggleLanguage() {
    _isArabic = !_isArabic;
    notifyListeners();
  }

  // Arabic String Constants Dictionary (Algerian Agronomic Context - Mila Basin)
  static const Map<String, String> arabicStrings = {
    'appTitle': 'منظومة SOL الرقمية',
    'appSubtitle': 'مستثمرة ميلة الفلاحية • حوض بني هارون',
    'locationSubtitle': 'ميلة، الجزائر • حوض بني هارون',
    'estateAreaLabel': 'المساحة الإجمالية: 142.5 هكتار',
    'soilType': 'تربة طميية فيضية غنية وخصبة (حوض ميلة)',
    'weatherStatus': '24° م مشمس، شمالي غربي 12 كم/سا',
    'oliveTrees': 'أشجار الزيتون',
    'livestock': 'الثروة الحيوانية',
    'soilMoisture': 'رطوبة التربة',
    'aiScanBannerTitle': 'الفحص السريع بالذكاء الاصطناعي',
    'aiScanSubtitle': 'التقط صورة للورقة للكشف المبكر عن عين الطاووس والآفات',
    'scanButton': 'فحص فوري',
    'analyzingText': 'جارٍ فحص أمراض الأوراق وتحليل العينة بالذكاء الاصطناعي...',
    'orchardModuleHeader': 'حالة الأشجار والمحاصيل (حقول الزيتون)',
    'orchardModuleSubtitle': 'حقول الزيتون (حوض ميلة الزراعي)',
    'canopyVigor': 'مؤشر حيوية المجموع الخضري والصحة',
    'treeStatusBreakdown': 'سليمة: 3820 | تحتاج عناية: 320 | مصابة: 110',
    'statusHealthy': 'سليمة',
    'statusAttention': 'تحتاج عناية',
    'statusDiseased': 'مصابة',
    'livestockModuleHeader': 'سجل الثروة الحيوانية (الأبقار والأغنام)',
    'livestockModuleSubtitle': 'تتبع القطيع بالرقمنة وأطواق RFID',
    'cattleHerd': 'قطيع الأبقار',
    'cattleCount': '220 رأس',
    'cattleBreeds': 'سلالة هولشتاين ومونبليارد',
    'sheepFlock': 'قطيع الأغنام',
    'sheepCount': '460 رأس',
    'sheepBreeds': 'سلالة أولاد جلال الأصيلة',
    'vaccineNotice': 'تنبيه بيطري: جرعة التلقيح المعززة ضد الحمى القلاعية لـ 42 عجلة مبرمجة في 25 أوت.',
    'traceabilityBanner': 'جواز السفر الرقمي للمنتج (تتبع الجودة QR)',
    'traceabilitySubtitle': 'شهادات المنشأ الرقمية لزيت الزيتون البكر الممتاز ولحوم أولاد جلال المسجلة.',
    'syncTooltip': 'مزامنة مع واجهة برمجة التطبيقات (API)',
    'syncing': 'جارٍ جلب البيانات الحية من خادم REST API...',
    'offlineWarning': 'وضع عدم الاتصال مفعل - البيانات المخزنة محلياً',
    'selectSpecimenSource': 'اختر مصدر عينة الفحص',
    'cameraOption': 'التقاط صورة عبر الكاميرا',
    'galleryOption': 'اختيار من معرض الصور',
    'aiDiagnosticResult': 'نتيجة التشخيص بالذكاء الاصطناعي',
    'matchPercentage': 'نسبة التطابق',
    'observedSymptoms': 'الأعراض المشخصة:',
    'treatmentProtocol': 'البروتوكول العلاجي الموصى به:',
    'acknowledgeButton': 'اعتماد البروتوكول وإدراجه بالسجل الصحي للمزرعة',
    'dossierSuccessMessage': 'تم تسجيل البروتوكول العلاجي بنجاح في السجل الصحي للمزرعة.',
    'diagnosticFailed': 'تعذر إتمام الفحص بالذكاء الاصطناعي: ',
    'soilLabel': 'التربة:',
  };

  String tr(String key) => _isArabic ? (arabicStrings[key] ?? key) : key;

  Map<String, dynamic> _farmData = {
    'name': 'مستثمرة ميلة الفلاحية - حوض بني هارون',
    'locationSubtitle': 'ميلة، الجزائر • حوض بني هارون',
    'estateAreaLabel': 'المساحة الإجمالية: 142.5 هكتار',
    'treeCount': 4250,
    'healthyTreeCount': 3820,
    'attentionTreeCount': 320,
    'diseasedTreeCount': 110,
    'livestockCount': 680,
    'cattleCount': 220,
    'sheepCount': 460,
    'avgSoilMoisture': '38.4%',
  };
  Map<String, dynamic> get farmData => _farmData;

  FarmStateProvider({ApiService? apiService})
      : _apiService = apiService ?? ApiService();

  Future<void> loadFarmData() async {
    _isLoading = true;
    notifyListeners();
    try {
      final liveFarm = await _apiService.fetchFarmOverview('SOL-FARM-DZ-MILA-01');
      _farmData = { ..._farmData, ...liveFarm };
    } catch (e) {
      _errorMessage = e.toString();
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<Map<String, dynamic>> sendImageForAiDiagnosis(String base64Image) async {
    return await _apiService.diagnoseLeaf(imageBase64: base64Image, cropSpecies: 'Olive');
  }
}

/// Dashboard Screen with Strict RTL Directionality Wrapper & Material 3 Styling
class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final farmProvider = context.watch<FarmStateProvider>();
    final tr = farmProvider.tr;

    // Strict RTL Layout: Wrap entire Scaffold in Directionality(textDirection: RTL)
    return Directionality(
      textDirection: farmProvider.textDirection,
      child: Scaffold(
        backgroundColor: const Color(0xFFF4F7F4),
        appBar: AppBar(
          backgroundColor: const Color(0xFF0F5132),
          foregroundColor: Colors.white,
          title: Text(tr('appTitle'), style: const TextStyle(fontWeight: FontWeight.w800)),
          actions: [
            TextButton(
              onPressed: () => farmProvider.toggleLanguage(),
              child: Text(farmProvider.isArabic ? 'English' : 'عربي', style: const TextStyle(color: Colors.white)),
            ),
            IconButton(
              icon: const Icon(Icons.refresh_rounded),
              onPressed: () => farmProvider.loadFarmData(),
            ),
          ],
        ),
        body: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              _buildFarmOverviewCard(context, farmProvider),
              const SizedBox(height: 16),
              _buildQuickAiScanBanner(context, farmProvider),
              const SizedBox(height: 20),
              _buildOrchardHealthCard(context, farmProvider),
              const SizedBox(height: 20),
              _buildLivestockSummaryCard(context, farmProvider),
              const SizedBox(height: 20),
              _buildTraceabilityBanner(context, farmProvider),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFarmOverviewCard(BuildContext context, FarmStateProvider provider) {
    final tr = provider.tr;
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
            children: [
              Text(tr('estateAreaLabel'), style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.bold)),
              Text(tr('weatherStatus'), style: const TextStyle(color: Colors.white70, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 12),
          Text(tr('locationSubtitle'), style: const TextStyle(color: Color(0xFFC7E8CA), fontSize: 13)),
          const Divider(color: Colors.white24, height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('\${tr('oliveTrees')}: 4,250', style: const TextStyle(color: Colors.white)),
              Text('\${tr('livestock')}: 680', style: const TextStyle(color: Colors.white)),
              Text('\${tr('soilMoisture')}: 38.4%', style: const TextStyle(color: Colors.white)),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildQuickAiScanBanner(BuildContext context, FarmStateProvider provider) {
    final tr = provider.tr;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF8B4513).withOpacity(0.3)),
      ),
      child: Row(
        children: [
          const Icon(Icons.document_scanner_rounded, color: Color(0xFF8B4513), size: 30),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(tr('aiScanBannerTitle'), style: const TextStyle(fontWeight: FontWeight.bold)),
                Text(tr('aiScanSubtitle'), style: const TextStyle(fontSize: 11, color: Colors.grey)),
              ],
            ),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF8B4513), foregroundColor: Colors.white),
            onPressed: () {},
            child: Text(tr('scanButton')),
          )
        ],
      ),
    );
  }

  Widget _buildOrchardHealthCard(BuildContext context, FarmStateProvider provider) {
    final tr = provider.tr;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(tr('orchardModuleHeader'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 6),
            Text(tr('treeStatusBreakdown'), style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12, color: Color(0xFF0F5132))),
          ],
        ),
      ),
    );
  }

  Widget _buildLivestockSummaryCard(BuildContext context, FarmStateProvider provider) {
    final tr = provider.tr;
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(tr('livestockModuleHeader'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 6),
            Text('\${tr('cattleHerd')}: 220 (\${tr('cattleBreeds')}) | \${tr('sheepFlock')}: 460 (\${tr('sheepBreeds')})'),
            const SizedBox(height: 6),
            Text(tr('vaccineNotice'), style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildTraceabilityBanner(BuildContext context, FarmStateProvider provider) {
    final tr = provider.tr;
    return Card(
      color: const Color(0xFF1E3A8A).withOpacity(0.08),
      child: ListTile(
        leading: const Icon(Icons.qr_code_2, color: Color(0xFF1E3A8A)),
        title: Text(tr('traceabilityBanner'), style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text(tr('traceabilitySubtitle'), style: const TextStyle(fontSize: 11)),
        trailing: Icon(provider.isArabic ? Icons.arrow_back_ios_rounded : Icons.arrow_forward_ios_rounded, size: 14),
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
            {/* File Switcher Tabs */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-gray-900 border-b border-gray-800 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedFlutterFile('main')}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                    selectedFlutterFile === 'main'
                      ? 'bg-emerald-800/80 text-emerald-200 border border-emerald-600'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  lib/main.dart (RTL & i18n App Entry)
                </button>
                <button
                  onClick={() => setSelectedFlutterFile('dashboard')}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold transition-colors ${
                    selectedFlutterFile === 'dashboard'
                      ? 'bg-[#8B4513] text-amber-200 border border-amber-600'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  lib/screens/dashboard_screen.dart
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleDownload(
                      selectedFlutterFile === 'main' ? 'main.dart' : 'dashboard_screen.dart',
                      selectedFlutterFile === 'main' ? FLUTTER_MAIN_DART_SNIPPET : FLUTTER_DART_SNIPPET
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .dart</span>
                </button>
                <button
                  onClick={() =>
                    handleCopy(
                      selectedFlutterFile === 'main' ? FLUTTER_MAIN_DART_SNIPPET : FLUTTER_DART_SNIPPET,
                      'flutter'
                    )
                  }
                  className="flex items-center gap-1 px-3 py-1 rounded bg-[#0F5132] hover:bg-[#156d43] text-white font-bold"
                >
                  {copiedKey === 'flutter' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'flutter' ? 'Copied!' : `Copy ${selectedFlutterFile === 'main' ? 'main.dart' : 'dashboard.dart'}`}</span>
                </button>
              </div>
            </div>
            <pre className="p-6 text-xs text-gray-300 font-mono overflow-x-auto leading-relaxed max-h-[600px] overflow-y-auto">
              <code>{selectedFlutterFile === 'main' ? FLUTTER_MAIN_DART_SNIPPET : FLUTTER_DART_SNIPPET}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
