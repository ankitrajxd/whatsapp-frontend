import { Link, useLocation } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Chat {
  _id: string;
  users: string[];
  createdAt: Date;
}

interface ChatResponse {
  currentUserId: string;
  data: Chat[];
}

export const ChatList = () => {
  const { data, isLoading, error } = useQuery<ChatResponse>({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/chats/all", {
        withCredentials: true,
      });

      const currentUserRes = await axios.get("http://localhost:3000/users/me", {
        withCredentials: true,
      });

      return {
        currentUserId: currentUserRes.data.message.id,
        data: res.data.data,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className=" h-full">
      {/* header */}
      <div>
        <div className="flex items-center justify-between p-4 pb-0">
          <h2 className="font-bold text-lg">Chats</h2>

          <div className="flex items-center gap-5">
            <Link to={"/contacts"}>
              <img
                src="/icons/start-new-chat.png"
                alt="Start new chat"
                className="invert size-5"
              />
            </Link>
            <img
              src="/icons/three-dot-menu.png"
              alt="More options"
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
            {isLoading && <div className="p-4">Loading...</div>}
            {error && (
              <div className="p-4 text-red-500">Failed to load chats.</div>
            )}
            {data?.data.map((chat) => (
              <UserChat
                key={chat._id}
                image="/icons/user-avatar.png" // Placeholder image
                user={
                  chat.users.filter((user) => user !== data.currentUserId)[0]
                }
                link={`/chat/${chat._id}`}
              />
            ))}
          </div>

          {data?.data.length == 0 && (
            <div>
              <div className="flex items-center text-sm text-zinc-400 gap-1.5 mt-1.5 p-4 pt-1.5"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function UserChat({
  image,
  user,
  link,
  time = "1m ago",
}: {
  image: string;
  user: string;
  link: string;
  time?: string;
}) {
  const location = useLocation();

  // fetch the other user
  const { data } = useQuery({
    queryKey: ["user", user],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/users/${user}`, {
        withCredentials: true,
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Use fetched user data if available
  const userData = data?.message;

  return (
    <Link to={link} className="flex flex-col gap-2 ">
      <div
        className={`flex  items-center gap-4 cursor-pointer hover:bg-surface/70 px-4 py-3 border-b border-surface/50 ${
          link === location.pathname ? "bg-surface/70" : ""
        }`}
      >
        <div>
          <img
            src={userData?.profileImage || image}
            alt={userData?.name || "user"}
            className="size-10 rounded-full"
          />
        </div>

        <div className="flex flex-col flex-1 gap-0">
          <p className="flex items-center justify-between text-sm">
            <span>{userData?.name || user}</span>
            <span className="text-xs text-zinc-400">{time}</span>
          </p>
          {userData?.email && (
            <span className="text-xs text-zinc-400">{userData.email}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
