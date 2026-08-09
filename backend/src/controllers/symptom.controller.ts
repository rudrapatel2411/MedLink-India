// MedLink India — AI Symptom Triage Controller
// Smart NLP-based symptom analysis with risk level classification
import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { ApiResponse, ApiError, asyncHandler } from '../utils/ApiResponse';

// ─────────────────────────────────────────────────
// AI Symptom Triage Engine (Rule-Based Mock for Phase 1)
// Will be replaced with PyTorch/Whisper ML model in later phases
// ─────────────────────────────────────────────────

interface TriageResult {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  suggestedAction: string;
  suggestedSpecialty: string;
  possibleConditions: string[];
  urgencyScore: number; // 1-10
  disclaimer: string;
}

const SYMPTOM_DATABASE: Record<string, { risk: number; specialties: string[]; conditions: string[] }> = {
  'chest pain': { risk: 9, specialties: ['Cardiologist', 'Emergency Medicine'], conditions: ['Angina', 'Heart Attack', 'GERD', 'Costochondritis'] },
  'breathing difficulty': { risk: 8, specialties: ['Pulmonologist', 'Emergency Medicine'], conditions: ['Asthma', 'Pneumonia', 'COPD', 'COVID-19'] },
  'severe headache': { risk: 7, specialties: ['Neurologist'], conditions: ['Migraine', 'Tension Headache', 'Cluster Headache', 'Meningitis'] },
  'headache': { risk: 4, specialties: ['General Medicine'], conditions: ['Tension Headache', 'Migraine', 'Sinusitis', 'Dehydration'] },
  'fever': { risk: 5, specialties: ['General Medicine', 'Internal Medicine'], conditions: ['Viral Infection', 'Malaria', 'Dengue', 'Typhoid', 'COVID-19'] },
  'high fever': { risk: 7, specialties: ['Internal Medicine', 'Infectious Disease'], conditions: ['Dengue', 'Malaria', 'Typhoid', 'Sepsis'] },
  'cough': { risk: 3, specialties: ['General Medicine', 'Pulmonologist'], conditions: ['Common Cold', 'Bronchitis', 'Allergies', 'Asthma'] },
  'stomach pain': { risk: 5, specialties: ['Gastroenterologist', 'General Surgery'], conditions: ['Gastritis', 'Appendicitis', 'IBS', 'Ulcer'] },
  'vomiting': { risk: 5, specialties: ['Gastroenterologist', 'General Medicine'], conditions: ['Food Poisoning', 'Gastroenteritis', 'Migraine', 'Pregnancy'] },
  'diarrhea': { risk: 4, specialties: ['Gastroenterologist'], conditions: ['Food Poisoning', 'IBS', 'Cholera', 'Viral Gastroenteritis'] },
  'joint pain': { risk: 3, specialties: ['Orthopedist', 'Rheumatologist'], conditions: ['Arthritis', 'Gout', 'Injury', 'Bursitis'] },
  'back pain': { risk: 3, specialties: ['Orthopedist', 'Physiotherapist'], conditions: ['Muscle Strain', 'Disc Herniation', 'Sciatica', 'Spondylitis'] },
  'skin rash': { risk: 3, specialties: ['Dermatologist'], conditions: ['Eczema', 'Psoriasis', 'Allergic Reaction', 'Fungal Infection'] },
  'eye pain': { risk: 5, specialties: ['Ophthalmologist'], conditions: ['Conjunctivitis', 'Glaucoma', 'Corneal Abrasion', 'Uveitis'] },
  'tooth pain': { risk: 3, specialties: ['Dentist'], conditions: ['Cavity', 'Abscess', 'Gum Disease', 'Wisdom Tooth'] },
  'anxiety': { risk: 4, specialties: ['Psychiatrist', 'Psychologist'], conditions: ['GAD', 'Panic Disorder', 'PTSD', 'OCD'] },
  'depression': { risk: 6, specialties: ['Psychiatrist', 'Psychologist'], conditions: ['Major Depression', 'Bipolar', 'Seasonal Affective Disorder'] },
  'blood in stool': { risk: 8, specialties: ['Gastroenterologist', 'General Surgery'], conditions: ['Hemorrhoids', 'Colorectal Cancer', 'IBD', 'Anal Fissure'] },
  'unconscious': { risk: 10, specialties: ['Emergency Medicine'], conditions: ['Stroke', 'Heart Attack', 'Seizure', 'Hypoglycemia'] },
  'seizure': { risk: 9, specialties: ['Neurologist', 'Emergency Medicine'], conditions: ['Epilepsy', 'Brain Tumor', 'Metabolic Disorder'] },
  'pregnancy related': { risk: 5, specialties: ['Gynecologist', 'Obstetrician'], conditions: ['Normal Pregnancy', 'Ectopic Pregnancy', 'Preeclampsia'] },
  'urinary problems': { risk: 4, specialties: ['Urologist', 'Nephrologist'], conditions: ['UTI', 'Kidney Stone', 'Prostate Issue', 'Cystitis'] },
  'weight loss': { risk: 5, specialties: ['Endocrinologist', 'Internal Medicine'], conditions: ['Diabetes', 'Hyperthyroidism', 'Cancer', 'Malnutrition'] },
  'fatigue': { risk: 3, specialties: ['General Medicine', 'Endocrinologist'], conditions: ['Anemia', 'Hypothyroidism', 'Diabetes', 'Sleep Disorder'] },
  'numbness': { risk: 6, specialties: ['Neurologist'], conditions: ['Neuropathy', 'Stroke', 'Multiple Sclerosis', 'Carpal Tunnel'] },
};

function analyzeSymptoms(symptoms: string[]): TriageResult {
  let maxRisk = 0;
  const allSpecialties: Set<string> = new Set();
  const allConditions: Set<string> = new Set();

  for (const symptom of symptoms) {
    const normalized = symptom.toLowerCase().trim();
    // Check for exact match first, then partial
    let match = SYMPTOM_DATABASE[normalized];
    if (!match) {
      for (const [key, value] of Object.entries(SYMPTOM_DATABASE)) {
        if (normalized.includes(key) || key.includes(normalized)) {
          match = value;
          break;
        }
      }
    }

    if (match) {
      maxRisk = Math.max(maxRisk, match.risk);
      match.specialties.forEach((s) => allSpecialties.add(s));
      match.conditions.forEach((c) => allConditions.add(c));
    }
  }

  // Multiple symptoms increase risk
  if (symptoms.length >= 3) maxRisk = Math.min(10, maxRisk + 1);
  if (symptoms.length >= 5) maxRisk = Math.min(10, maxRisk + 1);

  // Default for unknown symptoms
  if (maxRisk === 0) {
    maxRisk = 3;
    allSpecialties.add('General Medicine');
    allConditions.add('General Checkup Recommended');
  }

  let riskLevel: TriageResult['riskLevel'];
  let suggestedAction: string;

  if (maxRisk >= 9) {
    riskLevel = 'CRITICAL';
    suggestedAction = '🚨 EMERGENCY: Go to the nearest ER immediately or call 108/112. Do not delay.';
  } else if (maxRisk >= 7) {
    riskLevel = 'HIGH';
    suggestedAction = '⚠️ Visit a specialist or hospital within 2-4 hours. Consider calling an ambulance if worsening.';
  } else if (maxRisk >= 4) {
    riskLevel = 'MEDIUM';
    suggestedAction = '📋 Schedule a doctor consultation within 24-48 hours. Monitor symptoms closely.';
  } else {
    riskLevel = 'LOW';
    suggestedAction = '✅ Self-care may be sufficient. Rest, hydrate, and monitor. Visit doctor if symptoms persist beyond 3 days.';
  }

  return {
    riskLevel,
    suggestedAction,
    suggestedSpecialty: Array.from(allSpecialties)[0] || 'General Medicine',
    possibleConditions: Array.from(allConditions).slice(0, 5),
    urgencyScore: maxRisk,
    disclaimer: 'This is an AI-assisted preliminary assessment and NOT a medical diagnosis. Always consult a qualified healthcare provider.',
  };
}

/**
 * POST /api/v1/symptoms/check
 * AI Symptom Triage — Analyze symptoms and return risk level + suggested action
 */
export const checkSymptoms = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const { symptoms } = req.body;

  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    throw new ApiError(400, 'Please provide an array of symptoms.');
  }

  const triageResult = analyzeSymptoms(symptoms);

  // Save the symptom check
  const savedCheck = await prisma.symptomCheck.create({
    data: {
      userId: req.user!.userId,
      symptoms: JSON.stringify(symptoms),
      riskLevel: triageResult.riskLevel,
      triageResult: JSON.stringify(triageResult),
      suggestedAction: triageResult.suggestedAction,
      suggestedSpecialty: triageResult.suggestedSpecialty,
    },
  });

  res.json(
    new ApiResponse(200, 'Symptom analysis complete.', {
      id: savedCheck.id,
      symptoms,
      ...triageResult,
    })
  );
});

/**
 * GET /api/v1/symptoms/history
 * Get symptom check history for the logged-in user
 */
export const getSymptomHistory = asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
  const checks = await prisma.symptomCheck.findMany({
    where: { userId: req.user!.userId },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  const parsed = checks.map((c) => ({
    ...c,
    symptoms: JSON.parse(c.symptoms),
    triageResult: c.triageResult ? JSON.parse(c.triageResult) : null,
  }));

  res.json(new ApiResponse(200, 'Symptom history fetched.', parsed));
});
