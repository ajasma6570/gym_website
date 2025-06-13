"use client";

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

  return (
    <modalContext.Provider
      value={{
        userFormModal,
        setUserFormModal,
        deleteConfirmModal,
        setDeleteConfirmModal,
      }}
    >
      {children}
    </modalContext.Provider>
  );
};

export default modalContext;
