import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useLocation } from "react-router";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const SideBar = () => {
  const { data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/users/me`, {
        withCredentials: true,
      });

      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const location = useLocation();

  return (
    <div className="flex h-full justify-between  flex-col items-center py-4">
      <div className="flex items-center flex-col gap-5 px-2">
        <Link to={"/"} className="w-8 rounded-full">
          <div
            className={`${
              location.pathname === "/" || location.pathname.startsWith("/chat")
                ? "bg-zinc-500/25"
                : ""
            } flex items-center justify-center rounded-full p-2`}
          >
            <img
              src="/icons/all-messages-logo.png"
              alt="all messages"
              className="w-5 invert"
            />
          </div>
        </Link>
        <img
          src="/icons/all-statuses-logo.png"
          alt="all stauses"
          className="invert w-5"
        />

        <Link to={"/contacts"} className="w-8 rounded-full">
          <div
            className={`${
              location.pathname.startsWith("/contacts") ? "bg-zinc-500/25" : ""
            } flex items-center justify-center w-full rounded-full p-2`}
          >
            <img
              src="/icons/community-logo.png"
              alt="contacts"
              className="invert w-5"
            />
          </div>
        </Link>
      </div>

      <div className="flex items-center flex-col gap-4">
        <Link to={"/settings"}>
          <div
            className={`${
              location.pathname === "/settings" ? "bg-zinc-500/25" : ""
            } flex items-center justify-center w-full rounded-full p-2`}
          >
            <img
              src="/icons/settings-logo.png"
              alt="community"
              className="invert w-5"
            />
          </div>
        </Link>
        <Link to={"/profile"}>
          <div
            className={`${
              location.pathname === "/profile"
                ? "outline-accent outline-2 rounded-full"
                : ""
            } flex items-center justify-center w-full rounded-full`}
          >
            <img
              src={data?.profileImage}
              alt="user"
              className="w-8 rounded-full"
            />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SideBar;
