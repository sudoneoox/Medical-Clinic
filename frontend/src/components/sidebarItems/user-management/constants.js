import { Users, FileUser } from "lucide-react";

export const userOptions = [
  {
    id: "EMPLOYEEMANAGE",
    title: "Employee's",
    icon: <Users className="w-6 h-6 text-blue-500" />,
    description: "View Employees enrolled into the system",
    subCategories: [
      {
        id: "RECEPTIONISTMANAGE",
        title: "Receptionist",
        icon: <FileUser className="w-4 h-4" />,
      },
      {
        id: "DOCTORMANAGE",
        title: "Doctors",
        icon: <FileUser className="w-4 h-4" />,
      },
      {
        id: "NURSEMANAGE",
        title: "Nurses",
        icon: <FileUser className="w-4 h-4" />,
      },
    ],
  },
  {
    id: "PATIENTSMANAGE",
    title: "Patients",
    icon: <Users className="w-6 h-6 text-blue-500" />,
    description: "View patients enrolled into the system",
  },
  {
    id: "ADDEMPLOYEE",
    title: "New Employee",
    icon: <Users className="w-6 h-6 text-orange-500" />,
    description: "Add a new employee into the system",
  },
];
