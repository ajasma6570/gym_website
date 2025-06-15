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
import { usePlanDelete } from "@/hooks/usePlan";
import modalContext from "@/context/ModalContext";

export default function PlanDeleteConfirmModal() {
  const { planDeleteConfirmModal, setPlanDeleteConfirmModal } =
    useContext(modalContext);
  const { mutate: deletePlan, isPending } = usePlanDelete();

  const handleConfirmDelete = () => {
    if (planDeleteConfirmModal.planId) {
      deletePlan(planDeleteConfirmModal.planId);
      handleClose();
    }
  };

  const handleClose = () => {
    setPlanDeleteConfirmModal({
      isOpen: false,
      planId: null,
      planName: null,
    });
  };

  return (
    <Dialog open={planDeleteConfirmModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
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
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
