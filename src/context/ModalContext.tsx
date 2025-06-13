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
}

const modalContext = createContext<ModalContextType>({
  userFormModal: {
    isOpen: false,
    mode: "create",
    userData: null,
  },
  setUserFormModal: () => {},
});

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [userFormModal, setUserFormModal] = useState({
    isOpen: false,
    mode: "create",
    userData: null,
  });
  return (
    <modalContext.Provider value={{ userFormModal, setUserFormModal }}>
      {children}
    </modalContext.Provider>
  );
};

export default modalContext;
