import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/widgets/mobile_scaffold.dart';
import '../doctor/create_prescription_screen.dart';

class DoctorDashboard extends StatefulWidget {
  const DoctorDashboard({Key? key}) : super(key: key);

  @override
  State<DoctorDashboard> createState() => _DoctorDashboardState();
}

class _DoctorDashboardState extends State<DoctorDashboard> {
  final List<Map<String, dynamic>> _appointments = [
    {
      'id': '1',
      'patientName': 'Rahul Sharma',
      'age': '34',
      'gender': 'M',
      'time': '10:30 AM',
      'reason': 'High Fever & Severe Cough',
      'triage': 'PRIORITY',
      'status': 'IN_QUEUE',
      'abhaId': '91-4820-1928-3741'
    },
    {
      'id': '2',
      'patientName': 'Priya Patel',
      'age': '28',
      'gender': 'F',
      'time': '11:15 AM',
      'reason': 'Regular Routine Antenatal Checkup',
      'triage': 'ROUTINE',
      'status': 'IN_PROGRESS',
      'abhaId': '91-1029-3847-5621'
    },
    {
      'id': '3',
      'patientName': 'Amit Verma',
      'age': '45',
      'gender': 'M',
      'time': '02:00 PM',
      'reason': 'Acute Chest Tightness & Dizziness',
      'triage': 'CRITICAL',
      'status': 'IN_QUEUE',
      'abhaId': '91-8877-6655-4433'
    },
  ];

  void _requestAbhaConsent(String patientName, String abhaId) {
    HapticFeedback.mediumImpact();
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) => Container(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: const [
                Icon(Icons.shield_rounded, color: AppColors.primary, size: 20),
                SizedBox(width: 8),
                Text('ABHA HEALTH RECORD CONSENT', style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13)),
              ],
            ),
            const SizedBox(height: 12),
            Text('Request digital EHR access for $patientName', style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w700)),
            const SizedBox(height: 6),
            Text('ABHA ID: $abhaId', style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
            const SizedBox(height: 20),
            ElevatedButton(
              style: ElevatedButton.styleFrom(minimumSize: const Size(double.infinity, 48)),
              onPressed: () {
                Navigator.pop(context);
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text('🛡️ OTP Consent request sent to $patientName\'s registered phone!'),
                    backgroundColor: AppColors.accentEmerald,
                  ),
                );
              },
              child: const Text('SEND DIGITAL CONSENT OTP'),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);

    return MobileScaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Practitioner Header Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.accentIndigo.withOpacity(0.4)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: AppColors.accentIndigo.withOpacity(0.2),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(child: Text('👨‍⚕️', style: TextStyle(fontSize: 22))),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          auth.user?.name ?? 'Dr. Practitioner',
                          style: const TextStyle(color: Colors.white, fontSize: 17, fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Senior Consultant Practitioner • Apollo OPD',
                          style: const TextStyle(color: AppColors.textSecondary, fontSize: 12),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Key Clinical Metric Counters
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.glassBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('OPD Waiting', style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5)),
                        SizedBox(height: 4),
                        Text('12 Patients', style: TextStyle(color: AppColors.primary, fontSize: 18, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.glassBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: const [
                        Text('Consultations Done', style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5)),
                        SizedBox(height: 4),
                        Text('28 Completed', style: TextStyle(color: AppColors.accentEmerald, fontSize: 18, fontWeight: FontWeight.w800)),
                      ],
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),

            // Issue E-Prescription Button
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentIndigo,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                icon: const Icon(Icons.post_add_rounded, size: 20),
                label: Text(lang.t('createPrescription'), style: const TextStyle(fontWeight: FontWeight.bold)),
                onPressed: () {
                  HapticFeedback.lightImpact();
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (_) => const CreatePrescriptionScreen()),
                  );
                },
              ),
            ),
            const SizedBox(height: 24),

            // OPD Appointments Queue List
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text('Today\'s OPD Queue', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800)),
                Text('Real-Time Queue', style: TextStyle(color: AppColors.primaryLight, fontSize: 11.5, fontWeight: FontWeight.w600)),
              ],
            ),
            const SizedBox(height: 12),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _appointments.length,
              separatorBuilder: (_, __) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final appt = _appointments[index];
                Color badgeColor;
                if (appt['triage'] == 'CRITICAL') {
                  badgeColor = AppColors.accentRose;
                } else if (appt['triage'] == 'PRIORITY') {
                  badgeColor = AppColors.accentAmber;
                } else {
                  badgeColor = AppColors.accentEmerald;
                }

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.glassBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              Text(
                                '${appt['patientName']} (${appt['gender']}, ${appt['age']} yrs)',
                                style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 14),
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: badgeColor.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: badgeColor),
                            ),
                            child: Text(
                              appt['triage'],
                              style: TextStyle(color: badgeColor, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Text('Reason: ${appt['reason']}', style: const TextStyle(color: AppColors.textSecondary, fontSize: 12.5)),
                      const SizedBox(height: 4),
                      Text('Scheduled Time: ${appt['time']}', style: const TextStyle(color: AppColors.textMuted, fontSize: 11.5)),
                      const SizedBox(height: 12),

                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton.icon(
                              style: OutlinedButton.styleFrom(
                                padding: const EdgeInsets.symmetric(vertical: 8),
                                side: const BorderSide(color: AppColors.primary),
                              ),
                              icon: const Icon(Icons.security, size: 14, color: AppColors.primary),
                              label: const Text('ABHA Vault', style: TextStyle(fontSize: 11, color: AppColors.primary)),
                              onPressed: () => _requestAbhaConsent(appt['patientName'], appt['abhaId']),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: appt['status'] == 'IN_PROGRESS' ? AppColors.accentEmerald : AppColors.primaryDark,
                                padding: const EdgeInsets.symmetric(vertical: 8),
                              ),
                              onPressed: () {
                                HapticFeedback.mediumImpact();
                                setState(() {
                                  if (appt['status'] == 'IN_PROGRESS') {
                                    appt['status'] = 'COMPLETED';
                                  } else {
                                    appt['status'] = 'IN_PROGRESS';
                                  }
                                });
                              },
                              child: Text(
                                appt['status'] == 'IN_PROGRESS' ? 'COMPLETED' : 'START CONSULT',
                                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
