import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';

class CreatePrescriptionScreen extends StatefulWidget {
  const CreatePrescriptionScreen({Key? key}) : super(key: key);

  @override
  State<CreatePrescriptionScreen> createState() => _CreatePrescriptionScreenState();
}

class _CreatePrescriptionScreenState extends State<CreatePrescriptionScreen> {
  final _patientNameController = TextEditingController(text: 'Rahul Sharma');
  final _diagnosisController = TextEditingController();
  final _medNameController = TextEditingController();
  final _dosageController = TextEditingController();
  final _durationController = TextEditingController();

  final List<Map<String, String>> _medications = [];
  bool _isSubmitting = false;

  void _addMedication() {
    final name = _medNameController.text.trim();
    final dosage = _dosageController.text.trim();
    final duration = _durationController.text.trim();

    if (name.isNotEmpty && dosage.isNotEmpty) {
      setState(() {
        _medications.add({
          'name': name,
          'dosage': dosage,
          'duration': duration.isEmpty ? '5 Days' : duration,
        });
        _medNameController.clear();
        _dosageController.clear();
        _durationController.clear();
      });
    }
  }

  void _issuePrescription() async {
    if (_diagnosisController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter clinical diagnosis'), backgroundColor: AppColors.accentRose),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(milliseconds: 1000));
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('📜 Digital Rx issued & synced to ABHA Vault & Pharmacy Network'),
          backgroundColor: AppColors.accentEmerald,
        ),
      );
      Navigator.pop(context);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text(lang.t('createPrescription'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Patient Information', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            TextField(
              controller: _patientNameController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(labelText: 'Patient Name / ABHA ID'),
            ),
            const SizedBox(height: 16),

            const Text('Clinical Diagnosis', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            TextField(
              controller: _diagnosisController,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(hintText: 'e.g. Acute Pharyngitis, Fever'),
            ),
            const SizedBox(height: 24),

            const Text('Add Prescribed Medicines', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 12),

            Row(
              children: [
                Expanded(
                  flex: 2,
                  child: TextField(
                    controller: _medNameController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(hintText: 'Medicine (e.g. Paracetamol)'),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: TextField(
                    controller: _dosageController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(hintText: 'Dosage (500mg)'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _durationController,
                    style: const TextStyle(color: Colors.white),
                    decoration: const InputDecoration(hintText: 'Duration (e.g. 5 Days, 1-0-1)'),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                  onPressed: _addMedication,
                  child: const Text('Add'),
                ),
              ],
            ),

            const SizedBox(height: 16),

            if (_medications.isNotEmpty) ...[
              const Text('Prescribed Rx Items:', style: TextStyle(color: AppColors.textSecondary, fontSize: 13, fontWeight: FontWeight.bold)),
              const SizedBox(height: 8),
              ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _medications.length,
                itemBuilder: (context, index) {
                  final med = _medications[index];
                  return Container(
                    margin: const EdgeInsets.only(bottom: 6),
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: AppColors.glassBorder),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text('${med['name']} (${med['dosage']})', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
                        Text('${med['duration']}', style: const TextStyle(color: AppColors.primaryLight, fontSize: 12)),
                      ],
                    ),
                  );
                },
              ),
            ],

            const SizedBox(height: 32),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(backgroundColor: AppColors.accentEmerald),
                icon: _isSubmitting
                    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Icon(Icons.send),
                label: Text(_isSubmitting ? 'Signing & Transmitting Rx...' : 'Sign & Issue Digital Rx'),
                onPressed: _isSubmitting ? null : _issuePrescription,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
