"use client";

import React, { useContext } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUserDelete } from "@/hooks/useUserList";
import modalContext from "@/context/ModalContext";

export default function DeleteConfirmModal() {
  const { deleteConfirmModal, setDeleteConfirmModal } =
    useContext(modalContext);
  const { mutate: deleteUser, isPending } = useUserDelete();

  const handleConfirmDelete = () => {
    if (deleteConfirmModal.userId) {
      deleteUser(deleteConfirmModal.userId);
      handleClose();
    }
  };

  const handleClose = () => {
    setDeleteConfirmModal({
      isOpen: false,
      userId: null,
      userName: null,
    });
  };

  return (
    <Dialog open={deleteConfirmModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm ">
            Are you sure you want to delete user{" "}
            <span className="font-semibold ">
              &quot;{deleteConfirmModal.userName} &quot;
            </span>
            ?
          </p>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
