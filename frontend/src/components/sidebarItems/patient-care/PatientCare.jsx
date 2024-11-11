import React, { useState, useCallback } from "react";
import {
  CalendarCheck,
  ClipboardList,
  DollarSign,
  FileText,
  Pill,
  AlertTriangle,
} from "lucide-react";

import PatientCareCard from "./PatientCareCard";
import SubCategoryCards from "./SubCategoryCards";
import AppointmentView from "./AppointmentView/AppointmentView.jsx";
import BillingView from "./BillingView/BillingView.jsx";
import MedicalRecordsView from "./MedicalRecordsView/MedicalRecordsView.jsx";

const PatientCare = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);

  // config for items
  const categoryOptions = [
    {
      id: "APPOINTMENTS",
      title: "My Appointments",
      icon: <CalendarCheck className="w-6 h-6 text-blue-500" />,
      description: "View and manage your assigned patient appointments",
    },
    {
      id: "BILLING",
      title: "Patient Billing",
      icon: <DollarSign className="w-6 h-6 text-purple-500" />,
      description: "Manage billing for your appointments",
    },
    {
      id: "MEDICAL_RECORDS",
      title: "Medical Records",
      icon: <ClipboardList className="w-6 h-6 text-green-500" />,
      description: "Access and manage patient medical records",
      subCategories: [
        {
          id: "PRESCRIPTIONS",
          title: "Prescriptions",
          icon: <Pill className="w-4 h-4" />,
        },
        {
          id: "RECORDS",
          title: "Medical Records",
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: "ALLERGIES",
          title: "Patient Allergies",
          icon: <AlertTriangle className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleCategorySelect = useCallback((categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubCategory(null);
    const option = categoryOptions.find((opt) => opt.id === categoryId);
    if (option?.subCategories) {
      setSelectedSubCategory(option.subCategories[0].id);
    }
  }, []);

  const handleSubCategorySelect = useCallback((subCategoryId) => {
    setSelectedSubCategory(subCategoryId);
  }, []);

  const renderContent = () => {
    switch (selectedCategory) {
      case "APPOINTMENTS":
        return <AppointmentView />;
      case "BILLING":
        return <BillingView />;
      case "MEDICAL_RECORDS":
        return <MedicalRecordsView selectedSubCategory={selectedSubCategory} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Patient Care Portal</h2>
        <p className="text-gray-600 mb-6">
          Manage your patient appointments, records, and billing
        </p>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {categoryOptions.map((option) => (
            <PatientCareCard
              key={option.id}
              option={option}
              isSelected={selectedCategory === option.id}
              onClick={() => handleCategorySelect(option.id)}
            />
          ))}
        </div>

        {/* Sub Categories for Medical Records */}
        {selectedCategory === "MEDICAL_RECORDS" && (
          <SubCategoryCards
            type={selectedCategory}
            categoryOptions={categoryOptions}
            selectedSubCategory={selectedSubCategory}
            onSelect={handleSubCategorySelect}
          />
        )}

        {/* Content Area */}
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  );
};

export default PatientCare;
