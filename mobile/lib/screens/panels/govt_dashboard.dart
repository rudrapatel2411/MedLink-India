import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';

class GovtDashboard extends StatelessWidget {
  const GovtDashboard({Key? key}) : super(key: key);

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
            const Text('🏛️ ', style: TextStyle(fontSize: 20)),
            Text(lang.t('role_GOVT_OFFICIAL'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
            Text('Public Health Metrics & Disease Outbreak Alerting', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(child: _buildTile('Active ABHA Accounts', '1.42 Cr', AppColors.primary)),
                const SizedBox(width: 10),
                Expanded(child: _buildTile('Daily Consultations', '42,800', AppColors.accentIndigo)),
              ],
            ),
            const SizedBox(height: 16),

            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Epidemiological Heatmap Watch & Outbreak Index', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                  const SizedBox(height: 8),
                  const Text('• Dengue Surge Index: Low (Green Zone)', style: TextStyle(color: AppColors.accentEmerald, fontSize: 12, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  const Text('• Seasonal Influenza: Normal Distribution across 14 Districts', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentEmerald, padding: const EdgeInsets.symmetric(vertical: 10)),
                          icon: const Icon(Icons.vaccines_rounded, size: 16),
                          label: const Text('Dispatch Vaccines', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          onPressed: () {
                            socket.emitEvent('notification', {
                              'title': 'Vaccine Supply Dispatched',
                              'message': '5,000 Vaccine Doses & Medical Staff dispatched to District 4.',
                            });
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('📦 Vaccine Supply & Doctors Dispatched to District 4!')));
                          },
                        ),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, padding: const EdgeInsets.symmetric(vertical: 10)),
                          icon: const Icon(Icons.campaign_rounded, size: 16),
                          label: const Text('Broadcast Advisory', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                          onPressed: () {
                            socket.emitEvent('notification', {
                              'title': '🏛️ GOVT HEALTH ADVISORY',
                              'message': 'National Health Mission Advisory: Seasonal Flu Guidelines issued.',
                            });
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('📢 Public Health Advisory Broadcasted Nationwide!')));
                          },
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTile(String title, String val, Color color) {
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
          Text(val, style: TextStyle(color: color, fontSize: 22, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
