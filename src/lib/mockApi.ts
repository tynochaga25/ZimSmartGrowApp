import { DEMO_USERS, SAMPLE_DIAGNOSES, UserProfile } from '../data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AuthResponse {
  user: UserProfile;
  token: string;
}

export const mockApi = {
  // Farmer Phone & OTP auth
  async sendOtp(phone: string): Promise<{ success: boolean; message: string }> {
    await delay(750);
    if (!phone || phone.trim().length < 9) {
      throw new Error('Please enter a valid Zimbabwean mobile number (+263 7X XXX XXXX)');
    }
    return {
      success: true,
      message: 'Verification code sent via SMS to ' + phone,
    };
  },

  async verifyOtp(phone: string, otp: string, registrationDetails?: Partial<UserProfile>): Promise<AuthResponse> {
    await delay(900);
    if (otp !== '123456' && otp.length !== 6) {
      throw new Error('Invalid verification code. Please check SMS or use demo code 123456.');
    }

    const baseFarmer = DEMO_USERS.farmer;
    const user: UserProfile = {
      id: registrationDetails?.id || `usr_farmer_${Date.now().toString(36)}`,
      name: registrationDetails?.name || baseFarmer.name,
      phone: phone || baseFarmer.phone,
      role: 'farmer',
      province: registrationDetails?.province || baseFarmer.province,
      district: registrationDetails?.district || baseFarmer.district,
      farmSize: registrationDetails?.farmSize || baseFarmer.farmSize,
      crops: registrationDetails?.crops || baseFarmer.crops,
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zimsmart.farmer.${Date.now()}`;
    return { user, token };
  },

  // Partner / Buyer / Admin Email & Password auth
  async loginWithEmail(email: string, pass: string): Promise<AuthResponse> {
    await delay(850);
    const cleanEmail = email.toLowerCase().trim();

    if (pass === 'wrongpass') {
      throw new Error('Incorrect password. 2 attempts remaining before temporary account lock.');
    }

    if (cleanEmail.includes('nationalfoods') || cleanEmail.includes('buyer')) {
      return {
        user: DEMO_USERS.buyer,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zimsmart.buyer.${Date.now()}`,
      };
    }

    if (cleanEmail.includes('admin') || cleanEmail.includes('zimsmartgrow') || cleanEmail.includes('investor')) {
      return {
        user: DEMO_USERS.admin,
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zimsmart.admin.${Date.now()}`,
      };
    }

    // Default partner fallback
    const partnerUser: UserProfile = {
      id: `usr_partner_${Date.now().toString(36)}`,
      name: cleanEmail.split('@')[0].replace('.', ' '),
      email: cleanEmail,
      role: 'partner',
      organization: 'Agribusiness Development Partners',
      province: 'Harare',
      joinedDate: new Date().toISOString().split('T')[0],
    };

    return {
      user: partnerUser,
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zimsmart.partner.${Date.now()}`,
    };
  },

  async registerUser(payload: {
    role: 'farmer' | 'buyer' | 'partner' | 'admin';
    name: string;
    email?: string;
    phone?: string;
    organization?: string;
    province?: string;
    district?: string;
    farmSize?: number;
    crops?: string[];
  }): Promise<AuthResponse> {
    await delay(1100);

    const newUser: UserProfile = {
      id: `usr_${payload.role}_${Date.now().toString(36)}`,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      role: payload.role,
      organization: payload.organization,
      province: payload.province || 'Mashonaland West',
      district: payload.district || 'Makonde District',
      farmSize: payload.farmSize || 2.0,
      crops: payload.crops || ['White Maize'],
      joinedDate: new Date().toISOString().split('T')[0],
    };

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.zimsmart.${payload.role}.${Date.now()}`;
    return { user: newUser, token };
  },

  async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    await delay(700);
    return {
      success: true,
      message: `Password reset instructions and 6-digit recovery code sent to ${email}`,
    };
  },

  async diagnoseCrop(imageSrc: string, cropName: string) {
    await delay(2200);
    // Find matching sample or default to Tomato late blight
    if (cropName.toLowerCase().includes('maize')) {
      return SAMPLE_DIAGNOSES[1];
    }
    if (cropName.toLowerCase().includes('tobacco')) {
      return SAMPLE_DIAGNOSES[2];
    }
    return SAMPLE_DIAGNOSES[0];
  },

  exportAnonymizedDataCsv(): void {
    const headers = [
      'Record_ID',
      'Province',
      'District',
      'Farm_Size_Ha',
      'Primary_Crop',
      'Diagnosis_Disease',
      'Confidence_Score',
      'Yield_Increase_Pct',
      'Post_Harvest_Loss_Reduction_Pct',
      'Season_Year',
    ];

    const rows = [
      ['ZSG-2026-001', 'Mashonaland West', 'Makonde', '3.5', 'White Maize', 'Fall Armyworm', '94.2%', '+34.0%', '-39.2%', '2026'],
      ['ZSG-2026-002', 'Mashonaland West', 'Zvimba', '2.0', 'Roma Tomatoes', 'Late Blight', '88.5%', '+31.5%', '-41.0%', '2026'],
      ['ZSG-2026-003', 'Mashonaland East', 'Marondera', '1.8', 'Virginia Tobacco', 'Tobacco Mosaic Virus', '91.0%', '+28.0%', '-35.5%', '2026'],
      ['ZSG-2026-004', 'Manicaland', 'Mutasa', '4.2', 'White Maize', 'Maize Streak Virus', '89.4%', '+33.2%', '-42.1%', '2026'],
      ['ZSG-2026-005', 'Midlands', 'Gokwe South', '5.0', 'Cotton', 'Bollworm Complex', '93.0%', '+30.8%', '-37.8%', '2026'],
      ['ZSG-2026-006', 'Masvingo', 'Chivi', '2.5', 'Sorghum', 'Ergot Fungal', '86.1%', '+35.4%', '-44.0%', '2026'],
      ['ZSG-2026-007', 'Mashonaland Central', 'Mazowe', '3.0', 'Soya Beans', 'Soybean Rust', '92.7%', '+32.1%', '-38.4%', '2026'],
      ['ZSG-2026-008', 'Matabeleland North', 'Umguza', '1.5', 'Horticulture', 'Powdery Mildew', '95.1%', '+29.6%', '-36.0%', '2026'],
    ];

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zimsmart_grow_anonymized_agri_dataset_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
