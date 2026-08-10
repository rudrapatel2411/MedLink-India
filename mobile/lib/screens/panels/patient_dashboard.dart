import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';
import '../patient/book_appointment_screen.dart';
import '../patient/symptom_checker_screen.dart';

class PatientDashboard extends StatelessWidget {
  const PatientDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);
    final socket = Provider.of<SocketService>(context);
    final user = auth.user;

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
                color: AppColors.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: AppColors.primary.withOpacity(0.4)),
              ),
              child: const Center(child: Text('🏥', style: TextStyle(fontSize: 16))),
            ),
            const SizedBox(width: 10),
            Text(lang.t('brandName'), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w800, letterSpacing: -0.3)),
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
            // ABHA Digital Health Card Pass
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F2027), Color(0xFF203A43), Color(0xFF2C5364)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.primary.withOpacity(0.4), width: 1.5),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.2),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.shield_rounded, color: AppColors.primaryLight, size: 18),
                          SizedBox(width: 6),
                          Text('NATIONAL HEALTH AUTHORITY', style: TextStyle(color: AppColors.primaryLight, fontSize: 10.5, fontWeight: FontWeight.w800, letterSpacing: 0.8)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: socket.isConnected ? AppColors.accentEmerald.withOpacity(0.2) : Colors.black45,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: socket.isConnected ? AppColors.accentEmerald : AppColors.glassBorder),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: BoxDecoration(
                                color: socket.isConnected ? AppColors.accentEmerald : AppColors.textMuted,
                                shape: BoxShape.circle,
                              ),
                            ),
                            const SizedBox(width: 5),
                            Text(
                              socket.isConnected ? 'ABHA Live' : 'Offline',
                              style: TextStyle(color: socket.isConnected ? AppColors.accentEmerald : AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.bold),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            user?.name ?? 'Patient Citizen',
                            style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800, letterSpacing: -0.3),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'ABHA ID: ${user?.abhaId ?? "91-4820-3910-4492"}',
                            style: const TextStyle(color: AppColors.primaryLight, fontSize: 13, fontWeight: FontWeight.w600, letterSpacing: 0.5),
                          ),
                        ],
                      ),
                      // Simulated QR Code Chip
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Center(
                          child: Icon(Icons.qr_code_2_rounded, color: Colors.black87, size: 36),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  const Divider(color: Colors.white24, height: 1),
                  const SizedBox(height: 12),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: const [
                      Text('BLOOD GROUP: O+', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                      Text('EMR ENCRYPTED • AES-256', style: TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // One-Tap Emergency Triangulation SOS Button
            Container(
              width: double.infinity,
              margin: const EdgeInsets.only(bottom: 20),
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.accentRose,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  elevation: 6,
                  shadowColor: AppColors.accentRose.withOpacity(0.5),
                ),
                icon: const Icon(Icons.emergency_rounded, size: 24),
                label: const Text('🚨 ONE-TAP EMERGENCY SOS (TRIANGULATE)', style: TextStyle(fontSize: 14.5, fontWeight: FontWeight.w800, letterSpacing: 0.5)),
                onPressed: () => _triggerEmergencySOS(context, socket),
              ),
            ),

            // Quick Actions Section
            const Text('Ecosystem Direct Actions', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const BookAppointmentScreen()),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.glassBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.calendar_month_rounded, color: AppColors.primary, size: 22),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            lang.t('bookAppointment'),
                            style: const TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          const Text('Top Specialists', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => const SymptomCheckerScreen()),
                      );
                    },
                    borderRadius: BorderRadius.circular(16),
                    child: Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.glassBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.accentIndigo.withOpacity(0.15),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(Icons.psychology_rounded, color: AppColors.accentIndigo, size: 22),
                          ),
                          const SizedBox(height: 12),
                          Text(
                            lang.t('symptomChecker'),
                            style: const TextStyle(color: Colors.white, fontSize: 13.5, fontWeight: FontWeight.w700),
                          ),
                          const SizedBox(height: 2),
                          const Text('Instant AI Triage', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Real-Time Hospital Bed & ICU Tracker
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Live Hospital Bed Radar (30s Sync)', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
                TextButton(
                  onPressed: () => _showBedReservationModal(context, socket),
                  child: const Text('Reserve Bed', style: TextStyle(color: AppColors.primaryLight, fontSize: 12, fontWeight: FontWeight.bold)),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Row(
              children: [
                _buildBedCard('Normal Beds', '42 Available', AppColors.accentEmerald, Icons.king_bed_rounded),
                const SizedBox(width: 10),
                _buildBedCard('Oxygen Beds', '18 Available', AppColors.accentAmber, Icons.air_rounded),
                const SizedBox(width: 10),
                _buildBedCard('ICU Beds', '5 Available', AppColors.accentRose, Icons.medical_services_rounded),
              ],
            ),

            const SizedBox(height: 24),

            // Health Metrics Grid
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text('Personal Health Vitals', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
                Text('Last Sync: 10m ago', style: TextStyle(color: AppColors.textSecondary, fontSize: 11)),
              ],
            ),
            const SizedBox(height: 12),

            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.5,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              children: [
                _buildVitalTile('Heart Rate', '72', 'bpm', 'Normal', AppColors.accentRose, Icons.favorite_rounded),
                _buildVitalTile('Blood Pressure', '120/80', 'mmHg', 'Optimal', AppColors.primary, Icons.speed_rounded),
                _buildVitalTile('Oxygen Saturation', '99', '%', 'Excellent', AppColors.accentEmerald, Icons.air_rounded),
                _buildVitalTile('Blood Glucose', '95', 'mg/dL', 'Fasting', AppColors.accentAmber, Icons.water_drop_rounded),
              ],
            ),

            const SizedBox(height: 24),

            // Universal Digital Health Vault & Medication Reminders
            const Text('Smart Prescription Reminders', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
            const SizedBox(height: 10),
            _buildMedicationTile(context, 'Tab Metformin 500mg', '1 Dose after breakfast', '08:00 AM', true),
            const SizedBox(height: 8),
            _buildMedicationTile(context, 'Cap Amoxicillin 250mg', '1 Capsule after lunch', '02:00 PM', false),

            const SizedBox(height: 24),

            // Real-Time Socket Notifications
            if (socket.notifications.isNotEmpty) ...[
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('Ecosystem Live Feeds', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.2), borderRadius: BorderRadius.circular(10)),
                    child: Text('${socket.notifications.length} Live Alerts', style: const TextStyle(color: AppColors.primaryLight, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: socket.notifications.length,
                itemBuilder: (context, index) {
                  final notif = socket.notifications[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 8),
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.notifications_active_outlined, color: AppColors.primary, size: 18),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                notif['title'] ?? notif['message'] ?? 'Ecosystem Signal',
                                style: const TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.bold),
                              ),
                              if (notif['message'] != null && notif['title'] != null)
                                Text(
                                  notif['message'],
                                  style: const TextStyle(color: AppColors.textSecondary, fontSize: 11),
                                ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  );
                },
              ),
            ],
          ],
        ),
      ),
    );
  }

  void _triggerEmergencySOS(BuildContext context, SocketService socket) {
    socket.emitEvent('emergency_sos', {
      'patient': 'Rahul Sharma',
      'location': 'Sector 14, City Center (GPS: 28.6139, 77.2090)',
      'condition': 'Severe Cardiac Discomfort',
      'timestamp': DateTime.now().toIso8601String(),
    });

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.accentRose)),
        title: Row(
          children: const [
            Icon(Icons.warning_amber_rounded, color: AppColors.accentRose, size: 28),
            SizedBox(width: 10),
            Text('🚨 Emergency SOS Dispatched', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            Text('Live Triangulation Active:', style: TextStyle(color: AppColors.primaryLight, fontSize: 12, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text('• Ambulance Fleet: ALS Ambulance #04 Dispatched (ETA: 5 mins)', style: TextStyle(color: Colors.white, fontSize: 12)),
            Text('• Nearby Hospital: AIIMS Trauma Bay Pre-Notified', style: TextStyle(color: Colors.white, fontSize: 12)),
            Text('• Blood Bank Sync: O -ve Units Reserved', style: TextStyle(color: Colors.white, fontSize: 12)),
            Text('• Family Contacts: SMS payload sent with live GPS coordinates', style: TextStyle(color: Colors.white, fontSize: 12)),
          ],
        ),
        actions: [
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('OK, Track Dispatch'),
            onPressed: () => Navigator.pop(ctx),
          ),
        ],
      ),
    );
  }

  void _showBedReservationModal(BuildContext context, SocketService socket) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20), side: const BorderSide(color: AppColors.glassBorder)),
        title: const Text('Reserve Emergency Hospital Bed', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Select Bed Type:', style: TextStyle(color: AppColors.textSecondary, fontSize: 12)),
            const SizedBox(height: 10),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentEmerald, minimumSize: const Size(double.infinity, 40)),
              child: const Text('Normal Bed (42 Avail)'),
              onPressed: () {
                socket.emitEvent('bed_reservation', {'type': 'NORMAL', 'patient': 'Rahul Sharma'});
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Normal Bed Pre-Reserved! Token generated.')));
              },
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentAmber, minimumSize: const Size(double.infinity, 40)),
              child: const Text('Oxygen Bed (18 Avail)'),
              onPressed: () {
                socket.emitEvent('bed_reservation', {'type': 'OXYGEN', 'patient': 'Rahul Sharma'});
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Oxygen Bed Pre-Reserved! Hospital notified.')));
              },
            ),
            const SizedBox(height: 8),
            ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentRose, minimumSize: const Size(double.infinity, 40)),
              child: const Text('ICU Bed (5 Avail)'),
              onPressed: () {
                socket.emitEvent('bed_reservation', {'type': 'ICU', 'patient': 'Rahul Sharma'});
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('ICU Bed Reserved! Critical bay alert sent.')));
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBedCard(String title, String subtitle, Color color, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: color.withOpacity(0.4)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 20),
            const SizedBox(height: 6),
            Text(title, style: const TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
            const SizedBox(height: 2),
            Text(subtitle, style: TextStyle(color: color, fontSize: 9.5, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildMedicationTile(BuildContext context, String medName, String dosage, String timeStr, bool taken) {
    return StatefulBuilder(
      builder: (context, setState) {
        return Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.glassBorder),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(color: AppColors.primary.withOpacity(0.15), borderRadius: BorderRadius.circular(10)),
                    child: const Icon(Icons.medication_rounded, color: AppColors.primary, size: 20),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(medName, style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold)),
                      Text('$dosage • $timeStr', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
                    ],
                  ),
                ],
              ),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: taken ? AppColors.accentEmerald : AppColors.primary,
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  minimumSize: Size.zero,
                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                ),
                child: Text(taken ? 'Dose Taken ✓' : 'Take Dose', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                onPressed: () {
                  setState(() {
                    taken = !taken;
                  });
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildVitalTile(String title, String val, String unit, String badgeText, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(icon, size: 15, color: color),
                  const SizedBox(width: 6),
                  Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5, fontWeight: FontWeight.w600)),
                ],
              ),
            ],
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(val, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
              const SizedBox(width: 4),
              Text(unit, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(6),
            ),
            child: Text(badgeText, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
