import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useLocation, useNavigate } from "react-router";

interface Contact {
  _id: string;
  name: string;
  email: string;
  profileImage: string;
}

interface ContactResponse {
  success: boolean;
  message: Contact[];
}

export const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const { data, isLoading, error } = useQuery<ContactResponse>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get<ContactResponse>(`${BACKEND_URL}/users`, {
        withCredentials: true,
      });
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });

  const location = useLocation();

  if (isLoading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-500">Failed to load contacts.</div>;

  return (
    <div className="h-full">
      <div>
        <div className="flex items-center justify-between p-4 pb-0">
          <h2 className="font-bold text-lg">Contacts</h2>
        </div>
        <div className="p-4 pb-0">
          <div className="flex items-center gap-2 bg-surface/70 rounded-md p-2">
            <img src="/icons/search-icon.png" className="w-5 invert" />
            <input
              type="text"
              placeholder="Search contacts"
              className="flex-1 outline-none text-sm"
            />
          </div>
        </div>
        <div className="overflow-y-auto mt-5">
          {data?.message.map((contact) => (
            <ContactItem
              onclick={async () => {
                try {
                  const chat = await axios.post(
                    `${BACKEND_URL}/chats`,
                    { receiverId: contact._id },
                    { withCredentials: true }
                  );
                  if (chat.data.success) {
                    navigate(`/chat/${chat.data.data._id}`);
                    return;
                  }
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (err: any) {
                  if (err.response && err.response.status === 404) {
                    // Chat not found, create a new one
                    const newChat = await axios.post(
                      `${BACKEND_URL}/chats/new`,
                      { otherUser: contact._id },
                      { withCredentials: true }
                    );
                    if (newChat.data.success) {
                      // clear cache
                      queryClient.invalidateQueries({ queryKey: ["chats"] });
                      navigate(`/chat/${newChat.data.data._id}`);
                      return;
                    }
                  } else {
                    // Handle other errors
                    alert("Failed to open chat.");
                  }
                }
              }}
              key={contact._id}
              contact={contact}
              selected={location.pathname === `/contacts/${contact._id}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

function ContactItem({
  contact,
  selected,
  onclick,
}: {
  contact: { _id: string; name: string; email: string; profileImage: string };
  selected: boolean;
  onclick?: () => void;
}) {
  return (
    <div className="flex flex-col gap-2" onClick={onclick}>
      <div
        className={`flex items-center gap-4 cursor-pointer hover:bg-surface/70 px-4 py-3 border-b border-surface/50 ${
          selected ? "bg-surface/70" : ""
        }`}
      >
        <img
          src={contact.profileImage}
          alt={contact.name}
          className="size-10 rounded-full"
        />
        <div className="flex flex-col flex-1 gap-0">
          <span className="text-sm font-medium">{contact.name}</span>
          <span className="text-xs text-zinc-400">{contact.email}</span>
        </div>
      </div>
    </div>
  );
}
