import { useParams } from "react-router";

export default function ChatWindow() {
  const { userId } = useParams(); // ⬅️ extract dynamic segment

  return (
    <div className="p-4 flex h-screen items-center justify-center">
      <h1 className="text-xl">Chat with: {userId}</h1>
      {/* Use userId to fetch messages, user info, etc. */}
    </div>
  );
}
