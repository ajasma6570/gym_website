"use client";

import React, { useContext } from "react";
import UserTableShimmer from "@/components/admin/User/UserTableShimmer";
import { usePlanList } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const MembershipPlanForm = dynamic(
  () => import("@/components/admin/Pricing/MembershipForm")
);

const PlanDeleteConfirmModal = dynamic(
  () => import("@/components/admin/Pricing/PlanDeleteConfirmModal")
);

const PricingTable = dynamic(
  () => import("@/components/admin/Pricing/PricingTable"),
  {
    loading: () => <UserTableShimmer />,
  }
);

export default function PlanPage() {
  const { data, isLoading } = usePlanList();
  const { setMembershipFormModal } = useContext(modalContext);

  const handleCreateNew = () => {
    setMembershipFormModal({
      isOpen: true,
      mode: "create",
      membershipData: null,
    });
  };

  if (isLoading) {
    return <UserTableShimmer />;
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Membership Plans</h1>
          <p className="text-muted-foreground">
            Manage your gym membership plans and pricing
          </p>
        </div>
        <Button onClick={handleCreateNew} className="ml-auto">
          New Membership Plan
        </Button>
      </div>

      <div className="p-4 border-2 rounded-2xl">
        <PricingTable data={data} />
      </div>

      {/* Modal Components */}
      <MembershipPlanForm />
      <PlanDeleteConfirmModal />
    </>
  );
}
