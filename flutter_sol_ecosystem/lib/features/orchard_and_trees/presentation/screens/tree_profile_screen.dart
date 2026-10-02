import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../data/models/tree_model.dart';

/// ============================================================================
/// SOL ECOSYSTEM - INDIVIDUAL TREE PROFILE SCREEN
/// File: lib/features/orchard_and_trees/presentation/screens/tree_profile_screen.dart
/// Architectural Layer: Features / Orchard & Trees / Presentation / Screens
/// ============================================================================
class TreeProfileScreen extends StatelessWidget {
  final Map<String, dynamic> tree;

  const TreeProfileScreen({
    super.key,
    required this.tree,
  });

  /// Factory convenience for instantiating directly with TreeModel
  factory TreeProfileScreen.fromModel({required TreeModel treeModel}) {
    return TreeProfileScreen(tree: treeModel.toMap());
  }

  @override
  Widget build(BuildContext context) {
    final String tagCode = tree['tagCode'] ?? tree['tag'] ?? 'SOL-TR-OLV-001';
    final String variety = tree['variety'] ?? 'Chemlali Ancient (زيتون شملالي)';
    final String parcelZone = tree['parcelZone'] ?? tree['zone'] ?? 'Grove Alpha (Ancient) • حوض ميلة';
    final String healthStatus = tree['healthStatus'] ?? 'healthy';

    Color statusColor;
    String statusLabel;
    if (healthStatus == 'diseased') {
      statusColor = AppColors.diseasedRed;
      statusLabel = 'Status: Infected / مصابة';
    } else if (healthStatus == 'attention') {
      statusColor = AppColors.attentionYellow;
      statusLabel = 'Status: Attention / تحتاج عناية';
    } else {
      statusColor = AppColors.healthyGreen;
      statusLabel = 'Status: Optimal / سليمة';
    }

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        title: Text('$tagCode Details'),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.borderLight),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.04),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.park_rounded, color: AppColors.primary, size: 34),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          variety,
                          style: const TextStyle(
                            fontSize: 17,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Zone: $parcelZone',
                          style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: statusColor.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            statusLabel,
                            style: TextStyle(
                              color: statusColor,
                              fontSize: 11,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        )
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Agronomic Attributes Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.6,
              children: [
                _buildAttrCard('Tree Age / العمر', '${tree['ageYears'] ?? '14.0'} Years', Icons.history),
                _buildAttrCard('Irrigation Status / الري', '${tree['irrigationStatus'] ?? 'Optimal'}', Icons.water_drop),
                _buildAttrCard('Soil Moisture / رطوبة التربة', '${tree['soilMoisturePct'] ?? '42.0'}%', Icons.grass),
                _buildAttrCard('Last Harvest / آخر جني', '${tree['lastHarvestDate'] ?? '2025-11-20'}', Icons.event_available),
              ],
            ),
            const SizedBox(height: 20),

            // Health Logs & History
            const Text(
              'Disease History & Health Logs (السجل الصحي للشجرة)',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text(
                    '2024-04-12 • Resolved / تمت المعالجة بنجاح',
                    style: TextStyle(color: AppColors.healthyGreen, fontWeight: FontWeight.bold, fontSize: 11),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Mild Olive Peacock Spot (Spilocaea oleagina / عين الطاووس)',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary),
                  ),
                  SizedBox(height: 4),
                  Text(
                    'Rx: Applied organic Copper Hydroxide spray (250g/100L). Canopy aeration pruned.\nالبروتوكول: رش هيدروكسيد النحاس 250غ/100ل وتقليم الفروع الداخلية لتهوية التاج.',
                    style: TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildAttrCard(String title, String val, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderLight),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: AppColors.primary),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            val,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.bold,
              color: AppColors.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
