"use client";

import React from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Payment, PlanHistory } from "@/types";

interface PaymentHistoryTableProps {
  payments: Payment[];
  planHistories?: PlanHistory[];
}

export default function PaymentHistoryTable({
  payments,
  planHistories = [],
}: PaymentHistoryTableProps) {
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getPlanTypeBadge = (payment: Payment) => {
    if (!planHistories || planHistories.length === 0) {
      return <span>No Plans Data</span>;
    }

    const paymentDate = new Date(payment.date);
    const oneHourBefore = new Date(paymentDate.getTime() - 60 * 60 * 1000);
    const oneHourAfter = new Date(paymentDate.getTime() + 60 * 60 * 1000);

    let relatedPlans = planHistories.filter((planHistory) => {
      const planStartDate = new Date(planHistory.startDate);
      return planStartDate >= oneHourBefore && planStartDate <= oneHourAfter;
    });

    if (relatedPlans.length === 0) {
      const paymentDateOnly = paymentDate.toDateString();
      relatedPlans = planHistories.filter((planHistory) => {
        const planStartDate = new Date(planHistory.startDate);
        return planStartDate.toDateString() === paymentDateOnly;
      });
    }

    if (relatedPlans.length === 0) {
      const sevenDaysBefore = new Date(
        paymentDate.getTime() - 7 * 24 * 60 * 60 * 1000
      );
      const sevenDaysAfter = new Date(
        paymentDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );
      relatedPlans = planHistories.filter((planHistory) => {
        const planStartDate = new Date(planHistory.startDate);
        return (
          planStartDate >= sevenDaysBefore && planStartDate <= sevenDaysAfter
        );
      });
    }

    if (relatedPlans.length === 0) {
      const allMembershipPlans = planHistories.filter(
        (plan) => plan.plan?.type === "membership_plan"
      );
      const allPersonalTrainingPlans = planHistories.filter(
        (plan) => plan.plan?.type === "personal_training"
      );

      if (
        allMembershipPlans.length > 0 &&
        allPersonalTrainingPlans.length > 0
      ) {
        return <span>Both Plans</span>;
      } else if (allMembershipPlans.length > 0) {
        return <span>Membership</span>;
      } else if (allPersonalTrainingPlans.length > 0) {
        return <span> Personal Training</span>;
      } else {
        return <span>N/A</span>;
      }
    }

    // Check what types of plans are included
    const hasMembership = relatedPlans.some(
      (plan) => plan.plan?.type === "membership_plan"
    );
    const hasPersonalTraining = relatedPlans.some(
      (plan) => plan.plan?.type === "personal_training"
    );

    if (hasMembership && hasPersonalTraining) {
      return (
        <div className="flex gap-1 flex-wrap">
          <span>Membership</span>
          <span>Personal Training</span>
        </div>
      );
    } else if (hasPersonalTraining) {
      return <span>Personal Training</span>;
    } else if (hasMembership) {
      return <span>Membership</span>;
    } else {
      return <span>N/A</span>;
    }
  };

  const getTotalAmount = () => {
    return payments.reduce((total, payment) => total + payment.amount, 0);
  };

  if (!payments || payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No payment history found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-col lg:flex-row gap-4 lg:gap-0 lg:items-center lg:justify-between">
        <CardTitle className="text-xl font-bold">Payment History</CardTitle>
        <div className="text-sm ">
          <div className="flex justify-between items-center text-sm gap-4">
            <span className="">Total Payments Made:</span>
            <span className="font-semibold">{payments.length}</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1 gap-4">
            <span className="">Total Amount Paid:</span>
            <span
              className={`font-semibold ml-auto ${
                getTotalAmount() < 0 ? "text-red-600" : "text-green-600"
              }`}
            >
              ₹{getTotalAmount()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border max-h-96 overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[80px]">S.No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Plan Type</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPayments.map((payment, index) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {format(new Date(payment.date), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`font-semibold ${
                        payment.amount < 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹ {payment.amount}
                    </span>
                  </TableCell>
                  <TableCell>{getPlanTypeBadge(payment)}</TableCell>
                  <TableCell>{payment.paymentMethod.toUpperCase()}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {format(new Date(payment.date), "hh:mm a")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
