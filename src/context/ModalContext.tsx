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
    userId: string | null;
    userName: string | null;
  };
  setDeleteConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      userId: string | null;
      userName: string | null;
    }>
  >;
  planDeleteConfirmModal: {
    isOpen: boolean;
    planId: string | null;
    planName: string | null;
  };
  setPlanDeleteConfirmModal: React.Dispatch<
    React.SetStateAction<{
      isOpen: boolean;
      planId: string | null;
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
    userId: null as string | null,
    userName: null as string | null,
  },
  setDeleteConfirmModal: () => {},
  planDeleteConfirmModal: {
    isOpen: false,
    planId: null as string | null,
    planName: null as string | null,
  },
  setPlanDeleteConfirmModal: () => {},
  membershipFormModal: {
    isOpen: false,
    mode: "create",
    membershipData: null,
  },
  setMembershipFormModal: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [userFormModal, setUserFormModal] = useState({
    isOpen: false,
    mode: "create",
    userData: null,
  });

  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    userId: null as string | null,
    userName: null as string | null,
  });

  const [planDeleteConfirmModal, setPlanDeleteConfirmModal] = useState({
    isOpen: false,
    planId: null as string | null,
    planName: null as string | null,
  });

  const [membershipFormModal, setMembershipFormModal] = useState({
    isOpen: false,
    mode: "create",
    membershipData: null,
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
      }}
    >
      {children}
    </modalContext.Provider>
  );
};

export default modalContext;
