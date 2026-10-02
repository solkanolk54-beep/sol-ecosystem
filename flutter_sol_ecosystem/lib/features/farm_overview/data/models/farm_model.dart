import '../../domain/entities/farm_entity.dart';

/// ============================================================================
/// SOL ECOSYSTEM - FARM DATA MODEL
/// File: lib/features/farm_overview/data/models/farm_model.dart
/// Architectural Layer: Data / Models
/// ============================================================================
class FarmModel extends FarmEntity {
  const FarmModel({
    required super.id,
    required super.code,
    required super.name,
    required super.location,
    required super.region,
    required super.locationSubtitle,
    required super.estateAreaLabel,
    required super.soilType,
    required super.areaHectares,
    required super.treeCount,
    required super.healthyTreeCount,
    required super.attentionTreeCount,
    required super.diseasedTreeCount,
    required super.livestockCount,
    required super.cattleCount,
    required super.sheepCount,
    required super.avgSoilMoisture,
    required super.weather,
  });

  /// Factory constructor parsing JSON / Map from Backend REST API
  factory FarmModel.fromJson(Map<String, dynamic> json) {
    return FarmModel(
      id: json['id']?.toString() ?? json['_id']?.toString() ?? 'SOL-FARM-DZ-MILA-01',
      code: json['code']?.toString() ?? 'SOL-FARM-DZ-MILA-01',
      name: json['name']?.toString() ?? 'مستثمرة ميلة الفلاحية - حوض بني هارون',
      location: json['location']?.toString() ?? 'ميلة، الجزائر',
      region: json['region']?.toString() ?? 'حوض بني هارون',
      locationSubtitle: json['locationSubtitle']?.toString() ?? 'ميلة، الجزائر • حوض بني هارون',
      estateAreaLabel: json['estateAreaLabel']?.toString() ?? 'المساحة الإجمالية: 142.5 هكتار',
      soilType: json['soilType']?.toString() ?? 'تربة طميية فيضية غنية وخصبة (حوض ميلة)',
      areaHectares: (json['areaHectares'] is num)
          ? (json['areaHectares'] as num).toDouble()
          : 142.5,
      treeCount: json['treeCount'] is int
          ? json['treeCount']
          : int.tryParse(json['treeCount']?.toString() ?? '4250') ?? 4250,
      healthyTreeCount: json['healthyTreeCount'] is int
          ? json['healthyTreeCount']
          : int.tryParse(json['healthyTreeCount']?.toString() ?? '3820') ?? 3820,
      attentionTreeCount: json['attentionTreeCount'] is int
          ? json['attentionTreeCount']
          : int.tryParse(json['attentionTreeCount']?.toString() ?? '320') ?? 320,
      diseasedTreeCount: json['diseasedTreeCount'] is int
          ? json['diseasedTreeCount']
          : int.tryParse(json['diseasedTreeCount']?.toString() ?? '110') ?? 110,
      livestockCount: json['livestockCount'] is int
          ? json['livestockCount']
          : int.tryParse(json['livestockCount']?.toString() ?? '680') ?? 680,
      cattleCount: json['cattleCount'] is int
          ? json['cattleCount']
          : int.tryParse(json['cattleCount']?.toString() ?? '220') ?? 220,
      sheepCount: json['sheepCount'] is int
          ? json['sheepCount']
          : int.tryParse(json['sheepCount']?.toString() ?? '460') ?? 460,
      avgSoilMoisture: json['avgSoilMoisture']?.toString() ?? '38.4%',
      weather: json['weather']?.toString() ?? '24° م مشمس، شمالي غربي 12 كم/سا',
    );
  }

  /// Default baseline factory for offline / cached initialization
  factory FarmModel.initial() {
    return const FarmModel(
      id: 'SOL-FARM-DZ-MILA-01',
      code: 'SOL-FARM-DZ-MILA-01',
      name: 'مستثمرة ميلة الفلاحية - حوض بني هارون',
      location: 'ميلة، الجزائر',
      region: 'حوض بني هارون',
      locationSubtitle: 'ميلة، الجزائر • حوض بني هارون',
      estateAreaLabel: 'المساحة الإجمالية: 142.5 هكتار',
      soilType: 'تربة طميية فيضية غنية وخصبة (حوض ميلة)',
      areaHectares: 142.5,
      treeCount: 4250,
      healthyTreeCount: 3820,
      attentionTreeCount: 320,
      diseasedTreeCount: 110,
      livestockCount: 680,
      cattleCount: 220,
      sheepCount: 460,
      avgSoilMoisture: '38.4%',
      weather: '24° م مشمس، شمالي غربي 12 كم/سا',
    );
  }

  Map<String, dynamic> toJson() => toMap();

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'code': code,
      'name': name,
      'location': location,
      'region': region,
      'locationSubtitle': locationSubtitle,
      'estateAreaLabel': estateAreaLabel,
      'soilType': soilType,
      'areaHectares': areaHectares,
      'treeCount': treeCount,
      'healthyTreeCount': healthyTreeCount,
      'attentionTreeCount': attentionTreeCount,
      'diseasedTreeCount': diseasedTreeCount,
      'livestockCount': livestockCount,
      'cattleCount': cattleCount,
      'sheepCount': sheepCount,
      'avgSoilMoisture': avgSoilMoisture,
      'weather': weather,
    };
  }
}
