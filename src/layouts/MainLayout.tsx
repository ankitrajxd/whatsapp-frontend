import { Outlet } from "react-router";
import SideBar from "../components/SideBar";
import { UserList } from "../components/UserList";

export default function MainLayout() {
  return (
    <>
      <div className="hidden md:flex">
        <div className="w-[4%] h-screen bg-surface  text-white border-r border-gray-700">
          <SideBar />
        </div>

        <div className="w-[25%] h-screen bg-background text-white overflow-y-auto border border-gray-800">
          <UserList />
        </div>
        <div className="flex-1 h-screen bg-background-dark text-white overflow-y-auto">
          <Outlet /> {/* nested routes will render here */}
        </div>
      </div>

      <div className="flex items-center text-sm justify-center h-screen text-center text-white bg-background-dark md:hidden">
        This is is a desktop client. Please open it on a desktop device.
      </div>
    </>
  );
}
