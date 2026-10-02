import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../providers/farm_dashboard_provider.dart';

/// ============================================================================
/// SOL ECOSYSTEM - TRACEABILITY BANNER WIDGET
/// File: lib/features/farm_overview/presentation/widgets/traceability_banner.dart
/// Architectural Layer: Presentation / Widgets
/// Context: Digital Product Passport (Quality QR Traceability)
/// ============================================================================
class TraceabilityBanner extends StatelessWidget {
  final FarmDashboardProvider provider;
  final VoidCallback? onTap;

  const TraceabilityBanner({
    super.key,
    required this.provider,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final tr = provider.tr;
    final isArabic = provider.isArabic;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.tertiary.withOpacity(0.08),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.tertiary.withOpacity(0.25)),
        ),
        child: Row(
          children: [
            const Icon(Icons.qr_code_2_rounded, size: 36, color: AppColors.tertiary),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    tr('traceabilityBanner'),
                    style: const TextStyle(fontSize: 13.5, fontWeight: FontWeight.bold, color: AppColors.tertiary),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    tr('traceabilitySubtitle'),
                    style: const TextStyle(fontSize: 11, color: AppColors.textSecondary, height: 1.3),
                  ),
                ],
              ),
            ),
            // RTL-aware Chevron Icon: Points left in RTL, right in LTR
            Icon(
              isArabic ? Icons.arrow_back_ios_rounded : Icons.arrow_forward_ios_rounded,
              size: 16,
              color: AppColors.tertiary,
            ),
          ],
        ),
      ),
    );
  }
}
