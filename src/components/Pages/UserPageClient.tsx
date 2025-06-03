"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useUSerList } from "@/hooks/useUserList";
import UserTableShimmer from "../admin/UserTableShimmer";

const UserForm = dynamic(() => import("@/components/admin/userForm"), {
  loading: () => <p>Loading form...</p>,
});

const UserTable = dynamic(() => import("@/components/admin/userTable"), {
  loading: () => <UserTableShimmer />,
});

export default function Page() {
  const { data, isLoading } = useUSerList();

  if (isLoading) {
    return <UserTableShimmer />;
  }

  return (
    <>
      <UserForm />
      <div className="p-4 border-2 rounded-2xl">
        <UserTable data={data} />
      </div>
    </>
  );
}
