"use client";

import React, { useContext } from "react";
import dynamic from "next/dynamic";
import { useUserList } from "@/hooks/useUserList";
import modalContext from "@/context/ModalContext";
import { Button } from "@/components/ui/button";

const UserForm = dynamic(() => import("@/components/admin/User/userForm"));

const UserTable = dynamic(() => import("@/components/admin/User/userTable"));

const DeleteConfirmModal = dynamic(
  () => import("@/components/admin/User/DeleteConfirmModal")
);

const PaymentModal = dynamic(
  () => import("@/components/admin/Payment/PaymentModal")
);

export default function Page() {
  const { data, isLoading, isSuccess, isPending } = useUserList();
  const { setUserFormModal } = useContext(modalContext);

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold">Members</h1>
        <p className="text-muted-foreground">
          Manage your gym members, add new members, and manage their
          information.
        </p>
      </div>
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
      <PaymentModal />
      <div className="p-4 border-2 rounded-2xl">
        <UserTable
          data={data}
          isLoading={isLoading}
          isSuccess={isSuccess}
          isPending={isPending}
        />
      </div>
    </>
  );
}
