// "use client";
// import React from "react";
// import {
//   Menu,
//   Search,
//   Bell,
//   User,
//   ChevronDown,
//   Video,
//   Users,
//   Calendar,
//   Settings,
//   LogOut,
// } from "lucide-react";
// import { AnimatePresence, motion } from "framer-motion";
// import { useState } from "react";
// import { v4 as uuidv4 } from "uuid";
// import { useRouter } from "next/navigation";

// const Header = () => {
//   const router = useRouter();
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [modal, setmodal] = useState(false);
//   const createMeeting = () => {
//     const roomId = uuidv4().slice(0, 6);
//     router.push(`/meeting/${roomId}?role=host`);
//   };
//   function MeetingModal() {
//     const [joinCode, setJoinCode] = useState("");
//     const router = useRouter();
//     const joinMeeting = () => {
//       if (!joinCode.trim()) return alert("Enter meeting code!");
//       router.push(`/meeting/${joinCode}?role=guest`);
//     };

//     return (
//       <motion.form
//         initial={{ opacity: 0, x: -20 }}
//         animate={{ opacity: 1, x: 0 }}
//         className="space-y-6"
//         onSubmit={(e) => e.preventDefault()}
//       >
//         <div className="text-center mb-8">
//           <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
//           <p className="text-white/60">
//             Enter Meeting ID to Join to Get Started
//           </p>
//         </div>

//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-white/80 mb-2">
//               Meeting ID
//             </label>
//             <div className="relative">
//               <Mail
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
//                 size={20}
//               />
//               <input
//                 type="text"
//                 onChange={(e) => setJoinCode(e.target.value)}
//                 value={joinCode}
//                 placeholder="Enter meeting ID"
//                 className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B] transition-colors"
//               />
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           onClick={joinMeeting}
//           className="w-full cursor-pointer py-4 bg-linear-to-r from-[#E9164B] to-[#E9164B] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
//         >
//           <span className="relative z-10">Join Meeting</span>
//           <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
//         </button>
//       </motion.form>
//     );
//   }

//   return (
//     <header className="sticky top-0 z-40 bg-[#0C0C2A]/80 backdrop-blur-xl border-b border-white/10">
//       <div className="flex items-center justify-between px-6 py-4">
//         <div className="flex items-center gap-4">
//           <button
//             onClick={() => setSidebarOpen(!sidebarOpen)}
//             className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
//           >
//             <Menu className="w-5 h-5" />
//           </button>

//           {/* Search */}
//           <div className="relative hidden md:block">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
//             <input
//               type="text"
//               placeholder="Search calls, meetings..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-80 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#E9164B] transition-colors"
//             />
//           </div>
//         </div>

//         <div className="flex items-center gap-3">
//           <button
//             onClick={createMeeting}
//             className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-[#E9164B] border border-white hover:border-none rounded-lg text-sm font-medium transition"
//           >
//             <Video className="w-4 h-4" />
//             Create New Meeting
//           </button>
//           {/* Quick Join */}
//           <button
//             onClick={() => setmodal(true)}
//             className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#E9164B] hover:bg-[#B30E3A] rounded-lg text-sm font-medium transition"
//           >
//             <Video className="w-4 h-4" />
//             Quick Join
//           </button>

//           {/* Notifications */}
//           <div className="relative">
//             <button
//               onClick={() => setShowNotifications(!showNotifications)}
//               className="p-2 hover:bg-white/10 rounded-lg transition relative"
//             >
//               <Bell className="w-5 h-5" />
//               <span className="absolute top-1 right-1 w-2 h-2 bg-[#E9164B] rounded-full" />
//             </button>

//             <AnimatePresence>
//               {showNotifications && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="absolute right-0 mt-2 w-80 bg-[#111133] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
//                 >
//                   <div className="p-4 border-b border-white/10">
//                     <h3 className="font-semibold">Notifications</h3>
//                   </div>
//                   <div className="max-h-96 overflow-y-auto">
//                     <NotificationItem
//                       icon={Video}
//                       title="Meeting starting soon"
//                       description="UI/UX Design Review in 5 minutes"
//                       time="5 min ago"
//                     />
//                     <NotificationItem
//                       icon={Users}
//                       title="New participant"
//                       description="Sarah Chen joined the meeting"
//                       time="10 min ago"
//                     />
//                     <NotificationItem
//                       icon={Calendar}
//                       title="Meeting scheduled"
//                       description="Product Roadmap for tomorrow"
//                       time="1 hour ago"
//                     />
//                   </div>
//                   <div className="p-3 border-t border-white/10">
//                     <button className="w-full text-center text-sm text-[#E9164B] hover:text-[#B30E3A] transition">
//                       View all notifications
//                     </button>
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>

//           {/* User Menu */}
//           <div className="relative">
//             <button
//               onClick={() => setShowUserMenu(!showUserMenu)}
//               className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-lg transition"
//             >
//               <img
//                 src={userData.avatar}
//                 alt={userData.name}
//                 className="w-8 h-8 rounded-lg"
//               />
//               <ChevronDown className="w-4 h-4 text-white/60" />
//             </button>

//             <AnimatePresence>
//               {showUserMenu && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   className="absolute right-0 mt-2 w-48 bg-[#111133] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
//                 >
//                   <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2">
//                     <User className="w-4 h-4" />
//                     <span>Profile</span>
//                   </button>
//                   <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2">
//                     <Settings className="w-4 h-4" />
//                     <span>Settings</span>
//                   </button>
//                   <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2 border-t border-white/10">
//                     <LogOut className="w-4 h-4" />
//                     <span>Logout</span>
//                   </button>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </div>
//       {modal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
//           <div className="bg-[#0f172a] p-8 rounded-2xl w-full max-w-md relative">
//             {/* Close Button */}
//             <button
//               onClick={() => setmodal(false)}
//               className="absolute top-4 right-4 text-white hover:text-red-400"
//             >
//               ✕
//             </button>

//             <MeetingModal />
//           </div>
//         </div>
//       )}
//     </header>
//   );
// };

// export default Header;












"use client";
import React, { useState } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  ChevronDown,
  Video,
  Users,
  Calendar,
  Settings,
  LogOut,
  Mail,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

// ✅ Separate Modal Component
const MeetingModal = ({ onClose }) => {
  const [joinCode, setJoinCode] = useState("");
  const router = useRouter();

  const joinMeeting = () => {
    if (!joinCode.trim()) return alert("Enter meeting code!");
    router.push(`/meeting/${joinCode}?role=guest`);
    onClose(); // close modal after join
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[#0f172a] p-8 rounded-2xl w-full max-w-md relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-400"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">Join Meeting</h2>
          <p className="text-white/60 text-sm">
            Enter Meeting ID to continue
          </p>
        </div>

        <div className="relative mb-4">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
            placeholder="Enter meeting ID"
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white"
          />
        </div>

        <button
          onClick={joinMeeting}
          className="w-full py-3 bg-[#E9164B] rounded-xl text-white font-semibold hover:bg-[#B30E3A]"
        >
          Join Meeting
        </button>
      </motion.div>
    </div>
  );
};

const Header = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // ✅ Dummy user data (later replace with backend)
  const userData = {
    name: "Talha Ahmed",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  };

  const createMeeting = () => {
    const roomId = uuidv4().slice(0, 6);
    router.push(`/meeting/${roomId}?role=host`);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0C0C2A]/80 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        
        {/* Left */}
        <div className="flex items-center gap-4">
          <button className="lg:hidden p-2 hover:bg-white/10 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          
          {/* Create */}
          <button
            onClick={createMeeting}
            className="hidden cursor-pointer md:flex items-center gap-2 px-4 py-2 border border-white rounded-lg text-sm hover:bg-[#E9164B] hover:border-none transition"
          >
            <Video className="w-4 h-4" />
            Create
          </button>

          {/* Join */}
          <button
            onClick={() => setShowModal(true)}
            className="hidden cursor-pointer md:flex items-center gap-2 px-4 py-2 bg-[#E9164B] rounded-lg text-sm"
          >
            <Video className="w-4 h-4" />
            Join
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <Bell className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-72 bg-[#111133] rounded-xl p-4"
                >
                  <p className="text-sm text-white/60">
                    No new notifications
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2"
            >
              <img
                src={userData.avatar}
                className="w-8 h-8 rounded-lg"
              />
              <ChevronDown className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {showUserMenu && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute right-0 mt-2 w-48 bg-[#111133] rounded-xl"
                >
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full p-3 text-left hover:bg-white/5 flex gap-2"
                  >
                    <User className="w-4 h-4" /> Profile
                  </button>

                  <button
                    onClick={() => router.push("/settings")}
                    className="w-full p-3 text-left hover:bg-white/5 flex gap-2"
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </button>

                  <button className="w-full p-3 text-left hover:bg-white/5 flex gap-2 border-t border-white/10">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ✅ Modal */}
      {showModal && <MeetingModal onClose={() => setShowModal(false)} />}
    </header>
  );
};

export default Header;