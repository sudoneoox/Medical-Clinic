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
  primaryDoctor,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg w-full max-w-md mx-auto p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Specialist Approval Required</DialogTitle>
            <DialogDescription>
              {primaryDoctor ? (
                <>
                  Request will be sent to your primary doctor: Dr.{" "}
                  {primaryDoctor.doctor_fname} {primaryDoctor.doctor_lname}
                </>
              ) : (
                "Loading primary doctor information..."
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
                requestingApproval ||
                !approvalReason.trim() ||
                !selectedDateTime ||
                !primaryDoctor
              }
            >
              {requestingApproval ? "Requesting..." : "Request Approval"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default SpecialistApprovalModal;
