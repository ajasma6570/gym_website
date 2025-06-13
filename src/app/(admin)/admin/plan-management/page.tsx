import React from "react";
import PlanPage from "@/components/Pages/PlanPage";

export async function generateMetadata() {
  return {
    title: "Gym - Membership plan Management",
    description: "Manage membership plans in the admin dashboard",
  };
}

export default function Page() {
  return <PlanPage />;
}
