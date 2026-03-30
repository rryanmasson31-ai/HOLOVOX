import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function SettingsModal({ setShowSettings }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center"
        onClick={() => setShowSettings(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#111133] rounded-2xl p-6 max-w-md w-full mx-4 border border-white/20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Settings</h3>
            <button onClick={() => setShowSettings(false)} className="p-1 hover:bg-white/10 rounded">
              <X size={20} />
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Video Quality</span>
                <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
                  <option>HD (720p)</option>
                  <option>Full HD (1080p)</option>
                  <option>Standard (480p)</option>
                </select>
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Audio Output</span>
                <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
                  <option>Default</option>
                  <option>Headphones</option>
                  <option>Speakers</option>
                </select>
              </label>
            </div>
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <span>Background Effects</span>
                <select className="bg-white/10 rounded-lg px-3 py-1 text-sm">
                  <option>None</option>
                  <option>Blur</option>
                  <option>Virtual Background</option>
                </select>
              </label>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}