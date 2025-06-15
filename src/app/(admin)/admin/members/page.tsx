"use client";

import React, { useContext } from "react";
import dynamic from "next/dynamic";
import { useUserList } from "@/hooks/useUserList";
import UserTableShimmer from "@/components/admin/User/UserTableShimmer";
import modalContext from "@/context/ModalContext";
import { Button } from "@/components/ui/button";

const UserForm = dynamic(() => import("@/components/admin/User/userForm"));

const UserTable = dynamic(() => import("@/components/admin/User/userTable"), {
  loading: () => <UserTableShimmer />,
});

const DeleteConfirmModal = dynamic(
  () => import("@/components/admin/User/DeleteConfirmModal")
);

export default function Page() {
  const { data, isLoading } = useUserList();
  const { setUserFormModal } = useContext(modalContext);

  if (isLoading) {
    return <UserTableShimmer />;
  }

  return (
    <>
      <Button
        className="w-36 cursor-pointer"
        onClick={() =>
          setUserFormModal({ isOpen: true, mode: "create", userData: null })
        }
      >
        Add Member
      </Button>
      <UserForm />
      <DeleteConfirmModal />
      <div className="p-4 border-2 rounded-2xl">
        <UserTable data={data} />
      </div>
    </>
  );
}
