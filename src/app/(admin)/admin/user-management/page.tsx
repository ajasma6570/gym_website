import React from "react";
import UserPage from "@/components/Pages/UserPage";

export async function generateMetadata() {
  return {
    title: "Gym - user Management",
    description: "Manage users in the admin dashboard",
  };
}

export default function Page() {
  return <UserPage />;
}
