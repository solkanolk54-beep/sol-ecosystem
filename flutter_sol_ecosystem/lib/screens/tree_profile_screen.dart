import 'package:flutter/material.dart';

/// Module A: Individual Tree Profile & Historical Agronomic Tracking
class TreeProfileScreen extends StatelessWidget {
  final Map<String, dynamic> tree;

  const TreeProfileScreen({super.key, required this.tree});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${tree['tagCode'] ?? 'SOL-TR-OLV-001'} Details'),
        backgroundColor: const Color(0xFF0F5132),
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
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 60,
                    height: 60,
                    decoration: BoxDecoration(
                      color: const Color(0xFF0F5132).withOpacity(0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.park_rounded, color: Color(0xFF0F5132), size: 34),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          tree['variety'] ?? 'Chemlali Ancient',
                          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                        ),
                        Text(
                          'Zone: ${tree['parcelZone'] ?? 'Grove Alpha (Ancient)'}',
                          style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
                        ),
                        const SizedBox(height: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFF10B981).withOpacity(0.15),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text('Status: Optimal / Healthy',
                              style: TextStyle(color: Color(0xFF0F5132), fontSize: 11, fontWeight: FontWeight.bold)),
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
                _buildAttrCard('Tree Age', '${tree['ageYears'] ?? '14.0'} Years', Icons.history),
                _buildAttrCard('Irrigation Status', '${tree['irrigationStatus'] ?? 'Optimal'}', Icons.water_drop),
                _buildAttrCard('Soil Moisture', '${tree['soilMoisturePct'] ?? '42.0'}%', Icons.grass),
                _buildAttrCard('Last Harvest', '${tree['lastHarvestDate'] ?? '2025-11-20'}', Icons.event_available),
              ],
            ),
            const SizedBox(height: 20),
            const Text(
              'Disease History & Health Logs',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20)),
            ),
            const SizedBox(height: 10),
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: const Color(0xFFE5E7EB)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('2024-04-12 • Resolved', style: TextStyle(color: Color(0xFF10B981), fontWeight: FontWeight.bold, fontSize: 11)),
                  SizedBox(height: 4),
                  Text('Mild Olive Peacock Spot (Spilocaea oleagina)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  SizedBox(height: 4),
                  Text('Rx: Applied organic Copper Hydroxide spray (250g/100L). Canopy aeration pruned.', style: TextStyle(fontSize: 12, color: Color(0xFF4B5563))),
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
        border: Border.all(color: const Color(0xFFE5E7EB)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: const Color(0xFF0F5132)),
              const SizedBox(width: 4),
              Text(title, style: const TextStyle(fontSize: 11, color: Color(0xFF6B7280))),
            ],
          ),
          const SizedBox(height: 6),
          Text(val, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20))),
        ],
      ),
    );
  }
}
