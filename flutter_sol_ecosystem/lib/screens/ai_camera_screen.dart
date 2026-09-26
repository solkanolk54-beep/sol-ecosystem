import 'package:flutter/material.dart';

/// Module A: AI Diagnostic Camera Preview Screen with Mock Analysis Response
class AiCameraScreen extends StatefulWidget {
  const AiCameraScreen({super.key});

  @override
  State<AiCameraScreen> createState() => _AiCameraScreenState();
}

class _AiCameraScreenState extends State<AiCameraScreen> {
  bool _isAnalyzing = false;
  Map<String, dynamic>? _diagnosticResult;

  void _triggerScan() async {
    setState(() {
      _isAnalyzing = true;
      _diagnosticResult = null;
    });

    await Future.delayed(const Duration(seconds: 2));

    setState(() {
      _isAnalyzing = false;
      _diagnosticResult = {
        'pathogen': 'Olive Peacock Spot (Spilocaea oleagina)',
        'confidence': 94.8,
        'severity': 'Moderate (Early Stage)',
        'symptoms': 'Circular chlorotic target-like spots on upper leaf surfaces.',
        'recommendation': '1. Spray Copper Hydroxide (250g/100L) post-rain.\n2. Prune internal canopy twigs to maximize air movement.\n3. Rake fallen foliage to eliminate overwintering conidia.'
      };
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        title: const Text('AI Vision Plant Diagnostic'),
        backgroundColor: Colors.black,
        foregroundColor: Colors.white,
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
                border: Border.all(color: const Color(0xFF10B981), width: 2),
                borderRadius: BorderRadius.circular(20),
                color: const Color(0xFF1A2E20),
              ),
              child: Stack(
                children: [
                  const Center(
                    child: Icon(Icons.yard_rounded, size: 100, color: Colors.white30),
                  ),
                  Center(
                    child: Container(
                      width: 260,
                      height: 260,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.white60, style: BorderStyle.solid),
                        borderRadius: BorderRadius.circular(16),
                      ),
                    ),
                  ),
                  if (_isAnalyzing)
                    const Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(color: Color(0xFF10B981)),
                          SizedBox(height: 12),
                          Text('Analyzing leaf pathogen vectors...', style: TextStyle(color: Colors.white)),
                        ],
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
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('AI Diagnostic Result', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF59E0B).withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text('${_diagnosticResult!['confidence']}% Match',
                              style: const TextStyle(color: Color(0xFFD97706), fontWeight: FontWeight.bold, fontSize: 12)),
                        )
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(_diagnosticResult!['pathogen'],
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF0F5132))),
                    const SizedBox(height: 8),
                    Text('Recommended Treatment:\n${_diagnosticResult!['recommendation']}',
                        style: const TextStyle(fontSize: 12, color: Color(0xFF374151))),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF0F5132),
                          foregroundColor: Colors.white,
                        ),
                        onPressed: () => Navigator.pop(context),
                        child: const Text('Log Treatment to Tree File'),
                      ),
                    )
                  ],
                ),
              ),
            ),

          // Capture Button
          if (_diagnosticResult == null && !_isAnalyzing)
            Positioned(
              bottom: 30,
              left: 0,
              right: 0,
              child: Center(
                child: FloatingActionButton.large(
                  backgroundColor: const Color(0xFF10B981),
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
}
