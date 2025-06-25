"use client";

import React, { useCallback, useContext, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { usePlanDelete } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";

export default function PlanDeleteConfirmModal() {
  const { planDeleteConfirmModal, setPlanDeleteConfirmModal } =
    useContext(modalContext);
  const { mutate: deletePlan, isPending, isSuccess } = usePlanDelete();

  const handleConfirmDelete = () => {
    if (planDeleteConfirmModal.planId) {
      deletePlan(planDeleteConfirmModal.planId);
    }
  };

  const handleClose = useCallback(() => {
    setPlanDeleteConfirmModal({
      isOpen: false,
      planId: null,
      planName: null,
    });
  }, [setPlanDeleteConfirmModal]);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);

  return (
    <Dialog open={planDeleteConfirmModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm ">
            Are you sure you want to delete plan{" "}
            <span className="font-semibold ">
              &quot;{planDeleteConfirmModal.planName}&quot;
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
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
