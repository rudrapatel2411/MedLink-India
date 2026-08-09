import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // Midnight Clinical Dark System
  static const Color background = Color(0xFF090F1E); // Deepest Midnight Navy
  static const Color surface = Color(0xFF131B2E); // Refined Slate Navy
  static const Color surfaceLight = Color(0xFF1E2A45); // Lighter Surface Card
  static const Color glassBorder = Color(0xFF232F52); // Crisp 1px Border
  static const Color glassBorderActive = Color(0xFF00B4D8); // Active focus border

  // Primary Clinical Accents
  static const Color primary = Color(0xFF00B4D8); // Nordic Cyan
  static const Color primaryDark = Color(0xFF0077B6); // Deep Ocean Blue
  static const Color primaryLight = Color(0xFF90E0EF); // Soft Ice Cyan

  // Secondary Functional Accents
  static const Color accentIndigo = Color(0xFF5E60CE); // Royal Indigo
  static const Color accentCyan = Color(0xFF48CAE4); // Ice Blue
  static const Color accentEmerald = Color(0xFF2EC4B6); // Mint Emerald
  static const Color accentAmber = Color(0xFFFF9F1C); // Warm Amber
  static const Color accentRose = Color(0xFFFF5252); // Emergency Red
  static const Color accentPurple = Color(0xFF7209B7); // Deep Purple

  // Neutral Typography
  static const Color textPrimary = Color(0xFFF8FAFC); // Crisp White
  static const Color textSecondary = Color(0xFF94A3B8); // Muted Slate
  static const Color textMuted = Color(0xFF475569); // Dark Muted Text
}

class AppTheme {
  static ThemeData get darkTheme {
    return ThemeData.dark().copyWith(
      scaffoldBackgroundColor: AppColors.background,
      colorScheme: const ColorScheme.dark(
        primary: AppColors.primary,
        secondary: AppColors.accentIndigo,
        surface: AppColors.surface,
        background: AppColors.background,
        error: AppColors.accentRose,
      ),
      textTheme: GoogleFonts.plusJakartaSansTextTheme(
        ThemeData.dark().textTheme.apply(
              bodyColor: AppColors.textPrimary,
              displayColor: AppColors.textPrimary,
            ),
      ),
      cardTheme: CardTheme(
        color: AppColors.surface,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.glassBorder, width: 1),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: AppColors.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 15),
        hintStyle: GoogleFonts.plusJakartaSans(color: AppColors.textMuted, fontSize: 13.5),
        labelStyle: GoogleFonts.plusJakartaSans(color: AppColors.textSecondary, fontSize: 13.5),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.glassBorder),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.glassBorder),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(14),
          borderSide: const BorderSide(color: AppColors.primary, width: 1.5),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primary,
          foregroundColor: Colors.white,
          elevation: 0,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
          textStyle: GoogleFonts.plusJakartaSans(
            fontSize: 14.5,
            fontWeight: FontWeight.w700,
            letterSpacing: 0.3,
          ),
        ),
      ),
    );
  }
}
