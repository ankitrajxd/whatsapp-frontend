import { Link, useLocation } from "react-router";

const contacts = [
  {
    id: "ankit",
    name: "Ankit Sharma",
    number: "+91 9876543210",
    image: "/images/user.jpg",
  },
  {
    id: "john",
    name: "John Doe",
    number: "+1 555 123 4567",
    image: "/images/john.jpg",
  },
  {
    id: "lisa",
    name: "Lisa Marie",
    number: "+44 20 7946 0958",
    image: "/images/lisa.jpg",
  },
];

export const Contacts = () => {
  const location = useLocation();

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
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              selected={location.pathname === `/contacts/${contact.id}`}
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
}: {
  contact: { id: string; name: string; number: string; image: string };
  selected: boolean;
}) {
  return (
    <Link to={`/chat/${contact.id}`} className="flex flex-col gap-2">
      <div
        className={`flex items-center gap-4 cursor-pointer hover:bg-surface/70 px-4 py-3 border-b border-surface/50 ${
          selected ? "bg-surface/70" : ""
        }`}
      >
        <img
          src={contact.image}
          alt={contact.name}
          className="size-10 rounded-full"
        />
        <div className="flex flex-col flex-1 gap-0">
          <span className="text-sm font-medium">{contact.name}</span>
          <span className="text-xs text-zinc-400">{contact.number}</span>
        </div>
      </div>
    </Link>
  );
}
