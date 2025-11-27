// src/utility/types.ts

// ----------------------------
// Subscription Form Values
// ----------------------------
export interface SubscriptionFormValues {
  name: string;
  duration: string;
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

// ----------------------------
// Trainer Form Values
// ----------------------------
export interface TrainerFormValues {
  fullName: string;
  phoneNumber: string;
  specializationIds: number[];
}

// ----------------------------
// Trainer Form Values
// ----------------------------
export interface Trainer {
  id: string;
  fullName: string;
  phoneNumber: string;
  specializations: string[];
}


// ----------------------------
// Trainer Form Values
// ----------------------------
export interface TrainerFormValues {
  fullName: string;
  phoneNumber: string;
  specializationIds: number[];
}

// ----------------------------
// Trainer Filter Type
// ----------------------------
export interface TrainerFilter {
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  specializationId?: number;
}

// ----------------------------
// Trainer Context Type
// ----------------------------
export interface TrainerContextType {
  trainers: Trainer[];
  loading: boolean;
  totalCount: number;
  getTrainers: (filters: TrainerFilter) => Promise<void>;
  createTrainer: (values: TrainerFormValues) => Promise<void>;
  updateTrainer: (id: string, values: TrainerFormValues) => Promise<void>;
  deleteTrainer: (id: string) => Promise<void>;
  totalTrainers: number;
  addTraineeToTrainer: (trainerId: string, traineeId: string) => Promise<void>; // ✅ هنا
getTraineesOfTrainer: (
  trainerId: string,
  search?: string,
  pageIndex?: number,
  pageSize?: number
) => Promise<{ data: Trainee[]; count: number } | null>;
  deleteTraineeFromTrainer: (trainerId: string, traineeId: string) => Promise<void>; // ✅ أضفنا
}

// ----------------------------
// Subscription Context Type
export interface SubscriptionContextType {
  allSubscriptions: SubscriptionFormValues[];
  getAllSubscription: () => Promise<void>;
  createSubscription: (values: SubscriptionFormValues) => Promise<void>;
  updateSubscription: (id: number, values: SubscriptionFormValues) => Promise<void>;
  deleteSubscription: (id: number) => Promise<void>;
  loading: boolean;
  totalSubscriptions: number;
}

// ----------------------------
// Specialization Type
// ----------------------------
export interface Specialization {
  id: string;
  name: string;
}

// ----------------------------
// Specialization Context Type
// ----------------------------
export interface SpecializationContextType {
  specializations: Specialization[];
  loading: boolean;
  getSpecializations: (token: string) => Promise<void>;
  createSpecialization: (name: string, token: string) => Promise<void>;
  updateSpecialization: (id: string, name: string, token: string) => Promise<void>;
  deleteSpecialization: (id: string, token: string) => Promise<void>;
}

// ----------------------------
// Member Type
// ----------------------------
export interface Member {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  pay: number;
  restMoney: number;
  subscriptionId: string;
}

// ----------------------------
// Member Context Type
// ----------------------------
export interface MemberContextType {
  loading: boolean;
  members: Member[];
  totalPages: number;
  totalCount: number;
  totalMembers: number;
  createMember: (values: MemberFormValues) => Promise<void>;
  getMembers: (subscriptionId: string, pageSize: number, pageIndex: number) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMember: (id: string, values: MemberFormValues) => Promise<void>;
  getExpiryMember: (memberId: string) => Promise<ExpiryData | null>;
  expiryMap: { [memberId: string]: ExpiryData | null }; // ← تم التعديل هنا
}


export interface ExpiryData {
  expiryDate: string;
  sessionsNumber: number;
}


export interface Attendance {
  id: string;
  memberId: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
}

export interface AttendanceContextType {
  loading: boolean;
  markAttendance: (memberId: string, token: string) => Promise<void>;
  deleteAttendance: (memberId: string, dayDate: string, token: string) => Promise<void>;
  getMemberAttendances: (memberId: string, token: string) => Promise<Attendance[]>;
}

export interface Trainee {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  pay: number;
}
