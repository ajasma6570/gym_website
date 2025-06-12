"use client";
import { generateSequentialId } from "@/lib/utils";
import { newUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState, useCallback } from "react";
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
import { useUserListMutate } from "@/hooks/useUserList";

export default function UserForm() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      id: generateSequentialId(1000),
      name: "",
      age: "",
      weight: "",
      height: "",
      joiningDate: new Date().toISOString().split("T")[0],
      phone: "",
    },
  });

  useEffect(() => {
    form.setValue("joiningDate", new Date().toISOString().split("T")[0]);
  }, [form]);

  const onSubmit = async (values: z.infer<typeof newUserSchema>) => {
    try {
      mutate(values);
      console.log("Form submitted with values:", values);
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    }
  };

  const clearForm = useCallback(() => {
    form.reset({
      id: generateSequentialId(1000),
      name: "",
      age: "",
      weight: "",
      height: "",
      joiningDate: new Date().toISOString().split("T")[0],
      phone: "",
    });
  }, [form]);

  const { mutate, isSuccess } = useUserListMutate();

  useEffect(() => {
    if (isSuccess) {
      setIsOpen(false);
      clearForm();
    }
  }, [isSuccess, clearForm]);

  return (
    <div className="">
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            clearForm();
          }
        }}
      >
        <DialogTrigger asChild className="cursor-pointer">
          <Button>Add New User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
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
                  />

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
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter your phone number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogFooter className="w-full flex justify-center items-center mt-6">
                <Button type="submit" className="w-60 cursor-pointer">
                  Create User
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
