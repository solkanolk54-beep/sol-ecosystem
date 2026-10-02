import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:provider/provider.dart';

import 'core/network/api_client.dart';
import 'core/theme/sol_theme.dart';
import 'features/farm_overview/presentation/providers/farm_dashboard_provider.dart';
import 'features/farm_overview/presentation/screens/dashboard_screen.dart';

/// ============================================================================
/// SOL ECOSYSTEM - SMART AGRITECH & BIO-FARMING PLATFORM
/// File: lib/main.dart
/// Architectural Pattern: Modular Feature-First Clean Architecture
/// Features: MultiProvider Dependency Injection, Arabic RTL Cairo Typography (Mila Basin)
/// ============================================================================

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        // 1. Core Network Layer Injection
        Provider<ApiClient>(
          create: (_) => ApiClient(),
        ),

        // 2. Feature Providers Dependency Injection
        ChangeNotifierProvider<FarmDashboardProvider>(
          create: (context) {
            final apiClient = context.read<ApiClient>();
            return FarmDashboardProvider(apiClient: apiClient)..loadFarmData();
          },
        ),
      ],
      child: const SolEcosystemApp(),
    ),
  );
}

class SolEcosystemApp extends StatelessWidget {
  const SolEcosystemApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Observe locale and RTL state changes from FarmDashboardProvider
    final farmProvider = context.watch<FarmDashboardProvider>();
    final isArabic = farmProvider.isArabic;

    return MaterialApp(
      // Localized application title
      title: isArabic ? 'منظومة SOL الرقمية' : 'SOL Ecosystem',
      debugShowCheckedModeBanner: false,

      // Configure Material 3 Theme with Algerian Agronomic Visual Identity & Cairo Typography
      theme: SolTheme.getThemeData(isArabic: isArabic),

      // Dynamically select locale based on farmProvider.isArabic
      // Defaults to Locale('ar', 'DZ') for Algerian agronomic context (Mila Basin)
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

      // Main Farm & Orchard Clean Architecture Dashboard
      home: const DashboardScreen(),
    );
  }
}
