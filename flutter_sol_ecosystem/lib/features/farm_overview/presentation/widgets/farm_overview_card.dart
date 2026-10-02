import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../providers/farm_dashboard_provider.dart';

/// ============================================================================
/// SOL ECOSYSTEM - FARM OVERVIEW CARD WIDGET
/// File: lib/features/farm_overview/presentation/widgets/farm_overview_card.dart
/// Architectural Layer: Presentation / Widgets
/// Context: Mila Basin estate telemetry (Area, Trees, Livestock, Soil Moisture)
/// ============================================================================
class FarmOverviewCard extends StatelessWidget {
  final FarmDashboardProvider provider;

  const FarmOverviewCard({super.key, required this.provider});

  @override
  Widget build(BuildContext context) {
    final data = provider.farmData;
    final tr = provider.tr;

    return Container(
      decoration: BoxDecoration(
        gradient: AppColors.primaryGradient,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withOpacity(0.25),
            blurRadius: 12,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.location_on_rounded, color: AppColors.primaryContainer, size: 15),
                        const SizedBox(width: 4),
                        Expanded(
                          child: Text(
                            tr('locationSubtitle'),
                            style: const TextStyle(
                              color: AppColors.primaryContainer,
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    Text(
                      tr('estateAreaLabel'),
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 21,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${tr('soilLabel')} ${tr('soilType')}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.88),
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.18),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.wb_sunny_rounded, color: Colors.amberAccent, size: 16),
                    const SizedBox(width: 6),
                    Text(
                      tr('weatherStatus'),
                      style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          const Divider(color: Colors.white24, height: 1),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMetricTile(
                tr('oliveTrees'),
                '${data['treeCount'] ?? 4250}',
                Icons.yard_rounded,
              ),
              _buildMetricTile(
                tr('livestock'),
                '${data['livestockCount'] ?? 680}',
                Icons.agriculture_rounded,
              ),
              _buildMetricTile(
                tr('soilMoisture'),
                '${data['avgSoilMoisture'] ?? '38.4%'}',
                Icons.water_drop_rounded,
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricTile(String label, String value, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: AppColors.primaryContainer, size: 15),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(color: Colors.white.withOpacity(0.85), fontSize: 11),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          value,
          style: const TextStyle(
            color: Colors.white,
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
