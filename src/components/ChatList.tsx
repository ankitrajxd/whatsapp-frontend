import { Link, useLocation } from "react-router";

export const ChatList = () => {
  return (
    <div className=" h-full">
      {/* header */}
      <div>
        <div className="flex items-center justify-between p-4 pb-0">
          <h2 className="font-bold text-lg">Chats</h2>

          <div className="flex items-center gap-5">
            <img
              src="/icons/start-new-chat.png"
              alt="Start new chat"
              className="invert size-5"
            />
            <img
              src="/icons/three-dot-menu.png"
              alt="Start new chat"
              className="invert size-5"
            />
          </div>
        </div>

        <div className="">
          <div className="p-4 pb-0">
            <div className="flex items-center gap-2 bg-surface/70 rounded-md p-2 ">
              <img src="/icons/search-icon.png" className="w-5 invert" />
              <input
                type="text"
                placeholder="Search"
                className="flex-1 outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 mt-1.5 p-4 pt-1.5">
              <span className="text-[12px] px-2 py-0.5 bg-accent/20 text-accent rounded-full">
                All
              </span>
              <span className="text-[12px] px-2 py-0.5 bg-secondary text-zinc-400 rounded-full">
                Unread
              </span>
              <span className="text-[12px] px-2 py-0.5 bg-secondary text-zinc-400 rounded-full">
                Favourites
              </span>
              <span className="text-[12px] px-2 py-0.5 bg-secondary text-zinc-400 rounded-full">
                Groups
              </span>
            </div>
          </div>

          {/* chat list */}
          <div className="overflow-y-auto">
            <UserChat
              image="/images/user.jpg"
              time="yesterday"
              link="/chat/ankit"
              user="Ankit"
              message="Hello world ✌️"
            />
            <UserChat
              image="/images/john.jpg"
              link="/chat/john"
              user="John"
              message="Did you install the right npm package?"
            />
            <UserChat
              image="/images/lisa.jpg"
              link="/chat/lisa"
              user="Lisa Marie"
              time="22:30"
              message="Yo whatsupp!"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

function UserChat({
  image,
  user,
  message,
  link,
  time = "1m ago",
}: {
  image: string;
  user: string;
  message: string;
  link: string;
  time?: string;
}) {
  const location = useLocation();

  return (
    <Link to={link} className="flex flex-col gap-2 ">
      <div
        className={`flex  items-center gap-4 cursor-pointer hover:bg-surface/70 px-4 py-3 border-b border-surface/50 ${
          link === location.pathname ? "bg-surface/70" : ""
        }`}
      >
        <div>
          <img src={image} alt="user" className="size-10 rounded-full" />
        </div>

        <div className="flex flex-col flex-1 gap-0">
          <p className="flex items-center justify-between text-sm">
            <span>{user}</span>
            <span className="text-xs text-zinc-400">{time}</span>
          </p>
          <span className="text-xs text-zinc-400 ">
            <span>{message}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
