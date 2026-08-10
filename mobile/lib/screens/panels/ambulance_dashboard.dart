import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';

class AmbulanceDashboard extends StatefulWidget {
  const AmbulanceDashboard({Key? key}) : super(key: key);

  @override
  State<AmbulanceDashboard> createState() => _AmbulanceDashboardState();
}

class _AmbulanceDashboardState extends State<AmbulanceDashboard> {
  bool _isNavigating = false;
  int _etaMinutes = 6;

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
            const Text('🚑 ', style: TextStyle(fontSize: 20)),
            Text(lang.t('role_AMBULANCE_DRIVER'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
            // Active SOS Emergency Dispatch Banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.accentRose.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.accentRose, width: 1.5),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: const [
                          Icon(Icons.warning_amber_rounded, color: AppColors.accentRose, size: 24),
                          SizedBox(width: 8),
                          Text('ACTIVE EMERGENCY DISPATCH #SOS-108', style: TextStyle(color: AppColors.accentRose, fontWeight: FontWeight.bold, fontSize: 13)),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(color: AppColors.accentRose, borderRadius: BorderRadius.circular(12)),
                        child: Text(_isNavigating ? 'ETA: $_etaMinutes Mins' : 'ON-DISPATCH', style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  const Text('Pickup Location: Sector 14, MG Road, Metro Station Gate 2 (GPS: 28.6139, 77.2090)', style: TextStyle(color: Colors.white, fontSize: 12.5, fontWeight: FontWeight.w600)),
                  const SizedBox(height: 4),
                  const Text('Destination Hospital: City Civil Hospital (ICU Triage Bay #1)', style: TextStyle(color: AppColors.textSecondary, fontSize: 11.5)),
                  const SizedBox(height: 14),
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton.icon(
                          style: ElevatedButton.styleFrom(backgroundColor: _isNavigating ? AppColors.accentEmerald : AppColors.accentRose),
                          icon: const Icon(Icons.navigation_outlined, size: 18),
                          label: Text(_isNavigating ? 'GPS Navigation Live' : 'Start GPS Navigation'),
                          onPressed: () {
                            setState(() {
                              _isNavigating = true;
                            });
                            socket.emitEvent('emergency_sos', {
                              'title': 'Ambulance In-Transit',
                              'message': 'ALS Unit #04 en-route to Sector 14. ETA: 5 mins.',
                            });
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🗺️ Live GPS Navigation Started! Hospital Pre-Notified.')));
                          },
                        ),
                      ),
                      const SizedBox(width: 10),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                        child: const Text('Pre-Notify ER', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                        onPressed: () {
                          socket.emitEvent('notification', {
                            'title': 'Hospital ER Notified',
                            'message': 'Ambulance #04 approaching AIIMS ER in 5 mins with Cardiac patient.',
                          });
                          ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('🔔 ER Trauma Bay Pre-Notified!')));
                        },
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            Text('Vehicle Readiness & Fleet Status', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            _buildFleetTile('Ambulance Unit GJ-01-MD-9912', 'ALS (Advanced Life Support)', 'READY ON-STANDBY', AppColors.accentEmerald),
            const SizedBox(height: 10),
            _buildFleetTile('Ambulance Unit GJ-01-MD-8831', 'BLS (Basic Life Support)', 'IN-TRANSIT', AppColors.accentAmber),
          ],
        ),
      ),
    );
  }

  Widget _buildFleetTile(String name, String type, String status, Color color) {
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
              Text(name, style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              const SizedBox(height: 2),
              Text(type, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: color.withOpacity(0.2), borderRadius: BorderRadius.circular(6)),
            child: Text(status, style: TextStyle(color: color, fontSize: 10, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
