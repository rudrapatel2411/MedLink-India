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
    {'roleKey': 'role_PATIENT', 'icon': '🧑', 'email': 'patient@gmail.com', 'badge': 'Patient'},
    {'roleKey': 'role_DOCTOR', 'icon': '👨‍⚕️', 'email': 'doctor@gmail.com', 'badge': 'practitioner'},
    {'roleKey': 'role_HOSPITAL_ADMIN', 'icon': '🏥', 'email': 'hospital@gmail.com', 'badge': 'Hospital'},
    {'roleKey': 'role_LAB_TECHNICIAN', 'icon': '🧪', 'email': 'lab@gmail.com', 'badge': 'Diagnostics'},
    {'roleKey': 'role_PHARMACIST', 'icon': '💊', 'email': 'pharmacy@gmail.com', 'badge': 'Pharma'},
    {'roleKey': 'role_AMBULANCE_DRIVER', 'icon': '🚑', 'email': 'ambulance@gmail.com', 'badge': 'Emergency'},
    {'roleKey': 'role_BLOOD_BANK_MANAGER', 'icon': '🩸', 'email': 'bloodbank@gmail.com', 'badge': 'Blood Bank'},
    {'roleKey': 'role_INSURANCE_TPA', 'icon': '📜', 'email': 'insurance@gmail.com', 'badge': 'Insurance'},
    {'roleKey': 'role_GOVT_OFFICIAL', 'icon': '🏛️', 'email': 'govt@gmail.com', 'badge': 'Govt Health'},
    {'roleKey': 'role_SUPER_ADMIN', 'icon': '🛡️', 'email': 'admin@medlink.in', 'badge': 'Super Admin'},
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
            padding: const EdgeInsets.symmetric(horizontal: 20.0, vertical: 24.0),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Top Language Switcher Bar
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.primary.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: const [
                            Icon(Icons.shield_outlined, size: 13, color: AppColors.primaryLight),
                            SizedBox(width: 5),
                            Text('ABHA Compliant', style: TextStyle(color: AppColors.primaryLight, fontSize: 11, fontWeight: FontWeight.w700)),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(20),
                          border: Border.all(color: AppColors.glassBorder),
                        ),
                        child: DropdownButtonHideUnderline(
                          child: DropdownButton<String>(
                            value: lang.currentLanguage,
                            dropdownColor: AppColors.surface,
                            isDense: true,
                            items: const [
                              DropdownMenuItem(value: 'en', child: Text('🌐 EN', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600))),
                              DropdownMenuItem(value: 'hi', child: Text('🇮🇳 हिंदी', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600))),
                              DropdownMenuItem(value: 'gu', child: Text('🇮🇳 ગુજરાતી', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600))),
                            ],
                            onChanged: (val) {
                              if (val != null) lang.setLanguage(val);
                            },
                          ),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 28),

                  // Brand Hero Header
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: RadialGradient(
                            colors: [
                              AppColors.primary.withOpacity(0.35),
                              Colors.transparent,
                            ],
                          ),
                        ),
                      ),
                      Container(
                        width: 68,
                        height: 68,
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          shape: BoxShape.circle,
                          border: Border.all(color: AppColors.primary.withOpacity(0.5), width: 1.5),
                          boxShadow: [
                            BoxShadow(
                              color: AppColors.primary.withOpacity(0.25),
                              blurRadius: 16,
                              spreadRadius: 2,
                            ),
                          ],
                        ),
                        child: const Center(
                          child: Text('🏥', style: TextStyle(fontSize: 32)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 14),
                  Text(
                    lang.t('brandName'),
                    style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800, letterSpacing: -0.5, color: Colors.white),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    lang.t('tagline'),
                    style: const TextStyle(fontSize: 13, color: AppColors.textSecondary, letterSpacing: 0.2),
                  ),

                  const SizedBox(height: 32),

                  // Main Login Form Card
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.glassBorder),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.2),
                          blurRadius: 20,
                          offset: const Offset(0, 10),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Sign in to your account', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 15)),
                        const SizedBox(height: 16),

                        // Email Field
                        TextField(
                          controller: _emailController,
                          keyboardType: TextInputType.emailAddress,
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                          decoration: InputDecoration(
                            labelText: lang.t('emailAddress'),
                            hintText: lang.t('enterEmail'),
                            prefixIcon: const Icon(Icons.mail_outline_rounded, color: AppColors.primary, size: 20),
                          ),
                        ),
                        const SizedBox(height: 14),

                        // Password Field
                        TextField(
                          controller: _passwordController,
                          obscureText: _obscurePassword,
                          style: const TextStyle(color: Colors.white, fontSize: 14),
                          decoration: InputDecoration(
                            labelText: lang.t('password'),
                            hintText: lang.t('enterPassword'),
                            prefixIcon: const Icon(Icons.lock_outline_rounded, color: AppColors.primary, size: 20),
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

                        const SizedBox(height: 20),

                        // Sign In Button
                        SizedBox(
                          width: double.infinity,
                          height: 48,
                          child: ElevatedButton(
                            onPressed: auth.isLoading ? null : _handleLogin,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                            ),
                            child: auth.isLoading
                                ? const SizedBox(
                                    width: 22,
                                    height: 22,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(lang.t('signIn')),
                                      const SizedBox(width: 8),
                                      const Icon(Icons.arrow_forward_rounded, size: 18),
                                    ],
                                  ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 18),

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
                        child: Text(lang.t('register'), style: const TextStyle(color: AppColors.primaryLight, fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Quick Demo Login Grid Section
                  Row(
                    children: const [
                      Expanded(child: Divider(color: AppColors.glassBorder)),
                      Padding(
                        padding: EdgeInsets.symmetric(horizontal: 12),
                        child: Text('1-CLICK DEMO ACCESS', style: TextStyle(color: AppColors.textMuted, fontSize: 10, fontWeight: FontWeight.w800, letterSpacing: 1.0)),
                      ),
                      Expanded(child: Divider(color: AppColors.glassBorder)),
                    ],
                  ),
                  const SizedBox(height: 16),

                  GridView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 10,
                      mainAxisSpacing: 10,
                      childAspectRatio: 2.5,
                    ),
                    itemCount: demoAccounts.length,
                    itemBuilder: (context, index) {
                      final demo = demoAccounts[index];
                      final roleTitle = lang.t(demo['roleKey']!);
                      return InkWell(
                        onTap: auth.isLoading ? null : () => _quickDemoLogin(demo['email']!),
                        borderRadius: BorderRadius.circular(12),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.glassBorder),
                          ),
                          child: Row(
                            children: [
                              Text(demo['icon']!, style: const TextStyle(fontSize: 18)),
                              const SizedBox(width: 8),
                              Expanded(
                                child: Column(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      roleTitle,
                                      style: const TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.w700),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                    Text(
                                      demo['badge']!,
                                      style: const TextStyle(color: AppColors.textSecondary, fontSize: 9.5),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
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
