import { DataTypes } from "sequelize"
import { classToInvokable } from "sequelize/lib/utils";

// Workaround to get the actual ABSTRACT class
const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;


class EMERGENCY_CONTACT extends ABSTRACT {
  static key = "EMERGENCY_CONTACT";
  toSql() {
    return "emergency_contact";
  }
}

class INSURANCE extends ABSTRACT {
  static key = "INSURANCE";
  toSql() {
    return "insurance";
  }
}

class MEDICATION extends ABSTRACT {
  static key = "MEDICATION";
  toSql() {
    return "medication";
  }
}

// Apply the workaround to all custom types
DataTypes.EMERGENCY_CONTACT = classToInvokable(EMERGENCY_CONTACT);
DataTypes.INSURANCE = classToInvokable(INSURANCE);
DataTypes.MEDICATION = classToInvokable(MEDICATION);

// Enums don't need the workaround
DataTypes.APPOINTMENT_STATUS = DataTypes.ENUM(
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
  "NO SHOW"
);
DataTypes.BILLING_STATUS = DataTypes.ENUM(
  "PAID",
  "NOT PAID",
  "IN PROGRESS",
  "CANCELLED",
  "REFUNDED"
);

DataTypes.USER_ROLE = DataTypes.ENUM("ADMIN", "DOCTOR", "PATIENT", "NURSE", "RECEPTIONIST");

DataTypes.SPECIALIST_REQUEST_STATUS = DataTypes.ENUM(
  "PENDING",
  "APPROVED",
  "REJECTED"
);

module.exports = DataTypes;
