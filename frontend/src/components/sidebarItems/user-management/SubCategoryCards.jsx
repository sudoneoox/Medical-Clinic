import React from "react";

const SubCategoryCard = ({ title, icon, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer p-2 rounded-lg border transition-all ${
      isSelected
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-blue-300"
    }`}
  >
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-sm font-medium">{title}</span>
    </div>
  </div>
);

export default SubCategoryCard;
