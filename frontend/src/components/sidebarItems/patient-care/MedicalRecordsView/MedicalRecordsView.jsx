import React from "react";
import PrescriptionView from "./subcategories/PrescriptionView.jsx";
import RecordsView from "./subcategories/RecordsView.jsx";
import AllergiesView from "./subcategories/AllergiesView.jsx";
import { Card } from "../../../../utils/Card.tsx";

const MedicalRecordsView = ({ selectedSubCategory }) => {
  const renderSubCategory = () => {
    switch (selectedSubCategory) {
      case "PRESCRIPTIONS":
        return <PrescriptionView />;
      case "RECORDS":
        return <RecordsView />;
      case "ALLERGIES":
        return <AllergiesView />;
      default:
        return <RecordsView />;
    }
  };

  return <Card className="mt-4">{renderSubCategory()}</Card>;
};

export default MedicalRecordsView;
