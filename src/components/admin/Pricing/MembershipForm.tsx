"use client";
import { createMembershipSchema, updateMembershipSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { usePlanCreate, usePlanUpdate } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";

type CreateFormData = z.infer<typeof createMembershipSchema>;
type FormData = CreateFormData & { id?: number };

export default function MembershipForm() {
  const {
    mutate: createPlan,
    isSuccess: isCreateSuccess,
    isPending: isCreatePending,
    reset: resetCreate,
  } = usePlanCreate();
  const {
    mutate: updatePlan,
    isSuccess: isUpdateSuccess,
    isPending: isUpdatePending,
    reset: resetUpdate,
  } = usePlanUpdate();
  const { membershipFormModal, setMembershipFormModal } =
    useContext(modalContext);

  const isSuccess = isCreateSuccess || isUpdateSuccess;
  const isPending = isCreatePending || isUpdatePending;

  const currentSchema =
    membershipFormModal.mode === "edit"
      ? updateMembershipSchema
      : createMembershipSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(currentSchema),
    defaultValues: {
      name: "",
      duration: 0,
      amount: 0,
      status: "active",
    },
  });

  const handleSubmit = useCallback(
    async (values: FormData) => {
      try {
        console.log("Modal mode:", membershipFormModal.mode);

        if (membershipFormModal.mode === "edit") {
          // For edit mode, include the plan ID
          const updateData = {
            ...values,
            id: membershipFormModal.membershipData?.id || 0,
          };
          console.log("Update data:", updateData);
          updatePlan(updateData);
        } else {
          const createData = {
            name: values.name,
            duration: values.duration,
            amount: values.amount,
            status: values.status,
          };
          console.log("Create data:", createData);
          createPlan(createData);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [
      createPlan,
      updatePlan,
      membershipFormModal.mode,
      membershipFormModal.membershipData,
    ]
  );

  const handleModalClose = useCallback(() => {
    setMembershipFormModal({
      isOpen: false,
      mode: "create",
      membershipData: null,
    });
    resetCreate();
    resetUpdate();
    form.reset();
  }, [setMembershipFormModal, form, resetCreate, resetUpdate]);

  useEffect(() => {
    if (!membershipFormModal.isOpen) return;

    if (
      membershipFormModal.mode === "edit" &&
      membershipFormModal.membershipData
    ) {
      const data = membershipFormModal.membershipData;

      form.reset({
        id: data.id || 0,
        name: data.name || "",
        duration: data.duration || 0,
        amount: data.amount || 0,
        status: data.status || "active",
      });
    } else {
      form.reset({
        name: "",
        duration: 0,
        amount: 0,
        status: "active",
      });
    }
  }, [
    membershipFormModal.isOpen,
    membershipFormModal.mode,
    membershipFormModal.membershipData,
    form,
  ]);

  useEffect(() => {
    if (isSuccess) {
      handleModalClose();
    }
  }, [isSuccess, handleModalClose]);

  const dialogTitle =
    membershipFormModal.mode === "edit"
      ? "Edit Membership Plan"
      : "New Membership Plan";
  const buttonText = membershipFormModal.mode === "edit" ? "Update" : "Create";

  return (
    <Dialog open={membershipFormModal.isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.warn("Validation failed:", errors);
            })}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 mt-2">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter plan name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="duration"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of days"
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
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
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

                <FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select plan status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
              <Button
                type="submit"
                className="w-60 cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {membershipFormModal.mode === "edit"
                      ? "Updating..."
                      : "Creating..."}
                  </>
                ) : (
                  buttonText
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
