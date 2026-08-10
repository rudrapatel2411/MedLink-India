import 'package:flutter/foundation.dart';

class ApiConstants {
  // Configurable base URL (Auto-selects localhost for web/desktop and 10.0.2.2 for Android emulator)
  static String get baseUrl {
    if (kIsWeb) return 'http://localhost:5000/api/v1';
    return defaultTargetPlatform == TargetPlatform.android
        ? 'http://10.0.2.2:5000/api/v1'
        : 'http://localhost:5000/api/v1';
  }

  static String get socketUrl {
    if (kIsWeb) return 'http://localhost:5000';
    return defaultTargetPlatform == TargetPlatform.android
        ? 'http://10.0.2.2:5000'
        : 'http://localhost:5000';
  }

  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String me = '/auth/me';

  // Patient endpoints
  static const String patientDashboard = '/patient/dashboard';
  static const String bookAppointment = '/patient/appointments';
  static const String doctorsList = '/patient/doctors';

  // Doctor endpoints
  static const String doctorDashboard = '/doctor/dashboard';
  static const String createPrescription = '/doctor/prescriptions';

  // Panel endpoints
  static const String hospitalDashboard = '/hospital/dashboard';
  static const String labDashboard = '/lab/dashboard';
  static const String pharmacyDashboard = '/pharmacy/dashboard';
  static const String ambulanceDashboard = '/ambulance/dashboard';
  static const String bloodBankDashboard = '/bloodbank/dashboard';
  static const String insuranceDashboard = '/insurance/dashboard';
  static const String govtDashboard = '/govt/dashboard';
  static const String adminDashboard = '/admin/dashboard';
}
