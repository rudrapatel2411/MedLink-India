import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';
import '../doctor/create_prescription_screen.dart';

class DoctorDashboard extends StatelessWidget {
  const DoctorDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);
    final user = auth.user;

    final mockAppointments = [
      {'patientName': 'Rahul Sharma', 'age': '34', 'gender': 'M', 'time': '10:30 AM', 'reason': 'High Fever & Cold', 'triage': 'Priority', 'triageColor': AppColors.accentAmber},
      {'patientName': 'Priya Patel', 'age': '28', 'gender': 'F', 'time': '11:15 AM', 'reason': 'Regular Routine Checkup', 'triage': 'Routine', 'triageColor': AppColors.accentEmerald},
      {'patientName': 'Amit Verma', 'age': '45', 'gender': 'M', 'time': '02:00 PM', 'reason': 'Chest Tightness', 'triage': 'Critical', 'triageColor': AppColors.accentRose},
    ];

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.accentIndigo.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.accentIndigo.withOpacity(0.4)),
              ),
              child: const Center(child: Text('👨‍⚕️', style: TextStyle(fontSize: 16))),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user?.name ?? 'Dr. Practitioner', style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold)),
                Text(lang.t('role_DOCTOR'), style: const TextStyle(fontSize: 10.5, color: AppColors.primaryLight)),
              ],
            ),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: AppColors.textSecondary, size: 20),
            onPressed: () => auth.logout(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Practitioner Stats Bar
            Row(
              children: [
                Expanded(child: _buildMetricTile('OPD Waiting Queue', '12', 'Patients in Clinic', AppColors.primary, Icons.people_outline_rounded)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetricTile('Consultations Today', '28', '93% Completed', AppColors.accentEmerald, Icons.task_alt_rounded)),
              ],
            ),
            const SizedBox(height: 16),

            // Prescription Action Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentIndigo,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                icon: const Icon(Icons.note_add_outlined, size: 20),
                label: Text(lang.t('createPrescription')),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => const CreatePrescriptionScreen()),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // OPD Appointments Queue
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text('Today\'s Clinical Queue', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
                Text('Real-Time Sync', style: TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.w600)),
              ],
            ),
            const SizedBox(height: 12),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: mockAppointments.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final appt = mockAppointments[index];
                final Color triageColor = appt['triageColor'] as Color;

                return Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.glassBorder),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 42,
                        height: 42,
                        decoration: BoxDecoration(
                          color: AppColors.surfaceLight,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.glassBorder),
                        ),
                        child: const Center(child: Text('👤', style: TextStyle(fontSize: 18))),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Text(
                                  '${appt['patientName']}',
                                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13.5),
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  '(${appt['gender']}, ${appt['age']}y)',
                                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5),
                                ),
                              ],
                            ),
                            const SizedBox(height: 3),
                            Text(
                              'Chief Complaint: ${appt['reason']}',
                              style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5),
                            ),
                          ],
                        ),
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.end,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: triageColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              appt['triage'] as String,
                              style: TextStyle(color: triageColor, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            appt['time'] as String,
                            style: const TextStyle(color: AppColors.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
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

  Widget _buildMetricTile(String title, String val, String sub, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: color),
              const SizedBox(width: 6),
              Expanded(
                child: Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.w600), overflow: TextOverflow.ellipsis),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(val, style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w800)),
          const SizedBox(height: 2),
          Text(sub, style: const TextStyle(color: AppColors.textMuted, fontSize: 10.5)),
        ],
      ),
    );
  }
}
