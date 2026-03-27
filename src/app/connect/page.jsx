// "use client";
// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { v4 as uuidv4 } from "uuid";

// export default function LandingPage() {
//   const [joinCode, setJoinCode] = useState("");
//   const router = useRouter();

//   const createMeeting = () => {
//     const roomId = uuidv4().slice(0, 6);
//     router.push(`/meeting/${roomId}?role=host`);
//   };

//   const joinMeeting = () => {
//     if (!joinCode.trim()) return alert("Enter meeting code!");
//     router.push(`/meeting/${joinCode}?role=guest`);
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden">
//       {/* Background Decorative Glow */}
//       <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full"></div>
//       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>

//       <div className="z-10 text-center max-w-2xl">
//         <h1 className="text-6xl font-extrabold tracking-tighter mb-4 bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
//           360° CONNECT
//         </h1>
//         <p className="text-gray-400 text-lg mb-10 leading-relaxed">
//           The next generation of immersive video collaboration. Connect your 360° hardware and step into the same room, from anywhere in the world.
//         </p>

//         <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
//           <button
//             onClick={createMeeting}
//             className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-500 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
//           >
//             Start New Meeting
//           </button>

//           <div className="h-px w-full md:h-12 md:w-px bg-white/10"></div>

//           <div className="flex items-center gap-2 w-full md:w-auto">
//             <input
//               type="text"
//               placeholder="Enter Room Code"
//               value={joinCode}
//               onChange={(e) => setJoinCode(e.target.value)}
//               className="w-full px-5 py-4 bg-black/40 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 transition text-center font-mono tracking-widest"
//             />
//             <button
//               onClick={joinMeeting}
//               className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all"
//             >
//               Join
//             </button>
//           </div>
//         </div>

//         <div className="mt-12 flex justify-center gap-8 text-sm text-gray-500 font-medium uppercase tracking-widest">
//             <span>Encrypted P2P</span>
//             <span>•</span>
//             <span>Spatial Audio</span>
//             <span>•</span>
//             <span>360° Rendering</span>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import { useState,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Calendar,
  Clock,
  Users,
  Phone,
  PhoneCall,
  PhoneIncoming,
  PhoneOutgoing,
  VideoOff,
  Mic,
  MicOff,
  MoreVertical,
  Plus,
  Search,
  Filter,
  Bell,
  Settings,
  User,
  LogOut,
  ChevronRight,
  Star,
  Share2,
  Copy,
  Download,
  Play,
  Pause,
  X,
  Check,
  AlertCircle,
  Home,
  MessageSquare,
  Activity,
  BarChart,
  PieChart,
  TrendingUp,
  Award,
  Zap,
  Globe,
  Camera,
  Volume2,
  Moon,
  Sun,
  Mail,
  ChevronDown,
  Menu,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

// Dummy user data
const userData = {
  name: "Alex Johnson",
  email: "alex.johnson@holovox.com",
  avatar: "https://randomuser.me/api/portraits/men/75.jpg",
  role: "Premium Member",
  memberSince: "January 2024",
  totalCalls: 156,
  totalHours: 48.5,
  rating: 4.8,
  connections: 234,
  plan: "Pro",
  credits: 2450,
};

// Dummy ongoing calls
const ongoingCalls = [
  {
    id: 1,
    title: "UI/UX Design Review",
    participants: [
      {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "Mike Ross",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      },
      {
        name: "Emma Watson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      },
    ],
    time: "10:30 AM",
    duration: "25 mins",
    status: "live",
    host: "You",
  },
  {
    id: 2,
    title: "Client Meeting - Project Alpha",
    participants: [
      {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/21.jpg",
      },
      {
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
    ],
    time: "11:45 AM",
    duration: "15 mins",
    status: "live",
    host: "You",
  },
];

// Dummy upcoming calls
const upcomingCalls = [
  {
    id: 3,
    title: "Weekly Team Sync",
    date: "Today",
    time: "2:00 PM",
    participants: [
      {
        name: "Sarah Chen",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
      },
      {
        name: "Mike Ross",
        avatar: "https://randomuser.me/api/portraits/men/12.jpg",
      },
      {
        name: "Emma Watson",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      },
      {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      },
    ],
    duration: "1 hour",
    host: "Sarah Chen",
    status: "confirmed",
  },
  {
    id: 4,
    title: "Product Roadmap Planning",
    date: "Tomorrow",
    time: "10:00 AM",
    participants: [
      {
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/21.jpg",
      },
      {
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        name: "Bob Wilson",
        avatar: "https://randomuser.me/api/portraits/men/33.jpg",
      },
    ],
    duration: "1.5 hours",
    host: "Michael Rodriguez",
    status: "pending",
  },
  {
    id: 5,
    title: "Client Feedback Session",
    date: "Jan 15",
    time: "3:30 PM",
    participants: [
      {
        name: "Alice Brown",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
      },
      {
        name: "Tom Harris",
        avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      },
    ],
    duration: "45 mins",
    host: "Emily Watson",
    status: "confirmed",
  },
];

// Dummy call history
const callHistory = [
  {
    id: 6,
    title: "Design Sprint Review",
    date: "Yesterday",
    time: "2:30 PM",
    duration: "1h 15m",
    participants: 4,
    status: "completed",
    recording: true,
    type: "outgoing",
  },
  {
    id: 7,
    title: "Technical Architecture Discussion",
    date: "Jan 12",
    time: "11:00 AM",
    duration: "2h",
    participants: 6,
    status: "completed",
    recording: true,
    type: "incoming",
  },
  {
    id: 8,
    title: "Client Onboarding Call",
    date: "Jan 10",
    time: "3:00 PM",
    duration: "45m",
    participants: 3,
    status: "completed",
    recording: false,
    type: "outgoing",
  },
  {
    id: 9,
    title: "Weekly Standup",
    date: "Jan 8",
    time: "9:30 AM",
    duration: "30m",
    participants: 5,
    status: "completed",
    recording: true,
    type: "incoming",
  },
  {
    id: 10,
    title: "Product Demo",
    date: "Jan 5",
    time: "4:00 PM",
    duration: "1h",
    participants: 8,
    status: "completed",
    recording: true,
    type: "outgoing",
  },
];

// Quick actions
const quickActions = [
  {
    id: 1,
    title: "New Meeting",
    icon: Video,
    color: "#E9164B",
    description: "Start instantly",
  },
  {
    id: 2,
    title: "Schedule",
    icon: Calendar,
    color: "#4E54E9",
    description: "Plan ahead",
  },
  {
    id: 3,
    title: "Join with Code",
    icon: Phone,
    color: "#00C48C",
    description: "Enter meeting ID",
  },
  {
    id: 4,
    title: "Share",
    icon: Share2,
    color: "#FFB800",
    description: "Invite others",
  },
];

// Stats data
const stats = [
  {
    id: 1,
    label: "Total Calls",
    value: userData.totalCalls,
    icon: PhoneCall,
    color: "#E9164B",
    change: "+12%",
    changeType: "increase",
  },
  {
    id: 2,
    label: "Hours Spent",
    value: userData.totalHours,
    icon: Clock,
    color: "#4E54E9",
    change: "+8%",
    changeType: "increase",
  },
  {
    id: 3,
    label: "Connections",
    value: userData.connections,
    icon: Users,
    color: "#00C48C",
    change: "+23",
    changeType: "increase",
  },
  {
    id: 4,
    label: "Rating",
    value: userData.rating,
    icon: Star,
    color: "#FFB800",
    change: "4.8",
    changeType: "neutral",
  },
];

// Activity chart data (simplified)
const activityData = [
  { day: "Mon", calls: 4 },
  { day: "Tue", calls: 6 },
  { day: "Wed", calls: 8 },
  { day: "Thu", calls: 5 },
  { day: "Fri", calls: 7 },
  { day: "Sat", calls: 3 },
  { day: "Sun", calls: 2 },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [modal, setmodal] = useState(false);
   const router = useRouter();

   useEffect(() => {
  async function fetchMeeting() {
    try {
      const response = await fetch("/api/user/meeting");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json(); // <- await here
      console.log("Fetched meeting data:", jsonData);
    } catch (error) {
      console.error("Error fetching meeting data:", error);
    }
  }

  fetchMeeting();
}, []);

   const createMeeting = () => {
    const roomId = uuidv4().slice(0, 6);
    router.push(`/meeting/${roomId}?role=host`);
  };

  function MeetingModal() {
    const [joinCode, setJoinCode] = useState("");
    const router = useRouter();
    const joinMeeting = () => {
      if (!joinCode.trim()) return alert("Enter meeting code!");
      router.push(`/meeting/${joinCode}?role=guest`);
    };

    return (
      <motion.form
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">
            Enter Meeting ID to Join to Get Started
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">
              Meeting ID
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                size={20}
              />
              <input
                type="text"
                onChange={(e) => setJoinCode(e.target.value)}
                value={joinCode}
                placeholder="Enter meeting ID"
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#E9164B] transition-colors"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          onClick={joinMeeting}
          className="w-full cursor-pointer py-4 bg-linear-to-r from-[#E9164B] to-[#E9164B] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 relative overflow-hidden group"
        >
          <span className="relative z-10">Join Meeting</span>
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/30 to-transparent"></div>
        </button>
      </motion.form>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0C2A] text-white">
      {/* Background Gradient Effect */}
      <div className="fixed inset-0 bg-linear-to-br from-[#E9164B]/5 via-transparent to-[#4E54E9]/5 pointer-events-none" />

      {/* Animated Particles (simplified) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/10 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main Layout */}
      <div className="relative flex">
        {/* Sidebar */}
        <motion.div
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#111133]/90 backdrop-blur-xl border-r border-white/10 lg:translate-x-0 transform transition-transform duration-300 ease-in-out"
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#E9164B] to-[#B30E3A] flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-linear-to-r from-white to-white/80 bg-clip-text text-transparent">
                    HoloVox
                  </h1>
                  <p className="text-xs text-white/40">Premium Plan</p>
                </div>
              </div>
            </div>

            {/* User Credits */}
            <div className="p-4 mx-4 mt-4 bg-linear-to-r from-[#E9164B]/20 to-[#4E54E9]/20 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">Available Credits</span>
                <Zap className="w-4 h-4 text-[#E9164B]" />
              </div>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-bold">{userData.credits}</span>
                <span className="text-xs text-white/40">≈ 24 hours</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-3">
                <div className="w-3/4 h-full bg-linear-to-r from-[#E9164B] to-[#4E54E9] rounded-full" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              <NavItem icon={Home} label="Dashboard" active />
              <NavItem icon={Calendar} label="Calls" />
              <NavItem icon={Users} label="Contacts" />
              <NavItem icon={MessageSquare} label="Messages" />
              <NavItem icon={Activity} label="Analytics" />
              <NavItem icon={Settings} label="Settings" />
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-10 h-10 rounded-xl border-2 border-[#E9164B]"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#111133]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{userData.name}</p>
                  <p className="text-xs text-white/40">{userData.email}</p>
                </div>
                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                  <LogOut className="w-4 h-4 text-white/60" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 bg-[#0C0C2A]/80 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
                >
                  <Menu className="w-5 h-5" />
                </button>

                {/* Search */}
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search calls, meetings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-80 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-[#E9164B] transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                onClick={createMeeting}
                  className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-[#E9164B] border border-white hover:border-none rounded-lg text-sm font-medium transition"
                >
                  <Video className="w-4 h-4" />
                  Create New Meeting
                </button>
                {/* Quick Join */}
                <button
                 onClick={() => setmodal(true)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#E9164B] hover:bg-[#B30E3A] rounded-lg text-sm font-medium transition">
                  <Video className="w-4 h-4" />
                  Quick Join
                </button>

                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2 hover:bg-white/10 rounded-lg transition relative"
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-[#E9164B] rounded-full" />
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-80 bg-[#111133] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <div className="p-4 border-b border-white/10">
                          <h3 className="font-semibold">Notifications</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          <NotificationItem
                            icon={Video}
                            title="Meeting starting soon"
                            description="UI/UX Design Review in 5 minutes"
                            time="5 min ago"
                          />
                          <NotificationItem
                            icon={Users}
                            title="New participant"
                            description="Sarah Chen joined the meeting"
                            time="10 min ago"
                          />
                          <NotificationItem
                            icon={Calendar}
                            title="Meeting scheduled"
                            description="Product Roadmap for tomorrow"
                            time="1 hour ago"
                          />
                        </div>
                        <div className="p-3 border-t border-white/10">
                          <button className="w-full text-center text-sm text-[#E9164B] hover:text-[#B30E3A] transition">
                            View all notifications
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 hover:bg-white/10 rounded-lg transition"
                  >
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-8 h-8 rounded-lg"
                    />
                    <ChevronDown className="w-4 h-4 text-white/60" />
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-48 bg-[#111133] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                      >
                        <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        <button className="w-full px-4 py-3 text-left hover:bg-white/5 transition flex items-center gap-2 border-t border-white/10">
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  Welcome back, {userData.name.split(" ")[0]}! 👋
                </h2>
                <p className="text-white/60 mt-1">
                  Here's what's happening with your meetings today
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                  <Sun className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition">
                  <Moon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.id * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#E9164B]/30 transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${stat.color}20` }}
                    >
                      <stat.icon
                        className="w-6 h-6"
                        style={{ color: stat.color }}
                      />
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        stat.changeType === "increase"
                          ? "bg-green-500/20 text-green-400"
                          : stat.changeType === "decrease"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-white/10 text-white/60"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-white/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <motion.button
                    key={action.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 text-left hover:border-[#E9164B]/30 transition group"
                  >
                    <div
                      className="p-3 rounded-xl mb-3 w-fit"
                      style={{ backgroundColor: `${action.color}20` }}
                    >
                      <action.icon
                        className="w-5 h-5"
                        style={{ color: action.color }}
                      />
                    </div>
                    <h4 className="font-medium mb-1">{action.title}</h4>
                    <p className="text-xs text-white/40">
                      {action.description}
                    </p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              {/* Ongoing & Upcoming Calls */}
              <div className="lg:col-span-2 space-y-6">
                {/* Ongoing Calls */}
                {ongoingCalls.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Ongoing Calls</h3>
                      <span className="text-xs bg-[#E9164B]/20 text-[#E9164B] px-2 py-1 rounded-full">
                        {ongoingCalls.length} live
                      </span>
                    </div>
                    <div className="space-y-4">
                      {ongoingCalls.map((call) => (
                        <motion.div
                          key={call.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#E9164B]/30 transition group"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1 px-2 py-1 bg-[#E9164B]/20 rounded-full">
                                <span className="w-1.5 h-1.5 bg-[#E9164B] rounded-full animate-pulse" />
                                <span className="text-xs text-[#E9164B]">
                                  LIVE
                                </span>
                              </span>
                              <span className="text-xs text-white/40">
                                {call.time} • {call.duration}
                              </span>
                            </div>
                            <button className="p-1 hover:bg-white/10 rounded transition">
                              <MoreVertical className="w-4 h-4 text-white/60" />
                            </button>
                          </div>

                          <h4 className="font-medium mb-3">{call.title}</h4>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              {call.participants
                                .slice(0, 3)
                                .map((participant, i) => (
                                  <img
                                    key={i}
                                    src={participant.avatar}
                                    alt={participant.name}
                                    className="w-8 h-8 rounded-full border-2 border-[#0C0C2A] -ml-2 first:ml-0"
                                    title={participant.name}
                                  />
                                ))}
                              {call.participants.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-[#0C0C2A] -ml-2 flex items-center justify-center">
                                  <span className="text-xs">
                                    +{call.participants.length - 3}
                                  </span>
                                </div>
                              )}
                            </div>

                            <button className="px-4 py-2 bg-[#E9164B] hover:bg-[#B30E3A] rounded-lg text-sm font-medium transition flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Join
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upcoming Calls */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Upcoming Calls</h3>
                    <button className="text-sm text-[#E9164B] hover:text-[#B30E3A] transition">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {upcomingCalls.map((call) => (
                      <motion.div
                        key={call.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#E9164B]/30 transition group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4 text-white/40" />
                                <span className="text-sm text-white/60">
                                  {call.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4 text-white/40" />
                                <span className="text-sm text-white/60">
                                  {call.time}
                                </span>
                              </div>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  call.status === "confirmed"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                                }`}
                              >
                                {call.status}
                              </span>
                            </div>

                            <h4 className="font-medium mb-2">{call.title}</h4>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {call.participants
                                    .slice(0, 3)
                                    .map((participant, i) => (
                                      <img
                                        key={i}
                                        src={participant.avatar}
                                        alt={participant.name}
                                        className="w-6 h-6 rounded-full border-2 border-[#0C0C2A] -ml-2 first:ml-0"
                                      />
                                    ))}
                                </div>
                                <span className="text-xs text-white/40">
                                  {call.participants.length} participants •{" "}
                                  {call.duration}
                                </span>
                              </div>

                              <button className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs transition">
                                Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Activity & Profile */}
              <div className="space-y-6">
                {/* Activity Chart */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Weekly Activity</h3>
                    <div className="flex items-center gap-2">
                      <button
                        className={`text-xs px-2 py-1 rounded ${selectedTimeRange === "week" ? "bg-[#E9164B]" : "hover:bg-white/10"}`}
                      >
                        Week
                      </button>
                      <button
                        className={`text-xs px-2 py-1 rounded ${selectedTimeRange === "month" ? "bg-[#E9164B]" : "hover:bg-white/10"}`}
                      >
                        Month
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between h-32 gap-2">
                    {activityData.map((item, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-2"
                      >
                        <div
                          className="w-full bg-linear-to-t from-[#E9164B] to-[#4E54E9] rounded-t-lg transition-all duration-300 hover:opacity-80"
                          style={{ height: `${(item.calls / 8) * 100}%` }}
                        />
                        <span className="text-xs text-white/40">
                          {item.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Summary */}
                <div className="bg-linear-to-br from-[#E9164B]/20 to-[#4E54E9]/20 border border-white/10 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={userData.avatar}
                      alt={userData.name}
                      className="w-16 h-16 rounded-xl border-2 border-[#E9164B]"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{userData.name}</h3>
                      <p className="text-sm text-white/60 mb-1">
                        {userData.role}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                        <span className="text-sm font-medium">
                          {userData.rating}
                        </span>
                        <span className="text-xs text-white/40">
                          (156 reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold">{userData.totalCalls}</p>
                      <p className="text-xs text-white/40">Calls</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        {userData.totalHours}h
                      </p>
                      <p className="text-xs text-white/40">Hours</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold">
                        {userData.connections}
                      </p>
                      <p className="text-xs text-white/40">Connections</p>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition flex items-center justify-center gap-2">
                    <User className="w-4 h-4" />
                    View Profile
                  </button>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <Camera className="w-5 h-5 text-[#E9164B] mb-2" />
                    <p className="text-2xl font-bold mb-1">12</p>
                    <p className="text-xs text-white/40">Meetings this week</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <Volume2 className="w-5 h-5 text-[#4E54E9] mb-2" />
                    <p className="text-2xl font-bold mb-1">8.5h</p>
                    <p className="text-xs text-white/40">Avg. weekly time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Call History */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Recent Calls</h3>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <button className="text-xs px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full transition">
                      All
                    </button>
                    <button className="text-xs px-3 py-1 hover:bg-white/10 rounded-full transition">
                      Incoming
                    </button>
                    <button className="text-xs px-3 py-1 hover:bg-white/10 rounded-full transition">
                      Outgoing
                    </button>
                  </div>
                  <button className="text-sm text-[#E9164B] hover:text-[#B30E3A] transition">
                    View All
                  </button>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                <div className="divide-y divide-white/10">
                  {callHistory.map((call) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between p-4 hover:bg-white/5 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-2 rounded-lg ${
                            call.type === "incoming"
                              ? "bg-green-500/20"
                              : "bg-blue-500/20"
                          }`}
                        >
                          {call.type === "incoming" ? (
                            <PhoneIncoming className="w-4 h-4 text-green-400" />
                          ) : (
                            <PhoneOutgoing className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{call.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-white/40">
                            <span>
                              {call.date} at {call.time}
                            </span>
                            <span>•</span>
                            <span>{call.duration}</span>
                            <span>•</span>
                            <span>{call.participants} participants</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {call.recording && (
                          <button className="p-2 hover:bg-white/10 rounded-lg transition">
                            <Play className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 hover:bg-white/10 rounded-lg transition">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-[#0f172a] p-8 rounded-2xl w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setmodal(false)}
              className="absolute top-4 right-4 text-white hover:text-red-400"
            >
              ✕
            </button>

            <MeetingModal />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
function NavItem({ icon: Icon, label, active = false }) {
  return (
    <button
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

function NotificationItem({ icon: Icon, title, description, time }) {
  return (
    <div className="flex items-start gap-3 p-4 hover:bg-white/5 transition">
      <div className="p-2 bg-white/5 rounded-lg">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{title}</p>
        <p className="text-xs text-white/40 mb-1">{description}</p>
        <p className="text-xs text-white/20">{time}</p>
      </div>
    </div>
  );
}
