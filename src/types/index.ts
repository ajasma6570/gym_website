// Base types from Prisma schema
export type Gender = "male" | "female" | "other";
export type PlanStatus = "active" | "inactive";
export type PlanType = "membership_plan" | "personal_training";
export type PaymentMethod = "cash" | "card" | "upi";

// Plan related types
export interface Plan {
    id: number;
    name: string;
    duration: number;
    amount: number;
    type: PlanType;
    status: PlanStatus;
    isDeleted: boolean;
    deletedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface PlanHistory {
    id: number;
    memberId: number;
    planId: number;
    startDate: Date;
    dueDate: Date;
    plan: Plan;
}

// Payment related types
export interface Payment {
    id: number;
    memberId: number;
    amount: number;
    date: Date;
    paymentMethod: PaymentMethod;
}

// Member related types
export interface Member {
    id: number;
    name: string;
    gender: Gender;
    phone: string;
    age: number;
    height: number;
    weight: number;
    joiningDate: Date;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
    activePlanId?: number;
    activePlan?: PlanHistory;
    payments?: Payment[];
    planHistories?: PlanHistory[];
}

// Extended types for API responses
export interface MemberWithRelations extends Member {
    activePlan: PlanHistory & {
        plan: Plan;
    };
    payments: Payment[];
    planHistories: (PlanHistory & {
        plan: Plan;
    })[];
}

// Payment details response type
export interface PaymentDetailsResponse {
    currentPlans: (PlanHistory & {
        plan: Plan;
    })[];
    personalTrainingPlans: (PlanHistory & {
        plan: Plan;
    })[];
    futurePlans: (PlanHistory & {
        plan: Plan;
    })[];
}

// Form data types for creating/updating
export interface CreateMemberData {
    name: string;
    gender: Gender;
    phone: string;
    age: number;
    height: number;
    weight: number;
    joiningDate: string; // Date string in YYYY-MM-DD format
}

export interface UpdateMemberData extends CreateMemberData {
    id: number;
}

export interface CreatePlanData {
    name: string;
    duration: number;
    amount: number;
    type: PlanType;
    status: PlanStatus;
}

export interface UpdatePlanData extends CreatePlanData {
    id: number;
}

// Payment form types
export interface PaymentFormData {
    planId?: number;
    personalTrainingId?: number;
    membershipPaymentStart?: string; // Date string in YYYY-MM-DD format
    personalTrainingPaymentStart?: string; // Date string in YYYY-MM-DD format
    paymentStart: string; // Date string in YYYY-MM-DD format
    dueDate: string; // Date string in YYYY-MM-DD format
    personalTrainingPlan?: string;
    paymentType: "cash" | "bank" | "both";
    amount: number;
}

// Modal context types
export interface UserFormModalState {
    isOpen: boolean;
    mode: "create" | "edit";
    userData: Member | null;
}

export interface DeleteConfirmModalState {
    isOpen: boolean;
    userId: number | null;
    userName: string | null;
}

export interface PlanDeleteConfirmModalState {
    isOpen: boolean;
    planId: number | null;
    planName: string | null;
}

export interface MembershipFormModalState {
    isOpen: boolean;
    mode: "create" | "edit";
    membershipData: Plan | null;
}

export interface PaymentFormModalState {
    isOpen: boolean;
    memberData: MemberWithRelations | null;
}

// Table props types
export interface TableProps<T> {
    data: T[];
    isLoading: boolean;
    isSuccess: boolean;
    isPending: boolean;
}

export type UserTableProps = TableProps<Member>;

export interface PlanTableProps extends TableProps<Plan> {
    title: string;
    type: PlanType;
}

// Status related types
export interface UserStatus {
    status: "active" | "inactive" | "expired";
    daysLeft?: number;
    expiryDate?: Date;
}

// API response types
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// Hook return types
export interface MutationHookReturn<T> {
    mutate: (data: T) => void;
    isSuccess: boolean;
    isPending: boolean;
    reset: () => void;
}

export interface QueryHookReturn<T> {
    data: T;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

// Form validation types
export interface ValidationResult {
    valid: boolean;
    error?: string;
    parsedBody?: Record<string, unknown>;
}

// Member status check types
export interface MemberStatusResult {
    isActive: boolean;
    expiryDate: Date;
    daysLeft: number;
}

// Search and filter types
export interface SearchFilters {
    name?: string;
    phone?: string;
    status?: "active" | "inactive" | "expired";
    planType?: PlanType;
}

// Date utility types
export type DateString = string; // YYYY-MM-DD format
export type DateTimeString = string; // ISO date string

// Component prop types for reusable components
export interface DetailProps {
    label: string;
    value: string;
    status?: string;
}

export interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

// Export arrays for dropdowns and selects
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
];

export const PLAN_STATUS_OPTIONS: { value: PlanStatus; label: string }[] = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
];

export const PLAN_TYPE_OPTIONS: { value: PlanType; label: string }[] = [
    { value: "membership_plan", label: "Membership Plan" },
    { value: "personal_training", label: "Personal Training" },
];

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
    { value: "cash", label: "Cash" },
    { value: "card", label: "Card" },
    { value: "upi", label: "UPI" },
];

// Utility type helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Re-export commonly used types for convenience
export type {
    Member as User, // For backward compatibility
    MemberWithRelations as UserWithRelations,
    CreateMemberData as CreateUserData,
    UpdateMemberData as UpdateUserData,
};
