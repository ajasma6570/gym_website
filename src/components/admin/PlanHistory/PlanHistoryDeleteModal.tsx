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
import { usePlanHistoryDelete } from "@/hooks/usePlanHistory";
import modalContext from "@/context/ModalContext";

export default function PlanHistoryDeleteModal() {
  const { planHistoryDeleteModal, setPlanHistoryDeleteModal } =
    useContext(modalContext);
  const {
    mutate: deletePlanHistory,
    isPending,
    isSuccess,
  } = usePlanHistoryDelete();

  const handleConfirmDelete = () => {
    if (planHistoryDeleteModal.planHistoryId) {
      deletePlanHistory(planHistoryDeleteModal.planHistoryId);
    }
  };

  const handleClose = useCallback(() => {
    setPlanHistoryDeleteModal({
      isOpen: false,
      planHistoryId: null,
      planName: null,
      planType: null,
    });
  }, [setPlanHistoryDeleteModal]);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);

  const planTypeDisplay =
    planHistoryDeleteModal.planType === "personal_training"
      ? "Personal Training"
      : "Membership";

  return (
    <Dialog open={planHistoryDeleteModal.isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm">
            Are you sure you want to delete this {planTypeDisplay.toLowerCase()}{" "}
            plan:{" "}
            <span className="font-semibold">
              &quot;{planHistoryDeleteModal.planName}&quot;
            </span>
            ?
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This action cannot be undone and will permanently remove the plan
            from the member's history.
          </p>
          <p className="text-sm text-orange-600 mt-2 font-medium">
            ⚠️ The associated payment will also be deleted and the amount will be removed from payment history.
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
