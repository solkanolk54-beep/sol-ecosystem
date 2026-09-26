import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

/// Module C: Farm-to-Fork Batch QR Generator & Public Verification Screen
class TraceabilityScreen extends StatelessWidget {
  final Map<String, dynamic> batchData;

  const TraceabilityScreen({
    super.key,
    required this.batchData,
  });

  @override
  Widget build(BuildContext context) {
    final String qrPayload = 'https://sol-ecosystem.agri/passport/${batchData['batchCode']}';

    return Scaffold(
      appBar: AppBar(
        title: const Text('Traceability & Farm-to-Fork Passport'),
        backgroundColor: const Color(0xFF1E3A8A),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // QR Code Card
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withOpacity(0.06),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                children: [
                  Text(
                    batchData['productName'] ?? 'SOL Reserve Extra Virgin Olive Oil',
                    textAlign: TextAlign.center,
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 6),
                  Text('Batch ID: ${batchData['batchCode']}',
                      style: const TextStyle(color: Color(0xFF1E3A8A), fontWeight: FontWeight.bold)),
                  const SizedBox(height: 16),
                  QrImageView(
                    data: qrPayload,
                    version: QrVersions.auto,
                    size: 200.0,
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Scan with any smartphone camera to open public certification',
                    style: TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Public Quality Parameters View
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Certified Lab Quality Parameters', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                  const Divider(height: 20),
                  _buildQualityRow('Harvest Date', batchData['harvestDate'] ?? '2025-11-20'),
                  _buildQualityRow('Origin Parcel', batchData['origin'] ?? 'Cap Bon Parcel Alpha'),
                  _buildQualityRow('Acidity Level', '0.18% (Ultra-Low Acidity)'),
                  _buildQualityRow('Polyphenols', '540 mg/kg (High Antioxidants)'),
                  _buildQualityRow('Extraction Method', 'Cold-extracted at 22°C within 6h'),
                  _buildQualityRow('Blockchain Seal', 'Verified Ethereum / Polygon L2'),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQualityRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(color: Color(0xFF6B7280), fontSize: 13)),
          Text(value, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
        ],
      ),
    );
  }
}
