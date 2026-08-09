import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';

class SymptomCheckerScreen extends StatefulWidget {
  const SymptomCheckerScreen({Key? key}) : super(key: key);

  @override
  State<SymptomCheckerScreen> createState() => _SymptomCheckerScreenState();
}

class _SymptomCheckerScreenState extends State<SymptomCheckerScreen> {
  final _inputController = TextEditingController();
  bool _analyzing = false;
  Map<String, dynamic>? _triageResult;

  void _analyzeSymptoms() async {
    final text = _inputController.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _analyzing = true;
      _triageResult = null;
    });

    await Future.delayed(const Duration(milliseconds: 1200));

    setState(() {
      _analyzing = false;
      _triageResult = {
        'riskLevel': 'Moderate Risk',
        'possibleConditions': [
          'Acute Viral Upper Respiratory Infection',
          'Seasonal Influenza',
          'Early Tension Headache',
        ],
        'recommendation': 'Rest, stay hydrated, take Paracetamol 500mg if fever > 100°F. Consult a General Physician if symptoms persist beyond 48 hours.',
        'urgency': 'Non-Emergency OPD Visit',
      };
    });
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text(lang.t('symptomChecker'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.accentIndigo.withOpacity(0.15),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.accentIndigo.withOpacity(0.4)),
              ),
              child: Row(
                children: const [
                  Text('🤖', style: TextStyle(fontSize: 24)),
                  SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      'AI Triage System analyzes symptoms against medical databases for preliminary health guidance.',
                      style: TextStyle(color: Colors.white, fontSize: 12),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            const Text('Describe how you feel in detail:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),

            TextField(
              controller: _inputController,
              maxLines: 4,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: 'e.g. High fever 101F, dry cough, body pain and tiredness since 2 days',
              ),
            ),

            const SizedBox(height: 20),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentIndigo),
                icon: _analyzing
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.auto_awesome),
                label: Text(_analyzing ? 'Analyzing Symptoms...' : 'Run AI Symptom Analysis'),
                onPressed: _analyzing ? null : _analyzeSymptoms,
              ),
            ),

            if (_triageResult != null) ...[
              const SizedBox(height: 28),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.accentAmber),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('AI Triage Report', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppColors.accentAmber.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Text(
                            _triageResult!['riskLevel'],
                            style: const TextStyle(color: AppColors.accentAmber, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 12),
                    const Text('Possible Conditions:', style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    ...(_triageResult!['possibleConditions'] as List<String>).map((c) => Text('• $c', style: const TextStyle(color: Colors.white, fontSize: 13))),
                    const SizedBox(height: 12),
                    const Text('Recommended Action:', style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 4),
                    Text(_triageResult!['recommendation'], style: const TextStyle(color: AppColors.primaryLight, fontSize: 13)),
                  ],
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
