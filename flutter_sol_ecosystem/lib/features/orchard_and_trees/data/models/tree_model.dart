/// ============================================================================
/// SOL ECOSYSTEM - TREE MODEL
/// File: lib/features/orchard_and_trees/data/models/tree_model.dart
/// Architectural Layer: Data / Models
/// Context: Smart Orchard Individual Olive Tree Telemetry (Mila Basin)
/// ============================================================================
class TreeModel {
  final String id;
  final String tagCode;
  final String species;
  final String variety;
  final String parcelZone;
  final String healthStatus; // 'healthy', 'attention', 'diseased'
  final double ageYears;
  final String irrigationStatus;
  final double soilMoisturePct;
  final String lastHarvestDate;
  final List<TreeHealthLog> healthLogs;

  const TreeModel({
    required this.id,
    required this.tagCode,
    this.species = 'Olive',
    required this.variety,
    required this.parcelZone,
    required this.healthStatus,
    required this.ageYears,
    required this.irrigationStatus,
    required this.soilMoisturePct,
    required this.lastHarvestDate,
    this.healthLogs = const [],
  });

  factory TreeModel.fromJson(Map<String, dynamic> json) {
    return TreeModel(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? 'SOL-TR-OLV-001',
      tagCode: json['tagCode']?.toString() ?? json['tag']?.toString() ?? 'SOL-TR-OLV-001',
      species: json['species']?.toString() ?? 'Olive',
      variety: json['variety']?.toString() ?? 'Chemlali Ancient',
      parcelZone: json['parcelZone']?.toString() ?? json['zone']?.toString() ?? 'Grove Alpha (Ancient)',
      healthStatus: json['healthStatus']?.toString() ?? 'healthy',
      ageYears: (json['ageYears'] is num) ? (json['ageYears'] as num).toDouble() : 14.0,
      irrigationStatus: json['irrigationStatus']?.toString() ?? 'Optimal',
      soilMoisturePct: (json['soilMoisturePct'] is num)
          ? (json['soilMoisturePct'] as num).toDouble()
          : 42.0,
      lastHarvestDate: json['lastHarvestDate']?.toString() ?? '2025-11-20',
      healthLogs: (json['healthLogs'] as List?)
              ?.map((item) => TreeHealthLog.fromJson(item as Map<String, dynamic>))
              .toList() ??
          [
            const TreeHealthLog(
              date: '2024-04-12',
              status: 'Resolved',
              diagnosis: 'Mild Olive Peacock Spot (Spilocaea oleagina)',
              treatment: 'Rx: Applied organic Copper Hydroxide spray (250g/100L). Canopy aeration pruned.',
            ),
          ],
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'tagCode': tagCode,
      'species': species,
      'variety': variety,
      'parcelZone': parcelZone,
      'healthStatus': healthStatus,
      'ageYears': ageYears,
      'irrigationStatus': irrigationStatus,
      'soilMoisturePct': soilMoisturePct,
      'lastHarvestDate': lastHarvestDate,
      'healthLogs': healthLogs.map((log) => log.toMap()).toList(),
    };
  }
}

class TreeHealthLog {
  final String date;
  final String status;
  final String diagnosis;
  final String treatment;

  const TreeHealthLog({
    required this.date,
    required this.status,
    required this.diagnosis,
    required this.treatment,
  });

  factory TreeHealthLog.fromJson(Map<String, dynamic> json) {
    return TreeHealthLog(
      date: json['date']?.toString() ?? '',
      status: json['status']?.toString() ?? '',
      diagnosis: json['diagnosis']?.toString() ?? '',
      treatment: json['treatment']?.toString() ?? '',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'date': date,
      'status': status,
      'diagnosis': diagnosis,
      'treatment': treatment,
    };
  }
}
