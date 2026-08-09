import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';
import 'register_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  final List<Map<String, String>> demoAccounts = [
    {'roleKey': 'role_PATIENT', 'icon': '🧑', 'email': 'patient@gmail.com'},
    {'roleKey': 'role_DOCTOR', 'icon': '👨‍⚕️', 'email': 'doctor@gmail.com'},
    {'roleKey': 'role_HOSPITAL_ADMIN', 'icon': '🏥', 'email': 'hospital@gmail.com'},
    {'roleKey': 'role_LAB_TECHNICIAN', 'icon': '🧪', 'email': 'lab@gmail.com'},
    {'roleKey': 'role_PHARMACIST', 'icon': '💊', 'email': 'pharmacy@gmail.com'},
    {'roleKey': 'role_AMBULANCE_DRIVER', 'icon': '🚑', 'email': 'ambulance@gmail.com'},
    {'roleKey': 'role_BLOOD_BANK_MANAGER', 'icon': '🩸', 'email': 'bloodbank@gmail.com'},
    {'roleKey': 'role_INSURANCE_TPA', 'icon': '📜', 'email': 'insurance@gmail.com'},
    {'roleKey': 'role_GOVT_OFFICIAL', 'icon': '🏛️', 'email': 'govt@gmail.com'},
    {'roleKey': 'role_SUPER_ADMIN', 'icon': '🛡️', 'email': 'admin@medlink.in'},
  ];

  void _handleLogin() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(
      _emailController.text.trim(),
      _passwordController.text,
    );
    if (!success && mounted && auth.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.error!),
          backgroundColor: AppColors.accentRose,
        ),
      );
    }
  }

  void _quickDemoLogin(String email) async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(email, 'password123');
    if (!success && mounted && auth.error != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(auth.error!),
          backgroundColor: AppColors.accentRose,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Language Selector Bar
                  Align(
                    alignment: Alignment.centerRight,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.glassBorder),
                      ),
                      child: DropdownButton<String>(
                        value: lang.currentLanguage,
                        underline: const SizedBox(),
                        dropdownColor: AppColors.surface,
                        isDense: true,
                        items: const [
                          DropdownMenuItem(value: 'en', child: Text('🌐 English', style: TextStyle(fontSize: 13))),
                          DropdownMenuItem(value: 'hi', child: Text('🇮🇳 हिंदी', style: TextStyle(fontSize: 13))),
                          DropdownMenuItem(value: 'gu', child: Text('🇮🇳 ગુજરાતી', style: TextStyle(fontSize: 13))),
                        ],
                        onChanged: (val) {
                          if (val != null) lang.setLanguage(val);
                        },
                      ),
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Brand Icon & Title
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withOpacity(0.15),
                      shape: BoxShape.circle,
                      border: Border.all(color: AppColors.primary.withOpacity(0.4), width: 2),
                    ),
                    child: const Center(
                      child: Text('🏥', style: TextStyle(fontSize: 36)),
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    lang.t('brandName'),
                    style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  Text(
                    lang.t('tagline'),
                    style: const TextStyle(fontSize: 14, color: AppColors.textSecondary),
                  ),

                  const SizedBox(height: 32),

                  // Email Field
                  TextField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      labelText: lang.t('emailAddress'),
                      hintText: lang.t('enterEmail'),
                      prefixIcon: const Icon(Icons.email_outlined, color: AppColors.textSecondary, size: 20),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Password Field
                  TextField(
                    controller: _passwordController,
                    obscureText: _obscurePassword,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      labelText: lang.t('password'),
                      hintText: lang.t('enterPassword'),
                      prefixIcon: const Icon(Icons.lock_outline, color: AppColors.textSecondary, size: 20),
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                          color: AppColors.textSecondary,
                          size: 20,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Sign In Button
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: auth.isLoading ? null : _handleLogin,
                      child: auth.isLoading
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : Text(lang.t('signIn')),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(lang.t('dontHaveAccount'), style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                      TextButton(
                        onPressed: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(builder: (context) => const RegisterScreen()),
                          );
                        },
                        child: Text(lang.t('register'), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),
                  const Divider(color: AppColors.glassBorder),
                  const SizedBox(height: 16),

                  // Quick Demo Logins Section
                  Text(
                    lang.t('directPanelLogin'),
                    style: const TextStyle(
                      color: AppColors.primaryLight,
                      fontSize: 12,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 0.5,
                    ),
                  ),
                  const SizedBox(height: 12),

                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: demoAccounts.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final demo = demoAccounts[index];
                      final roleTitle = lang.t(demo['roleKey']!);
                      return OutlinedButton(
                        style: OutlinedButton.styleFrom(
                          side: const BorderSide(color: AppColors.glassBorder),
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                          backgroundColor: AppColors.surface.withOpacity(0.5),
                        ),
                        onPressed: auth.isLoading ? null : () => _quickDemoLogin(demo['email']!),
                        child: Row(
                          children: [
                            Text(demo['icon']!, style: const TextStyle(fontSize: 16)),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                roleTitle,
                                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios, size: 12, color: AppColors.textMuted),
                          ],
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
