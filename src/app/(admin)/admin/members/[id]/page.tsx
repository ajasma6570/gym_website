"use client";

import { useUserDetails } from "@/hooks/useUserList";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard, Trash2 } from "lucide-react";
import { useContext } from "react";
import modalContext from "@/context/ModalContext";
import dynamic from "next/dynamic";
import { usePaymentDetails } from "@/hooks/usePayment";
import { PlanHistory, Plan } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Dynamically import the payment modal and payment history table
const PaymentModal = dynamic(
  () => import("@/components/admin/Payment/PaymentModal")
);
const PaymentHistoryTable = dynamic(
  () => import("@/components/admin/Payment/PaymentHistoryTable")
);
const PlanHistoryDeleteModal = dynamic(
  () => import("@/components/admin/PlanHistory/PlanHistoryDeleteModal")
);

export default function MemberPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: user, isLoading } = useUserDetails(id);
  const { data: paymentDetails, isLoading: paymentDetailsLoading } =
    usePaymentDetails(id);
  const { setPaymentFormModal, setPlanHistoryDeleteModal } =
    useContext(modalContext);

  const handleAddPayment = () => {
    setPaymentFormModal({
      isOpen: true,
      memberData: user,
    });
  };

  const handleDeletePlanHistory = (
    planHistoryId: number,
    planName: string,
    planType: string
  ) => {
    setPlanHistoryDeleteModal({
      isOpen: true,
      planHistoryId,
      planName,
      planType,
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
            <h2 className="text-2xl font-semibold pb-2">Profile</h2>
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Personal Details</CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>

                  <table className="w-full">
                    <tbody className="">
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Name</td>
                        <td className="px-4 py-3 ">{user.name}</td>
                      </tr>
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Gender</td>
                        <td className="px-4 py-3">
                          {" "}
                          {capitalize(user.gender)}
                        </td>
                      </tr>
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Phone</td>
                        <td className="px-4 py-3 ">{user.phone.toString()}</td>
                      </tr>
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Age</td>
                        <td className="px-4 py-3 ">{user.age.toString()}</td>
                      </tr>
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Height</td>
                        <td className="px-4 py-3 ">{user.height} cm</td>
                      </tr>
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Weight</td>
                        <td className="px-4 py-3 ">{user.weight} kg</td>
                      </tr>
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Status</td>
                        <td className="px-4 py-3">
                          <span
                            className={`font-semibold ${
                              !paymentDetailsLoading &&
                              paymentDetails?.currentPlans &&
                              paymentDetails.currentPlans.length > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {capitalize(
                              !paymentDetailsLoading &&
                                paymentDetails?.currentPlans &&
                                paymentDetails.currentPlans.length > 0
                                ? "active"
                                : "inactive"
                            )}
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted">
                        <td className="px-4 py-3 font-medium ">Joining Date</td>
                        <td className="px-4 py-3 ">
                          {format(new Date(user.joiningDate), "dd MMM yyyy")}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>

            {/* Current & Future Plans Section */}
            <div className="space-y-6">
              {/* Current Plans */}

              <Card className="gap-2">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Active Membership Plan
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  {!paymentDetailsLoading &&
                  paymentDetails?.currentPlans &&
                  paymentDetails.currentPlans.length > 0 ? (
                    <div className="space-y-2">
                      {paymentDetails.currentPlans
                        .filter(
                          (currentPlan: PlanHistory & { plan: Plan }) =>
                            currentPlan.plan?.type !== "personal_training"
                        )
                        .map((currentPlan: PlanHistory & { plan: Plan }) => (
                          <div
                            key={currentPlan.id}
                            className="p-3 bg-background  rounded-md"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium ">
                                  {currentPlan.plan?.name}
                                </p>
                                <p className="text-base ">Membership</p>
                                <p className="text-sm ">
                                  ₹{currentPlan.plan?.amount}
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="">
                                  {format(
                                    new Date(currentPlan.startDate),
                                    "dd MMM yyyy"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(currentPlan.dueDate),
                                    "dd MMM yyyy"
                                  )}
                                </p>
                                <p className="font-medium text-green-700">
                                  Active
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    handleDeletePlanHistory(
                                      currentPlan.id,
                                      currentPlan.plan?.name || "Unknown Plan",
                                      "membership_plan"
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {paymentDetails.currentPlans.filter(
                        (currentPlan: PlanHistory & { plan: Plan }) =>
                          currentPlan.plan?.type !== "personal_training"
                      ).length === 0 && (
                        <div className="p-3 bg-background border rounded-md">
                          <p className="text-center">
                            No Membership plan available.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-background border rounded-md">
                      <p className="text-center">
                        No Membership plan available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/*Personal Training Section */}

              <Card className="gap-2 ">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Active Personal Training Plan
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  {!paymentDetailsLoading &&
                  paymentDetails?.currentPlans &&
                  paymentDetails.currentPlans.length > 0 ? (
                    <div className="space-y-2">
                      {paymentDetails.currentPlans
                        .filter(
                          (ptPlan: PlanHistory & { plan: Plan }) =>
                            ptPlan.plan?.type === "personal_training"
                        )
                        .map((ptPlan: PlanHistory & { plan: Plan }) => (
                          <div
                            key={ptPlan.id}
                            className="p-3 bg-background rounded-md"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium ">
                                  {ptPlan.plan?.name}
                                </p>
                                <p className="text-base ">Personal Training</p>
                                <p className="text-sm ">
                                  ₹{ptPlan.plan?.amount}
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="">
                                  {format(
                                    new Date(ptPlan.startDate),
                                    "dd MMM yyyy"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(ptPlan.dueDate),
                                    "dd MMM yyyy"
                                  )}
                                </p>
                                <p className="font-medium text-green-700">
                                  Active
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    handleDeletePlanHistory(
                                      ptPlan.id,
                                      ptPlan.plan?.name || "Unknown Plan",
                                      "personal_training"
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      {paymentDetails.currentPlans.filter(
                        (ptPlan: PlanHistory & { plan: Plan }) =>
                          ptPlan.plan?.type === "personal_training"
                      ).length === 0 && (
                        <div className="p-3 bg-background border rounded-md">
                          <p className="text-center">
                            No personal training plan available.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 bg-background border rounded-md">
                      <p className="text-center">
                        No personal training plan available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Future Plans */}
              <Card className="gap-2">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Future Membership Plan
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  {!paymentDetailsLoading &&
                  paymentDetails?.futurePlans &&
                  paymentDetails.futurePlans.length > 0 ? (
                    <div className="space-y-2">
                      {(() => {
                        const futureMembershipPlans = paymentDetails.futurePlans
                          .filter(
                            (plan: PlanHistory & { plan: Plan }) =>
                              plan.plan?.type !== "personal_training"
                          )
                          .sort(
                            (
                              a: PlanHistory & { plan: Plan },
                              b: PlanHistory & { plan: Plan }
                            ) =>
                              new Date(a.startDate).getTime() -
                              new Date(b.startDate).getTime()
                          );

                        if (futureMembershipPlans.length === 0) {
                          return (
                            <div className="p-3 bg-background border rounded-md">
                              <p className="text-center">
                                No future membership plan available.
                              </p>
                            </div>
                          );
                        }

                        const latestFuturePlan = futureMembershipPlans[0];

                        return (
                          <div
                            key={latestFuturePlan.id}
                            className="p-3 bg-background  rounded-md"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium ">
                                  {latestFuturePlan.plan?.name}
                                </p>
                                <p className="text-base ">Membership</p>
                                <p className="text-sm ">
                                  ₹{latestFuturePlan.plan?.amount}
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="">
                                  {format(
                                    new Date(latestFuturePlan.startDate),
                                    "dd MMM yyyy"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(latestFuturePlan.dueDate),
                                    "dd MMM yyyy"
                                  )}
                                </p>
                                <p className="font-medium text-green-700">
                                  Upcoming
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    handleDeletePlanHistory(
                                      latestFuturePlan.id,
                                      latestFuturePlan.plan?.name ||
                                        "Unknown Plan",
                                      "membership_plan"
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="p-3 bg-background border rounded-md">
                      <p className="text-center">
                        No future membership plan available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Future Personal Training Plans */}
              <Card className="gap-2">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">
                    Future Personal Training Plan
                  </CardTitle>
                  <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                  {!paymentDetailsLoading &&
                  paymentDetails?.futurePlans &&
                  paymentDetails.futurePlans.length > 0 ? (
                    <div className="space-y-2">
                      {(() => {
                        const futurePersonalTrainingPlans =
                          paymentDetails.futurePlans
                            .filter(
                              (plan: PlanHistory & { plan: Plan }) =>
                                plan.plan?.type === "personal_training"
                            )
                            .sort(
                              (
                                a: PlanHistory & { plan: Plan },
                                b: PlanHistory & { plan: Plan }
                              ) =>
                                new Date(a.startDate).getTime() -
                                new Date(b.startDate).getTime()
                            );

                        if (futurePersonalTrainingPlans.length === 0) {
                          return (
                            <div className="p-3 bg-background border rounded-md">
                              <p className="text-center">
                                No future personal training plan available.
                              </p>
                            </div>
                          );
                        }

                        const latestFuturePTPlan =
                          futurePersonalTrainingPlans[0];

                        return (
                          <div
                            key={latestFuturePTPlan.id}
                            className="p-3 bg-background  rounded-md"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium text-white">
                                  {latestFuturePTPlan.plan?.name}
                                </p>
                                <p className="text-base text-white">
                                  Personal Training
                                </p>
                                <p className="text-sm text-white">
                                  ₹{latestFuturePTPlan.plan?.amount}
                                </p>
                              </div>
                              <div className="text-right text-sm">
                                <p className="text-white">
                                  {format(
                                    new Date(latestFuturePTPlan.startDate),
                                    "dd MMM yyyy"
                                  )}{" "}
                                  -{" "}
                                  {format(
                                    new Date(latestFuturePTPlan.dueDate),
                                    "dd MMM yyyy"
                                  )}
                                </p>
                                <p className="font-medium text-green-700">
                                  Upcoming
                                </p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="mt-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() =>
                                    handleDeletePlanHistory(
                                      latestFuturePTPlan.id,
                                      latestFuturePTPlan.plan?.name ||
                                        "Unknown Plan",
                                      "personal_training"
                                    )
                                  }
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="p-3 bg-background border rounded-md">
                      <p className="text-center">
                        No future personal training plan available.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Payment History */}
          <div className="space-y-4">
            <PaymentHistoryTable
              payments={user.payments || []}
              planHistories={user.planHistories || []}
            />
          </div>

          {/* Payment Modal */}
          <PaymentModal />

          {/* Plan History Delete Modal */}
          <PlanHistoryDeleteModal />
        </div>
      )}
    </>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
