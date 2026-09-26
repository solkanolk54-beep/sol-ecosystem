import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

// ============================================================================
// SOL ECOSYSTEM - FLUTTER MOBILE APP (Material 3 + Clean Architecture)
// Screen: Main Dashboard Screen (dashboard_screen.dart)
// ============================================================================

/// State Management Provider holding the active Farm & Orchard telemetry
class FarmStateProvider extends ChangeNotifier {
  bool _isLoading = false;
  bool get isLoading => _isLoading;

  // Farm Summary Model State
  final Map<String, dynamic> _farmData = {
    'name': 'SOL Green Valley Estate',
    'code': 'SOL-FARM-01',
    'location': 'Mila, Algeria',
    'region': 'Mila Agro-Industrial Basin, Algeria',
    'soilType': 'Rich Silty Loam & Agricultural Alluvial Soil',
    'areaHectares': 142.5,
    'totalTrees': 4250,
    'healthyTrees': 3820,
    'needsAttentionTrees': 320,
    'diseasedTrees': 110,
    'totalLivestock': 680,
    'cattleCount': 220,
    'sheepCount': 460,
    'avgSoilMoisture': '38.4%',
    'weather': '24°C Mediterranean Sunny'
  };

  Map<String, dynamic> get farmData => _farmData;

  Future<void> loadFarmData() async {
    _isLoading = true;
    notifyListeners();
    // Simulate API fetch delay from Node.js backend
    await Future.delayed(const Duration(milliseconds: 600));
    _isLoading = false;
    notifyListeners();
  }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final farmProvider = context.watch<FarmStateProvider>();
    final data = farmProvider.farmData;

    return Scaffold(
      backgroundColor: const Color(0xFFF4F7F4),
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.eco_rounded, color: Colors.white, size: 22),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'SOL ECOSYSTEM',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1.1,
                  ),
                ),
                Text(
                  data['name'] as String,
                  style: TextStyle(
                    fontSize: 11,
                    color: Colors.white.withOpacity(0.85),
                  ),
                ),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none_rounded),
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('All systems nominal. Irrigation scheduled at 19:00.')),
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.refresh_rounded),
            onPressed: () => farmProvider.loadFarmData(),
          ),
        ],
      ),
      body: farmProvider.isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF0F5132)))
          : RefreshIndicator(
              color: const Color(0xFF0F5132),
              onRefresh: () => farmProvider.loadFarmData(),
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // 1. Farm Overview Header & Weather
                    _buildFarmOverviewCard(context, data),
                    const SizedBox(height: 16),

                    // 2. Quick AI Scan Banner (Camera Prompt)
                    _buildQuickAiScanBanner(context),
                    const SizedBox(height: 20),

                    // 3. Smart Orchard Health Breakdown (Module A)
                    _buildSectionHeader('Smart Orchard Management', 'Olive & Fruit Trees', Icons.forest_rounded),
                    const SizedBox(height: 10),
                    _buildOrchardHealthCard(context, data),
                    const SizedBox(height: 20),

                    // 4. Livestock Summary (Module B)
                    _buildSectionHeader('Livestock Herd Telemetry', 'Cattle & Sheep Tracking', Icons.pets_rounded),
                    const SizedBox(height: 10),
                    _buildLivestockSummaryCard(context, data),
                    const SizedBox(height: 20),

                    // 5. Traceability Quick Access (Module C)
                    _buildTraceabilityBanner(context),
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ),
    );
  }

  // Helper Header
  Widget _buildSectionHeader(String title, String subtitle, IconData icon) {
    return Row(
      children: [
        Icon(icon, color: const Color(0xFF0F5132), size: 20),
        const SizedBox(width: 8),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: Color(0xFF1B2E20),
              ),
            ),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)),
            ),
          ],
        ),
      ],
    );
  }

  /// 1. Dynamic Widget: Farm Overview & Key Telemetry Cards
  Widget _buildFarmOverviewCard(BuildContext context, Map<String, dynamic> data) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F5132), Color(0xFF165B37)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF0F5132).withOpacity(0.25),
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
                        const Icon(Icons.location_on_rounded, color: Color(0xFFC7E8CA), size: 14),
                        const SizedBox(width: 4),
                        Text(
                          '${data['location']} • ${data['region']}',
                          style: const TextStyle(
                            color: Color(0xFFC7E8CA),
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                    const SizedBox(height: 4),
                    Text(
                      '${data['areaHectares']} Ha Estate',
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 24,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Soil: ${data['soilType']}',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.85),
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
                      '${data['weather']}',
                      style: TextStyle(color: Colors.white.withOpacity(0.95), fontSize: 11, fontWeight: FontWeight.w600),
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
              _buildMetricTile('Olive Trees', '${data['totalTrees']}', Icons.yard_rounded),
              _buildMetricTile('Livestock', '${data['totalLivestock']}', Icons.agriculture_rounded),
              _buildMetricTile('Soil Moisture', '${data['avgSoilMoisture']}', Icons.water_drop_rounded),
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
            Icon(icon, color: const Color(0xFFC7E8CA), size: 15),
            const SizedBox(width: 4),
            Text(
              label,
              style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 11),
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

  /// 2. Dynamic Widget: Quick AI Scan Banner (Module A AI Diagnostic Placeholder)
  Widget _buildQuickAiScanBanner(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF8B4513).withOpacity(0.2)),
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
            width: 52,
            height: 52,
            decoration: BoxDecoration(
              color: const Color(0xFF8B4513).withOpacity(0.12),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Icon(Icons.document_scanner_rounded, color: Color(0xFF8B4513), size: 28),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Quick AI Leaf & Fruit Scan',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF1B2E20),
                  ),
                ),
                SizedBox(height: 4),
                Text(
                  'Detect peacock spot, anthracnose, or nutrient deficiency instantly.',
                  style: TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),
          ElevatedButton(
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Opening AI Camera Vision Scanner...')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF8B4513),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            ),
            child: const Text('Scan Now', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  /// 3. Dynamic Widget: Smart Orchard Health Breakdown (Module A)
  Widget _buildOrchardHealthCard(BuildContext context, Map<String, dynamic> data) {
    final int healthy = data['healthyTrees'] as int;
    final int attention = data['needsAttentionTrees'] as int;
    final int diseased = data['diseasedTrees'] as int;
    final int total = data['totalTrees'] as int;

    final double healthyPct = (healthy / total) * 100;
    final double attentionPct = (attention / total) * 100;
    final double diseasedPct = (diseased / total) * 100;

    return Container(
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
              const Text(
                'Canopy Vigor & Health Status',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20)),
              ),
              Text(
                '$total Trees Tracked',
                style: const TextStyle(fontSize: 12, color: Color(0xFF0F5132), fontWeight: FontWeight.w600),
              ),
            ],
          ),
          const SizedBox(height: 12),
          // Stacked Progress Bar
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: SizedBox(
              height: 12,
              child: Row(
                children: [
                  Expanded(flex: healthy, child: Container(color: const Color(0xFF10B981))),
                  Expanded(flex: attention, child: Container(color: const Color(0xFFF59E0B))),
                  Expanded(flex: diseased, child: Container(color: const Color(0xFFEF4444))),
                ],
              ),
            ),
          ),
          const SizedBox(height: 14),
          // Breakdown Badges
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildStatusPill('Healthy', healthy, healthyPct, const Color(0xFF10B981)),
              _buildStatusPill('Needs Water', attention, attentionPct, const Color(0xFFF59E0B)),
              _buildStatusPill('Diseased', diseased, diseasedPct, const Color(0xFFEF4444)),
            ],
          ),
        ],
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
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Color(0xFF1B2E20)),
          ),
        ],
      ),
    );
  }

  /// 4. Dynamic Widget: Livestock Summary (Module B)
  Widget _buildLivestockSummaryCard(BuildContext context, Map<String, dynamic> data) {
    return Container(
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
                  'Cattle Herd',
                  '${data['cattleCount']} Heads',
                  'Holstein & Angus',
                  Icons.agriculture,
                  const Color(0xFF1E3A8A),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildSpeciesTile(
                  'Sheep Flock',
                  '${data['sheepCount']} Heads',
                  'Awassi & Barbarine',
                  Icons.cruelty_free_rounded,
                  const Color(0xFF8B4513),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: const Color(0xFFF9FBF8),
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: const Color(0xFFE5E7EB)),
            ),
            child: Row(
              children: const [
                Icon(Icons.vaccines_rounded, color: Color(0xFF0F5132), size: 18),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Upcoming: Clostridial 8-Way booster scheduled for 42 heifers on July 20th.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF374151)),
                  ),
                ),
              ],
            ),
          ),
        ],
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
          Text(count, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w900, color: Color(0xFF1B2E20))),
          Text(breeds, style: const TextStyle(fontSize: 10, color: Color(0xFF6B7280))),
        ],
      ),
    );
  }

  /// 5. Dynamic Widget: Traceability & Farm-to-Fork Banner (Module C)
  Widget _buildTraceabilityBanner(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFF1E3A8A).withOpacity(0.08),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF1E3A8A).withOpacity(0.25)),
      ),
      child: Row(
        children: [
          const Icon(Icons.qr_code_2_rounded, size: 36, color: Color(0xFF1E3A8A)),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  'Traceability & QR Batches',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF1E3A8A)),
                ),
                SizedBox(height: 2),
                Text(
                  'Generate tamper-proof consumer passports for EVOO and organic meat.',
                  style: TextStyle(fontSize: 11, color: Color(0xFF4B5563)),
                ),
              ],
            ),
          ),
          const Icon(Icons.arrow_forward_ios_rounded, size: 16, color: Color(0xFF1E3A8A)),
        ],
      ),
    );
  }
}
