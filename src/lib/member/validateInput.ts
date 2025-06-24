
export interface ParsedMemberInput {
  name: string;
  gender: string;
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
    createdAt,
    updatedAt,
    initialPayment,
    activePlan,
  } = body;

  // Validate required fields
  if (!name || !phone || !joiningDate || !activePlan) {
    return {
      valid: false,
      error: "Missing required fields: name, phone, joiningDate, or activePlan",
    };
  }

  // Validate numeric fields
  const planId = parseInt(activePlan);
  if (isNaN(planId)) {
    return { valid: false, error: "Invalid plan ID" };
  }

  return {
    valid: true,
    parsedBody: {
      name,
      gender,
      phone,
      age: Number(age),
      height: Number(height),
      weight: Number(weight),
      joiningDate,
      paymentStart,
      dueDate,
      createdAt,
      updatedAt,
      initialPayment: initialPayment ? Number(initialPayment) : undefined,
      planId,
    },
  };
}
