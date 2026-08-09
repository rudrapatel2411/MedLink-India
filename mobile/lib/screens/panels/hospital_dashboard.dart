import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';

class HospitalDashboard extends StatelessWidget {
  const HospitalDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Row(
          children: [
            const Text('🏥 ', style: TextStyle(fontSize: 20)),
            Text(lang.t('role_HOSPITAL_ADMIN'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
            // Bed Occupancy Status
            Text('ICU & Bed Occupancy Live Tracker', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(child: _buildMetric('Total Beds', '150', AppColors.primary)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetric('Occupied', '118', AppColors.accentRose)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetric('Available ICU', '6', AppColors.accentEmerald)),
              ],
            ),

            const SizedBox(height: 24),

            // Emergency Admissions
            Text('Active In-Patient Admissions', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: Column(
                children: [
                  _buildAdmissionRow('ICU Bed #4', 'Karan Patel', 'Severe Asthma', 'Admitted 2h ago', AppColors.accentRose),
                  const Divider(color: AppColors.glassBorder),
                  _buildAdmissionRow('Ward B #12', 'Sunita Rao', 'Post-Op Recovery', 'Admitted 5h ago', AppColors.accentEmerald),
                  const Divider(color: AppColors.glassBorder),
                  _buildAdmissionRow('Emergency #1', 'Vikas Gupta', 'Trauma Triage', 'Admitted 15m ago', AppColors.accentAmber),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String title, String val, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Column(
        children: [
          Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
          const SizedBox(height: 4),
          Text(val, style: TextStyle(color: color, fontSize: 20, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }

  Widget _buildAdmissionRow(String bed, String name, String diagnosis, String time, Color tagColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('$bed - $name', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              Text(diagnosis, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: tagColor.withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
            child: Text(time, style: TextStyle(color: tagColor, fontSize: 11, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
