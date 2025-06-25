"use client";
import {
  createPlanSchema,
  updatePlanSchema,
} from "@/lib/validation/planSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useCallback, useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import * as Dialog from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as Form from "@/components/ui/form";
import * as SelectField from "@/components/ui/select";
import { usePlanCreate, usePlanUpdate } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";
import { DialogDescription } from "@radix-ui/react-dialog";

type CreateFormData = z.infer<typeof createPlanSchema>;
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
    membershipFormModal.mode === "edit" ? updatePlanSchema : createPlanSchema;

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
        if (membershipFormModal.mode === "edit") {
          const parsed = updatePlanSchema.safeParse(values);
          if (parsed.success) {
            updatePlan(parsed.data);
          } else {
            console.warn("Validation failed:", parsed.error);
          }
        } else {
          createPlan(values);
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
    <Dialog.Dialog
      aria-describedby={"membership-form-dialog"}
      open={membershipFormModal.isOpen}
      onOpenChange={handleModalClose}
    >
      <Dialog.DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <Dialog.DialogHeader>
          <Dialog.DialogTitle>{dialogTitle}</Dialog.DialogTitle>
          <DialogDescription></DialogDescription>
        </Dialog.DialogHeader>

        <Form.Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit, (errors) => {
              console.warn("Validation failed:", errors);
            })}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 mt-2">
                <Form.FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Plan Name</Form.FormLabel>
                      <Form.FormControl>
                        <Input placeholder="Enter plan name" {...field} />
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />

                <Form.FormField
                  name="duration"
                  control={form.control}
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Duration (Days)</Form.FormLabel>
                      <Form.FormControl>
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
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />

                <Form.FormField
                  name="amount"
                  control={form.control}
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Amount (₹)</Form.FormLabel>
                      <Form.FormControl>
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
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />

                <Form.FormField
                  name="status"
                  control={form.control}
                  render={({ field }) => (
                    <Form.FormItem>
                      <Form.FormLabel>Status</Form.FormLabel>
                      <Form.FormControl>
                        <SelectField.Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectField.SelectTrigger className="w-full">
                            <SelectField.SelectValue placeholder="Select plan status" />
                          </SelectField.SelectTrigger>
                          <SelectField.SelectContent>
                            <SelectField.SelectItem value="active">
                              Active
                            </SelectField.SelectItem>
                            <SelectField.SelectItem value="inactive">
                              Inactive
                            </SelectField.SelectItem>
                          </SelectField.SelectContent>
                        </SelectField.Select>
                      </Form.FormControl>
                      <Form.FormMessage />
                    </Form.FormItem>
                  )}
                />
              </div>
            </div>
            <Dialog.DialogFooter className="w-full flex !justify-center mt-6">
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
            </Dialog.DialogFooter>
          </form>
        </Form.Form>
      </Dialog.DialogContent>
    </Dialog.Dialog>
  );
}
