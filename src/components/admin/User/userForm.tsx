"use client";
import { newMemberSchema } from "@/lib/validation/memberSchema";
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
import { useUserCreate, useUserUpdate } from "@/hooks/useUserList";
import modalContext from "@/context/ModalContext";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useRouter } from "next/navigation";

type CreateFormData = z.infer<typeof newMemberSchema>;
type FormData = CreateFormData & { id?: number };

export default function UserForm() {
  const router = useRouter();
  const {
    mutate: createUser,
    isSuccess: isCreateSuccess,
    isPending: isCreatePending,
    reset: resetCreate,
    data: createdUserData,
  } = useUserCreate();
  const {
    mutate: updateUser,
    isSuccess: isUpdateSuccess,
    isPending: isUpdatePending,
    reset: resetUpdate,
  } = useUserUpdate();
  const { userFormModal, setUserFormModal } = useContext(modalContext);

  // Check if either create or update was successful
  const isSuccess = isCreateSuccess || isUpdateSuccess;
  const isPending = isCreatePending || isUpdatePending;

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
    },
  });

  // Memoize handlers to prevent unnecessary re-renders
  const handleSubmit = useCallback(
    async (values: FormData) => {
      try {
        console.log("Form values:", values);
        console.log("Modal mode:", userFormModal);

        // Convert string values to numbers for numeric fields
        const formattedValues = {
          name: values.name,
          gender: values.gender,
          phone: values.phone,
          age: Number(values.age),
          weight: Number(values.weight),
          height: Number(values.height),
          joiningDate: values.joiningDate,
        };

        if (userFormModal.mode === "edit") {
          const updateData = {
            ...formattedValues,
            id: userFormModal.userData?.id,
          };
          console.log("Update data:", updateData);
          updateUser(updateData);
        } else {
          // For create mode, don't include ID (Prisma will auto-generate)
          console.log("Create data:", formattedValues);
          createUser(formattedValues);
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
    [createUser, updateUser, userFormModal]
  );

  const handleModalClose = useCallback(() => {
    // Prevent closing if operation is pending
    if (isPending) return;

    setUserFormModal({
      isOpen: false,
      mode: "create",
      userData: null,
    });
    resetCreate();
    resetUpdate();
    form.reset();
  }, [setUserFormModal, form, resetCreate, resetUpdate, isPending]);

  useEffect(() => {
    if (!userFormModal.isOpen) return;

    if (userFormModal.mode === "edit" && userFormModal.userData) {
      console.log("user data----->", userFormModal.userData);

      const data = userFormModal.userData;

      form.reset({
        name: data.name || "",
        gender: data.gender || "male",
        phone: String(data.phone || ""),
        age: data.age || 0,
        weight: data.weight || 0,
        height: data.height || 0,
        joiningDate: data.joiningDate
          ? new Date(data.joiningDate).toISOString().split("T")[0]
          : "",
      });
    } else {
      const now = new Date();
      const istOffset = now.getTimezoneOffset() * 60000;
      const today = new Date(now.getTime() - istOffset)
        .toISOString()
        .split("T")[0];

      form.reset({
        name: "",
        gender: "male",
        phone: "",
        age: 0,
        weight: 0,
        height: 0,
        joiningDate: today,
      });
    }
  }, [userFormModal.isOpen, userFormModal.mode, userFormModal.userData, form]);

  useEffect(() => {
    if (isSuccess) {
      // Close modal automatically on success
      setTimeout(() => {
        handleModalClose();

        // Navigate to user details page if this was a user creation
        if (isCreateSuccess && createdUserData?.id) {
          router.push(`/admin/members/${createdUserData.id}`);
        }
      }, 500); // Small delay to show success state
    }
  }, [isSuccess, isCreateSuccess, createdUserData, handleModalClose, router]);

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
              </div>
            </div>
            <DialogFooter className="w-full flex !justify-center mt-6">
              <Button
                type="submit"
                className="w-32 cursor-pointer"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                    {userFormModal.mode === "edit"
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
