import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../providers/farm_dashboard_provider.dart';

/// ============================================================================
/// SOL ECOSYSTEM - QUICK AI SCAN BANNER WIDGET
/// File: lib/features/farm_overview/presentation/widgets/quick_ai_scan_banner.dart
/// Architectural Layer: Presentation / Widgets
/// ============================================================================
class QuickAiScanBanner extends StatelessWidget {
  final FarmDashboardProvider provider;
  final VoidCallback onScanPressed;

  const QuickAiScanBanner({
    super.key,
    required this.provider,
    required this.onScanPressed,
  });

  @override
  Widget build(BuildContext context) {
    final tr = provider.tr;

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.secondary.withOpacity(0.2)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Container(
            width: 50,
            height: 50,
            decoration: BoxDecoration(
              color: AppColors.secondary.withOpacity(0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: provider.isDiagnosing
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: CircularProgressIndicator(color: AppColors.secondary, strokeWidth: 2.5),
                  )
                : const Icon(Icons.document_scanner_rounded, color: AppColors.secondary, size: 26),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  tr('aiScanBannerTitle'),
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  provider.isDiagnosing ? tr('analyzingText') : tr('aiScanSubtitle'),
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton.icon(
            onPressed: provider.isDiagnosing ? null : onScanPressed,
            icon: const Icon(Icons.camera_alt_rounded, size: 16),
            label: Text(tr('scanButton')),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.secondary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              textStyle: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold),
            ),
          ),
        ],
      ),
    );
  }
}
