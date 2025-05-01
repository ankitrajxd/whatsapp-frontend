import { Outlet } from "react-router";
import SideBar from "../components/SideBar";
import { UserList } from "../components/UserList";

export default function MainLayout() {
  return (
    <div className="flex">
      <div className="w-[5%] h-screen bg-surface  text-white">
        <SideBar />
      </div>

      <div className="w-[25%] h-screen bg-background text-white overflow-y-auto">
        <UserList />
      </div>
      <div className="flex-1 h-screen bg-background-dark text-white overflow-y-auto">
        <Outlet /> {/* nested routes will render here */}
      </div>
    </div>
  );
}
