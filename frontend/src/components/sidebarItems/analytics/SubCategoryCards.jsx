import { Card, CardContent } from "../../../utils/Card.tsx";

const SubCategoryCards = ({
  type,
  analyticOptions,
  selectedSubCategory,
  onSelect,
}) => {
  const option = analyticOptions.find((opt) => opt.id === type);
  if (!option?.subCategories) return null;

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      {option.subCategories.map((subCat) => (
        <Card
          key={subCat.id}
          className={`cursor-pointer ${
            selectedSubCategory === subCat.id
              ? "border-blue-500 bg-blue-50"
              : "hover:border-blue-300"
          }`}
          onClick={() => onSelect(subCat.id)}
        >
          <CardContent className="p-2">
            <div className="flex items-center gap-2">
              {subCat.icon}
              <span className="text-sm font-medium">{subCat.title}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubCategoryCards;
