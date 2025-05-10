import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";

// interface for response data
interface ChatResponse {
  message: {
    _id: string;
    name: string;
    profileImage: string;
  };
}

export default function ChatWindow() {
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data } = useQuery<ChatResponse>({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:3000/chats/${chatId}`, {
        withCredentials: true,
      });

      if (res.status !== 200) {
        throw new Error("Failed to fetch chat data");
      }

      // fetch the user details of the other user in the chat
      const otheruser = await axios.get(
        `http://localhost:3000/users/${res.data.message}`,
        {
          withCredentials: true,
        }
      );

      return otheruser.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  // filter out the current user from the users array and fetch the other user to display their name and image

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="bg-secondary h-12">
        <div
          className="flex items-center justify-between h-full mx-2 mr-3
        "
        >
          <div className="flex items-center gap-2">
            <img
              src={data?.message.profileImage}
              alt="user"
              className="size-8 rounded-full"
            />
            <span className="text-sm">{data?.message.name}</span>
          </div>
          <div className="space-x-3 flex items-center">
            <button className="text-sm text-emerald-500/75">clear chat</button>
            <button
              onClick={async () => {
                // delete the chat
                await axios.delete(
                  `http://localhost:3000/chats/delete/${chatId}`,
                  {
                    withCredentials: true,
                  }
                );
                //  clear the cache for the chat list
                queryClient.invalidateQueries({
                  queryKey: ["chats"],
                });
                // navigate to the chat list
                navigate("/");
              }}
              className="text-red-500 text-sm cursor-pointer hover:opacity-80"
            >
              delete
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-y-auto no-scrollbar">
        <div className="flex flex-col justify-between p-3 w-full">
          <div
            className="flex w-full items-center justify-center 
          "
          >
            <p className="text-yellow-500 text-center text-xs w-lg bg-background p-3 rounded-md">
              Messages and calls are protected with end-to-end encryption and
              are only between you and the participants in this conversation.
              Not even Our team can read or listen to them. Tap to learn more.
            </p>
          </div>
          <div className="pb-4 mt-12">
            <MessageBubble time="22:30" isSentByUser message="Hello ankit" />
            <MessageBubble time="22:33" message="Hiii! How you doing?" />
            <MessageBubble
              time="23:00"
              isSentByUser
              message="I m doing fine! what about you?"
            />
            <MessageBubble
              time="00:00"
              message="I m also fine, Its  nice weather here."
            />
            <MessageBubble time="22:30" isSentByUser message="Yeah it seems." />
            <MessageBubble
              time="01:10"
              isSentByUser
              message="Okay lets meet tomm.."
            />
            <MessageBubble time="01:11" message="okay bye" />
            <MessageBubble time="01:11" message="see ya" />
            <MessageBubble time="01:11" message="✌️" />
            <MessageBubble isSentByUser time="01:12" message="kk" />
          </div>
        </div>
      </div>
      <div className="bg-secondary h-12">
        <div className="flex gap-3 items-center h-full p-3">
          <div>
            <img
              src="/icons/media-upload-icon.png"
              className="size-6 invert opacity-30"
            />
          </div>
          <div className="flex-1 flex items-center bg-surface rounded-md  ">
            <div className="pl-2">
              <img
                src="/icons/stickers-icon.png"
                className="size-5 invert opacity-30"
              />
            </div>
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 outline-none text-sm py-1.5 pl-3 placeholder:opacity-50"
            />
          </div>
          <div>
            <img
              src="/icons/send-icon.png"
              className="size-5 invert opacity-30"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface MessageBubbleProps {
  message: string;
  isSentByUser?: boolean;
  time: string;
}

function MessageBubble({ message, isSentByUser, time }: MessageBubbleProps) {
  return (
    <div className={`flex ${isSentByUser ? "justify-end" : "justify-start"} `}>
      <span
        className={`${
          isSentByUser
            ? "bg-accent/40 rounded-tr-xs rounded-b-xl rounded-tl-xl"
            : "bg-secondary rounded-tl-xs rounded-b-xl rounded-tr-xl"
        } text-sm  m-2 mb-0 p-1.5  px-4 flex w-fit relative pr-10`}
      >
        {message}
        <span className="text-[9px] absolute right-2 bottom-1 opacity-60">
          {time}
        </span>
      </span>
    </div>
  );
}
