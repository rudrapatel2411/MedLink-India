import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';

class BloodBankDashboard extends StatefulWidget {
  const BloodBankDashboard({Key? key}) : super(key: key);

  @override
  State<BloodBankDashboard> createState() => _BloodBankDashboardState();
}

class _BloodBankDashboardState extends State<BloodBankDashboard> {
  final List<Map<String, dynamic>> _bloodUnits = [
    {'group': 'A+', 'units': 24, 'status': 'Stable'},
    {'group': 'A-', 'units': 5, 'status': 'Low Stock'},
    {'group': 'B+', 'units': 38, 'status': 'Stable'},
    {'group': 'B-', 'units': 8, 'status': 'Moderate'},
    {'group': 'O+', 'units': 45, 'status': 'High Demand'},
    {'group': 'O-', 'units': 2, 'status': 'CRITICAL'},
    {'group': 'AB+', 'units': 15, 'status': 'Stable'},
    {'group': 'AB-', 'units': 4, 'status': 'Low Stock'},
  ];

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
            const Text('🩸 ', style: TextStyle(fontSize: 20)),
            Text(lang.t('role_BLOOD_BANK_MANAGER'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
            // Critical O-ve Alert & Donor Broadcast
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.accentRose.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.accentRose.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.bloodtype_rounded, color: AppColors.accentRose, size: 28),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'CRITICAL BLOOD DEFICIT: O -ve stock at 2 units only.',
                      style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold),
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentRose, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                    child: const Text('Broadcast Donors', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    onPressed: () {
                      socket.emitEvent('notification', {
                        'title': '🩸 URGENT DONOR ALERT',
                        'message': 'Emergency O -ve Blood Donors needed at City Blood Bank!',
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('📢 Emergency SOS Push Sent to Registered O -ve Donors!')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Real-Time Blood Stock Inventory', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6)),
                  icon: const Icon(Icons.local_shipping_outlined, size: 14),
                  label: const Text('Dispatch Unit', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  onPressed: () => _showDispatchModal(context, socket),
                ),
              ],
            ),
            const SizedBox(height: 12),
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 4,
                crossAxisSpacing: 8,
                mainAxisSpacing: 8,
                childAspectRatio: 1.0,
              ),
              itemCount: _bloodUnits.length,
              itemBuilder: (context, index) {
                final b = _bloodUnits[index];
                final isCritical = b['status'] == 'CRITICAL';
                return Container(
                  decoration: BoxDecoration(
                    color: isCritical ? AppColors.accentRose.withOpacity(0.2) : AppColors.surface,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: isCritical ? AppColors.accentRose : AppColors.glassBorder),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(b['group'] as String, style: TextStyle(color: isCritical ? AppColors.accentRose : Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('${b['units']} Units', style: const TextStyle(color: AppColors.textSecondary, fontSize: 10)),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showDispatchModal(BuildContext context, SocketService socket) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16), side: const BorderSide(color: AppColors.glassBorder)),
        title: const Text('Dispatch Blood Bag Unit', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Destination Hospital:', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
            const SizedBox(height: 4),
            const Text('AIIMS Trauma Center - ICU Bay #1', style: TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentRose, minimumSize: const Size(double.infinity, 40)),
              child: const Text('Dispatch 2 Units O -ve'),
              onPressed: () {
                setState(() {
                  _bloodUnits[5]['units'] = (_bloodUnits[5]['units'] as int) - 2;
                });
                socket.emitEvent('notification', {
                  'title': 'Blood Units Dispatched',
                  'message': '2 Units of O -ve blood dispatched to AIIMS Trauma Center.',
                });
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🩸 2 Units O -ve Dispatched via Cold Chain Courier!')));
              },
            ),
          ],
        ),
      ),
    );
  }
}
