class ApiConstants {
  // Configurable base URL (Defaults to localhost for development/emulator)
  static const String baseUrl = 'http://10.0.2.2:5000/api'; // Android Emulator default, or 127.0.0.1
  static const String socketUrl = 'http://10.0.2.2:5000';

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
