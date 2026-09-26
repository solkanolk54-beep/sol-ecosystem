import 'package:flutter/material.dart';

/// Module B: Livestock Registry & Individual Animal RFID File Screen
class LivestockScreen extends StatefulWidget {
  const LivestockScreen({super.key});

  @override
  State<LivestockScreen> createState() => _LivestockScreenState();
}

class _LivestockScreenState extends State<LivestockScreen> {
  String _selectedSpecies = 'all';

  final List<Map<String, dynamic>> _animals = [
    {
      'tagRfid': 'RFID-CTL-9021',
      'name': 'Bella Prima',
      'species': 'cattle',
      'breed': 'Holstein Friesian',
      'weight': 645.0,
      'health': 'lactating',
      'yield': '29.5 L/day Milk'
    },
    {
      'tagRfid': 'RFID-SHP-3084',
      'name': 'Sultan Awassi',
      'species': 'sheep',
      'breed': 'Awassi Fat-Tailed',
      'weight': 88.5,
      'health': 'healthy',
      'yield': '+340 g/day gain'
    },
    {
      'tagRfid': 'RFID-CTL-8812',
      'name': 'Maximus Angus',
      'species': 'cattle',
      'breed': 'Black Angus',
      'weight': 730.0,
      'health': 'healthy',
      'yield': 'Prime MS4 Meat'
    }
  ];

  @override
  Widget build(BuildContext context) {
    final filtered = _selectedSpecies == 'all'
        ? _animals
        : _animals.where((a) => a['species'] == _selectedSpecies).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Livestock Herd & RFID Registry'),
        backgroundColor: const Color(0xFF1E3A8A),
      ),
      body: Column(
        children: [
          // Species Segment Filters
          Padding(
            padding: const EdgeInsets.all(12),
            child: Row(
              children: [
                _buildFilterChip('All Herd', 'all'),
                const SizedBox(width: 8),
                _buildFilterChip('Cattle (Bovine)', 'cattle'),
                const SizedBox(width: 8),
                _buildFilterChip('Sheep (Ovine)', 'sheep'),
              ],
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
                  child: ListTile(
                    leading: CircleAvatar(
                      backgroundColor: isCattle
                          ? const Color(0xFF1E3A8A).withOpacity(0.12)
                          : const Color(0xFF8B4513).withOpacity(0.12),
                      child: Icon(
                        isCattle ? Icons.agriculture : Icons.cruelty_free,
                        color: isCattle ? const Color(0xFF1E3A8A) : const Color(0xFF8B4513),
                      ),
                    ),
                    title: Text('${item['name']} (${item['tagRfid']})', style: const TextStyle(fontWeight: FontWeight.bold)),
                    subtitle: Text('${item['breed']} • Weight: ${item['weight']} kg\nYield: ${item['yield']}'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 16),
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
      selectedColor: const Color(0xFF1E3A8A),
      labelStyle: TextStyle(color: isSelected ? Colors.white : Colors.black87),
    );
  }
}
