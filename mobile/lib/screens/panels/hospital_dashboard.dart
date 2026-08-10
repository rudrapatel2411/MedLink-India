import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';

class HospitalDashboard extends StatefulWidget {
  const HospitalDashboard({Key? key}) : super(key: key);

  @override
  State<HospitalDashboard> createState() => _HospitalDashboardState();
}

class _HospitalDashboardState extends State<HospitalDashboard> {
  int _currentToken = 104;
  int _availableBeds = 32;
  int _icuBeds = 6;

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
            // OPD Queue Control System
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary.withOpacity(0.4)),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('DYNAMIC OPD QUEUE ENGINE', style: TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.w800, letterSpacing: 0.8)),
                      const SizedBox(height: 4),
                      Text('Current Serving Token: #$_currentToken', style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w800)),
                      const Text('14 Patients Waiting in Clinic', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    ],
                  ),
                  ElevatedButton.icon(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12)),
                    icon: const Icon(Icons.record_voice_over_rounded, size: 18),
                    label: const Text('Call Next Token'),
                    onPressed: () {
                      setState(() {
                        _currentToken++;
                      });
                      socket.emitEvent('opd_queue_update', {
                        'token': _currentToken,
                        'message': 'Token #$_currentToken called to Room 3',
                        'title': 'OPD Queue Alert',
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('📢 Token #$_currentToken Called to Consultation Room 3')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Emergency Room Triage Pre-Arrival Warning
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.accentRose.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.accentRose.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.warning_amber_rounded, color: AppColors.accentRose, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('ER TRIAGE ALERT: Incoming Critical Case', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        Text('ALS Ambulance #04 arriving in 4 mins (Severe Cardiac Trauma)', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                      ],
                    ),
                  ),
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentRose, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8)),
                    child: const Text('Ready Trauma Bay', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    onPressed: () {
                      socket.emitEvent('notification', {
                        'title': 'Trauma Bay Ready',
                        'message': 'AIIMS Emergency Bay #1 Prepped & Ready for Ambulance #04',
                      });
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('✅ Trauma Bay Prepped & Resuscitation Team Notified')),
                      );
                    },
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Bed Occupancy Status
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('ICU & Bed Occupancy Live Tracker', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentEmerald, padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6)),
                  icon: const Icon(Icons.add_circle_outline_rounded, size: 14),
                  label: const Text('Allocate Bed', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                  onPressed: () {
                    setState(() {
                      if (_availableBeds > 0) _availableBeds--;
                    });
                    socket.emitEvent('bed_update', {
                      'title': 'Bed Allocated',
                      'message': 'New IPD Admission allocated in Ward B',
                    });
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Bed Allocated to Patient!')));
                  },
                ),
              ],
            ),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(child: _buildMetric('Total Capacity', '150 Beds', AppColors.primary)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetric('Available Beds', '$_availableBeds Beds', AppColors.accentEmerald)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetric('Available ICU', '$_icuBeds Beds', AppColors.accentRose)),
              ],
            ),

            const SizedBox(height: 24),

            // Emergency Admissions
            Text('Active In-Patient Department (IPD) Admissions', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
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
          Text(val, style: TextStyle(color: color, fontSize: 16, fontWeight: FontWeight.bold)),
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
