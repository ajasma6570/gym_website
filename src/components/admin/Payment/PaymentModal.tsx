"use client";

import React, { useEffect, useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { paymentSchema, PaymentFormData } from "@/lib/validation/paymentSchema";
import { usePlanList } from "@/hooks/usePlan";
import { usePaymentCreate, transformPaymentFormData } from "@/hooks/usePayment";
import modalContext from "@/context/ModalContext";
import { Plan } from "@/types";
import { showToastMessage } from "@/lib/toast";

export default function PaymentModal() {
  const { paymentFormModal, setPaymentFormModal } = useContext(modalContext);
  const { data: plans = [], isLoading: plansLoading } = usePlanList();
  const {
    mutate: createPayment,
    isPending: isPaymentPending,
    isSuccess: isPaymentSuccess,
    error: paymentError,
  } = usePaymentCreate();

  // Get appropriate start date based on member's active plan
  const getPaymentStartDate = useCallback(() => {
    if (paymentFormModal.memberData?.activePlan?.dueDate) {
      const activePlanDueDate = new Date(
        paymentFormModal.memberData.activePlan.dueDate
      );
      const nextDay = new Date(activePlanDueDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split("T")[0];
    }
    // If no active plan, use today's date
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, [paymentFormModal.memberData]);

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      planId: 0,
      personalTrainingId: 0,
      paymentStart: getPaymentStartDate(),
      dueDate: "",
      personalTrainingPlan: "",
      paymentType: "cash",
      amount: 0,
    },
  });

  // Watch plan changes to auto-calculate due date and amount
  const watchedPlanId = form.watch("planId");
  const watchedPersonalTrainingId = form.watch("personalTrainingId");
  const watchedPaymentStart = form.watch("paymentStart");

  // Function to calculate due date based on payment start and selected plan
  const calculateDueDate = useCallback(
    (paymentStartDate: string, planId: number) => {
      if (!paymentStartDate || !planId || !plans.length) return "";

      const selectedPlan = plans.find((plan: Plan) => plan.id === planId);
      if (!selectedPlan) return "";

      const startDate = new Date(paymentStartDate);
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + selectedPlan.duration);

      return dueDate.toISOString().split("T")[0];
    },
    [plans]
  );

  // Auto-calculate due date when plan or payment start changes
  useEffect(() => {
    if (watchedPlanId && watchedPaymentStart) {
      const newDueDate = calculateDueDate(watchedPaymentStart, watchedPlanId);
      if (newDueDate) {
        form.setValue("dueDate", newDueDate);
      }
    }
  }, [watchedPlanId, watchedPaymentStart, calculateDueDate, form]);

  // Auto-update payment start date when plan is selected
  useEffect(() => {
    if (watchedPlanId && paymentFormModal.isOpen) {
      const newStartDate = getPaymentStartDate();
      form.setValue("paymentStart", newStartDate);
    }
  }, [watchedPlanId, getPaymentStartDate, form, paymentFormModal.isOpen]);

  // Auto-set amount when plan or personal training changes
  useEffect(() => {
    if (plans.length) {
      let totalAmount = 0;

      // Add membership plan amount
      if (watchedPlanId) {
        const selectedPlan = plans.find(
          (plan: Plan) => plan.id === watchedPlanId
        );
        if (selectedPlan) {
          totalAmount += selectedPlan.amount;
        }
      }

      // Add personal training plan amount
      if (watchedPersonalTrainingId) {
        const selectedPT = plans.find(
          (plan: Plan) => plan.id === watchedPersonalTrainingId
        );
        if (selectedPT) {
          totalAmount += selectedPT.amount;
        }
      }

      form.setValue("amount", totalAmount);
    }
  }, [watchedPlanId, watchedPersonalTrainingId, plans, form]);

  const handleModalClose = useCallback(() => {
    // Prevent closing if payment is pending
    if (isPaymentPending) return;

    setPaymentFormModal({
      isOpen: false,
      memberData: null,
    });
    const startDate = getPaymentStartDate();
    form.reset({
      planId: 0,
      personalTrainingId: 0,
      paymentStart: startDate,
      dueDate: "",
      personalTrainingPlan: "",
      paymentType: "cash",
      amount: 0,
    });
  }, [setPaymentFormModal, form, getPaymentStartDate, isPaymentPending]);

  // Close modal on successful payment
  useEffect(() => {
    if (isPaymentSuccess) {
      setTimeout(() => {
        handleModalClose();
      }, 500); // Small delay to show success state
    }
  }, [isPaymentSuccess, handleModalClose]);

  // Reset form with appropriate date when modal opens
  useEffect(() => {
    if (paymentFormModal.isOpen) {
      const startDate = getPaymentStartDate();
      form.reset({
        planId: 0,
        personalTrainingId: 0,
        paymentStart: startDate,
        dueDate: "",
        personalTrainingPlan: "",
        paymentType: "cash",
        amount: 0,
      });
    }
  }, [paymentFormModal.isOpen, form, getPaymentStartDate]);

  const handleSubmit = useCallback(
    async (values: PaymentFormData) => {
      try {
        if (!paymentFormModal.memberData?.id) {
          showToastMessage("No member data available for payment", "warning");
          return;
        }

        const paymentData = transformPaymentFormData(values);

        createPayment({
          memberId: paymentFormModal.memberData.id,
          paymentData,
        });
      } catch (error) {
        console.error("Payment submission error:", error);
        showToastMessage(
          "Failed to create payment. Please check your input.",
          "error"
        );
      }
    },
    [paymentFormModal.memberData, createPayment]
  );

  const member = paymentFormModal.memberData;
  const dueDate = member?.activePlan?.dueDate
    ? new Date(member.activePlan.dueDate)
    : new Date();

  const nextDate = new Date(dueDate);
  nextDate.setDate(nextDate.getDate() + 1);

  const formattedDate = nextDate.toISOString().split("T")[0];

  return (
    <Dialog open={paymentFormModal.isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Pay Now</DialogTitle>
          <DialogDescription>
            Payment record for {member?.name || "this member"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-1 space-y-8 mb-4">
              {/* Member Info Display */}
              {member && (
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium">Member: {member.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current Plan:{" "}
                    {member.activePlan?.plan?.name || "No active plan"}
                    {member.activePlan?.dueDate && (
                      <span className="ml-2">
                        (Expires:{" "}
                        {new Date(
                          member.activePlan.dueDate
                        ).toLocaleDateString()}
                        )
                      </span>
                    )}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Plan Selection */}
                <FormField
                  name="planId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Membership Plan</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          disabled={plansLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a membership plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans
                              .filter(
                                (plan: Plan) =>
                                  plan.type === "membership_plan" &&
                                  plan.status === "active"
                              )
                              .map((plan: Plan) => (
                                <SelectItem
                                  key={plan.id}
                                  value={plan.id.toString()}
                                >
                                  {plan.name} - {plan.duration} days - $
                                  {plan.amount}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Personal Training Plan Selection */}
                <FormField
                  name="personalTrainingId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Personal Training Plan{" "}
                        <span className="text-muted-foreground">
                          (Optional)
                        </span>
                      </FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(value === "0" ? 0 : Number(value))
                          }
                          disabled={plansLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select personal training (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">
                              No Personal Training
                            </SelectItem>
                            {plans
                              .filter(
                                (plan: Plan) =>
                                  plan.type === "personal_training" &&
                                  plan.status === "active"
                              )
                              .map((plan: Plan) => (
                                <SelectItem
                                  key={plan.id}
                                  value={plan.id.toString()}
                                >
                                  {plan.name} - {plan.duration} days - $
                                  {plan.amount}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Payment Start Date */}
                <FormField
                  name="paymentStart"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Start Date</FormLabel>
                      <FormControl>
                        <Input
                          min={formattedDate}
                          type="date"
                          placeholder="Select payment start date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Total amount"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                          readOnly
                          className="bg-muted"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Type */}
                <FormField
                  name="paymentType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cash">Cash</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="both">
                              Both (Cash + Bank)
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="flex gap-2 mt-4">
              {paymentError && (
                <div className="text-red-600 text-sm mb-2">
                  {paymentError.message}
                </div>
              )}
              <Button type="submit" disabled={isPaymentPending}>
                {isPaymentPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Pay now"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
