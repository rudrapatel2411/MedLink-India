import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/language_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../core/services/api_service.dart';
import '../../core/constants/api_constants.dart';

class BookAppointmentScreen extends StatefulWidget {
  const BookAppointmentScreen({Key? key}) : super(key: key);

  @override
  State<BookAppointmentScreen> createState() => _BookAppointmentScreenState();
}

class _BookAppointmentScreenState extends State<BookAppointmentScreen> {
  final _reasonController = TextEditingController();
  String _selectedDoctor = 'Dr. Rajesh Mehta (Cardiologist)';
  String _selectedTimeSlot = '10:00 AM - 10:30 AM';
  bool _isSubmitting = false;

  final List<String> doctors = [
    'Dr. Rajesh Mehta (Cardiologist)',
    'Dr. Sunita Sharma (Neurologist)',
    'Dr. Ananya Iyer (General Physician)',
    'Dr. Vikram Patel (Orthopedic Surgeon)',
  ];

  final List<String> slots = [
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '11:15 AM - 11:45 AM',
    '02:00 PM - 02:30 PM',
    '04:30 PM - 05:00 PM',
  ];

  void _submitAppointment() async {
    setState(() => _isSubmitting = true);
    try {
      // Simulate booking
      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎉 Appointment booked successfully! Confirmation sent.'),
            backgroundColor: AppColors.accentEmerald,
          ),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.accentRose),
        );
      }
    } finally {
      if (mounted) setState(() => _isSubmitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);

    return Scaffold(
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        elevation: 0,
        title: Text(lang.t('bookAppointment'), style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Select Doctor & Specialty', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: DropdownButtonHideUnderline(
                child: DropdownButton<String>(
                  value: _selectedDoctor,
                  isExpanded: true,
                  dropdownColor: AppColors.surface,
                  items: doctors.map((doc) {
                    return DropdownMenuItem(
                      value: doc,
                      child: Text(doc, style: const TextStyle(color: Colors.white, fontSize: 13)),
                    );
                  }).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedDoctor = val);
                  },
                ),
              ),
            ),

            const SizedBox(height: 20),

            const Text('Available Time Slots', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: slots.map((slot) {
                final isSelected = _selectedTimeSlot == slot;
                return ChoiceChip(
                  label: Text(slot),
                  selected: isSelected,
                  selectedColor: AppColors.primary,
                  backgroundColor: AppColors.surface,
                  labelStyle: TextStyle(color: isSelected ? Colors.white : AppColors.textSecondary, fontSize: 12),
                  onSelected: (selected) {
                    if (selected) setState(() => _selectedTimeSlot = slot);
                  },
                );
              }).toList(),
            ),

            const SizedBox(height: 20),

            const Text('Chief Symptoms / Reason for Visit', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
            const SizedBox(height: 8),
            TextField(
              controller: _reasonController,
              maxLines: 3,
              style: const TextStyle(color: Colors.white),
              decoration: const InputDecoration(
                hintText: 'e.g. Mild fever since yesterday, headache and sore throat',
              ),
            ),

            const SizedBox(height: 32),

            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: _isSubmitting ? null : _submitAppointment,
                child: _isSubmitting
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Confirm Appointment'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
