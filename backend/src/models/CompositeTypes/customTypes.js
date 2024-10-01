import { DataTypes } from "@sequelize/core";
import { classToInvokable } from "sequelize/lib/utils";

// Workaround to get the actual ABSTRACT class
const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

class ADDRESS extends ABSTRACT {
  static key = "ADDRESS";
  toSql() {
    return DataTypes.JSON;
  }
}
class TIMESTAMP extends ABSTRACT {
  static key = "TIMESTAMP";
  
  constructor(options = {}) {
    super();
    this.options = options;
  }

  toSql() {
    let defaultSql = 'DATETIME DEFAULT CURRENT_TIMESTAMP';
    if (this.options.notNull) {
      defaultSql += ' NOT NULL';
    }
    if (this.options.onUpdate) {
      defaultSql += ' ON UPDATE CURRENT_TIMESTAMP';
    }
    return defaultSql;
  }
}

class EMERGENCY_CONTACT extends ABSTRACT {
  static key = "EMERGENCY_CONTACT";
  toSql() {
    return DataTypes.JSON;
  }
}

class INSURANCE extends ABSTRACT {
  static key = "INSURANCE";
  toSql() {
    return DataTypes.JSON;
  }
}

class MEDICATION extends ABSTRACT {
  static key = "MEDICATION";
  toSql() {
    return DataTypes.JSON;
  }
}

// Apply the workaround to all custom types
DataTypes.ADDRESS = classToInvokable(ADDRESS);
DataTypes.EMERGENCY_CONTACT = classToInvokable(EMERGENCY_CONTACT);
DataTypes.INSURANCE = classToInvokable(INSURANCE);
DataTypes.MEDICATION = classToInvokable(MEDICATION);
DataTypes.TIMESTAMP = classToInvokable(TIMESTAMP);

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

DataTypes.USER_ROLE = DataTypes.ENUM(
  "Admin",
  "Doctor",
  "Patient",
  "Nurse",
  "Receptionist"
);

DataTypes.SPECIALIST_REQUEST_STATUS = DataTypes.ENUM(
  "PENDING",
  "APPROVED",
  "REJECTED"
);

DataTypes.NOTIFICATION_TYPE = DataTypes.ENUM(
  "APPOINTMENT REMINDER",
  "TEST_RESULT_AVAILABLE",
  "PRESCRIPTION READY",
  "BILLING REMINDER",
  "GENERAL"
);

export default DataTypes;
