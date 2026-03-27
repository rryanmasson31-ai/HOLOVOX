"use client";
import React from "react";
import {
  Camera,
  Zap,
  Home,
  Calendar,
  Users,
  MessageSquare,
  Activity,
  Settings,
  LogOut,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { getTokenData } from "@/app/content/data";
import {useState, useEffect} from "react";
import { SiGoogledocs } from "react-icons/si";
import { GrDocumentNotes } from "react-icons/gr";
import { IoMdContacts } from "react-icons/io";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

   const [loading, setLoading] = useState(true);
    const [decodedUser, setDecodedUser] = useState([]);
  
  useEffect(() => {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const user = await getTokenData();
          // console.log("Decoded User:", user);
          setDecodedUser(user || {});
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchUser();
    }, []);

  // ✅ Dynamic Sidebar Config
  const navItems = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "AI Companion", icon: Calendar, path: "/ai" },
    { label: "Meetings", icon: Users, path: "/home/meetings" },
    { label: "Recordings", icon: MessageSquare, path: "/home/recording" },
    { label: "Summaries", icon: Activity, path: "/home/summaries" },
    { label: "Notes", icon: GrDocumentNotes, path: "/home/notes" },
    { label: "Docs", icon: SiGoogledocs, path: "/home/docs" },
    { label: "Contact US", icon: IoMdContacts, path: "/home/contactus" },
  ];

  const userData = {
    name: decodedUser?.name,
    email: decodedUser?.email,
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    credits: 2450,
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed lg:static inset-y-0 left-0 z-20 w-72 bg-[#111133]/90 backdrop-blur-xl border-r border-white/10"
    >
      <div className="flex flex-col h-full">
        
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          {/* <div className="flex items-center gap-3"> */}
            <div className="w-full flex items-center justify-center">
              <img
                src="/holovox-icon.png"
                alt="HoloVox Logo"
                className="w-[30%] h-[30%] object-cover"
              />
              <span className="text-2xl font-bold text-white ml-2">HoloVox</span>
            </div>
        </div>

        {/* Credits */}
        {/* <div className="p-4 mx-4 mt-4 bg-linear-to-r from-[#E9164B]/20 to-[#4E54E9]/20 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">Available Credits</span>
            <Zap className="w-4 h-4 text-[#E9164B]" />
          </div>
          <div className="flex items-end justify-between">
            <span className="text-2xl font-bold text-white">
              {userData.credits}
            </span>
            <span className="text-xs text-white/40">≈ 24 hours</span>
          </div>
        </div> */}

        {/* ✅ Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item, index) => (
            <NavItem
              key={index}
              icon={item.icon}
              label={item.label}
              active={pathname === item.path}
              onClick={() => router.push(item.path)}
            />
          ))}
        </nav>

        {/* Profile */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-10 h-10 rounded-xl border-2 border-[#E9164B]"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-white">
                {userData.name}
              </p>
              <p className="text-xs text-white/40">
                {userData.email}
              </p>
            </div>

            <button className="p-2 hover:bg-white/10 rounded-lg transition">
              <LogOut className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ✅ NavItem Component
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
        active
          ? "bg-[#E9164B] text-white"
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

export default Sidebar;