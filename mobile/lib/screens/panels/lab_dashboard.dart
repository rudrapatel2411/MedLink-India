import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';

class LabDashboard extends StatefulWidget {
  const LabDashboard({Key? key}) : super(key: key);

  @override
  State<LabDashboard> createState() => _LabDashboardState();
}

class _LabDashboardState extends State<LabDashboard> {
  int _pendingCount = 18;
  int _completedCount = 45;

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
            const Text('🧪 ', style: TextStyle(fontSize: 20)),
            Text(lang.t('role_LAB_TECHNICIAN'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
            Row(
              children: [
                Expanded(child: _buildMetric('Pending Tests', '$_pendingCount', AppColors.accentAmber)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetric('Completed Today', '$_completedCount', AppColors.accentEmerald)),
              ],
            ),
            const SizedBox(height: 20),

            // Critical Value Alert Banner
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.accentRose.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.accentRose.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning_rounded, color: AppColors.accentRose, size: 24),
                  const SizedBox(width: 10),
                  const Expanded(
                    child: Text(
                      'CRITICAL METRIC ALARM: High Troponin detected for Patient Rahul Sharma.',
                      style: TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold),
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentRose, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6)),
                    child: const Text('Escalate Alert', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                    onPressed: () {
                      socket.emitEvent('notification', {
                        'title': '🚨 CRITICAL LAB VALUE ESCALATED',
                        'message': 'Troponin I: 4.8 ng/mL (Critical High). Doctor & Patient notified.',
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('⚡ Urgent Alert Pushed to Doctor & Patient ABHA Vault!')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            Text('Recent Diagnostic Requests & Vault Push', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildTestCard(context, socket, 'Complete Blood Count (CBC)', 'Deepak Joshi', 'Sample Collected', AppColors.accentIndigo),
            const SizedBox(height: 10),
            _buildTestCard(context, socket, 'Lipid Profile Test', 'Meera Nair', 'Processing in Analyzer', AppColors.accentAmber),
            const SizedBox(height: 10),
            _buildTestCard(context, socket, 'HbA1c Diabetes Panel', 'Ramesh Shah', 'Ready for Vault Push', AppColors.accentEmerald),
          ],
        ),
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

  Widget _buildTestCard(BuildContext context, SocketService socket, String testName, String patient, String status, Color color) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(testName, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13.5)),
              const SizedBox(height: 2),
              Text('Patient: $patient', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5)),
            ],
          ),
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(backgroundColor: color, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6)),
            icon: const Icon(Icons.cloud_upload_outlined, size: 14),
            label: const Text('Push to Vault', style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
            onPressed: () {
              setState(() {
                if (_pendingCount > 0) _pendingCount--;
                _completedCount++;
              });
              socket.emitEvent('lab_report_pushed', {
                'title': 'Lab Report Ready',
                'message': '$testName for $patient uploaded to ABHA Health Vault.',
              });
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('📄 $testName Report Pushed to $patient\'s ABHA Vault!')),
              );
            },
          ),
        ],
      ),
    );
  }
}
