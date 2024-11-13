import { UserRound } from "lucide-react";
// Header component to display user details and quick actions

const Header = ({ userFullName, userRole }) => (
  <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Welcome {userFullName},
        </h1>
        <p className="text-2xl ml-2 text-gray-500 font-bold">
          How're you feeling today?
        </p>
      </div>
      <div className="flex items-center space-x-4">
        {/* COULD NOT IMPLEMENT  */}
        {/* <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"> */}
        {/*   <Bell className="rounded-full" /> */}
        {/* </button> */}
        <div className="flex items-center">
          <UserRound className="h-8 w-8 mr-3 rounded-full" />
          <div>
            <p className="font-semibold text-sm text-gray-800">
              {userFullName}
            </p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
        </div>
      </div>
    </div>
  </header>
);
export default Header;
