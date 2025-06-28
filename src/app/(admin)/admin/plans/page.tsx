"use client";

import React, { useContext } from "react";
import { usePlanList } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";
import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";

const PlanForm = dynamic(() => import("@/components/admin/Pricing/PlanForm"));

const PlanDeleteConfirmModal = dynamic(
  () => import("@/components/admin/Pricing/PlanDeleteConfirmModal")
);

const PricingTable = dynamic(
  () => import("@/components/admin/Pricing/PricingTable")
);

export default function PlanPage() {
  const { data, isLoading, isSuccess, isPending } = usePlanList();
  const { setMembershipFormModal } = useContext(modalContext);

  const handleCreateNew = () => {
    setMembershipFormModal({
      isOpen: true,
      mode: "create",
      membershipData: null,
    });
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Plans</h1>
        <p className="text-muted-foreground">
          Create and manage your membership and personal training plans here.
          You can add, edit, or delete plans as needed.
        </p>
      </div>
      <Button onClick={handleCreateNew} className="w-40">
        New Plan
      </Button>

      <div className="space-y-6 mt-4">
        <div className="p-4 border-2 rounded-2xl">
          <PricingTable
            title="Membership Plans"
            type="membership_plan"
            data={data}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isPending={isPending}
          />
        </div>

        <div className="p-4 border-2 rounded-2xl">
          <PricingTable
            title="Personal Training Plans"
            type="personal_training"
            data={data}
            isLoading={isLoading}
            isSuccess={isSuccess}
            isPending={isPending}
          />
        </div>
      </div>
      <PlanForm />
      <PlanDeleteConfirmModal />
    </>
  );
}
