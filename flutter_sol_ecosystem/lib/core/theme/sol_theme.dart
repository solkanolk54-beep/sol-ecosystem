import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../constants/app_colors.dart';

/// ============================================================================
/// SOL ECOSYSTEM - MATERIAL 3 THEME CONFIGURATION
/// File: lib/core/theme/sol_theme.dart
/// Architectural Layer: Core / Theme
/// Features: Full Arabic RTL Cairo Typography (Algerian Agronomic Context) & Inter Fallback
/// ============================================================================
class SolTheme {
  // Brand Material 3 ColorScheme
  static final ColorScheme colorScheme = ColorScheme.fromSeed(
    seedColor: AppColors.primary,
    primary: AppColors.primary,
    onPrimary: Colors.white,
    primaryContainer: AppColors.primaryContainer,
    onPrimaryContainer: AppColors.primaryDark,
    secondary: AppColors.secondary,
    onSecondary: Colors.white,
    secondaryContainer: AppColors.secondaryContainer,
    onSecondaryContainer: AppColors.secondaryDark,
    tertiary: AppColors.tertiary,
    onTertiary: Colors.white,
    tertiaryContainer: AppColors.tertiaryContainer,
    onTertiaryContainer: AppColors.tertiaryDark,
    surface: AppColors.lightSurface,
    onSurface: AppColors.textPrimary,
    surfaceContainerHighest: AppColors.surfaceContainerHighest,
    error: AppColors.diseasedDark,
    onError: Colors.white,
    brightness: Brightness.light,
  );

  /// Arabic Typography based on Google Fonts Cairo with specialized line height
  /// and tracking calibrated for optimal Arabic legibility and technical agronomic text
  static TextTheme getArabicTextTheme([TextTheme? base]) {
    final baseTheme = base ?? ThemeData.light().textTheme;
    return GoogleFonts.cairoTextTheme(baseTheme).copyWith(
      displayLarge: GoogleFonts.cairo(
        fontSize: 32,
        fontWeight: FontWeight.w800,
        height: 1.4,
        letterSpacing: 0,
        color: AppColors.textPrimary,
      ),
      displayMedium: GoogleFonts.cairo(
        fontSize: 26,
        fontWeight: FontWeight.w800,
        height: 1.4,
        letterSpacing: 0,
        color: AppColors.textPrimary,
      ),
      headlineMedium: GoogleFonts.cairo(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        height: 1.4,
        letterSpacing: 0,
        color: AppColors.textPrimary,
      ),
      headlineSmall: GoogleFonts.cairo(
        fontSize: 19,
        fontWeight: FontWeight.w700,
        height: 1.4,
        letterSpacing: 0,
        color: AppColors.textPrimary,
      ),
      titleLarge: GoogleFonts.cairo(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        height: 1.45,
        letterSpacing: 0,
        color: AppColors.textPrimary,
      ),
      titleMedium: GoogleFonts.cairo(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        height: 1.4,
        color: AppColors.textPrimary,
      ),
      titleSmall: GoogleFonts.cairo(
        fontSize: 13,
        fontWeight: FontWeight.w600,
        height: 1.35,
        color: AppColors.textSecondary,
      ),
      bodyLarge: GoogleFonts.cairo(
        fontSize: 14,
        fontWeight: FontWeight.w500,
        height: 1.55,
        color: AppColors.textSecondary,
      ),
      bodyMedium: GoogleFonts.cairo(
        fontSize: 13,
        fontWeight: FontWeight.w400,
        height: 1.5,
        color: AppColors.textMuted,
      ),
      bodySmall: GoogleFonts.cairo(
        fontSize: 11,
        fontWeight: FontWeight.w400,
        height: 1.4,
        color: AppColors.textSubtle,
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
        color: AppColors.textMuted,
      ),
      labelSmall: GoogleFonts.cairo(
        fontSize: 10,
        fontWeight: FontWeight.w600,
        height: 1.2,
        color: AppColors.textSubtle,
      ),
    );
  }

  /// English Typography using Inter for international fallback
  static TextTheme getEnglishTextTheme([TextTheme? base]) {
    final baseTheme = base ?? ThemeData.light().textTheme;
    return GoogleFonts.interTextTheme(baseTheme).copyWith(
      displayLarge: GoogleFonts.inter(
        fontSize: 30,
        fontWeight: FontWeight.w800,
        color: AppColors.textPrimary,
      ),
      headlineMedium: GoogleFonts.inter(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimary,
      ),
      titleLarge: GoogleFonts.inter(
        fontSize: 18,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimary,
      ),
      titleMedium: GoogleFonts.inter(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      ),
      bodyLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.normal,
        height: 1.5,
        color: AppColors.textSecondary,
      ),
      bodyMedium: GoogleFonts.inter(
        fontSize: 13,
        fontWeight: FontWeight.normal,
        height: 1.45,
        color: AppColors.textMuted,
      ),
      labelLarge: GoogleFonts.inter(
        fontSize: 14,
        fontWeight: FontWeight.bold,
        color: Colors.white,
      ),
    );
  }

  /// Main ThemeData builder dynamically adapting typography to the current language
  static ThemeData getThemeData({bool isArabic = true}) {
    final textTheme = isArabic ? getArabicTextTheme() : getEnglishTextTheme();
    final fontFunction = isArabic ? GoogleFonts.cairo : GoogleFonts.inter;

    return ThemeData(
      useMaterial3: true,
      colorScheme: colorScheme,
      scaffoldBackgroundColor: AppColors.scaffoldBackground,
      textTheme: textTheme,
      primaryColor: AppColors.primary,

      // App Bar Theme
      appBarTheme: AppBarTheme(
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: fontFunction(
          fontSize: 19,
          fontWeight: FontWeight.w800,
          color: Colors.white,
        ),
        iconTheme: const IconThemeData(color: Colors.white),
      ),

      // Card Theme
      cardTheme: CardTheme(
        color: AppColors.cardSurface,
        elevation: 1.5,
        shadowColor: Colors.black.withOpacity(0.06),
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderLight, width: 0.8),
        ),
      ),

      // Elevated Button Theme
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          elevation: 0,
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: fontFunction(
            fontWeight: FontWeight.w700,
            fontSize: 14,
          ),
        ),
      ),

      // Outlined Button Theme
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.primary,
          side: const BorderSide(color: AppColors.primary, width: 1.2),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 11),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          textStyle: fontFunction(
            fontWeight: FontWeight.w700,
            fontSize: 13,
          ),
        ),
      ),

      // Chip Theme
      chipTheme: ChipThemeData(
        backgroundColor: AppColors.lightSurface,
        selectedColor: AppColors.primary,
        disabledColor: Colors.grey.shade200,
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.borderLight),
        ),
        labelStyle: fontFunction(fontSize: 12, fontWeight: FontWeight.w600),
      ),

      // Input Decoration Theme
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.8),
        ),
      ),

      // Divider Theme
      dividerTheme: const DividerThemeData(
        color: AppColors.divider,
        thickness: 1,
        space: 24,
      ),
    );
  }
}
