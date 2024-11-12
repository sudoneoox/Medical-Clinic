import React, { useState } from "react";
import { Card, CardContent } from "../../../../utils/Card.tsx";
import { Textarea } from "../../../../utils/TextArea.tsx";
import { Button } from "../../../../utils/Button.tsx";
import { CheckCircle, Edit, Plus } from "lucide-react";
import { format } from "date-fns";

const AppointmentCard = ({
  appointment,
  onStatusUpdate,
  onAddNote,
  onEditNote,
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmitNote = async () => {
    await onAddNote(appointment.appointment_id, noteText);
    setNoteText("");
    setIsAddingNote(false);
  };

  const handleComplete = async () => {
    await onStatusUpdate(appointment.appointment_id, "COMPLETED");
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">
              {appointment.patient_fname} {appointment.patient_lname}
            </h3>
            <p className="text-sm text-gray-500">
              {format(new Date(appointment.appointment_datetime), "PPp")}
            </p>
            <p className="text-sm text-gray-500">
              Duration: {appointment.duration}
            </p>
            <p className="text-sm text-gray-500">
              Office: {appointment.office_name}
            </p>
            {appointment.reason && (
              <p className="text-sm text-gray-600 mt-2">
                Reason: {appointment.reason}
              </p>
            )}
            {appointment.status && (
              <p className="text-sm text-gray-600 ">
                Status: {appointment.status}
              </p>
            )}
          </div>
          <div className="space-x-2">
            {appointment.status !== "COMPLETED" && (
              <Button variant="outline" size="sm" onClick={handleComplete}>
                <CheckCircle className="w-4 h-4 mr-1" />
                Complete
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotes(!showNotes)}
            >
              {showNotes ? "Hide Notes" : "Show Notes"}
            </Button>
          </div>
        </div>

        {/* Notes Section */}
        {showNotes && (
          <div className="mt-4 border-t pt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Appointment Notes</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingNote(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Note
              </Button>
            </div>

            {/* Add Note Form */}
            {isAddingNote && (
              <div className="mb-4 space-y-2">
                <Textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter your note..."
                  className="min-h-[100px]"
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAddingNote(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmitNote}
                    disabled={!noteText.trim()}
                  >
                    Save Note
                  </Button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-2">
              {appointment.notes?.map((note) => (
                <div
                  key={note.note_id}
                  className="bg-gray-50 p-3 rounded-md text-sm"
                >
                  <div className="flex justify-between items-start">
                    <p>{note.note_text}</p>
                    {note.created_by_nurse ===
                      parseInt(localStorage.getItem("nurseId")) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditNote(note.note_id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Added by {note.created_by_nurse_name} on{" "}
                    {format(new Date(note.created_at), "PP")}
                  </p>
                </div>
              ))}
              {(!appointment.notes || appointment.notes.length === 0) && (
                <p className="text-sm text-gray-500 italic">No notes yet</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentCard;
