import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../services/socket_service.dart';
import '../theme/app_theme.dart';

class MobileScaffold extends StatelessWidget {
  final Widget body;
  final String title;
  final Widget? bottomNavigationBar;

  const MobileScaffold({
    Key? key,
    required this.body,
    this.title = 'MedLink India',
    this.bottomNavigationBar,
  }) : super(key: key);

  static const List<Map<String, String>> roles = [
    {'key': 'PATIENT', 'name': 'Citizen / Patient', 'emoji': '🧑'},
    {'key': 'DOCTOR', 'name': 'Doctor / Practitioner', 'emoji': '👨‍⚕️'},
    {'key': 'HOSPITAL_ADMIN', 'name': 'Hospital Management', 'emoji': '🏥'},
    {'key': 'LAB_TECHNICIAN', 'name': 'Diagnostic Lab', 'emoji': '🧪'},
    {'key': 'PHARMACIST', 'name': 'E-Pharmacy Supply', 'emoji': '💊'},
    {'key': 'AMBULANCE_DRIVER', 'name': 'Ambulance Fleet', 'emoji': '🚑'},
    {'key': 'BLOOD_BANK_MANAGER', 'name': 'Blood Bank Radar', 'emoji': '🩸'},
    {'key': 'INSURANCE_TPA', 'name': 'Insurance TPA', 'emoji': '📜'},
    {'key': 'GOVT_OFFICIAL', 'name': 'Government Health', 'emoji': '🏛️'},
    {'key': 'SUPER_ADMIN', 'name': 'Super Admin Console', 'emoji': '🛡️'},
  ];

  void _showRolePicker(BuildContext context) {
    HapticFeedback.selectionClick();
    final auth = Provider.of<AuthProvider>(context, listen: false);

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.textMuted,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: const [
                  Text(
                    '⚡ Switch Ecosystem Role (Demo)',
                    style: TextStyle(
                      color: AppColors.textPrimary,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Icon(Icons.swap_horiz_rounded, color: AppColors.primary),
                ],
              ),
              const SizedBox(height: 12),
              Flexible(
                child: ListView.separated(
                  shrinkWrap: true,
                  itemCount: roles.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 8),
                  itemBuilder: (context, index) {
                    final role = roles[index];
                    final isSelected = auth.user?.role == role['key'];
                    return InkWell(
                      onTap: () {
                        HapticFeedback.mediumImpact();
                        auth.switchDemoRole(role['key']!);
                        Navigator.pop(context);
                      },
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary.withOpacity(0.15) : AppColors.surfaceLight,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? AppColors.primary : AppColors.glassBorder,
                            width: isSelected ? 1.5 : 1,
                          ),
                        ),
                        child: Row(
                          children: [
                            Text(role['emoji']!, style: const TextStyle(fontSize: 20)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                role['name']!,
                                style: TextStyle(
                                  color: isSelected ? AppColors.primaryLight : AppColors.textPrimary,
                                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                  fontSize: 14,
                                ),
                              ),
                            ),
                            if (isSelected)
                              const Icon(Icons.check_circle_rounded, color: AppColors.primary, size: 20),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              const SizedBox(height: 12),
            ],
          ),
        );
      },
    );
  }

  void _showLanguagePicker(BuildContext context) {
    HapticFeedback.selectionClick();
    final lang = Provider.of<LanguageProvider>(context, listen: false);

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.textMuted,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                '🌐 Select Preferred Language',
                style: TextStyle(color: AppColors.textPrimary, fontSize: 16, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 16),
              _buildLangOption(context, lang, 'en', 'English (Default)', '🇬🇧'),
              const SizedBox(height: 10),
              _buildLangOption(context, lang, 'hi', 'हिन्दी (Hindi)', '🇮🇳'),
              const SizedBox(height: 10),
              _buildLangOption(context, lang, 'gu', 'ગુજરાતી (Gujarati)', '🇮🇳'),
              const SizedBox(height: 16),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLangOption(BuildContext context, LanguageProvider lang, String code, String name, String flag) {
    final isSelected = lang.currentLanguage == code;
    return InkWell(
      onTap: () {
        HapticFeedback.mediumImpact();
        lang.setLanguage(code);
        Navigator.pop(context);
      },
      borderRadius: BorderRadius.circular(14),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.primary.withOpacity(0.15) : AppColors.surfaceLight,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.glassBorder,
          ),
        ),
        child: Row(
          children: [
            Text(flag, style: const TextStyle(fontSize: 18)),
            const SizedBox(width: 12),
            Text(
              name,
              style: TextStyle(
                color: isSelected ? AppColors.primaryLight : AppColors.textPrimary,
                fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
              ),
            ),
            const Spacer(),
            if (isSelected) const Icon(Icons.radio_button_checked, color: AppColors.primary, size: 18),
          ],
        ),
      ),
    );
  }

  void _triggerSosModal(BuildContext context) {
    HapticFeedback.heavyImpact();
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return Container(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: BoxDecoration(
                  color: AppColors.accentRose.withOpacity(0.2),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.accentRose, width: 2),
                ),
                child: const Center(
                  child: Text('🚨', style: TextStyle(fontSize: 32)),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'CRITICAL EMERGENCY SOS PANIC',
                style: TextStyle(
                  color: AppColors.accentRose,
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Broadcast live GPS telemetry to nearest Ambulance Dispatch & Hospital ICU ER Teams instantly.',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.textSecondary, fontSize: 13, height: 1.4),
              ),
              const SizedBox(height: 24),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: () => Navigator.pop(context),
                      child: const Text('Cancel', style: TextStyle(color: AppColors.textSecondary)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.accentRose,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                      ),
                      onPressed: () {

                        HapticFeedback.heavyImpact();
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('🚨 EMERGENCY SOS BROADCASTED TO NEARBY FLEET!'),
                            backgroundColor: AppColors.accentRose,
                            duration: Duration(seconds: 4),
                          ),
                        );
                      },
                      child: const Text('DISPATCH SOS NOW', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);
    final lang = Provider.of<LanguageProvider>(context);
    final socket = Provider.of<SocketService>(context);

    final activeRoleObj = roles.firstWhere(
      (r) => r['key'] == (auth.user?.role ?? 'PATIENT'),
      orElse: () => roles.first,
    );

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        centerTitle: false,
        title: Row(
          children: [
            Container(
              width: 32,
              height: 32,
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(9),
                border: Border.all(color: AppColors.primary.withOpacity(0.4)),
              ),
              child: const Center(child: Text('🏥', style: TextStyle(fontSize: 16))),
            ),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  lang.t('brandName'),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.textPrimary,
                    letterSpacing: -0.3,
                  ),
                ),
                Row(
                  children: [
                    Container(
                      width: 6,
                      height: 6,
                      decoration: BoxDecoration(
                        color: socket.isConnected ? AppColors.accentEmerald : AppColors.accentRose,
                        shape: BoxShape.circle,
                      ),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      socket.isConnected ? 'Socket Live' : 'Connecting...',
                      style: TextStyle(
                        fontSize: 10,
                        color: socket.isConnected ? AppColors.accentEmerald : AppColors.textMuted,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ],
        ),
        actions: [
          // Dynamic Role Switcher Pill
          InkWell(
            onTap: () => _showRolePicker(context),
            borderRadius: BorderRadius.circular(20),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.12),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.primary.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  Text(activeRoleObj['emoji']!, style: const TextStyle(fontSize: 13)),
                  const SizedBox(width: 4),
                  Text(
                    activeRoleObj['key']!.replaceAll('_', ' '),
                    style: const TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.w700),
                  ),
                  const Icon(Icons.arrow_drop_down, color: AppColors.primaryLight, size: 16),
                ],
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.language_rounded, color: AppColors.textSecondary, size: 20),
            onPressed: () => _showLanguagePicker(context),
            tooltip: 'Change Language',
          ),
          IconButton(
            icon: const Icon(Icons.logout_rounded, color: AppColors.textSecondary, size: 20),
            onPressed: () => auth.logout(),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: Stack(
        children: [
          SafeArea(child: body),
          // Live Toast Notification Banner Stack
          if (socket.notifications.isNotEmpty)
            Positioned(
              top: 12,
              left: 16,
              right: 16,
              child: Column(
                children: socket.notifications.take(2).map((n) {
                  Color bg;
                  Color border;
                  switch (n.type) {
                    case 'danger':
                      bg = const Color(0xFF2C0F14);
                      border = AppColors.accentRose;
                      break;
                    case 'warning':
                      bg = const Color(0xFF2C200F);
                      border = AppColors.accentAmber;
                      break;
                    case 'success':
                      bg = const Color(0xFF0F2C23);
                      border = AppColors.accentEmerald;
                      break;
                    default:
                      bg = AppColors.surfaceLight;
                      border = AppColors.primary;
                  }
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                      decoration: BoxDecoration(
                        color: bg,
                        borderRadius: BorderRadius.circular(14),
                        border: Border.all(color: border, width: 1.5),
                        boxShadow: const [
                          BoxShadow(
                            color: Colors.black45,
                            blurRadius: 10,
                            offset: Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  n.title,
                                  style: TextStyle(
                                    color: border,
                                    fontSize: 12,
                                    fontWeight: FontWeight.w800,
                                    letterSpacing: 0.3,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  n.message,
                                  style: const TextStyle(color: AppColors.textPrimary, fontSize: 12.5),
                                ),
                              ],
                            ),
                          ),
                          GestureDetector(
                            onTap: () => socket.dismissNotification(n.id),
                            child: const Icon(Icons.close, color: AppColors.textSecondary, size: 16),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
        ],
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => _triggerSosModal(context),
        backgroundColor: AppColors.accentRose,
        elevation: 6,
        icon: const Text('🚨', style: TextStyle(fontSize: 18)),
        label: const Text(
          '1-TAP SOS',
          style: TextStyle(fontWeight: FontWeight.w800, letterSpacing: 0.8, color: Colors.white, fontSize: 13),
        ),
      ),
      bottomNavigationBar: bottomNavigationBar,
    );
  }
}
