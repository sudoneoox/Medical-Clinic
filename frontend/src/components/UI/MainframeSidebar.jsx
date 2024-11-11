import { cn } from "../../utils/utils.js";
// sidebar component for navigation links and other information
const Sidebar = ({ items, currentSelected, onItemSelect }) => {
  return (
    <div className="h-screen w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5  border-b border-gray-200">
        <img src="images/logo.png" alt="Logo" className="h-8 w-auto" />
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {items.map((item, index) => {
            const isActive = currentSelected === item.label.toUpperCase();

            return (
              <li key={index}>
                {item.section === "account" && (
                  <div className="my-4 border-t border-gray-200" />
                )}
                <button
                  onClick={() => onItemSelect(item)}
                  className={cn(
                    "w-full flex items-center px-4 py-2 rounded-lg text-sm transition-all duration-200",
                    "hover:bg-gray-100",
                    isActive &&
                      "bg-blue-50 text-blue-600 font-semibold border-l-4 border-blue-600",
                    !isActive && "text-gray-700",
                  )}
                >
                  {item.icon && (
                    <span
                      className={cn(
                        "mr-3",
                        isActive ? "text-blue-600" : "text-gray-400",
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-red-50 p-3 rounded-lg">
          <p className="text-sm font-medium text-red-800">
            Emergency Hotline: 911
          </p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
