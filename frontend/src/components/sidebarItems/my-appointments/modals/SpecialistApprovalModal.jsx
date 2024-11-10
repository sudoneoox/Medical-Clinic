import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../../../../utils/Dialog.tsx";
import { Button } from "../../../../utils/Button.tsx";

const SpecialistApprovalModal = ({
  open,
  onOpenChange,
  approvalReason,
  setApprovalReason,
  selectedDateTime,
  requestingApproval,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Specialist Approval Required</DialogTitle>
          <DialogDescription>
            This doctor is a specialist. You need approval from your primary
            doctor first. Would you like to submit an approval request?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <textarea
            className="w-full p-2 border rounded"
            placeholder="Reason for specialist appointment..."
            value={approvalReason}
            onChange={(e) => setApprovalReason(e.target.value)}
            rows={4}
          />
          {selectedDateTime && (
            <p className="text-sm text-gray-600">
              Requested appointment time: {selectedDateTime.toLocaleString()}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={
              requestingApproval || !approvalReason.trim() || !selectedDateTime
            }
          >
            {requestingApproval ? "Requesting..." : "Request Approval"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SpecialistApprovalModal;
