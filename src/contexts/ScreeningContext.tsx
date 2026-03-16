import { createContext, useContext, useState, ReactNode } from "react";

export interface ScreeningData {
  // Consent
  consentGiven?: boolean;
  // Patient Details
  patientName?: string;
  patientId?: string;
  age?: number;
  dob?: string;
  gender?: string;
  phone?: string;
  location?: string;
  mode?: "screening" | "camp";
  // Image
  imageUrl?: string;
  heatmapUrl?: string;
  // AI Results
  riskLevel?: "low" | "medium" | "high";
  aiConfidence?: number;
  plaqueIndex?: number;
  gingivalIndex?: number;
  // Override
  overridden?: boolean;
  overrideReason?: string;
  // Referral
  referralClinic?: string;
  // Notes
  notes?: string;
}

interface ScreeningContextType {
  data: ScreeningData;
  updateData: (updates: Partial<ScreeningData>) => void;
  resetData: () => void;
}

const ScreeningContext = createContext<ScreeningContextType>({
  data: {},
  updateData: () => {},
  resetData: () => {},
});

export function ScreeningProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ScreeningData>({});

  const updateData = (updates: Partial<ScreeningData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const resetData = () => setData({});

  return (
    <ScreeningContext.Provider value={{ data, updateData, resetData }}>
      {children}
    </ScreeningContext.Provider>
  );
}

export function useScreening() {
  return useContext(ScreeningContext);
}
