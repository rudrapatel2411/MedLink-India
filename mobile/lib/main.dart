import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/theme/app_theme.dart';
import 'providers/auth_provider.dart';
import 'providers/language_provider.dart';
import 'core/services/socket_service.dart';
import 'screens/auth/login_screen.dart';
import 'screens/panels/patient_dashboard.dart';
import 'screens/panels/doctor_dashboard.dart';
import 'screens/panels/hospital_dashboard.dart';
import 'screens/panels/lab_dashboard.dart';
import 'screens/panels/pharmacy_dashboard.dart';
import 'screens/panels/ambulance_dashboard.dart';
import 'screens/panels/blood_bank_dashboard.dart';
import 'screens/panels/insurance_dashboard.dart';
import 'screens/panels/govt_dashboard.dart';
import 'screens/panels/admin_dashboard.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  GoogleFonts.config.allowRuntimeFetching = true;
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => AuthProvider()),
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => SocketService()),
      ],
      child: const MedLinkApp(),
    ),
  );
}

class MedLinkApp extends StatelessWidget {
  const MedLinkApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MedLink India',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatefulWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  State<AuthWrapper> createState() => _AuthWrapperState();
}

class _AuthWrapperState extends State<AuthWrapper> {
  @override
  void initState() {
    super.initState();
    // Initialize Socket Connection
    WidgetsBinding.instance.addPostFrameCallback((_) {
      Provider.of<SocketService>(context, listen: false).initSocket();
    });
  }

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (!auth.isAuthenticated) {
      return const LoginScreen();
    }

    final role = auth.user?.role ?? 'PATIENT';

    switch (role) {
      case 'DOCTOR':
        return const DoctorDashboard();
      case 'HOSPITAL_ADMIN':
        return const HospitalDashboard();
      case 'LAB_TECHNICIAN':
        return const LabDashboard();
      case 'PHARMACIST':
        return const PharmacyDashboard();
      case 'AMBULANCE_DRIVER':
        return const AmbulanceDashboard();
      case 'BLOOD_BANK_MANAGER':
        return const BloodBankDashboard();
      case 'INSURANCE_TPA':
        return const InsuranceDashboard();
      case 'GOVT_OFFICIAL':
        return const GovtDashboard();
      case 'SUPER_ADMIN':
        return const AdminDashboard();
      case 'PATIENT':
      default:
        return const PatientDashboard();
    }
  }
}
