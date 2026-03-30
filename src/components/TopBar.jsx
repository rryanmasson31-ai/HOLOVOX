import { motion } from "framer-motion";
import { Crown, Lock, Maximize2, Minimize2 } from "lucide-react";

export default function TopBar({
  isHost,
  meetingLocked,
  showControls,
  toggleFullscreen,
  isFullscreen,
  roomId,
}) {
  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: showControls ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="absolute top-0 left-0 right-0 z-20 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#E62064] to-[#E62064]/40 flex items-center justify-center">
          <span className="text-lg font-bold">H</span>
        </div>
        <div>
          <h1 className="text-sm font-semibold flex items-center gap-2">
            Business Weekly Meeting
            {isHost && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center gap-1">
                <Crown size={12} /> Host
              </span>
            )}
            {meetingLocked && (
              <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full text-xs flex items-center gap-1">
                <Lock size={10} /> Locked
              </span>
            )}
          </h1>
          <p className="text-xs text-white/80">Room: {roomId}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-white/5 rounded-lg">
          <span className="text-xs font-mono">00:15:23</span>
        </div>
        <button onClick={toggleFullscreen} className="p-2 hover:bg-white/10 rounded-lg transition">
          {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>
    </motion.div>
  );
}