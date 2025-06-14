"use client";
import { generateSequentialId } from "@/lib/utils";
import { newMemberSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUserCreate, useUserUpdate } from "@/hooks/useUserList";
import { usePlanList } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FormData = z.infer<typeof newMemberSchema>;

export default function UserForm() {
  const {
    mutate: createUser,
    isSuccess: isCreateSuccess,
    reset: resetCreate,
  } = useUserCreate();
  const {
    mutate: updateUser,
    isSuccess: isUpdateSuccess,
    reset: resetUpdate,
  } = useUserUpdate();
  const { userFormModal, setUserFormModal } = useContext(modalContext);
  const { data: plans = [], isLoading: plansLoading } = usePlanList();

  // Check if either create or update was successful
  const isSuccess = isCreateSuccess || isUpdateSuccess;

  const form = useForm<FormData>({
    resolver: zodResolver(newMemberSchema),
    defaultValues: {
      name: "",
      gender: "male",
      phone: "",
      age: 0,
      weight: 0,
      height: 0,
      joiningDate: "",
      activePlan: "",
      paymentStart: "",
      dueDate: "",
    },
  });

  type Plan = {
    id: string;
    name: string;
    duration: number; // in days
    amount: string; // in paise
    status: "active" | "inactive";
  };

  // Memoize handlers to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (values: FormData) => {
      try {
        console.log("Form values:", values);
        console.log("Modal mode:", userFormModal.mode);

        // Convert string values to numbers for numeric fields
        const formattedValues = {
          ...values,
          age: Number(values.age),
          weight: Number(values.weight),
          height: Number(values.height),
        };

        if (userFormModal.mode === "edit") {
          // For edit mode, include the user ID
          const updateData = {
            ...formattedValues,
            id: userFormModal.userData?.id,
          };
          console.log("Update data:", updateData);
          updateUser(updateData);
        } else {
          // For create mode, add generated ID
          const createData = {
            ...formattedValues,
            id: generateSequentialId(1000).toString(),
          };
          console.log("Create data:", createData);
          createUser(createData);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [createUser, updateUser, userFormModal.mode, userFormModal.userData]
  );

  // Function to calculate due date based on payment start and selected plan
  const calculateDueDate = useCallback(
    (paymentStartDate: string, planId: string) => {
      if (!paymentStartDate || !planId || !plans.length) return "";

      const selectedPlan = plans.find((plan: Plan) => plan.id === planId);
      if (!selectedPlan) return "";

      const startDate = new Date(paymentStartDate);
      const dueDate = new Date(startDate);
      dueDate.setDate(startDate.getDate() + selectedPlan.duration);

      return dueDate.toISOString().split("T")[0];
    },
    [plans]
  );

  // Watch for changes in activePlan and paymentStart to auto-calculate dueDate
  const watchedActivePlan = form.watch("activePlan");
  const watchedPaymentStart = form.watch("paymentStart");

  useEffect(() => {
    if (watchedActivePlan && watchedPaymentStart) {
      const newDueDate = calculateDueDate(
        watchedPaymentStart,
        watchedActivePlan
      );
      if (newDueDate) {
        form.setValue("dueDate", newDueDate);
      }
    }
  }, [watchedActivePlan, watchedPaymentStart, calculateDueDate, form]);

  const handleModalClose = useCallback(() => {
    setUserFormModal({
      isOpen: false,
      mode: "create",
      userData: null,
    });
    resetCreate();
    resetUpdate();
    form.reset();
  }, [setUserFormModal, form, resetCreate, resetUpdate]);

  useEffect(() => {
    if (!userFormModal.isOpen) return;

    if (userFormModal.mode === "edit" && userFormModal.userData) {
      const data = userFormModal.userData;

      form.reset({
        name: data.name || "",
        gender: data.gender || "male",
        phone: data.phone || "",
        age: data.age || 0,
        weight: data.weight || 0,
        height: data.height || 0,
        joiningDate: data.joiningDate
          ? new Date(data.joiningDate).toISOString().split("T")[0]
          : "",
        activePlan: data.activePlan || data.planId || "", // Handle both field names
        paymentStart: data.paymentStart
          ? new Date(data.paymentStart).toISOString().split("T")[0]
          : "",
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];

      form.reset({
        name: "",
        gender: "male",
        phone: "",
        age: 0,
        weight: 0,
        height: 0,
        joiningDate: today,
        activePlan: "",
        paymentStart: today,
        dueDate: today,
      });
    }
  }, [userFormModal.isOpen, userFormModal.mode, userFormModal.userData, form]);

  useEffect(() => {
    if (isSuccess) {
      handleModalClose();
    }
  }, [isSuccess, handleModalClose]);

  const dialogTitle =
    userFormModal.mode === "edit" ? "Edit Member" : "New Member";
  const buttonText = userFormModal.mode === "edit" ? "Update" : "Create";

  return (
    <Dialog open={userFormModal.isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-1 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6 mt-2">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter your phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="gender"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex"
                        >
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="male" id="r1" />
                            <Label htmlFor="r1">Male</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="female" id="r2" />
                            <Label htmlFor="r2">Female</Label>
                          </div>
                          <div className="flex items-center gap-3">
                            <RadioGroupItem value="other" id="r3" />
                            <Label htmlFor="r3">Other</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 items-center gap-6 mt-2">
                <FormField
                  name="age"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your age"
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
                <FormField
                  name="weight"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight (kg)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="Enter your weight"
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
                <FormField
                  name="height"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Height (cm)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your height"
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
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 mt-2">
                <FormField
                  name="joiningDate"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Joining Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          placeholder="Enter your joining date"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="activePlan"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Plan</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Auto-calculate due date if payment start is already set
                            const paymentStart = form.getValues("paymentStart");
                            if (paymentStart) {
                              const newDueDate = calculateDueDate(
                                paymentStart,
                                value
                              );
                              if (newDueDate) {
                                form.setValue("dueDate", newDueDate);
                              }
                            }
                          }}
                          value={field.value}
                          disabled={plansLoading}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue
                              placeholder={
                                plansLoading
                                  ? "Loading plans..."
                                  : "Select a membership plan"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {plans.map((plan: Plan) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - ₹{plan.amount} ({plan.duration}{" "}
                                days)
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-calculate due date if plan is already selected
                            const activePlan = form.getValues("activePlan");
                            if (activePlan && e.target.value) {
                              const newDueDate = calculateDueDate(
                                e.target.value,
                                activePlan
                              );
                              if (newDueDate) {
                                form.setValue("dueDate", newDueDate);
                              }
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
            </div>
            <DialogFooter className="w-full flex !justify-center mt-6">
              <Button type="submit" className="w-32 cursor-pointer">
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
