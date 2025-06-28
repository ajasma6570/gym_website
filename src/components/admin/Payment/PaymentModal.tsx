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
import {
  usePaymentCreate,
  usePaymentDetails,
  transformPaymentFormData,
} from "@/hooks/usePayment";
import modalContext from "@/context/ModalContext";
import { Plan, PlanHistory } from "@/types";
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

  // Get payment details to check for active plans
  const { data: paymentDetails } = usePaymentDetails(
    paymentFormModal.memberData?.id?.toString() || ""
  );

  // Get appropriate start date for membership plans
  const getMembershipPaymentStartDate = useCallback(() => {
    if (!paymentDetails?.currentPlans)
      return new Date().toISOString().split("T")[0];

    // Check for active membership plans
    const activeMembershipPlan = paymentDetails.currentPlans.find(
      (plan: PlanHistory & { plan: Plan }) =>
        plan.plan.type === "membership_plan"
    );

    if (activeMembershipPlan?.dueDate) {
      const dueDate = new Date(activeMembershipPlan.dueDate);
      const nextDay = new Date(dueDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split("T")[0];
    }

    // If no active membership plan, use today's date
    return new Date().toISOString().split("T")[0];
  }, [paymentDetails]);

  // Get appropriate start date for personal training plans
  const getPersonalTrainingPaymentStartDate = useCallback(() => {
    if (!paymentDetails?.personalTrainingPlans)
      return new Date().toISOString().split("T")[0];

    // Check for active personal training plans
    const activePTPlans = paymentDetails.personalTrainingPlans;

    if (activePTPlans.length > 0) {
      // Find the latest expiring PT plan
      const latestPTPlan = activePTPlans.reduce(
        (
          latest: PlanHistory & { plan: Plan },
          current: PlanHistory & { plan: Plan }
        ) =>
          new Date(current.dueDate) > new Date(latest.dueDate)
            ? current
            : latest
      );

      const dueDate = new Date(latestPTPlan.dueDate);
      const nextDay = new Date(dueDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay.toISOString().split("T")[0];
    }

    // If no active PT plan, use today's date
    return new Date().toISOString().split("T")[0];
  }, [paymentDetails]);

  // Get general payment start date (kept for backward compatibility)
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
      membershipPaymentStart: "",
      personalTrainingPaymentStart: "",
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
  const watchedMembershipPaymentStart = form.watch("membershipPaymentStart");
  const watchedPersonalTrainingPaymentStart = form.watch(
    "personalTrainingPaymentStart"
  );

  // Function to calculate due date based on payment start and selected plan
  const calculateDueDate = useCallback(
    (paymentStartDate: string, planId: number) => {
      if (!paymentStartDate || !planId || !plans.length) return "";

      const selectedPlan = plans.find((plan: Plan) => plan.id === planId);
      if (!selectedPlan) return "";

      const startDate = new Date(paymentStartDate);
      const dueDate = new Date(startDate);
      dueDate.setDate(dueDate.getDate() + selectedPlan.duration);

      return dueDate.toISOString().split("T")[0];
    },
    [plans]
  );

  // Auto-calculate due date when plan or payment start changes
  useEffect(() => {
    let newDueDate = "";

    // Calculate due date for membership plan
    if (watchedPlanId && watchedPlanId > 0 && watchedPaymentStart) {
      newDueDate = calculateDueDate(watchedPaymentStart, watchedPlanId);
    }

    // Calculate due date for personal training plan if no membership plan
    if (
      !newDueDate &&
      watchedPersonalTrainingId &&
      watchedPersonalTrainingId > 0 &&
      watchedPaymentStart
    ) {
      newDueDate = calculateDueDate(
        watchedPaymentStart,
        watchedPersonalTrainingId
      );
    }

    // If we have both plans, use the longer duration
    if (
      watchedPlanId &&
      watchedPlanId > 0 &&
      watchedPersonalTrainingId &&
      watchedPersonalTrainingId > 0 &&
      watchedPaymentStart
    ) {
      const membershipDueDate = calculateDueDate(
        watchedPaymentStart,
        watchedPlanId
      );
      const ptDueDate = calculateDueDate(
        watchedPaymentStart,
        watchedPersonalTrainingId
      );

      if (membershipDueDate && ptDueDate) {
        newDueDate =
          membershipDueDate > ptDueDate ? membershipDueDate : ptDueDate;
      }
    }

    if (newDueDate) {
      form.setValue("dueDate", newDueDate);
      // Force revalidation to ensure form validity is updated
      form.trigger();
    }
  }, [
    watchedPlanId,
    watchedPersonalTrainingId,
    watchedPaymentStart,
    calculateDueDate,
    form,
  ]);

  // Auto-update separate payment start dates when plans are selected
  useEffect(() => {
    if (paymentFormModal.isOpen) {
      if (watchedPlanId && watchedPlanId > 0) {
        const newStartDate = getMembershipPaymentStartDate();
        if (newStartDate !== form.getValues("membershipPaymentStart")) {
          form.setValue("membershipPaymentStart", newStartDate);
          form.trigger("membershipPaymentStart");
        }
      } else {
        // Clear the date when no plan is selected
        if (form.getValues("membershipPaymentStart") !== "") {
          form.setValue("membershipPaymentStart", "");
        }
      }
    }
  }, [
    watchedPlanId,
    getMembershipPaymentStartDate,
    form,
    paymentFormModal.isOpen,
  ]);

  useEffect(() => {
    if (paymentFormModal.isOpen) {
      if (watchedPersonalTrainingId && watchedPersonalTrainingId > 0) {
        const newStartDate = getPersonalTrainingPaymentStartDate();
        if (newStartDate !== form.getValues("personalTrainingPaymentStart")) {
          form.setValue("personalTrainingPaymentStart", newStartDate);
          form.trigger("personalTrainingPaymentStart");
        }
      } else {
        // Clear the date when no plan is selected
        if (form.getValues("personalTrainingPaymentStart") !== "") {
          form.setValue("personalTrainingPaymentStart", "");
        }
      }
    }
  }, [
    watchedPersonalTrainingId,
    getPersonalTrainingPaymentStartDate,
    form,
    paymentFormModal.isOpen,
  ]);

  // Update the general payment start date based on the earliest of the two
  useEffect(() => {
    if (paymentFormModal.isOpen) {
      let earliestDate = "";

      if (
        watchedMembershipPaymentStart &&
        watchedPersonalTrainingPaymentStart
      ) {
        earliestDate =
          watchedMembershipPaymentStart <= watchedPersonalTrainingPaymentStart
            ? watchedMembershipPaymentStart
            : watchedPersonalTrainingPaymentStart;
      } else if (watchedMembershipPaymentStart) {
        earliestDate = watchedMembershipPaymentStart;
      } else if (watchedPersonalTrainingPaymentStart) {
        earliestDate = watchedPersonalTrainingPaymentStart;
      } else {
        // Fallback: if no specific dates are set but plans are selected, use appropriate default
        if (watchedPlanId && watchedPlanId > 0) {
          earliestDate = getMembershipPaymentStartDate();
        } else if (watchedPersonalTrainingId && watchedPersonalTrainingId > 0) {
          earliestDate = getPersonalTrainingPaymentStartDate();
        } else {
          earliestDate = getPaymentStartDate();
        }
      }

      if (earliestDate && earliestDate !== form.getValues("paymentStart")) {
        form.setValue("paymentStart", earliestDate);
        // Force revalidation when payment start date changes
        form.trigger("paymentStart");
      }
    }
  }, [
    watchedMembershipPaymentStart,
    watchedPersonalTrainingPaymentStart,
    watchedPlanId,
    watchedPersonalTrainingId,
    getMembershipPaymentStartDate,
    getPersonalTrainingPaymentStartDate,
    getPaymentStartDate,
    form,
    paymentFormModal.isOpen,
  ]);

  // Auto-set amount when plan or personal training changes
  useEffect(() => {
    if (plans.length) {
      let totalAmount = 0;

      // Add membership plan amount
      if (watchedPlanId && watchedPlanId > 0) {
        const selectedPlan = plans.find(
          (plan: Plan) => plan.id === watchedPlanId
        );
        if (selectedPlan) {
          totalAmount += selectedPlan.amount;
        }
      }

      // Add personal training plan amount
      if (watchedPersonalTrainingId && watchedPersonalTrainingId > 0) {
        const selectedPT = plans.find(
          (plan: Plan) => plan.id === watchedPersonalTrainingId
        );
        if (selectedPT) {
          totalAmount += selectedPT.amount;
        }
      }

      form.setValue("amount", totalAmount);
      // Force revalidation to ensure form validity is updated
      form.trigger();
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
      membershipPaymentStart: "",
      personalTrainingPaymentStart: "",
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
        membershipPaymentStart: "",
        personalTrainingPaymentStart: "",
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
                <div className="p-3 bg-muted rounded-md space-y-2">
                  <h4 className="font-medium">Member: {member.name}</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>
                      <span className="font-medium">Membership Plan:</span>{" "}
                      {paymentDetails?.currentPlans?.find(
                        (plan: PlanHistory & { plan: Plan }) =>
                          plan.plan.type === "membership_plan"
                      )?.plan?.name || "No active membership"}
                      {paymentDetails?.currentPlans?.find(
                        (plan: PlanHistory & { plan: Plan }) =>
                          plan.plan.type === "membership_plan"
                      )?.dueDate && (
                        <span className="ml-2">
                          (Expires:{" "}
                          {new Date(
                            paymentDetails.currentPlans.find(
                              (plan: PlanHistory & { plan: Plan }) =>
                                plan.plan.type === "membership_plan"
                            )!.dueDate
                          ).toLocaleDateString()}
                          )
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-medium">Personal Training:</span>{" "}
                      {(paymentDetails?.personalTrainingPlans?.length ?? 0) > 0
                        ? `${paymentDetails?.personalTrainingPlans?.length} active plan(s)`
                        : "No active PT plans"}
                      {(paymentDetails?.personalTrainingPlans?.length ?? 0) >
                        0 &&
                        paymentDetails?.personalTrainingPlans && (
                          <span className="ml-2">
                            (Latest expires:{" "}
                            {new Date(
                              Math.max(
                                ...paymentDetails.personalTrainingPlans.map(
                                  (p: PlanHistory & { plan: Plan }) =>
                                    new Date(p.dueDate).getTime()
                                )
                              )
                            ).toLocaleDateString()}
                            )
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Membership Plan Selection */}
                <FormField
                  name="planId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Membership Plan (Optional)</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(value === "0" ? 0 : Number(value))
                          }
                          disabled={plansLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a membership plan (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">
                              No Membership Plan
                            </SelectItem>
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
                                  {plan.name} - {plan.duration} days - ₹
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
                      <FormLabel>Personal Training Plan (Optional)</FormLabel>
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
                                  {plan.name} - {plan.duration} days - ₹
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

              {/* Separate Start Date Fields */}
              {((watchedPlanId && watchedPlanId > 0) || 
                (watchedPersonalTrainingId && watchedPersonalTrainingId > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Membership Payment Start Date */}
                  {watchedPlanId && watchedPlanId > 0 && (
                    <FormField
                      name="membershipPaymentStart"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Membership Payment Start Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Select membership start date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Personal Training Payment Start Date */}
                  {watchedPersonalTrainingId && watchedPersonalTrainingId > 0 && (
                    <FormField
                      name="personalTrainingPaymentStart"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Personal Training Payment Start Date
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Select PT start date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              )}

              {/* Plan Selection Summary */}
              {((watchedPlanId && watchedPlanId > 0) ||
                (watchedPersonalTrainingId &&
                  watchedPersonalTrainingId > 0)) && (
                <div className="p-3 bg-muted rounded-md">
                  <h5 className="font-medium mb-2">Selected Plans Summary</h5>
                  <div className="space-y-2 text-sm">
                    {watchedPlanId && watchedPlanId > 0 && (
                      <div>
                        <div className="flex justify-between">
                          <span>
                            <strong>Membership:</strong>{" "}
                            {
                              plans.find((p: Plan) => p.id === watchedPlanId)
                                ?.name
                            }
                          </span>
                          <span>
                            ₹
                            {
                              plans.find((p: Plan) => p.id === watchedPlanId)
                                ?.amount
                            }
                          </span>
                        </div>
                        {watchedMembershipPaymentStart && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Start Date:{" "}
                            {new Date(
                              watchedMembershipPaymentStart
                            ).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    )}
                    {watchedPersonalTrainingId &&
                      watchedPersonalTrainingId > 0 && (
                        <div>
                          <div className="flex justify-between">
                            <span>
                              <strong>Personal Training:</strong>{" "}
                              {
                                plans.find(
                                  (p: Plan) =>
                                    p.id === watchedPersonalTrainingId
                                )?.name
                              }
                            </span>
                            <span>
                              ₹
                              {
                                plans.find(
                                  (p: Plan) =>
                                    p.id === watchedPersonalTrainingId
                                )?.amount
                              }
                            </span>
                          </div>
                          {watchedPersonalTrainingPaymentStart && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Start Date:{" "}
                              {new Date(
                                watchedPersonalTrainingPaymentStart
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      )}
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total Amount:</span>
                      <span>₹{form.watch("amount") || 0}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Amount (₹)</FormLabel>
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

              <Button
                type="submit"
                disabled={isPaymentPending || !form.formState.isValid}
              >
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
