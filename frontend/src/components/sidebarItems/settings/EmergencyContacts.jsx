import React from "react";
import { Label } from "../../../utils/Label.tsx";
import { Input } from "../../../utils/Input.tsx";
import { Button } from "../../../utils/Button.tsx";
import { Card, CardContent } from "../../../utils/Card.tsx";
const EmergencyContacts = ({
  formData,
  handleEmergencyContactChange,
  addEmergencyContact,
  removeEmergencyContact,
  handleSubmit,
}) => (
  <>
    <div className="space-y-4">
      {formData.emergency.contacts.map((contact, index) => (
        <Card key={index}>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Emergency Contact #{index + 1}</h3>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => removeEmergencyContact(index)}
              >
                Remove
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  value={contact.name}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "name", e.target.value)
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input
                  value={contact.relationship}
                  onChange={(e) =>
                    handleEmergencyContactChange(
                      index,
                      "relationship",
                      e.target.value,
                    )
                  }
                  placeholder="Spouse, Parent, etc."
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={contact.phone}
                  onChange={(e) =>
                    handleEmergencyContactChange(index, "phone", e.target.value)
                  }
                  placeholder="123-456-7890"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="outline"
        className="w-full"
        onClick={addEmergencyContact}
      >
        Add Emergency Contact
      </Button>
    </div>
    <Button onClick={() => handleSubmit("emergency")}>
      Save Emergency Contacts
    </Button>
  </>
);
export default EmergencyContacts;
