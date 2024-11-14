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

export const analyticOptions = [
  {
    id: "DEMOGRAPHICS",
    title: "User Demographics",
    icon: <Users className="w-6 h-6 text-blue-500" />,
    description: "View User age, gender, and ethnicity distribution",
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
  },
  {
    id: "APPOINTMENTS",
    title: "Appointment Analytics",
    icon: <Activity className="w-6 h-6 text-orange-500" />,
    description: "Track appointment status and distribution",
  },
  {
    id: "BILLING",
    title: "Billing Analytics",
    icon: <DollarSign className="w-6 h-6 text-purple-500" />,
    description: "Track payment status and revenue distribution",
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
];

export const DATE_RANGES = [
  { id: "all", label: "All Time" },
  { id: "today", label: "Today" },
  { id: "week", label: "This Week" },
  { id: "month", label: "This Month" },
  { id: "year", label: "This Year" },
];
