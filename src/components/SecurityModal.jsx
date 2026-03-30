import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, EyeOff, ShieldAlert } from "lucide-react";

export default function SecurityModal({
  setShowSecurity,
  meetingLocked,
  toggleMeetingLock,
  hideProfilePictures,
  toggleHideProfilePictures,
  permissions,
  updatePermissions,
}) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center"
        onClick={() => setShowSecurity(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#111133] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <ShieldAlert size={20} /> Security Settings
            </h3>
            <button onClick={() => setShowSecurity(false)} className="p-1 hover:bg-white/10 rounded">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2"><Lock size={16} /> Lock Meeting</span>
              <button
                onClick={toggleMeetingLock}
                className={`px-3 py-1 rounded-lg text-sm ${meetingLocked ? "bg-red-600" : "bg-green-600"}`}
              >
                {meetingLocked ? "Locked" : "Unlocked"}
              </button>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="flex items-center gap-2"><EyeOff size={16} /> Hide Profile Pictures</span>
              <button
                onClick={toggleHideProfilePictures}
                className={`px-3 py-1 rounded-lg text-sm ${hideProfilePictures ? "bg-green-600" : "bg-white/10"}`}
              >
                {hideProfilePictures ? "Hidden" : "Visible"}
              </button>
            </label>

            <div className="border-t border-white/10 pt-4">
              <h4 className="font-semibold mb-3">Participant Permissions</h4>
              <div className="space-y-3">
                {Object.entries(permissions).map(([key, value]) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer">
                    <span>Allow {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <button
                      onClick={() => updatePermissions(key, !value)}
                      className={`w-10 h-5 rounded-full transition ${value ? "bg-cyan-600" : "bg-white/20"} relative`}
                    >
                      <div className={`absolute w-4 h-4 rounded-full bg-white top-0.5 transition ${value ? "right-0.5" : "left-0.5"}`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}