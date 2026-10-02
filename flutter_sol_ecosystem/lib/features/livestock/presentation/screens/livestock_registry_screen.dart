import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';
import 'animal_detail_file_screen.dart';

/// ============================================================================
/// SOL ECOSYSTEM - LIVESTOCK REGISTRY SCREEN
/// File: lib/features/livestock/presentation/screens/livestock_registry_screen.dart
/// Architectural Layer: Features / Livestock / Presentation / Screens
/// Context: Livestock Registry & Individual Animal RFID File Screen
/// ============================================================================
class LivestockRegistryScreen extends StatefulWidget {
  const LivestockRegistryScreen({super.key});

  @override
  State<LivestockRegistryScreen> createState() => _LivestockRegistryScreenState();
}

class _LivestockRegistryScreenState extends State<LivestockRegistryScreen> {
  String _selectedSpecies = 'all';

  final List<Map<String, dynamic>> _animals = [
    {
      'tagRfid': 'RFID-CTL-9021',
      'name': 'Bella Prima',
      'species': 'cattle',
      'breed': 'Holstein Friesian (هولشتاين)',
      'weight': 645.0,
      'health': 'lactating',
      'yield': '29.5 L/day Milk (حليب طازج)',
      'birthDate': '2022-04-10',
      'vaccinationStatus': 'Up-to-Date (محدث)'
    },
    {
      'tagRfid': 'RFID-SHP-3084',
      'name': 'Sultan Awassi',
      'species': 'sheep',
      'breed': 'Ouled Djellal Heritage (أولاد جلال الأصيلة)',
      'weight': 88.5,
      'health': 'healthy',
      'yield': '+340 g/day gain (نمو ممتاز)',
      'birthDate': '2023-01-18',
      'vaccinationStatus': 'Up-to-Date (محدث)'
    },
    {
      'tagRfid': 'RFID-CTL-8812',
      'name': 'Maximus Angus',
      'species': 'cattle',
      'breed': 'Montbéliarde & Angus (مونبليارد)',
      'weight': 730.0,
      'health': 'healthy',
      'yield': 'Prime MS4 Bio-Beef (لحم ممتاز)',
      'birthDate': '2021-11-05',
      'vaccinationStatus': 'Up-to-Date (محدث)'
    },
    {
      'tagRfid': 'RFID-SHP-3102',
      'name': 'Baraka Lamb',
      'species': 'sheep',
      'breed': 'Ouled Djellal Pure (أولاد جلال نقية)',
      'weight': 74.0,
      'health': 'healthy',
      'yield': '+310 g/day gain',
      'birthDate': '2023-05-22',
      'vaccinationStatus': 'Up-to-Date (محدث)'
    }
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedSpecies == 'all'
        ? _animals
        : _animals.where((a) => a['species'] == _selectedSpecies).toList();

    return Scaffold(
      backgroundColor: AppColors.scaffoldBackground,
      appBar: AppBar(
        title: const Text('Livestock Herd & RFID Registry (سجل الثروة الحيوانية)'),
        backgroundColor: AppColors.tertiary,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Species Segment Filters
          Padding(
            padding: const EdgeInsets.all(12),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _buildFilterChip('All Herd / كامل القطيع', 'all'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Cattle (Bovine / أبقار)', 'cattle'),
                  const SizedBox(width: 8),
                  _buildFilterChip('Sheep (Ovine / أغنام)', 'sheep'),
                ],
              ),
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 12),
              itemCount: filtered.length,
              itemBuilder: (context, index) {
                final item = filtered[index];
                final isCattle = item['species'] == 'cattle';
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14),
                    side: const BorderSide(color: AppColors.borderLight),
                  ),
                  child: ListTile(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => AnimalDetailFileScreen(animal: item),
                        ),
                      );
                    },
                    leading: CircleAvatar(
                      backgroundColor: isCattle
                          ? AppColors.tertiary.withOpacity(0.12)
                          : AppColors.secondary.withOpacity(0.12),
                      child: Icon(
                        isCattle ? Icons.agriculture : Icons.cruelty_free,
                        color: isCattle ? AppColors.tertiary : AppColors.secondary,
                      ),
                    ),
                    title: Text(
                      '${item['name']} (${item['tagRfid']})',
                      style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.textPrimary),
                    ),
                    subtitle: Text(
                      '${item['breed']} • Weight: ${item['weight']} kg\nYield: ${item['yield']}',
                      style: const TextStyle(color: AppColors.textMuted, fontSize: 12),
                    ),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: AppColors.textMuted),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    final isSelected = _selectedSpecies == value;
    return ChoiceChip(
      label: Text(label),
      selected: isSelected,
      onSelected: (selected) {
        if (selected) setState(() => _selectedSpecies = value);
      },
      selectedColor: AppColors.tertiary,
      backgroundColor: Colors.white,
      labelStyle: TextStyle(
        color: isSelected ? Colors.white : AppColors.textPrimary,
        fontWeight: FontWeight.w600,
        fontSize: 12,
      ),
    );
  }
}

/// Backward compatibility alias so legacy code expecting LivestockScreen continues to work
typedef LivestockScreen = LivestockRegistryScreen;
