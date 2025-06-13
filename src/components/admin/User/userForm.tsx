"use client";
import { generateSequentialId } from "@/lib/utils";
import { newUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useCallback, useContext, useMemo } from "react";
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

type FormData = z.infer<typeof newUserSchema>;

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
    resolver: zodResolver(newUserSchema),
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (values: FormData) => {
      try {
        console.log("Form values:", values);
        console.log("Modal mode:", userFormModal.mode);
        console.log("Modal userData:", userFormModal.userData);
        
        if (userFormModal.mode === "edit") {
          // Ensure we have the id for updating
          const updateData = {
            ...values,
            id: userFormModal.userData?.id || values.id
          };
          console.log("Update data with id:", updateData);
          updateUser(updateData);
        } else {
          createUser(values);
          console.log("Creating user:", values);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [createUser, updateUser, userFormModal.mode, userFormModal.userData]
  );

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
      form.reset({
        ...userFormModal.userData,
        joiningDate:
          userFormModal.userData.joiningDate?.split("T")[0] ??
          new Date().toISOString().split("T")[0],
      });
    } else {
      form.reset({
        id: generateSequentialId(1000).toString(),
        name: "",
        age: "" as any,
        weight: "" as any,
        height: "" as any,
        joiningDate: new Date().toISOString().split("T")[0],
        phone: "",
        planId: "", // Add planId field
      });
    }
  }, [userFormModal.isOpen, userFormModal.mode, userFormModal.userData, form]);

  useEffect(() => {
    if (isSuccess) {
      handleModalClose();
    }
  }, [isSuccess, handleModalClose]);

  const dialogTitle = userFormModal.mode === "edit" ? "Edit User" : "New User";
  const buttonText =
    userFormModal.mode === "edit" ? "Update User" : "Create User";

  return (
    <Dialog open={userFormModal.isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-1 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 mt-2">
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <FormField
                  name="weight"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weight</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your weight (kg)"
                          {...field}
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
                      <FormLabel>Height</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your height (cm)"
                          {...field}
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
                  name="planId"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Plan</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
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
                            {plans.map((plan: any) => (
                              <SelectItem key={plan.id} value={plan.id}>
                                {plan.name} - ₹{plan.amount} ({plan.days} days)
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
            </div>
            <DialogFooter className="w-full flex !justify-center mt-6">
              <Button type="submit" className="w-60 cursor-pointer">
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
