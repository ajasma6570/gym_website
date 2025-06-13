"use client";

import React from "react";
import UserTableShimmer from "../admin/User/UserTableShimmer";
import { usePlanList } from "@/hooks/usePlan";
import dynamic from "next/dynamic";

const MembershipPlanForm = dynamic(
  () => import("@/components/admin/Pricing/MembershipPlanForm"),
  {
    loading: () => <p>Loading form...</p>,
  }
);

const PricingTable = dynamic(
  () => import("@/components/admin/Pricing/PricingTable"),
  {
    loading: () => <UserTableShimmer />,
  }
);

export default function PlanPage() {
  const { data, isLoading } = usePlanList();

  if (isLoading) {
    return <UserTableShimmer />;
  }

  return (
    <>
      <MembershipPlanForm />
      <div className="p-4 border-2 rounded-2xl">
        <PricingTable data={data} />
      </div>
    </>
  );
}
