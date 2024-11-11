import React from "react";
import { Label } from "../../../utils/Label.tsx";
import { Input } from "../../../utils/Input.tsx";
import { Button } from "../../../utils/Button.tsx";

const PasswordSettings = ({ formData, handleInputChange, handleSubmit }) => (
  <>
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <Input
          id="currentPassword"
          type="password"
          value={formData.password.currentPassword}
          onChange={(e) =>
            handleInputChange("password", "currentPassword", e.target.value)
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input
          id="newPassword"
          type="password"
          value={formData.password.newPassword}
          onChange={(e) =>
            handleInputChange("password", "newPassword", e.target.value)
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.password.confirmPassword}
          onChange={(e) =>
            handleInputChange("password", "confirmPassword", e.target.value)
          }
        />
      </div>
    </div>
    <Button onClick={() => handleSubmit("password")}>Update Password</Button>
  </>
);

export default PasswordSettings;
