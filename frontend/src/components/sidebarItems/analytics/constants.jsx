import {
  Building2,
  Users,
  Activity,
  Calendar,
  UserSquare2,
  Globe2,
  DollarSign,
  TrendingUp,
  CreditCard,
} from "lucide-react";

export const FILTER_TYPES = {
  OFFICE: "office",
  DATE_RANGE: "dateRange",
  ROLE: "role",
  STATUS: "status",
};

export const STATUSES = {
  APPOINTMENT: [
    { id: "all", label: "All Statuses" },
    { id: "CONFIRMED", label: "Confirmed" },
    { id: "CANCELLED", label: "Cancelled" },
    { id: "COMPLETED", label: "Completed" },
    { id: "NO SHOW", label: "No Show" },
    { id: "PENDING", label: "Pending" },
  ],
  PAYMENT: [
    { id: "all", label: "All Statuses" },
    { id: "PAID", label: "Paid" },
    { id: "NOT PAID", label: "Not Paid" },
    { id: "IN PROGRESS", label: "In Progress" },
    { id: "CANCELLED", label: "Cancelled" },
    { id: "REFUNDED", label: "Refunded" },
  ],
};

export const analyticOptions = [
  {
    id: "DEMOGRAPHICS",
    title: "User Demographics",
    icon: <Users className="w-6 h-6 text-blue-500" />,
    description: "View User age, gender, and ethnicity distribution",
    availableFilters: [FILTER_TYPES.ROLE, FILTER_TYPES.DATE_RANGE],
    subCategories: [
      {
        id: "GENDER",
        title: "Gender Distribution",
        icon: <UserSquare2 className="w-4 h-4" />,
      },
      {
        id: "AGE",
        title: "Age Groups",
        icon: <Calendar className="w-4 h-4" />,
      },
      {
        id: "ETHNICITY",
        title: "Ethnicity",
        icon: <Globe2 className="w-4 h-4" />,
      },
    ],
  },
  {
    id: "STAFF",
    title: "Staff Distribution",
    icon: <Building2 className="w-6 h-6 text-green-500" />,
    description: "Analyze staff roles and office assignments",
    availableFilters: [
      FILTER_TYPES.OFFICE,
      FILTER_TYPES.ROLE,
      FILTER_TYPES.SPECIALTY,
    ],
  },
  {
    id: "APPOINTMENTS",
    title: "Appointment Analytics",
    icon: <Activity className="w-6 h-6 text-orange-500" />,
    description: "Track appointment status and distribution",
    availableFilters: [
      FILTER_TYPES.OFFICE,
      FILTER_TYPES.DATE_RANGE,
      FILTER_TYPES.STATUS,
    ],
  },
  {
    id: "BILLING",
    title: "Billing Analytics",
    icon: <DollarSign className="w-6 h-6 text-purple-500" />,
    description: "Track payment status and revenue distribution",
    availableFilters: [FILTER_TYPES.DATE_RANGE, FILTER_TYPES.STATUS],
    subCategories: [
      {
        id: "PAYMENT_STATUS",
        title: "Payment Status",
        icon: <CreditCard className="w-4 h-4" />,
      },
      {
        id: "REVENUE",
        title: "Revenue Analysis",
        icon: <TrendingUp className="w-4 h-4" />,
      },
    ],
  },
];

export const OFFICE_LIST = [
  { office_id: 1, office_name: "Main Clinic" },
  { office_id: 2, office_name: "North Branch" },
  { office_id: 3, office_name: "South Branch" },
];

export const ROLE_LIST = [
  { user_role: "Patient" },
  { user_role: "Doctor" },
  { user_role: "Receptionists" },
  { user_role: "Nurse" },
  { user_role: "Admin" },
];

export const SPECIALTIES = [
  { id: 1, name: " Family Medicine" },
  { id: 2, name: " Internal Medicine" },
  { id: 3, name: " Pediatrics" },
  { id: 4, name: " Obstetrics and Gynecology" },
  { id: 5, name: " General Surgery" },
  { id: 6, name: " Psychiatry" },
  { id: 7, name: " Cardiology" },
  { id: 8, name: " Dermatology" },
  { id: 9, name: " Orthopedics" },
  { id: 10, name: " Neurology" },
  { id: 11, name: " Oncology" },
  { id: 12, name: " Emergency Medicine" },
  { id: 13, name: " Gastroenterology" },
  { id: 14, name: " Endocrinology" },
  { id: 15, name: "  Urology" },
];
