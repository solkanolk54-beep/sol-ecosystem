/// ============================================================================
/// SOL ECOSYSTEM - ANIMAL MODEL
/// File: lib/features/livestock/data/models/animal_model.dart
/// Architectural Layer: Data / Models
/// Context: Livestock Herd Telemetry & RFID Identification (Mila Basin / Ouled Djellal)
/// ============================================================================
class AnimalModel {
  final String tagRfid;
  final String name;
  final String species; // 'cattle' or 'sheep'
  final String breed;
  final double weight;
  final String health;
  final String yield;
  final String birthDate;
  final String lastCheckDate;
  final String vaccinationStatus;

  const AnimalModel({
    required this.tagRfid,
    required this.name,
    required this.species,
    required this.breed,
    required this.weight,
    required this.health,
    required this.yield,
    this.birthDate = '2023-03-15',
    this.lastCheckDate = '2026-09-20',
    this.vaccinationStatus = 'Up-to-Date (محدث)',
  });

  factory AnimalModel.fromJson(Map<String, dynamic> json) {
    return AnimalModel(
      tagRfid: json['tagRfid']?.toString() ?? json['id']?.toString() ?? 'RFID-CTL-0000',
      name: json['name']?.toString() ?? 'Unnamed Animal',
      species: json['species']?.toString() ?? 'cattle',
      breed: json['breed']?.toString() ?? 'Standard Heritage',
      weight: (json['weight'] is num) ? (json['weight'] as num).toDouble() : 450.0,
      health: json['health']?.toString() ?? 'healthy',
      yield: json['yield']?.toString() ?? 'Normal',
      birthDate: json['birthDate']?.toString() ?? '2023-03-15',
      lastCheckDate: json['lastCheckDate']?.toString() ?? '2026-09-20',
      vaccinationStatus: json['vaccinationStatus']?.toString() ?? 'Up-to-Date (محدث)',
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'tagRfid': tagRfid,
      'name': name,
      'species': species,
      'breed': breed,
      'weight': weight,
      'health': health,
      'yield': yield,
      'birthDate': birthDate,
      'lastCheckDate': lastCheckDate,
      'vaccinationStatus': vaccinationStatus,
    };
  }
}
