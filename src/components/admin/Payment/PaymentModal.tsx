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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { paymentSchema, PaymentFormData } from "@/lib/validation/paymentSchema";
import { usePlanList } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";

export default function PaymentModal() {
  const { paymentFormModal, setPaymentFormModal } = useContext(modalContext);
  const { data: plans = [], isLoading: plansLoading } = usePlanList();

  // Get today's date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      planId: 0,
      paymentStart: getCurrentDate(),
      dueDate: "",
      personalTrainingPlan: "",
      paymentType: "cash",
      amount: 0,
    },
  });

  // Watch plan changes to auto-calculate due date and amount
  const watchedPlanId = form.watch("planId");
  const watchedPaymentStart = form.watch("paymentStart");

  // Function to calculate due date based on payment start and selected plan
  const calculateDueDate = useCallback(
    (paymentStartDate: string, planId: number) => {
      if (!paymentStartDate || !planId || !plans.length) return "";

      const selectedPlan = plans.find((plan: any) => plan.id === planId);
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

  // Auto-set amount when plan changes
  useEffect(() => {
    if (watchedPlanId && plans.length) {
      const selectedPlan = plans.find((plan: any) => plan.id === watchedPlanId);
      if (selectedPlan) {
        form.setValue("amount", selectedPlan.amount);
      }
    }
  }, [watchedPlanId, plans, form]);

  // Reset form with current date when modal opens
  useEffect(() => {
    if (paymentFormModal.isOpen) {
      form.reset({
        planId: 0,
        paymentStart: getCurrentDate(),
        dueDate: "",
        personalTrainingPlan: "",
        paymentType: "cash",
        amount: 0,
      });
    }
  }, [paymentFormModal.isOpen, form]);

  const handleSubmit = useCallback(
    async (values: PaymentFormData) => {
      try {
        console.log("Payment data:", values);
        console.log("Member:", paymentFormModal.memberData);

        // Here you would typically make an API call to create a payment record
        // For now, we'll just close the modal
        handleModalClose();
      } catch (error) {
        console.error("Payment submission error:", error);
      }
    },
    [paymentFormModal.memberData]
  );

  const handleModalClose = useCallback(() => {
    setPaymentFormModal({
      isOpen: false,
      memberData: null,
    });
    form.reset({
      planId: 0,
      paymentStart: getCurrentDate(),
      dueDate: "",
      personalTrainingPlan: "",
      paymentType: "cash",
      amount: 0,
    });
  }, [setPaymentFormModal, form]);

  const member = paymentFormModal.memberData;

  return (
    <Dialog open={paymentFormModal.isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
          <DialogDescription>
            Create a new payment record for {member?.name || "this member"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-1 space-y-4">
              {/* Member Info Display */}
              {member && (
                <div className="p-3 bg-muted rounded-md">
                  <h4 className="font-medium">Member: {member.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    Current Plan: {member.plan?.name || "No active plan"}
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
                      <FormLabel>Select Plan</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          disabled={plansLoading}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a plan" />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((plan: any) => (
                              <SelectItem
                                key={plan.id}
                                value={plan.id.toString()}
                              >
                                {plan.name} - {plan.duration} months - $
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

                {/* Amount */}
                <FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Enter amount"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === "" ? 0 : Number(e.target.value)
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Start Date */}
                <FormField
                  name="paymentStart"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Start Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Select payment start date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Due Date */}
                <FormField
                  name="dueDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Select due date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
                        <SelectTrigger>
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

              {/* Personal Training Plan (Optional) */}
              <FormField
                name="personalTrainingPlan"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Training Plan (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter personal training plan details..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button type="submit">Create Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
