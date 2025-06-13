"use client";
import { generateSequentialId } from "@/lib/utils";
import { newPlanSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { usePlanListMutate } from "@/hooks/usePlan";

type FormData = z.infer<typeof newPlanSchema>;

interface UserFormProps {
  trigger?: React.ReactNode;
  defaultValues?: Partial<FormData>;
  mode?: "create" | "edit";
}

export default function UserForm({
  trigger = <Button>New Membership Plan</Button>,
  defaultValues,
  mode = "create",
}: UserFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate, isSuccess } = usePlanListMutate();

  const form = useForm<FormData>({
    resolver: zodResolver(newPlanSchema),
    defaultValues: {
      id: defaultValues?.id || generateSequentialId(1000),
      name: defaultValues?.name || "",
      days: defaultValues?.days || "",
      amount: defaultValues?.amount || "",
      status: defaultValues?.status || "active",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      mutate(values);
      console.log(`${mode === "edit" ? "Updating" : "Creating"}:`, values);
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  const clearForm = useCallback(() => {
    form.reset({
      id: generateSequentialId(1000),
      name: "",
      days: "",
      amount: "",
      status: "active",
    });
  }, [form]);

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      clearForm();
    }
  }, [isSuccess, clearForm]);

  useEffect(() => {
    if (isOpen && defaultValues && mode === "edit") {
      form.reset(defaultValues as FormData);
    }
  }, [isOpen, defaultValues, form, mode]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) clearForm();
      }}
    >
      <DialogTrigger asChild className="cursor-pointer w-60">
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Edit Membership Plan" : "New Membership Plan"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 min-h-0"
          >
            <div className="flex-1 overflow-y-auto px-1">
              <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-6 mt-2">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter plan name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="days"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Number of days"
                          {...field}
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
                          placeholder="Enter amount"
                          {...field}
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
                          defaultValue={field.value}
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
              <Button type="submit" className="w-60">
                {mode === "edit" ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
