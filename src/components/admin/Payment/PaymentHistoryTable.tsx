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
// import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Payment } from "@/types";

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export default function PaymentHistoryTable({
  payments,
}: PaymentHistoryTableProps) {
  // Sort payments by date (most recent first)
  const sortedPayments = [...payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  //   const getPaymentMethodBadge = (method: PaymentMethod) => {
  //     const variants = {
  //       cash: "bg-green-100 text-green-800 hover:bg-green-200",
  //       card: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  //       upi: "bg-purple-100 text-purple-800 hover:bg-purple-200",
  //     };

  //     return (
  //       <Badge className={variants[method]} variant="secondary">
  //         {method.toUpperCase()}
  //       </Badge>
  //     );
  //   };

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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Payment History</CardTitle>
        <div className="text-sm text-muted-foreground">
          Total Payments:{" "}
          <span className="font-semibold">${getTotalAmount()}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">S.No</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
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
                    <span className="font-semibold text-green-600">
                      {payment.amount} Rs
                    </span>
                  </TableCell>
                  <TableCell>{payment.paymentMethod}</TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {format(new Date(payment.date), "HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {payments.length > 0 && (
          <div className="mt-4 p-3 bg-muted rounded-md">
            <div className="flex justify-between items-center text-sm">
              <span>Total Payments Made:</span>
              <span className="font-semibold">{payments.length}</span>
            </div>
            <div className="flex justify-between items-center text-sm mt-1">
              <span>Total Amount Paid:</span>
              <span className="font-semibold text-green-600">
                ${getTotalAmount()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
