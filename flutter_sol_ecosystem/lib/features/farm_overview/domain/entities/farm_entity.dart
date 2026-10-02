/// ============================================================================
/// SOL ECOSYSTEM - FARM ENTITY
/// File: lib/features/farm_overview/domain/entities/farm_entity.dart
/// Architectural Layer: Domain / Entities (Pure Business Logic)
/// ============================================================================
class FarmEntity {
  final String id;
  final String code;
  final String name;
  final String location;
  final String region;
  final String locationSubtitle;
  final String estateAreaLabel;
  final String soilType;
  final double areaHectares;
  final int treeCount;
  final int healthyTreeCount;
  final int attentionTreeCount;
  final int diseasedTreeCount;
  final int livestockCount;
  final int cattleCount;
  final int sheepCount;
  final String avgSoilMoisture;
  final String weather;

  const FarmEntity({
    required this.id,
    required this.code,
    required this.name,
    required this.location,
    required this.region,
    required this.locationSubtitle,
    required this.estateAreaLabel,
    required this.soilType,
    required this.areaHectares,
    required this.treeCount,
    required this.healthyTreeCount,
    required this.attentionTreeCount,
    required this.diseasedTreeCount,
    required this.livestockCount,
    required this.cattleCount,
    required this.sheepCount,
    required this.avgSoilMoisture,
    required this.weather,
  });

  double get healthyTreePct => treeCount > 0 ? (healthyTreeCount / treeCount) * 100 : 0;
  double get attentionTreePct => treeCount > 0 ? (attentionTreeCount / treeCount) * 100 : 0;
  double get diseasedTreePct => treeCount > 0 ? (diseasedTreeCount / treeCount) * 100 : 0;
}
