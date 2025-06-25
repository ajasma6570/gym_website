"use client";

import React, { useContext, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useUserDelete } from "@/hooks/useUserList";
import modalContext from "@/context/ModalContext";

export default function DeleteConfirmModal() {
  const { deleteConfirmModal, setDeleteConfirmModal } =
    useContext(modalContext);
  const { mutate: deleteUser, isPending, isSuccess } = useUserDelete();

  const handleConfirmDelete = () => {
    if (deleteConfirmModal.userId) {
      deleteUser(deleteConfirmModal.userId);
    }
  };

  const handleClose = useCallback(() => {
    setDeleteConfirmModal({
      isOpen: false,
      userId: null,
      userName: null,
    });
  }, [setDeleteConfirmModal]);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);

  return (
    <Dialog open={deleteConfirmModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm ">
            Are you sure you want to permanently delete the user?
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
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
