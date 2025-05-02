import { Link, useLocation } from "react-router";

const SideBar = () => {
  const location = useLocation();

  console.log(location.pathname);

  return (
    <div className="flex h-full justify-between flex-col items-center py-4">
      <div className="flex items-center flex-col gap-5">
        <Link to={"/"}>
          <div
            className={`${
              location.pathname === "/" || location.pathname.startsWith("/chat")
                ? "bg-accent/30"
                : ""
            } flex items-center justify-center w-full rounded-full p-2`}
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
          alt="all messages"
          className="invert w-5"
        />
        <img
          src="/icons/community-logo.png"
          alt="community"
          className="invert w-5"
        />
      </div>

      <div className="flex items-center flex-col gap-4">
        <Link to={"/settings"}>
          <div
            className={`${
              location.pathname === "/settings" ? "bg-accent/30" : ""
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
              src="/images/user.jpg"
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
