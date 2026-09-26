# SOL Ecosystem - Flutter Mobile Architecture (Clean Architecture + Material 3)

```
flutter_sol_ecosystem/
├── pubspec.yaml                          # Flutter dependencies (Provider/BLoC, Material 3, fl_chart, qr_flutter)
├── lib/
│   ├── main.dart                         # App Entry Point, Theme (#0F5132 & #8B4513), Providers
│   │
│   ├── core/                             # Core cross-cutting concerns
│   │   ├── constants/
│   │   │   ├── app_colors.dart           # Dark Green, Earthy Wood, Agricultural Accents
│   │   │   └── api_endpoints.dart        # Backend Node.js REST endpoints
│   │   ├── network/
│   │   │   └── api_client.dart           # HTTP Client with JWT interceptor
│   │   └── theme/
│   │       └── sol_theme.dart            # Material 3 AgriTech ColorScheme & Typography
│   │
│   ├── features/
│   │   ├── farm_overview/                # Module A: Dashboard & Orchard Management
│   │   │   ├── data/
│   │   │   │   ├── models/farm_model.dart
│   │   │   │   └── repositories/farm_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   └── entities/farm_entity.dart
│   │   │   └── presentation/
│   │   │       ├── providers/farm_dashboard_provider.dart
│   │   │       ├── screens/dashboard_screen.dart   <-- [Requested Key Screen]
│   │   │       └── widgets/
│   │   │           ├── farm_metrics_carousel.dart
│   │   │           ├── orchard_health_card.dart
│   │   │           ├── quick_ai_scan_banner.dart
│   │   │           └── livestock_summary_card.dart
│   │   │
│   │   ├── orchard_and_trees/            # Module A: Tree Profiles & AI Leaf Scanner
│   │   │   ├── data/models/tree_model.dart
│   │   │   └── presentation/
│   │   │       ├── screens/tree_profile_screen.dart
│   │   │       └── screens/ai_camera_scanner_screen.dart
│   │   │
│   │   ├── livestock/                    # Module B: Cattle & Sheep Tracking
│   │   │   ├── data/models/animal_model.dart
│   │   │   └── presentation/
│   │   │       ├── screens/livestock_registry_screen.dart
│   │   │       └── screens/animal_detail_file_screen.dart
│   │   │
│   │   └── traceability/                 # Module C: Farm-to-Fork & QR Passport
│   │       ├── data/models/batch_passport_model.dart
│   │       └── presentation/
│   │           ├── screens/batch_qr_generator_screen.dart
│   │           └── screens/public_passport_view_screen.dart
```
