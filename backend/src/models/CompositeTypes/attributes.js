const DataTypes = require("sequelize/lib/data-types");
const { classToInvokable } = require("sequelize/lib/utils/class-to-invokable");

// Workaround to get the actual ABSTRACT class
const ABSTRACT = DataTypes.ABSTRACT.prototype.constructor;

class PHONE_NUM extends ABSTRACT {
  static key = "PHONE_NUM";
  toSql() {
    return "phone_num";
  }
}

class NAME extends ABSTRACT {
  static key = "NAME";
  toSql() {
    return "name";
  }
}

class ADDRESS extends ABSTRACT {
  static key = "ADDRESS";
  toSql() {
    return "address";
  }
}

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
DataTypes.PHONE_NUM = classToInvokable(PHONE_NUM);
DataTypes.NAME = classToInvokable(NAME);
DataTypes.ADDRESS = classToInvokable(ADDRESS);
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
DataTypes.USER_ROLE = DataTypes.ENUM("admin", "doctor", "patient");
DataTypes.SPECIALIST_REQUEST_STATUS = DataTypes.ENUM(
  "PENDING",
  "APPROVED",
  "REJECTED"
);

module.exports = DataTypes;
