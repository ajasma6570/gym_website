
export interface ParsedMemberInput {
  name: string;
  gender: "male" | "female" | "other";
  phone: string;
  age: number;
  height: number;
  weight: number;
  joiningDate: string;
  paymentStart?: string;
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
  initialPayment?: number;
  planId: number;
}

type ValidationResult =
  | { valid: true; parsedBody: ParsedMemberInput }
  | { valid: false; error: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateMemberInput(body: any): ValidationResult {
  const {
    name,
    gender,
    phone,
    age,
    height,
    weight,
    joiningDate,
    paymentStart,
    dueDate,
    planId, // Form now sends planId directly
    activePlan, // Keep for backward compatibility
    initialPayment, // Optional initial payment amount
  } = body;

  // Validate required fields
  if (!name || !phone || !joiningDate || (!planId && !activePlan)) {
    return {
      valid: false,
      error: "Missing required fields: name, phone, joiningDate, or planId",
    };
  }

  // Handle planId from either planId or activePlan field
  const finalPlanId = planId || activePlan;
  const parsedPlanId = Number(finalPlanId);
  if (isNaN(parsedPlanId) || parsedPlanId <= 0) {
    return { valid: false, error: "Invalid plan ID" };
  }

  // Validate gender field
  const validGenders = ["male", "female", "other"];
  const normalizedGender = (gender || "male").toLowerCase();
  if (!validGenders.includes(normalizedGender)) {
    return { valid: false, error: "Gender must be 'male', 'female', or 'other'" };
  }

  return {
    valid: true,
    parsedBody: {
      name,
      gender: normalizedGender as "male" | "female" | "other",
      phone,
      age: Number(age) || 0,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      joiningDate,
      paymentStart,
      dueDate,
      planId: parsedPlanId,
      initialPayment: initialPayment ? Number(initialPayment) : undefined,
    },
  };
}
