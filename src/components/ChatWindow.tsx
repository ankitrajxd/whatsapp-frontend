import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

// interface for response data
interface ChatUser {
  _id: string;
  name: string;
  profileImage: string;
}
interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content?: string; // fallback for message property
  message?: string; // fallback for content property
  timestamp: string;
}
interface ChatResponse {
  user: ChatUser;
  messages: Message[];
}

export default function ChatWindow() {
  const [msgText, setMsgText] = useState("");

  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { data, refetch } = useQuery<ChatResponse>({
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

      //  fetch all the messages related to the chat
      const messagesRes = await axios.get(
        `http://localhost:3000/chats/${chatId}/messages`,
        {
          withCredentials: true,
        }
      );

      // return the messages and the other user data
      return {
        user: otheruser.data.message,
        messages: messagesRes.data,
      };
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="bg-secondary h-12">
        <div className="flex items-center justify-between h-full mx-2 mr-3">
          <Link to={`/about/${data?.user._id}`} className="relative">
            <div className="flex items-center gap-2">
              <img
                src={data?.user.profileImage}
                alt="user"
                className="size-8 rounded-full"
              />
              <span className="text-sm">{data?.user.name}</span>
            </div>
          </Link>
          <div className="space-x-5 flex items-center">
            <button
              onClick={async () => {
                //  clear the chat
                const res = await axios.delete(
                  `http://localhost:3000/chats/clear/${chatId}`,
                  {
                    withCredentials: true,
                  }
                );

                if (res.status === 200) {
                  // refetch messages
                  refetch();
                }
              }}
              className="text-sm text-emerald-500/75 hover:opacity-80 cursor-pointer"
            >
              clear chat
            </button>
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
          <div className="flex w-full items-center justify-center">
            <p className="text-yellow-500 text-center text-xs w-lg bg-background p-3 rounded-md">
              Messages and calls are protected with end-to-end encryption and
              are only between you and the participants in this conversation.
              Not even Our team can read or listen to them. Tap to learn more.
            </p>
          </div>
          <div className="pb-4 mt-12">
            {/* Render messages dynamically */}
            {data?.messages.map((msg) => (
              <MessageBubble
                key={msg._id}
                time={new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                isSentByUser={msg.senderId !== data.user._id}
                message={msg.message ?? msg.content ?? ""}
              />
            ))}
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
              onChange={(e) => setMsgText(e.target.value)}
              value={msgText}
              type="text"
              placeholder="Type a message"
              className="flex-1 outline-none text-sm py-1.5 pl-3 placeholder:opacity-50"
            />
          </div>
          <div
            className="cursor-pointer"
            onClick={async () => {
              if (!msgText.trim()) return;
              // send message to backend
              const newMsg = {
                reciever: data?.user._id as string,
                message: msgText,
              };

              await axios.post(
                `http://localhost:3000/chats/${chatId}/messages`,
                newMsg,
                {
                  withCredentials: true,
                }
              );
              setMsgText("");
              // refetch messages
              refetch();
            }}
          >
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
        } text-sm  m-2 mb-0 p-1.5  px-4 flex w-fit relative pr-10 max-w-sm`}
      >
        {message}
        <span className="text-[9px] absolute right-2 bottom-1 opacity-60">
          {time}
        </span>
      </span>
    </div>
  );
}
