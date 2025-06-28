import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaymentFormData } from "@/lib/validation/paymentSchema";
import { PaymentMethod, PaymentDetailsResponse } from "@/types";
import { showToastMessage } from "@/lib/toast";

interface PaymentRequest {
    planId?: number;
    personalTrainingPlanId?: number;
    paymentStart: string;
    amount: number;
    paymentMethod?: PaymentMethod;
}

interface PaymentResponse {
    message: string;
    activeImmediately: boolean;
    planStart: string;
    planDue: string;
    payment: {
        id: number;
        memberId: number;
        amount: number;
        date: string;
        paymentMethod: PaymentMethod;
    };
}


export const usePaymentDetails = (memberId: string) => {
    return useQuery<PaymentDetailsResponse>({
        queryKey: ["payment details", memberId],
        queryFn: async (): Promise<PaymentDetailsResponse> => {
            const response = await fetch(`/api/payment/${memberId}`);
            if (!response.ok) {
                throw new Error("User not found");
            }
            return response.json();
        },
        refetchOnWindowFocus: false,
    });
}

export const getMemberPayments = async (memberId: number): Promise<PaymentResponse[]> => {
    const response = await fetch(`/api/payment/${memberId}`);
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch payments");
    }
    return response.json();
};



const createPayment = async (memberId: number, paymentData: PaymentRequest): Promise<PaymentResponse> => {
    const response = await fetch(`/api/payment/${memberId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create payment");
    }

    return response.json();
};

export const usePaymentCreate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ memberId, paymentData }: { memberId: number; paymentData: PaymentRequest }) =>
            createPayment(memberId, paymentData),
        onSuccess: () => {
            // Invalidate and refetch user list to update the table
            queryClient.invalidateQueries({ queryKey: ["users"] });
            // Also invalidate member details if viewing specific member
            queryClient.invalidateQueries({ queryKey: ["member"] });
            showToastMessage("Payment created successfully!", "success");
        },
        onError: (error) => {
            console.error("Payment creation failed:", error);
            showToastMessage(error.message, "error");
        },
    });
};

// Helper function to transform PaymentFormData to PaymentRequest
export const transformPaymentFormData = (formData: PaymentFormData): PaymentRequest => {
    return {
        planId: formData.planId && formData.planId > 0 ? formData.planId : undefined,
        personalTrainingPlanId: formData.personalTrainingId && formData.personalTrainingId > 0
            ? formData.personalTrainingId
            : undefined,
        paymentStart: formData.paymentStart,
        amount: formData.amount,
        paymentMethod: formData.paymentType as PaymentMethod,
    };
};