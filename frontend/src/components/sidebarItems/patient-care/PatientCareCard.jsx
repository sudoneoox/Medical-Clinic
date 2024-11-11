import React from "react";
import { Card, CardContent } from "../../../utils/Card.tsx";

const PatientCareCard = ({ option, isSelected, onClick }) => (
  <Card
    className={`cursor-pointer transition-all ${
      isSelected ? "border-blue-500 bg-blue-50" : "hover:border-blue-300"
    }`}
    onClick={onClick}
  >
    <CardContent className="p-4">
      <div className="flex items-center gap-3">
        {option.icon}
        <div>
          <h3 className="font-medium">{option.title}</h3>
          <p className="text-sm text-gray-500">{option.description}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default PatientCareCard;
