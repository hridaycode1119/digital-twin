export type OrganId = 'brain' | 'heart' | 'lungs' | 'liver' | 'stomach' | 'kidneys';

export type HealthStatus = 'Optimal' | 'Good' | 'Normal' | 'Monitoring' | 'High Risk';

export interface OrganMetric {
  name: string;
  value: string | number;
  unit?: string;
  isAbnormal?: boolean;
}

export interface OrganData {
  id: OrganId;
  name: string;
  status: HealthStatus;
  score: number;
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  icon: string;
  position: { x: number; y: number; z: number }; // 3D coordinates
  screenPos: { top: string; left: string }; // 2D layout overlay coordinates
  metrics: OrganMetric[];
  historicalTrend: { month: string; score: number }[];
  clinicalInsights: string;
  recommendations: string[];
}

export interface PatientTwinState {
  patientId: string;
  name: string;
  age: number;
  gender: string;
  overallScore: number;
  reportsCount: number;
  riskAlertsCount: number;
  upcomingCheckups: number;
  organs: Record<OrganId, OrganData>;
  vitals: {
    bloodPressure: string;
    heartRate: number;
    spo2: number;
    glucose: number;
    temperature: number;
    bmi: number;
  };
}
