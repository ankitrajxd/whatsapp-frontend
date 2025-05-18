import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useRef, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { io, Socket } from "socket.io-client";

//#region Interfaces
interface ChatUser {
  _id: string;
  name: string;
  profileImage: string;
  email: string;
}
export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  content?: string;
  timestamp: string;
}
interface ChatResponse {
  user: ChatUser;
  data: Message[];
}

const fetchChatData = async (
  BACKEND_URL: string,
  chatId: string | undefined
): Promise<ChatResponse> => {
  try {
    if (!chatId) throw new Error("No chatId provided");
    const {
      data: { data: otherUserId },
    } = await axios.get(`${BACKEND_URL}/chats/${chatId}`, {
      withCredentials: true,
    });

    const {
      data: { data: otherUserData },
    } = await axios.get<{ data: ChatUser; success: boolean }>(
      `${BACKEND_URL}/users/${otherUserId}`,
      { withCredentials: true }
    );

    const {
      data: { data: chatMessages },
    } = await axios.get(`${BACKEND_URL}/chats/${chatId}/messages`, {
      withCredentials: true,
    });

    return {
      user: otherUserData,
      data: chatMessages,
    };
  } catch (error) {
    console.error("Error fetching chat data:", error);
    throw error;
  }
};

const clearChat = async (BACKEND_URL: string, chatId: string | undefined) => {
  try {
    if (!chatId) return;
    return await axios.delete(`${BACKEND_URL}/chats/clear/${chatId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error clearing chat:", error);
    throw error;
  }
};

const deleteChat = async (BACKEND_URL: string, chatId: string | undefined) => {
  try {
    if (!chatId) return;
    return await axios.delete(`${BACKEND_URL}/chats/delete/${chatId}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Error deleting chat:", error);
    throw error;
  }
};

const sendMessage = async (
  BACKEND_URL: string,
  chatId: string | undefined,
  receiverId: string,
  message: string
) => {
  try {
    if (!chatId) return;
    return await axios.post(
      `${BACKEND_URL}/chats/${chatId}/messages`,
      { reciever: receiverId, message },
      { withCredentials: true }
    );
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};


export default function ChatWindow() {
  //#region Hooks and State
  const [msgText, setMsgText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { data, refetch } = useQuery<ChatResponse>({
    queryKey: ["chat", chatId],
    queryFn: () => fetchChatData(BACKEND_URL, chatId),
    staleTime: 5 * 60 * 1000,
  });
  //#endregion

  //#region Socket Setup
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(BACKEND_URL, { withCredentials: true });
    }
    const socket = socketRef.current;

    if (chatId) {
      socket.emit("joinChat", chatId);
    }

    socket.on("newMessage", () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["lastMessage", chatId] });
    });

    return () => {
      if (chatId) {
        socket.emit("leaveChat", chatId);
      }
      socket.off("newMessage");
    };
  }, [chatId, refetch, BACKEND_URL]);
  //#endregion

  //#region Scroll to Bottom on Message Change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data?.data]);

  // Focus the text input automatically after rendering the chat window
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [chatId]);

  //#region Handlers
  const handleClearChat = async () => {
    const res = await clearChat(BACKEND_URL, chatId);
    if (res?.status === 200) refetch();
  };

  const handleDeleteChat = async () => {
    await deleteChat(BACKEND_URL, chatId);
    queryClient.invalidateQueries({ queryKey: ["chats"] });
    navigate("/");
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!msgText.trim() || !data?.user._id) return;
    await sendMessage(BACKEND_URL, chatId, data.user._id, msgText);
    setMsgText("");
    refetch();
    queryClient.invalidateQueries({ queryKey: ["lastMessage", chatId] });
  };
  //#endregion

  //#region Render
  return (
    <div className="flex flex-col justify-between h-full">
      {/* Header */}
      <div className="bg-secondary h-12">
        <div className="flex items-center justify-between h-full mx-2 mr-3">
          <Link to={`/about/${data?.user._id}`} className="relative">
            <div className="flex items-center gap-2">
              <img
                src={data?.user.profileImage}
                alt="user"
                className="size-8 rounded-full"
              />
              <div className="flex flex-col">
                <span className="text-sm">{data?.user.name}</span>
                <span className="text-[10px] text-zinc-400">last seen 12:00</span>
              </div>
            </div>
          </Link>
          <div className="space-x-5 flex items-center">
            <button
              onClick={handleClearChat}
              className="text-sm text-emerald-500/75 hover:opacity-80 cursor-pointer"
            >
              clear chat
            </button>
            <button
              onClick={handleDeleteChat}
              className="text-red-500 text-sm cursor-pointer hover:opacity-80"
            >
              delete
            </button>
          </div>
        </div>
      </div>
      {/* Messages */}
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
            {data?.data.map((msg) => (
              <MessageBubble
                key={msg._id}
                time={new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                isSentByUser={msg.senderId !== data.user._id}
                message={msg.content ?? ""}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="bg-secondary h-12">
        <form
          className="flex gap-3 items-center h-full p-3"
          onSubmit={handleSendMessage}
        >
          <div>
            <img
              src="/icons/media-upload-icon.png"
              className="size-6 invert opacity-30"
            />
          </div>
          <div className="flex-1 flex items-center bg-surface rounded-md">
            <div className="pl-2">
              <img
                src="/icons/stickers-icon.png"
                className="size-5 invert opacity-30"
              />
            </div>
            <input
              ref={inputRef}
              onChange={(e) => setMsgText(e.target.value)}
              value={msgText}
              type="text"
              placeholder="Type a message"
              className="flex-1 outline-none text-sm py-1.5 pl-3 placeholder:opacity-50"
            />
          </div>
          <button type="submit" className="cursor-pointer">
            <img
              src="/icons/send-icon.png"
              className="size-5 invert opacity-30"
            />
          </button>
        </form>
      </div>
    </div>
  );
  //#endregion
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
        } text-sm  m-2 mb-0 p-1.5  px-4 flex w-fit relative pr-10 ${message.length > 20 ? "min-w-sm" : "max-w-xs"}`}
      >
        {message}
        <span className="text-[9px] absolute right-2 bottom-1 opacity-60">
          {time}
        </span>
      </span>
    </div>
  );
}