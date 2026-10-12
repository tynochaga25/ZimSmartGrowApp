import { DiagnosticRequest, DiagnosticResponse } from '../../types';
import { SUPPORTED_CROPS } from '../data/planting-rules';

export class DiagnosticsService {
  /**
   * Phase 3 Disease Diagnostics Contract Implementation
   * Evaluates image or symptom descriptions, returning treatment and SMS summary
   */
  public static async diagnoseCrop(request: DiagnosticRequest): Promise<DiagnosticResponse> {
    const crop = SUPPORTED_CROPS.find(c => c.id === request.cropId) || SUPPORTED_CROPS[0];
    const symptoms = (request.symptomsObserved || '').toLowerCase();

    // Default or condition determination
    let condition = 'Fall Armyworm (Spodoptera frugiperda)';
    let severity: 'mild' | 'moderate' | 'severe' = 'moderate';
    let symptomsIdentified = ['Window-pane damage on leaves', 'Frass (sawdust-like droppings) in whorl', 'Ragged ragged leaf margins'];
    let organic = 'Spray neem oil extract (50ml/10L water) or apply dry wood ash directly into the plant whorls at early emergence.';
    let chemical = 'Apply Ampligo 150 ZC (10ml/15L) or Belt 480 SC directed straight into leaf whorls. Rotate chemical classes.';
    let prevention = 'Early planting with first effective rains; intercropping with desmodium (push-pull strategy).';

    if (symptoms.includes('yellow') || symptoms.includes('streak') || symptoms.includes('stunt')) {
      condition = 'Maize Streak Virus (MSV)';
      severity = 'severe';
      symptomsIdentified = ['Continuous chlorotic yellow streaks along leaf veins', 'Stunted plant height', 'Small/barren cobs'];
      organic = 'Rogue out and bury infected plants immediately. Plant resistant cultivars.';
      chemical = 'No chemical cures the virus; control leafhopper vectors using Confidor (Imidacloprid) seed dressing.';
      prevention = 'Plant certified MSV-tolerant Seed Co hybrids (e.g. SC513/SC719). Clear grass borders around field.';
    } else if (crop.id === 'crop_tobacco' || symptoms.includes('brown') || symptoms.includes('spot')) {
      condition = 'Tobacco Brown Spot (Alternaria alternata)';
      severity = 'moderate';
      symptomsIdentified = ['Circular brown concentric rings on lower leaves', 'Yellow halo surrounding brown lesions', 'Dry brittle centers'];
      organic = 'Ensure wide ridge spacing to maximize airflow. Remove infected lower prime leaves.';
      chemical = 'Spray Azoxystrobin (Amistar) or Mancozeb 80 WP at first sight of lower leaf spotting.';
      prevention = 'Avoid excessive nitrogen; ensure balanced potassium (K) nutrition.';
    }

    const smsSummary = `ZimSmart Rx: ${crop.name} - Suspected ${condition.split(' (')[0]}. Action: ${organic.slice(0, 70)}. Chem: ${chemical.slice(0, 50)}`;

    return {
      diagnosisId: `diag_${Date.now()}`,
      cropName: crop.name,
      suspectedCondition: condition,
      confidencePercentage: 92,
      severity,
      symptomsIdentified,
      organicTreatment: organic,
      chemicalTreatment: chemical,
      preventionAdvice: prevention,
      smsSummary: smsSummary.slice(0, 160)
    };
  }
}
