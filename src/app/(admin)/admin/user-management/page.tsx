import React from "react";
import UserTable from "@/components/admin/userTable";
import UserForm from "@/components/admin/userForm";

export default function page() {
  return (
    <>
      <UserForm />
      <div className="p-4 border-2 rounded-2xl">
        <UserTable />
      </div>
    </>
  );
}
