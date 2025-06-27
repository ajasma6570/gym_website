"use client";

import { useUserDetails } from "@/hooks/useUserList";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { useContext } from "react";
import modalContext from "@/context/ModalContext";
import dynamic from "next/dynamic";

// Dynamically import the payment modal
const PaymentModal = dynamic(
  () => import("@/components/admin/Payment/PaymentModal")
);

export default function MemberPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: user, isLoading } = useUserDetails(id);
  const { setPaymentFormModal } = useContext(modalContext);

  const handleAddPayment = () => {
    setPaymentFormModal({
      isOpen: true,
      memberData: user,
    });
  };

  return (
    <>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : !user ? (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Member not found</p>
        </div>
      ) : (
        <div className="rounded-xl space-y-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold pb-2">Member Details</h2>
            <Button
              onClick={handleAddPayment}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Add Payment
            </Button>
          </div>

          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Detail label="Name" value={user.name} />
            <Detail label="Gender" value={user.gender} />
            <Detail label="Phone" value={user.phone.toString()} />
            <Detail label="Age" value={user.age.toString()} />
            <Detail label="Height" value={`${user.height} cm`} />
            <Detail label="Weight" value={`${user.weight} kg`} />
            <Detail
              label="Status"
              value={capitalize(user.status ? "active" : "inactive")}
              status={user.status}
            />
            <Detail label="Active Plan" value={user.plan.name} />
            <Detail
              label="Joining Date"
              value={format(new Date(user.joiningDate), "dd MMM yyyy")}
            />
            <Detail
              label="Payment Start"
              value={format(new Date(user.paymentStart), "dd MMM yyyy")}
            />
            <Detail
              label="Due Date"
              value={format(new Date(user.dueDate), "dd MMM yyyy")}
            />
            <Detail
              label="Created At"
              value={format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")}
            />
            <Detail
              label="Updated At"
              value={format(new Date(user.updatedAt), "dd MMM yyyy, HH:mm")}
            />
          </div>

          {/* Payment Modal */}
          <PaymentModal />
        </div>
      )}
    </>
  );
}

function Detail({
  label,
  value,
  status,
}: {
  label: string;
  value: string;
  status?: string;
}) {
  const color = status ? "text-green-600" : "text-red-600";

  return (
    <div className="flex justify-between  py-2">
      <span className="font-medium ">{label}</span>
      <span className={status ? `${color} font-semibold` : ""}>{value}</span>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
