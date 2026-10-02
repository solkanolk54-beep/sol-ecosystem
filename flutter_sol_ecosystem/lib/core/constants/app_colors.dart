import 'package:flutter/material.dart';

/// ============================================================================
/// SOL ECOSYSTEM - APP COLORS & PALETTE CONSTANTS
/// File: lib/core/constants/app_colors.dart
/// Architectural Layer: Core / Constants
/// Context: Algerian Bio-Agriculture & Agronomic Identity (Mila Basin)
/// ============================================================================
abstract class AppColors {
  // Brand Core Colors
  /// Primary Olive Green (#0F5132): Symbolizes olive groves and vegetative vigor
  static const Color primary = Color(0xFF0F5132);
  static const Color primaryDark = Color(0xFF0A3622);
  static const Color primaryLight = Color(0xFF165B37);
  static const Color primaryContainer = Color(0xFFC7E8CA);

  /// Secondary Earthy Wood (#8B4513): Symbolizes Mila fertile alluvial & silty loam soil
  static const Color secondary = Color(0xFF8B4513);
  static const Color secondaryDark = Color(0xFF5D2E0D);
  static const Color secondaryLight = Color(0xFFA0522D);
  static const Color secondaryContainer = Color(0xFFFFDCC2);

  /// Tertiary Precision Blue (#1E3A8A): Telemetry, IoT sensors, and QR traceability
  static const Color tertiary = Color(0xFF1E3A8A);
  static const Color tertiaryDark = Color(0xFF172554);
  static const Color tertiaryLight = Color(0xFF2563EB);
  static const Color tertiaryContainer = Color(0xFFDBEAFE);

  // Surfaces & Backgrounds
  /// Light Surface (#F9FBF8): Clean agronomic canvas
  static const Color lightSurface = Color(0xFFF9FBF8);
  static const Color scaffoldBackground = Color(0xFFF4F7F4);
  static const Color cardSurface = Colors.white;
  static const Color surfaceContainerHighest = Color(0xFFE8EFE8);

  // Typography & Content
  static const Color textPrimary = Color(0xFF1B2E20);
  static const Color textSecondary = Color(0xFF2E3D30);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color textSubtle = Color(0xFF9CA3AF);
  static const Color textInverse = Colors.white;

  // Status & Health Indicators
  static const Color healthyGreen = Color(0xFF10B981);
  static const Color healthyContainer = Color(0xFFD1FAE5);

  static const Color attentionYellow = Color(0xFFF59E0B);
  static const Color attentionContainer = Color(0xFFFEF3C7);

  static const Color diseasedRed = Color(0xFFEF4444);
  static const Color diseasedDark = Color(0xFFB71C1C);
  static const Color errorContainer = Color(0xFFFEE2E2);

  static const Color infoBlue = Color(0xFF0284C7);
  static const Color infoContainer = Color(0xFFE0F2FE);

  // Borders & Dividers
  static const Color borderLight = Color(0xFFE5E7EB);
  static const Color borderMedium = Color(0xFFD1D5DB);
  static const Color divider = Color(0xFFF0F2F0);

  // Gradients
  static const LinearGradient primaryGradient = LinearGradient(
    colors: [primary, primaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient soilGradient = LinearGradient(
    colors: [secondary, secondaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient techGradient = LinearGradient(
    colors: [tertiary, tertiaryLight],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );
}
