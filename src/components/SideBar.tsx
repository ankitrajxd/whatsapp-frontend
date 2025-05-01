import { Link, useLocation } from "react-router";

const SideBar = () => {
  const location = useLocation();

  console.log(location.pathname);

  return (
    <div className="flex h-full justify-between flex-col items-center py-4">
      <div className="flex items-center flex-col gap-5">
        <Link to={"/"}>
          <div className="flex items-center justify-center w-full bg-accent rounded-full p-2">
            <img
              src="/icons/all-messages-logo.png"
              alt="all messages"
              className={`${location.pathname === "/chat" ? "invert" : "w-5"}`}
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

      <div className="flex items-center flex-col gap-5">
        <Link to={"/settings"}>
          <img
            src="/icons/settings-logo.png"
            alt="community"
            className="invert w-5"
          />
        </Link>
        <Link to={"/profile"}>
          <div className="">
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
