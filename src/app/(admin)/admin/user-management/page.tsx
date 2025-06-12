import React from "react";
import UserPage from "@/components/Pages/UserPage";

export async function generateMetadata() {
  // You can fetch data or return static metadata
  return {
    title: "Gym - user Management",
    description: "Manage users in the admin dashboard",
  };
}

export default function Page() {
  return <UserPage />;
}
