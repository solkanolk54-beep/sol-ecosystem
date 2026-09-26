import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'screens/dashboard_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => FarmStateProvider()..loadFarmData()),
      ],
      child: const SolEcosystemApp(),
    ),
  );
}

class SolEcosystemApp extends StatelessWidget {
  const SolEcosystemApp({super.key});

  @override
  Widget build(BuildContext context) {
    // Brand Color Palette:
    // Dark Green: #0F5132 (Primary), Accent Navy: #1E3A8A, Earthy Wood: #8B4513
    final ColorScheme solColorScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF0F5132),
      primary: const Color(0xFF0F5132),
      onPrimary: Colors.white,
      secondary: const Color(0xFF8B4513), // Earthy Wood
      tertiary: const Color(0xFF1E3A8A),  // Deep Tech Blue
      surface: const Color(0xFFF9FBF8),
      onSurface: const Color(0xFF1B2E20),
      brightness: Brightness.light,
    );

    return MaterialApp(
      title: 'SOL Ecosystem',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: solColorScheme,
        scaffoldBackgroundColor: const Color(0xFFF6F8F5),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF0F5132),
          foregroundColor: Colors.white,
          elevation: 0,
          centerTitle: false,
        ),
        cardTheme: CardTheme(
          color: Colors.white,
          elevation: 1,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        ),
      ),
      home: const DashboardScreen(),
    );
  }
}
