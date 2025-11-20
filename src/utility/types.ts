// src/utility/types.ts

// ----------------------------
// Subscription Form Values
// ----------------------------
export interface SubscriptionFormValues {
  name: string;
  duration: string;
  phone: string;
  fitnessNumber: string;
  sessionsNumber: number | string;
  inviteCount: number | string;
  daysPerWeek: number | string;
  price: number | string;
}

// ----------------------------
// Login Form Values
// ----------------------------
export interface LoginFormValues {
  email: string;
  password: string;
}

// ----------------------------
// Specialization Form Values
// ----------------------------
export interface SpecializationFormValues {
  specializationName: string;
}

// ----------------------------
// Member Form Values
// ----------------------------
export interface MemberFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  pay: string;            // ← string
  restMoney: string;      // ← string
  subscriptionId: string; // ← string
}



// ----------------------------
// Generic Input Field Props
// ----------------------------
export interface InputFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string | boolean;
}
