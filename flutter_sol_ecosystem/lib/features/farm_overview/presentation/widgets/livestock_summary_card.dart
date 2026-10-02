import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../providers/farm_dashboard_provider.dart';

/// ============================================================================
/// SOL ECOSYSTEM - LIVESTOCK SUMMARY CARD WIDGET
/// File: lib/features/farm_overview/presentation/widgets/livestock_summary_card.dart
/// Architectural Layer: Presentation / Widgets
/// Context: Cattle & Sheep herd telemetry (Mila Basin / Ouled Djellal)
/// ============================================================================
class LivestockSummaryCard extends StatelessWidget {
  final FarmDashboardProvider provider;
  final VoidCallback? onTap;

  const LivestockSummaryCard({
    super.key,
    required this.provider,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final data = provider.farmData;
    final tr = provider.tr;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 8,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: _buildSpeciesTile(
                    tr('cattleHerd'),
                    '${data['cattleCount'] ?? 220} ${provider.isArabic ? "رأس" : "Heads"}',
                    tr('cattleBreeds'),
                    Icons.agriculture,
                    AppColors.tertiary,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _buildSpeciesTile(
                    tr('sheepFlock'),
                    '${data['sheepCount'] ?? 460} ${provider.isArabic ? "رأس" : "Heads"}',
                    tr('sheepBreeds'),
                    Icons.cruelty_free_rounded,
                    AppColors.secondary,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.all(10),
              decoration: BoxDecoration(
                color: AppColors.lightSurface,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Row(
                children: [
                  const Icon(Icons.vaccines_rounded, color: AppColors.primary, size: 18),
                  const SizedBox(width: 8),
                  Expanded(
                    child: Text(
                      tr('vaccineNotice'),
                      style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSpeciesTile(String title, String count, String breeds, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: color.withOpacity(0.06),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color.withOpacity(0.2)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: color)),
              Icon(icon, color: color, size: 18),
            ],
          ),
          const SizedBox(height: 6),
          Text(count, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
          Text(breeds, style: const TextStyle(fontSize: 10, color: AppColors.textMuted)),
        ],
      ),
    );
  }
}
