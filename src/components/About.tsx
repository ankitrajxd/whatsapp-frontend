import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { User } from "../store/AuthStore";
import axios from "axios";

const About = () => {
  const { userId } = useParams();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const { data } = useQuery<User>({
    queryKey: ["aboutUser", userId],
    queryFn: async () => {
      const res = await axios.get(`${BACKEND_URL}/users/${userId}`, {
        withCredentials: true,
      });
      return res.data.message;
    },
    staleTime: 5 * 60 * 1000,
  });
  return (
    <div className="flex justify-center items-center min-h-screen bg-background-dark">
      <div className="w-full max-w-sm bg-background rounded-lg shadow border border-surface p-0">
        {/* Header */}
        <div className="flex flex-col items-center py-8 px-6 border-b border-surface">
          <div className="relative">
            <img
              src={data?.profileImage}
              alt="profile"
              className="w-28 h-28 rounded-full border-4 border-accent object-cover shadow"
            />
          </div>
          <div className="mt-4 text-center">
            <div className="text-xl font-semibold text-white">{data?.name}</div>
            <div className="text-sm text-zinc-400 mt-1">{data?.email}</div>
          </div>
        </div>
        {/* Details */}
        <div className="px-8 py-6 flex flex-col gap-6">
          <div>
            <div className="text-xs text-zinc-400 mb-1">Full Name</div>
            <div className="bg-surface rounded-md text-sm px-4 py-2 text-white font-medium">
              {data?.name}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 mb-1">Email Address</div>
            <div className="bg-surface rounded-md text-sm px-4 py-2 text-zinc-300">
              {data?.email}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
