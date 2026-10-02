import 'package:flutter/material.dart';
import '../../../../core/constants/app_colors.dart';

/// ============================================================================
/// SOL ECOSYSTEM - AI CAMERA SCANNER SCREEN
/// File: lib/features/orchard_and_trees/presentation/screens/ai_camera_scanner_screen.dart
/// Architectural Layer: Features / Orchard & Trees / Presentation / Screens
/// Context: Computer Vision Peacock Spot & Foliar Pathogen Diagnosis (Mila Basin)
/// ============================================================================
class AiCameraScannerScreen extends StatefulWidget {
  const AiCameraScannerScreen({super.key});

  @override
  State<AiCameraScannerScreen> createState() => _AiCameraScannerScreenState();
}

class _AiCameraScannerScreenState extends State<AiCameraScannerScreen> {
  bool _isAnalyzing = false;
  Map<String, dynamic>? _diagnosticResult;

  void _triggerScan() async {
    setState(() {
      _isAnalyzing = true;
      _diagnosticResult = null;
    });

    await Future.delayed(const Duration(milliseconds: 1800));

    if (!mounted) return;
    setState(() {
      _isAnalyzing = false;
      _diagnosticResult = {
        'pathogen': 'Olive Peacock Spot (Spilocaea oleagina / عين الطاووس)',
        'confidence': 94.8,
        'severity': 'Moderate (Early Stage / مرحلة مبكرة)',
        'symptoms': 'Circular chlorotic target-like spots on upper leaf surfaces (بقع دائرية رمادية محاطة بهالة صفراء داكنة).',
        'recommendation': '1. Spray Copper Hydroxide (250g/100L) post-rain.\n2. Prune internal canopy twigs to maximize air movement.\n3. Rake fallen foliage to eliminate overwintering conidia.\n\nبروتوكول المعالجة: رش هيدروكسيد النحاس 250غ/100ل وتقليم الفروع لتهوية التاج.'
      };
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('AI Vision Plant Diagnostic (فحص بالذكاء الاصطناعي)'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: Stack(
        children: [
          // Camera Viewport Simulation
          Center(
            child: Container(
              margin: const EdgeInsets.all(24),
              width: double.infinity,
              height: 440,
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.healthyGreen, width: 2),
                borderRadius: BorderRadius.circular(20),
                color: const Color(0xFF1A2E20),
              ),
              child: Stack(
                children: [
                  const Center(
                    child: Icon(Icons.yard_rounded, size: 100, color: Colors.white24),
                  ),
                  Center(
                    child: Container(
                      width: 260,
                      height: 260,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.white60, width: 1.5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                _cornerMarker(),
                                Transform.rotate(angle: 1.57, child: _cornerMarker()),
                              ],
                            ),
                          ),
                          Padding(
                            padding: const EdgeInsets.all(8.0),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Transform.rotate(angle: -1.57, child: _cornerMarker()),
                                Transform.rotate(angle: 3.14, child: _cornerMarker()),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  if (_isAnalyzing)
                    Center(
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.7),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: const [
                            CircularProgressIndicator(color: AppColors.healthyGreen),
                            SizedBox(height: 12),
                            Text(
                              'Analyzing leaf pathogen vectors...',
                              style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                            ),
                            SizedBox(height: 4),
                            Text(
                              'جارٍ فحص البقع الفطرية وتحليل العينة...',
                              style: TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    )
                ],
              ),
            ),
          ),

          // Diagnostic Bottom Sheet if result ready
          if (_diagnosticResult != null)
            Align(
              alignment: Alignment.bottomCenter,
              child: Container(
                padding: const EdgeInsets.all(20),
                decoration: const BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
                  boxShadow: [
                    BoxShadow(color: Colors.black26, blurRadius: 16, offset: Offset(0, -4)),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'AI Diagnostic Result (نتيجة التشخيص)',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppColors.textPrimary),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.attentionYellow.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            '${_diagnosticResult!['confidence']}% Match',
                            style: const TextStyle(
                              color: AppColors.secondary,
                              fontWeight: FontWeight.bold,
                              fontSize: 12,
                            ),
                          ),
                        )
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      _diagnosticResult!['pathogen'],
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.primary),
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: AppColors.lightSurface,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: AppColors.borderLight),
                      ),
                      child: Text(
                        'Recommended Protocol:\n${_diagnosticResult!['recommendation']}',
                        style: const TextStyle(fontSize: 12, color: AppColors.textSecondary, height: 1.4),
                      ),
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          foregroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(vertical: 13),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Log Treatment to Tree File (حفظ بالسجل الصحي)'),
                      ),
                    )
                  ],
                ),
              ),
            ),

          // Capture Floating Button
          if (_diagnosticResult == null && !_isAnalyzing)
            Positioned(
              bottom: 30,
              left: 0,
              right: 0,
              child: Center(
                child: FloatingActionButton.large(
                  backgroundColor: AppColors.healthyGreen,
                  foregroundColor: Colors.white,
                  onPressed: _triggerScan,
                  child: const Icon(Icons.camera_alt_rounded, size: 36),
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _cornerMarker() {
    return Container(
      width: 16,
      height: 16,
      decoration: const BoxDecoration(
        border: Border(
          top: BorderSide(color: AppColors.healthyGreen, width: 3),
          left: BorderSide(color: AppColors.healthyGreen, width: 3),
        ),
      ),
    );
  }
}

/// Backward compatibility alias so legacy code expecting AiCameraScreen continues to work
typedef AiCameraScreen = AiCameraScannerScreen;
