import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';

class BloodBankDashboard extends StatelessWidget {
  const BloodBankDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);

    final bloodUnits = [
      {'group': 'A+', 'units': '24', 'status': 'Stable'},
      {'group': 'A-', 'units': '5', 'status': 'Low Stock'},
      {'group': 'B+', 'units': '38', 'status': 'Stable'},
      {'group': 'B-', 'units': '8', 'status': 'Moderate'},
      {'group': 'O+', 'units': '45', 'status': 'High Demand'},
      {'group': 'O-', 'units': '2', 'status': 'CRITICAL'},
      {'group': 'AB+', 'units': '15', 'status': 'Stable'},
      {'group': 'AB-', 'units': '4', 'status': 'Low Stock'},
    ];

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
            Text('Real-Time Blood Stock Inventory', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
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
              itemCount: bloodUnits.length,
              itemBuilder: (context, index) {
                final b = bloodUnits[index];
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
                      Text(b['group']!, style: TextStyle(color: isCritical ? AppColors.accentRose : Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
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
}
