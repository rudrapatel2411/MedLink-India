import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../core/services/socket_service.dart';
import '../../core/theme/app_theme.dart';

class InsuranceDashboard extends StatefulWidget {
  const InsuranceDashboard({Key? key}) : super(key: key);

  @override
  State<InsuranceDashboard> createState() => _InsuranceDashboardState();
}

class _InsuranceDashboardState extends State<InsuranceDashboard> {
  final List<Map<String, String>> _claims = [
    {'id': 'CLM-88401', 'hospital': 'Apollo Hospital', 'patient': 'Rahul Sharma', 'amount': '₹ 75,000', 'status': 'Approved'},
    {'id': 'CLM-88402', 'hospital': 'Fortis Healthcare', 'patient': 'Suresh Kumar', 'amount': '₹ 1,20,000', 'status': 'Under Verification'},
    {'id': 'CLM-88403', 'hospital': 'AIIMS Trauma', 'patient': 'Sunita Rao', 'amount': '₹ 45,000', 'status': 'Under Verification'},
  ];

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
            const Text('📜 ', style: TextStyle(fontSize: 20)),
            Text(lang.t('role_INSURANCE_TPA'), style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
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
            Row(
              children: [
                Expanded(child: _buildMetric('Claims Pre-Auth', '₹ 4.8L', AppColors.accentIndigo)),
                const SizedBox(width: 10),
                Expanded(child: _buildMetric('ABHA Cashless', '98.2%', AppColors.accentEmerald)),
              ],
            ),
            const SizedBox(height: 20),

            // Automated Fraud Engine Banner
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.primary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.primary.withOpacity(0.4)),
              ),
              child: Row(
                children: const [
                  Icon(Icons.verified_user_rounded, color: AppColors.primaryLight, size: 24),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'AI FRAUD ENGINE: 0 Fraud Flags detected across active ABHA pre-authorizations.',
                      style: TextStyle(color: Colors.white, fontSize: 11.5, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            Text('ABHA Cashless Pre-Authorization Claims', style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _claims.length,
              separatorBuilder: (context, index) => const SizedBox(height: 10),
              itemBuilder: (context, index) {
                final claim = _claims[index];
                final isApproved = claim['status'] == 'Approved';

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
                          Text('${claim['id']} - ${claim['amount']}', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13.5)),
                          const SizedBox(height: 2),
                          Text('${claim['patient']} (${claim['hospital']})', style: const TextStyle(color: AppColors.textSecondary, fontSize: 11.5)),
                        ],
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: isApproved ? AppColors.accentEmerald : AppColors.primary,
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        ),
                        child: Text(isApproved ? 'Approved ✓' : 'Approve Claim', style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold)),
                        onPressed: isApproved
                            ? null
                            : () {
                                setState(() {
                                  claim['status'] = 'Approved';
                                });
                                socket.emitEvent('claim_updated', {
                                  'title': 'Cashless Claim Approved',
                                  'message': 'Claim ${claim['id']} (${claim['amount']}) pre-authorized for ${claim['patient']}.',
                                });
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(content: Text('✅ Claim ${claim['id']} Cashless Pre-Authorized!')),
                                );
                              },
                      ),
                    ],
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String title, String val, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 12)),
          const SizedBox(height: 4),
          Text(val, style: TextStyle(color: color, fontSize: 24, fontWeight: FontWeight.bold)),
        ],
      ),
    );
  }
}
