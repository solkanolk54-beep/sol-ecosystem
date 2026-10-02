import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import '../../data/models/animal_model.dart';

/// ============================================================================
/// SOL ECOSYSTEM - ANIMAL DETAIL FILE SCREEN
/// File: lib/features/livestock/presentation/screens/animal_detail_file_screen.dart
/// Architectural Layer: Features / Livestock / Presentation / Screens
/// Context: Electronic RFID Livestock Passport & Health Dossier
/// ============================================================================
class AnimalDetailFileScreen extends StatelessWidget {
  final Map<String, dynamic> animal;

  const AnimalDetailFileScreen({
    super.key,
    required this.animal,
  });

  factory AnimalDetailFileScreen.fromModel(AnimalModel model) {
    return AnimalDetailFileScreen(animal: model.toMap());
  }

  @override
  Widget build(BuildContext context) {
    final bool isCattle = animal['species'] == 'cattle';
    final Color themeColor = isCattle ? AppColors.tertiary : AppColors.secondary;
    final String tagRfid = animal['tagRfid'] ?? 'RFID-CTL-0000';
    final String name = animal['name'] ?? 'Animal File';
    final String breed = animal['breed'] ?? 'Standard Breed';
    final double weight = (animal['weight'] is num) ? (animal['weight'] as num).toDouble() : 450.0;
    final String health = animal['health'] ?? 'healthy';
    final String yieldVal = animal['yield'] ?? 'Optimal';

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        title: Text('$name ($tagRfid)'),
        backgroundColor: themeColor,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header RFID Identification Card
            Container(
              padding: const EdgeInsets.all(18),
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
                  CircleAvatar(
                    radius: 32,
                    backgroundColor: themeColor.withOpacity(0.12),
                    child: Icon(
                      isCattle ? Icons.agriculture : Icons.cruelty_free,
                      color: themeColor,
                      size: 34,
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          name,
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '$breed • ${isCattle ? "Bovine (أبقار)" : "Ovine (أغنام)"}',
                          style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: themeColor.withOpacity(0.12),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            'Tag RFID: $tagRfid',
                            style: TextStyle(color: themeColor, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Performance & Biometrics Grid
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.6,
              children: [
                _buildMetricCard('Body Weight / الوزن', '$weight kg', Icons.monitor_weight_outlined, themeColor),
                _buildMetricCard('Health Status / الحالة', health.toUpperCase(), Icons.health_and_safety_outlined, AppColors.healthyGreen),
                _buildMetricCard('Production Yield / الإنتاجية', yieldVal, Icons.trending_up_rounded, themeColor),
                _buildMetricCard('Vaccination / التلقيح', animal['vaccinationStatus'] ?? 'Up-to-Date', Icons.verified_user_outlined, AppColors.healthyGreen),
              ],
            ),
            const SizedBox(height: 20),

            // Veterinary Dossier
            const Text(
              'Veterinary Health & Vaccination Dossier (السجل البيطري)',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTimelineItem(
                    date: '2026-08-25',
                    title: 'Scheduled: Foot-and-Mouth Booster (الحمى القلاعية)',
                    subtitle: 'Dr. Veterinary Inspectorate • Mila Sector',
                    isPending: true,
                  ),
                  const Divider(height: 20),
                  _buildTimelineItem(
                    date: '2026-02-10',
                    title: 'Administered: Clostridial Polyvalent Vaccine',
                    subtitle: 'Certified Bio-Security protocol compliant.',
                    isPending: false,
                  ),
                  const Divider(height: 20),
                  _buildTimelineItem(
                    date: '2025-10-15',
                    title: 'Biometric RFID Chip Synchronized',
                    subtitle: 'Linked with SOL Agro-Industrial Ledger.',
                    isPending: false,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 4),
              Expanded(
                child: Text(
                  label,
                  style: const TextStyle(fontSize: 11, color: AppColors.textMuted),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            value,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppColors.textPrimary),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildTimelineItem({
    required String date,
    required String title,
    required String subtitle,
    required bool isPending,
  }) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(
          isPending ? Icons.schedule_rounded : Icons.check_circle_rounded,
          color: isPending ? AppColors.attentionYellow : AppColors.healthyGreen,
          size: 18,
        ),
        const SizedBox(width: 10),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '$date • ${isPending ? "مجدول" : "مكتمل"}',
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: isPending ? AppColors.secondary : AppColors.healthyGreen,
                ),
              ),
              const SizedBox(height: 2),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppColors.textPrimary)),
              const SizedBox(height: 2),
              Text(subtitle, style: const TextStyle(fontSize: 11, color: AppColors.textMuted)),
            ],
          ),
        ),
      ],
    );
  }
}
