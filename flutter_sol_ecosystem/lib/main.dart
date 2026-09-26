import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'screens/dashboard_screen.dart';

// ============================================================================
// SOL ECOSYSTEM - SMART AGRITECH & BIO-FARMING PLATFORM
// File: lib/main.dart
// Features: Full Arabic Localization (Algerian Context: Mila) & RTL Architecture
// ============================================================================

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
