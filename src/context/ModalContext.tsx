"use client";
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useState } from "react";

interface ModalProviderProps {
  children: ReactNode;
}

interface ModalContextType {
  userFormModal: {
    isOpen: boolean;
    mode: string;
    userData: any;
  };
  setUserFormModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      mode: string;
      userData: any;
    }>
  >;
  deleteConfirmModal: {
    isOpen: boolean;
    userId: number | null;
    userName: string | null;
  };
  setDeleteConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      userId: number | null;
      userName: string | null;
    }>
  >;
  planDeleteConfirmModal: {
    isOpen: boolean;
    planId: number | null;
    planName: string | null;
  };
  setPlanDeleteConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      planId: number | null;
      planName: string | null;
    }>
  >;
  membershipFormModal: {
    isOpen: boolean;
    mode: string;
    membershipData: any;
  };
  setMembershipFormModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      mode: string;
      membershipData: any;
    }>
  >;
  paymentFormModal: {
    isOpen: boolean;
    memberData: any;
  };
  setPaymentFormModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      memberData: any;
    }>
  >;
  planHistoryDeleteModal: {
    isOpen: boolean;
    planHistoryId: number | null;
    planName: string | null;
    planType: string | null;
  };
  setPlanHistoryDeleteModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      planHistoryId: number | null;
      planName: string | null;
      planType: string | null;
    }>
  >;
}

const modalContext = createContext<ModalContextType>({
  userFormModal: {
    isOpen: false,
    mode: "create",
    userData: null,
  },
  setUserFormModal: () => {},
  deleteConfirmModal: {
    isOpen: false,
    userId: null as number | null,
    userName: null as string | null,
  },
  setDeleteConfirmModal: () => {},
  planDeleteConfirmModal: {
    isOpen: false,
    planId: null as number | null,
    planName: null as string | null,
  },
  setPlanDeleteConfirmModal: () => {},
  membershipFormModal: {
    isOpen: false,
    mode: "create",
    membershipData: null,
  },
  setMembershipFormModal: () => {},
  paymentFormModal: {
    isOpen: false,
    memberData: null,
  },
  setPaymentFormModal: () => {},
  planHistoryDeleteModal: {
    isOpen: false,
    planHistoryId: null as number | null,
    planName: null as string | null,
    planType: null as string | null,
  },
  setPlanHistoryDeleteModal: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [userFormModal, setUserFormModal] = useState({
    isOpen: false,
    mode: "create",
    userData: null,
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    userId: null as number | null,
    userName: null as string | null,
  });

  const [planDeleteConfirmModal, setPlanDeleteConfirmModal] = useState({
    isOpen: false,
    planId: null as number | null,
    planName: null as string | null,
  });

  const [membershipFormModal, setMembershipFormModal] = useState({
    isOpen: false,
    mode: "create",
    membershipData: null,
  });

  const [paymentFormModal, setPaymentFormModal] = useState({
    isOpen: false,
    memberData: null,
  });

  const [planHistoryDeleteModal, setPlanHistoryDeleteModal] = useState({
    isOpen: false,
    planHistoryId: null as number | null,
    planName: null as string | null,
    planType: null as string | null,
  });

  return (
    <modalContext.Provider
      value={{
        userFormModal,
        setUserFormModal,
        deleteConfirmModal,
        setDeleteConfirmModal,
        planDeleteConfirmModal,
        setPlanDeleteConfirmModal,
        membershipFormModal,
        setMembershipFormModal,
        paymentFormModal,
        setPaymentFormModal,
        planHistoryDeleteModal,
        setPlanHistoryDeleteModal,
      }}
    >
      {children}
    </modalContext.Provider>
  );
};

export default modalContext;
