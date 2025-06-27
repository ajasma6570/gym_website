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
import type { PlanHistory } from "@/types";

// Dynamically import the payment modal and payment history table
const PaymentModal = dynamic(
  () => import("@/components/admin/Payment/PaymentModal")
);
const PaymentHistoryTable = dynamic(
  () => import("@/components/admin/Payment/PaymentHistoryTable")
);

export default function MemberPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: user, isLoading } = useUserDetails(id);
  const { setPaymentFormModal } = useContext(modalContext);

  console.log("MemberPage user data:", user);

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
        <div className="rounded-xl space-y-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold pb-2">Member Details</h2>
            <Button
              onClick={handleAddPayment}
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Pay Now
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Member Information */}
            <div className="space-y-4">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="grid grid-cols-1 gap-4">
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
                <Detail
                  label="Joining Date"
                  value={format(new Date(user.joiningDate), "dd MMM yyyy")}
                />

                {/* Active Plan Information */}
                <Detail
                  label="Active Plan"
                  value={user.activePlan?.plan?.name || "No active plan"}
                />
                {user.activePlan?.dueDate && (
                  <Detail
                    label="Plan Expires"
                    value={format(
                      new Date(user.activePlan.dueDate),
                      "dd MMM yyyy"
                    )}
                    status={
                      new Date(user.activePlan.dueDate) > new Date()
                        ? "active"
                        : "expired"
                    }
                  />
                )}

                {/* Personal Training Information */}
                {(() => {
                  const personalTrainingPlan = user.planHistories?.find(
                    (planHistory: PlanHistory) =>
                      planHistory.plan?.type === "personal_training"
                  );

                  if (personalTrainingPlan) {
                    const isExpired =
                      new Date(personalTrainingPlan.dueDate) < new Date();
                    return (
                      <>
                        <Detail
                          label="Personal Training"
                          value={personalTrainingPlan.plan?.name || "N/A"}
                        />
                        <Detail
                          label="PT Expires"
                          value={format(
                            new Date(personalTrainingPlan.dueDate),
                            "dd MMM yyyy"
                          )}
                          status={!isExpired ? "active" : "expired"}
                        />
                      </>
                    );
                  }
                  return (
                    <Detail label="Personal Training" value="No PT plan" />
                  );
                })()}
              </div>
            </div>

            {/* Future Plans Section */}
            {user.planHistories && user.planHistories.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Plan History</h3>
                <div className="space-y-2">
                  {user.planHistories
                    .sort(
                      (a: PlanHistory, b: PlanHistory) =>
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime()
                    )
                    .slice(0, 5)
                    .map((planHistory: PlanHistory) => (
                      <div
                        key={planHistory.id}
                        className="p-3 bg-muted rounded-md"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">
                              {planHistory.plan?.name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {planHistory.plan?.type === "personal_training"
                                ? "Personal Training"
                                : "Membership"}
                            </p>
                          </div>
                          <div className="text-right text-sm">
                            <p className="text-muted-foreground">
                              {format(
                                new Date(planHistory.startDate),
                                "dd MMM yyyy"
                              )}{" "}
                              -{" "}
                              {format(
                                new Date(planHistory.dueDate),
                                "dd MMM yyyy"
                              )}
                            </p>
                            <p
                              className={`font-medium ${
                                new Date(planHistory.dueDate) > new Date()
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {new Date(planHistory.dueDate) > new Date()
                                ? "Active"
                                : "Expired"}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
          {/* Payment History */}
          <div className="space-y-4">
            <PaymentHistoryTable payments={user.payments || []} />
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
  status?: boolean | string;
}) {
  const getStatusColor = () => {
    if (typeof status === "boolean") {
      return status ? "text-green-600" : "text-red-600";
    }
    if (status === "active") return "text-green-600";
    if (status === "expired") return "text-red-600";
    return "";
  };

  return (
    <div className="flex justify-between py-2">
      <span className="font-medium">{label}</span>
      <span className={status ? `${getStatusColor()} font-semibold` : ""}>
        {value}
      </span>
    </div>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
