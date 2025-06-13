"use client";

import React, { useContext } from "react";
import dynamic from "next/dynamic";
import { useUserList } from "@/hooks/useUserList";
import UserTableShimmer from "../admin/User/UserTableShimmer";
import { Button } from "../ui/button";
import modalContext from "@/context/ModalContext";

const UserForm = dynamic(() => import("@/components/admin/User/userForm"));

const UserTable = dynamic(() => import("@/components/admin/User/userTable"), {
  loading: () => <UserTableShimmer />,
});

export default function Page() {
  const { data, isLoading } = useUserList();
  const { setUserFormModal } = useContext(modalContext);

  if (isLoading) {
    return <UserTableShimmer />;
  }

  return (
    <>
      <Button
        className="w-60 cursor-pointer"
        onClick={() =>
          setUserFormModal({ isOpen: true, mode: "create", userData: null })
        }
      >
        Add User
      </Button>
      <UserForm />
      <div className="p-4 border-2 rounded-2xl">
        <UserTable data={data} />
      </div>
    </>
  );
}
