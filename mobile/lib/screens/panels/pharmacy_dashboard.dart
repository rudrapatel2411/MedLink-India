import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';

class PharmacyDashboard extends StatefulWidget {
  const PharmacyDashboard({Key? key}) : super(key: key);

  @override
  State<PharmacyDashboard> createState() => _PharmacyDashboardState();
}

class _PharmacyDashboardState extends State<PharmacyDashboard> {
  int _pendingRx = 14;
  int _dispensedRx = 62;

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);
    final socket = Provider.of<SocketService>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Row(
          children: [
            const Text('💊 ', style: TextStyle(fontSize: 20)),
            Text(lang.t('role_PHARMACIST'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.textSecondary),
            onPressed: () => auth.logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Prescription OCR Scanner Banner
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.accentIndigo.withOpacity(0.15),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.accentIndigo.withOpacity(0.4)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text('PRESCRIPTION OCR SCANNER', style: TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.bold, letterSpacing: 0.8)),
                      SizedBox(height: 4),
                      Text('Scan Handwritten Rx & Auto-Verify', style: TextStyle(color: Colors.white, fontSize: 14, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentIndigo, padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10)),
                    icon: const Icon(Icons.qr_code_scanner_rounded, size: 18),
                    label: const Text('Scan Rx'),
                    onPressed: () => _simulateOCRScan(context),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Row(
              children: [
                Expanded(child: _buildMetric('Pending Prescriptions', '$_pendingRx', AppColors.accentAmber)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetric('Dispensed Today', '$_dispensedRx', AppColors.primary)),
              ],
            ),
            const SizedBox(height: 20),

            Text('Digital Prescriptions Queue', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildRxTile(context, socket, 'Rx #9401', 'Rahul Sharma', 'Paracetamol 500mg, Amoxicillin 500mg', 'Ready for Pickup'),
            const SizedBox(height: 10),
            _buildRxTile(context, socket, 'Rx #9402', 'Anita Roy', 'Metformin 500mg, Atorvastatin 10mg', 'Fulfilling'),

            const SizedBox(height: 24),

            // Batch & 60-Day Expiry Date Management
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('60-Day Batch & Expiry Tracker', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
                TextButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('📦 Purchase Order Sent to Pharma Distributor!')));
                  },
                  child: const Text('Reorder Stock', style: TextStyle(color: AppColors.primaryLight, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(12), border: Border.all(color: AppColors.glassBorder)),
              child: Column(
                children: [
                  _buildExpiryRow('Azithromycin 500mg', 'Batch #AZ-9921', 'Expiring in 18 Days', AppColors.accentRose),
                  const Divider(color: AppColors.glassBorder),
                  _buildExpiryRow('Pantoprazole 40mg', 'Batch #PT-4410', 'Expiring in 42 Days', AppColors.accentAmber),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _simulateOCRScan(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: AppColors.accentIndigo)),
        title: Row(
          children: const [
            Icon(Icons.document_scanner_rounded, color: AppColors.accentIndigo),
            SizedBox(width: 8),
            Text('OCR Prescription Parsed', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Extracted Medicine List:', style: TextStyle(color: AppColors.primaryLight, fontSize: 12, fontWeight: FontWeight.bold)),
            SizedBox(height: 6),
            Text('1. Tab Paracetamol 650mg - 1-0-1 (3 Days)', style: TextStyle(color: Colors.white, fontSize: 12)),
            Text('2. Syr Corex DX - 10ml at bed time', style: TextStyle(color: Colors.white, fontSize: 12)),
            SizedBox(height: 10),
            Text('✅ Verified against CDSCO Drug Database & Stock Available.', style: TextStyle(color: AppColors.accentEmerald, fontSize: 11)),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Add to Fulfill Queue'),
            onPressed: () {
              setState(() {
                _pendingRx++;
              });
              Navigator.pop(ctx);
            },
          ),
        ],
      ),
    );
  }

  Widget _buildMetric(String title, String val, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(height: 4),
          Text(val, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildRxTile(BuildContext context, SocketService socket, String rxId, String patient, String meds, String status) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('$rxId - $patient', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13.5)),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentEmerald, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6)),
                icon: const Icon(Icons.check_circle_outline_rounded, size: 14),
                label: const Text('Dispense Rx', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                onPressed: () {
                  setState(() {
                    if (_pendingRx > 0) _pendingRx--;
                    _dispensedRx++;
                  });
                  socket.emitEvent('notification', {
                    'title': 'Prescription Dispensed',
                    'message': '$rxId for $patient dispensed at Apollo Pharmacy. Ready for Pickup!',
                  });
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('💊 $rxId Dispensed & Patient Notified!')),
                  );
                },
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text('Meds: $meds', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
        ],
      ),
    );
  }

  Widget _buildExpiryRow(String med, String batch, String expiryText, Color color) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(med, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 12.5)),
            Text(batch, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
          ],
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
          decoration: BoxDecoration(color: color.withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
          child: Text(expiryText, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
        ),
      ],
    );
  }
}
