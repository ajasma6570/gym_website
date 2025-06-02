"use client";
import { generateSequentialId } from "@/lib/utils";
import { newUserSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
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

export default function userForm() {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof newUserSchema>>({
    resolver: zodResolver(newUserSchema),
    defaultValues: {
      id: generateSequentialId(1000),
      name: "",
      age: "",
      weight: "",
      height: "",
      joinDate: new Date().toISOString().split("T")[0],
      phone: "",
    },
  });

  useEffect(() => {
    form.setValue("joinDate", new Date().toISOString().split("T")[0]);
  }, [form]);

  const onSubmit = async (values: z.infer<typeof newUserSchema>) => {
    try {
      console.log("Form submitted with values:", values);
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.", error);
    } finally {
      await clearForm();
      setIsOpen(false);
    }
  };

  async function clearForm() {
    form.reset({
      id: generateSequentialId(1000),
      name: "",
      age: "",
      weight: "",
      height: "",
      joinDate: new Date().toISOString().split("T")[0],
      phone: "",
    });
  }
  return (
    <div className="">
      <Dialog
        defaultOpen={isOpen}
        onOpenChange={async (open) => {
          if (!open) {
            await clearForm();
          }
        }}
      >
        <DialogTrigger asChild className="cursor-pointer">
          <Button>Add New User</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
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
                  name="joinDate"
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
              <DialogFooter className="w-full flex justify-center mt-3">
                <Button type="submit" className="w-60">
                  Create User
                </Button>
              </DialogFooter>{" "}
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
