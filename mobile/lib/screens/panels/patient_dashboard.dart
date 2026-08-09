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

            // Real-Time Socket Notifications
            if (socket.notifications.isNotEmpty) ...[
              const Text('Ecosystem Live Feeds', style: TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.w700)),
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
                          child: Text(
                            notif['message'] ?? 'System notification',
                            style: const TextStyle(color: Colors.white, fontSize: 12.5),
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
              Text(val, style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
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
