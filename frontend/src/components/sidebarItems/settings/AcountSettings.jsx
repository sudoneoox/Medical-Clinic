import React from "react";
import { Label } from "../../../utils/Label.tsx";
import { Input } from "../../../utils/Input.tsx";
import { Button } from "../../../utils/Button.tsx";
import { Mail, Phone } from "lucide-react";

const AccountSettings = ({ formData, handleInputChange, handleSubmit }) => (
  <>
    <div className="space-y-2">
      <Label htmlFor="username">Username</Label>
      <Input
        id="username"
        value={formData.account.username}
        onChange={(e) =>
          handleInputChange("account", "username", e.target.value)
        }
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Email Address
        </div>
      </Label>
      <Input
        id="email"
        type="email"
        value={formData.account.email}
        onChange={(e) => handleInputChange("account", "email", e.target.value)}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">
        <div className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Phone Number
        </div>
      </Label>
      <Input
        id="phone"
        value={formData.account.phone}
        onChange={(e) => handleInputChange("account", "phone", e.target.value)}
      />
    </div>
    <Button onClick={() => handleSubmit("account")}>Save Changes</Button>
  </>
);

export default AccountSettings;
