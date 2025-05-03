import { useParams } from "react-router";

export default function ChatWindow() {
  const { userId } = useParams();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="bg-secondary h-12">
        <div className="flex items-center h-full ml-2">
          <div className="flex items-center gap-2">
            <img
              src="/images/user.jpg"
              alt="user"
              className="size-8 rounded-full"
            />
            <span className="text-sm">{userId}</span>
          </div>
        </div>
      </div>
      <div className="flex-1 flex overflow-y-auto ">
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
          <div>
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
          </div>
        </div>
      </div>
      <div className="bg-secondary h-12">
        <div className="flex gap-3 items-center h-full p-3">
          <div>
            <img
              src="/icons/stickers-icon.png"
              className="size-6 invert opacity-30"
            />
          </div>
          <div>
            <img
              src="/icons/media-upload-icon.png"
              className="size-6 invert opacity-30"
            />
          </div>
          <div className="flex-1 flex items-center bg-surface rounded-md  ">
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
      <p
        className={`${
          isSentByUser ? "bg-accent/40" : "bg-secondary"
        } text-sm  m-2 mb-0 p-1.5 rounded-full px-4 flex w-fit relative pr-10`}
      >
        {message}
        <span className="text-[9px] absolute right-2 bottom-1 opacity-60">
          {time}
        </span>
      </p>
    </div>
  );
}
