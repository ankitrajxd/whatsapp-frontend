import { useParams } from "react-router";

export default function ChatWindow() {
  const { userId } = useParams();

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="bg-surface h-12">
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
      <div className="flex-1 flex items-center justify-center">
        Messages goes here.
      </div>
      <div className="bg-surface h-12">
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
          <div className="flex-1 flex items-center bg-secondary rounded-md  ">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 outline-none text-sm p-2 pl-3 placeholder:opacity-50"
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
