import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';

class RegisterScreen extends StatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  State<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  String _selectedRole = 'PATIENT';
  bool _obscurePassword = true;

  final List<Map<String, String>> roles = [
    {'key': 'role_PATIENT', 'value': 'PATIENT', 'icon': '🧑'},
    {'key': 'role_DOCTOR', 'value': 'DOCTOR', 'icon': '👨‍⚕️'},
    {'key': 'role_HOSPITAL_ADMIN', 'value': 'HOSPITAL_ADMIN', 'icon': '🏥'},
    {'key': 'role_LAB_TECHNICIAN', 'value': 'LAB_TECHNICIAN', 'icon': '🧪'},
    {'key': 'role_PHARMACIST', 'value': 'PHARMACIST', 'icon': '💊'},
    {'key': 'role_AMBULANCE_DRIVER', 'value': 'AMBULANCE_DRIVER', 'icon': '🚑'},
    {'key': 'role_BLOOD_BANK_MANAGER', 'value': 'BLOOD_BANK_MANAGER', 'icon': '🩸'},
    {'key': 'role_INSURANCE_TPA', 'value': 'INSURANCE_TPA', 'icon': '📜'},
    {'key': 'role_GOVT_OFFICIAL', 'value': 'GOVT_OFFICIAL', 'icon': '🏛️'},
    {'key': 'role_SUPER_ADMIN', 'value': 'SUPER_ADMIN', 'icon': '🛡️'},
  ];

  void _handleRegister() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.register(
      _emailController.text.trim(),
      _passwordController.text,
      _nameController.text.trim(),
      _selectedRole,
    );
    if (success && mounted) {
      Navigator.pop(context);
    } else if (mounted && auth.error != null) {
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
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Container(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    lang.t('register'),
                    style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Join MedLink India Ecosystem',
                    style: const TextStyle(fontSize: 14, color: AppColors.textSecondary),
                  ),

                  const SizedBox(height: 28),

                  // Full Name
                  TextField(
                    controller: _nameController,
                    style: const TextStyle(color: Colors.white),
                    decoration: InputDecoration(
                      labelText: lang.t('fullName'),
                      hintText: lang.t('enterFullName'),
                      prefixIcon: const Icon(Icons.person_outline, color: AppColors.textSecondary, size: 20),
                    ),
                  ),
                  const SizedBox(height: 16),

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
                  const SizedBox(height: 16),

                  // Role Selection Dropdown
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.glassBorder),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedRole,
                        isExpanded: true,
                        dropdownColor: AppColors.surface,
                        items: roles.map((r) {
                          return DropdownMenuItem<String>(
                            value: r['value'],
                            child: Row(
                              children: [
                                Text(r['icon']!, style: const TextStyle(fontSize: 18)),
                                const SizedBox(width: 10),
                                Text(
                                  lang.t(r['key']!),
                                  style: const TextStyle(color: Colors.white, fontSize: 14),
                                ),
                              ],
                            ),
                          );
                        }).toList(),
                        onChanged: (val) {
                          if (val != null) {
                            setState(() {
                              _selectedRole = val;
                            });
                          }
                        },
                      ),
                    ),
                  ),

                  const SizedBox(height: 28),

                  // Create Account Button
                  SizedBox(
                    width: double.infinity,
                    height: 48,
                    child: ElevatedButton(
                      onPressed: auth.isLoading ? null : _handleRegister,
                      child: auth.isLoading
                          ? const SizedBox(
                              width: 24,
                              height: 24,
                              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                            )
                          : Text(lang.t('register')),
                    ),
                  ),

                  const SizedBox(height: 16),

                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(lang.t('alreadyHaveAccount'), style: const TextStyle(color: AppColors.textSecondary, fontSize: 13)),
                      TextButton(
                        onPressed: () => Navigator.pop(context),
                        child: Text(lang.t('signIn'), style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 13)),
                      ),
                    ],
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
