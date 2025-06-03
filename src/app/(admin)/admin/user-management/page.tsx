import React from "react";
import UserPageClient from "@/components/Pages/UserPageClient";

export async function generateMetadata() {
  // You can fetch data or return static metadata
  return {
    title: "Gym - user Management",
    description: "Manage users in the admin dashboard",
  };
}

export default function Page() {
  return <UserPageClient />;
}
