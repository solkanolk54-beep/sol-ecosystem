import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../providers/farm_dashboard_provider.dart';

/// ============================================================================
/// SOL ECOSYSTEM - ORCHARD HEALTH CARD WIDGET
/// File: lib/features/farm_overview/presentation/widgets/orchard_health_card.dart
/// Architectural Layer: Presentation / Widgets
/// Context: Smart Olive Grove Health (Mila Basin)
/// ============================================================================
class OrchardHealthCard extends StatelessWidget {
  final FarmDashboardProvider provider;
  final VoidCallback? onTap;

  const OrchardHealthCard({
    super.key,
    required this.provider,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final data = provider.farmData;
    final tr = provider.tr;

    final int healthy = data['healthyTreeCount'] ?? 3820;
    final int attention = data['attentionTreeCount'] ?? 320;
    final int diseased = data['diseasedTreeCount'] ?? 110;
    final int total = data['treeCount'] ?? 4250;

    final double healthyPct = total > 0 ? (healthy / total) * 100 : 0;
    final double attentionPct = total > 0 ? (attention / total) * 100 : 0;
    final double diseasedPct = total > 0 ? (diseased / total) * 100 : 0;

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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  tr('canopyVigor'),
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                ),
                Text(
                  '$total ${provider.isArabic ? "شجرة متابعة" : "Trees"}',
                  style: const TextStyle(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w600),
                ),
              ],
            ),
            const SizedBox(height: 8),

            // Prominent Tree Status Breakdown String
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
              decoration: BoxDecoration(
                color: AppColors.lightSurface,
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Row(
                children: [
                  const Icon(Icons.analytics_outlined, size: 15, color: AppColors.primary),
                  const SizedBox(width: 6),
                  Expanded(
                    child: Text(
                      tr('treeStatusBreakdown'),
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppColors.textPrimary,
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            // Multi-Segmented Health Progress Bar
            ClipRRect(
              borderRadius: BorderRadius.circular(8),
              child: SizedBox(
                height: 12,
                child: Row(
                  children: [
                    Expanded(flex: healthy > 0 ? healthy : 1, child: Container(color: AppColors.healthyGreen)),
                    Expanded(flex: attention > 0 ? attention : 1, child: Container(color: AppColors.attentionYellow)),
                    Expanded(flex: diseased > 0 ? diseased : 1, child: Container(color: AppColors.diseasedRed)),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 14),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _buildStatusPill(tr('statusHealthy'), healthy, healthyPct, AppColors.healthyGreen),
                _buildStatusPill(tr('statusAttention'), attention, attentionPct, AppColors.attentionYellow),
                _buildStatusPill(tr('statusDiseased'), diseased, diseasedPct, AppColors.diseasedRed),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStatusPill(String title, int count, double pct, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.09),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(width: 8, height: 8, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
              const SizedBox(width: 6),
              Text(title, style: TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: color)),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            '$count (${pct.toStringAsFixed(1)}%)',
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
          ),
        ],
      ),
    );
  }
}
