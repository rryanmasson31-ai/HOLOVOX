import { motion, AnimatePresence } from "framer-motion";
import { Video, Maximize2, MicOff, VideoOff, Crown, UserIcon, Edit, UserMinus, Smile, ThumbsUp, Heart, Laugh, Frown, Mic, ScreenShare, Paintbrush, Settings, Shield, Users, MessageSquare, Phone } from "lucide-react";
import ThreeSixtyView from "@/components/ThreeSixtyView";

export default function VideoArea({
  viewMode,
  setViewMode,
  activeStream,
  activeStreamId,
  setActiveStreamId,
  localStream,
  localVideoRef,
  mainVideoRef,
  remotePeers,
  hideProfilePictures,
  isMuted,
  isVideoOff,
  participantNames,
  hoveredParticipant,
  setHoveredParticipant,
  isHost,
  renameParticipant,
  removeParticipant,
  showControls,
  toggleAudio,
  isRecording,
  stopRecording,
  startRecording,
  toggleVideo,
  toggleScreenShare,
  isScreenSharing,
  showReactions,
  setShowReactions,
  addReaction,
  setShowWhiteboard,
  permissions,
  setShowSettings,
  setShowSecurity,
  endMeeting,
  leaveMeeting,
  showParticipants,
  setShowParticipants,
  participantCount,
  showChat,
  setShowChat,
  messagesCount,
}) {
  return (
    <div className="flex-1 flex flex-col relative bg-black overflow-hidden">
      {/* View mode toggle */}
      <div className="absolute top-24 right-6 z-30">
        <button
          onClick={() => setViewMode(viewMode === "360" ? "normal" : "360")}
          className="flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl hover:bg-white/10 transition shadow-2xl"
        >
          {viewMode === "360" ? (
            <>
              <Video size={18} className="text-cyan-400" />
              <span className="text-xs font-medium">Switch to Normal</span>
            </>
          ) : (
            <>
              <Maximize2 size={18} className="text-purple-400" />
              <span className="text-xs font-medium">Switch to 360°</span>
            </>
          )}
        </button>
      </div>

      {/* Video / 360° content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {viewMode === "360" ? (
            <motion.div
              key="360view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full"
            >
              <ThreeSixtyView stream={activeStream} isVisible={viewMode === "360"} />
            </motion.div>
          ) : (
            <motion.div
              key="normalView"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full flex items-center justify-center bg-slate-950"
            >
              <video
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                ref={mainVideoRef}
                srcObject={activeStream}
              />
              <div className="absolute bottom-10 left-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 z-20">
                <p className="text-sm font-medium flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  Standard View:{" "}
                  {activeStreamId === "local" ? "You (Local Preview)" : "Participant"}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Thumbnails bar */}
      <div className={`transition-transform duration-300 ${showControls ? "translate-y-0" : "translate-y-full"}`}>
        <div className="bg-gradient-to-t from-black/80 to-transparent pt-4 pb-4 px-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
            {/* Local thumbnail */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveStreamId("local")}
              className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                activeStreamId === "local"
                  ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                  : "border-white/10 hover:border-white/30"
              }`}
            >
              <video
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
                ref={localVideoRef}
                srcObject={localStream}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                  {!hideProfilePictures && <UserIcon size={10} />}
                  <span>{participantNames["local"] || "You"}</span>
                </div>
                <div className="flex gap-1">
                  {isMuted && <MicOff size={10} className="text-red-400" />}
                  {isVideoOff && <VideoOff size={10} className="text-red-400" />}
                </div>
              </div>
            </motion.div>

            {/* Remote thumbnails */}
            {remotePeers.map((peer) => (
              <motion.div
                key={peer.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredParticipant(peer.id)}
                onHoverEnd={() => setHoveredParticipant(null)}
                onClick={() => setActiveStreamId(peer.id)}
                className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                  activeStreamId === peer.id
                    ? "border-cyan-500 shadow-lg shadow-cyan-500/20"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <video
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  srcObject={peer.stream}
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-1 left-1 right-1 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] bg-black/60 px-2 py-1 rounded-full">
                    {peer.isHost ? (
                      <Crown size={10} className="text-amber-400" />
                    ) : (
                      !hideProfilePictures && <UserIcon size={10} />
                    )}
                    <span>{participantNames[peer.id] || peer.name}</span>
                  </div>
                  <div className="flex gap-1">
                    {peer.isMuted && <MicOff size={10} className="text-red-400" />}
                    {peer.isVideoOff && <VideoOff size={10} className="text-red-400" />}
                  </div>
                </div>
                {hoveredParticipant === peer.id && isHost && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newName = prompt("Enter new name:", participantNames[peer.id] || peer.name);
                        if (newName) renameParticipant(peer.id, newName);
                      }}
                      className="p-1 bg-white/20 rounded hover:bg-white/30"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("Remove this participant?")) removeParticipant(peer.id);
                      }}
                      className="p-1 bg-red-500/50 rounded hover:bg-red-500"
                    >
                      <UserMinus size={14} />
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls bar */}
      <div className={`transition-transform duration-300 ${showControls ? "translate-y-0" : "translate-y-full"} pb-4`}>
        <div className="flex justify-center">
          <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
            <button onClick={toggleAudio} className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
              isMuted ? "bg-red-600 hover:bg-red-700" : "bg-white/10 hover:bg-white/20"
            }`}>
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-2 rounded-lg ${isRecording ? "bg-red-600" : "bg-gray-700"}`}
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>

            <button onClick={toggleVideo} className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
              isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-white/10 hover:bg-white/20"
            }`}>
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>

            <button onClick={toggleScreenShare} className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
              isScreenSharing ? "bg-green-600 hover:bg-green-700" : "bg-white/10 hover:bg-white/20"
            }`}>
              <ScreenShare size={20} />
            </button>

            {/* Reactions button */}
            <div className="relative">
              <button
                onClick={() => setShowReactions(!showReactions)}
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Smile size={20} />
              </button>
              <AnimatePresence>
                {showReactions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-14 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-xl rounded-full p-2 flex gap-2"
                  >
                    <button onClick={() => addReaction("thumbsup")}><ThumbsUp size={20} /></button>
                    <button onClick={() => addReaction("smile")}><Smile size={20} /></button>
                    <button onClick={() => addReaction("heart")}><Heart size={20} /></button>
                    <button onClick={() => addReaction("laugh")}><Laugh size={20} /></button>
                    <button onClick={() => addReaction("frown")}><Frown size={20} /></button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Whiteboard button */}
            <button
              onClick={() => {
                if (permissions.shareWhiteboard || isHost) {
                  setShowWhiteboard(true);
                } else {
                  showNotification("Whiteboard is disabled by host", "error");
                }
              }}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <Paintbrush size={20} />
            </button>

            {/* Settings button */}
            <button
              onClick={() => setShowSettings(true)}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
            >
              <Settings size={20} />
            </button>

            {/* Security button (host only) */}
            {isHost && (
              <button
                onClick={() => setShowSecurity(true)}
                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center"
              >
                <Shield size={20} />
              </button>
            )}

            {/* Leave / End meeting */}
            <button
              onClick={isHost ? endMeeting : leaveMeeting}
              className={`w-14 h-14 rounded-xl flex items-center justify-center transition shadow-lg ${
                isHost ? "bg-red-600 hover:bg-red-700" : "bg-orange-600 hover:bg-orange-700"
              }`}
            >
              <Phone size={24} className="rotate-135" />
            </button>

            {/* Participants toggle */}
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition relative ${
                showParticipants ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <Users size={20} />
              {participantCount > 1 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
                  {participantCount}
                </span>
              )}
            </button>

            {/* Chat toggle */}
            <button
              onClick={() => setShowChat(!showChat)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition relative ${
                showChat ? "bg-cyan-600" : "bg-white/10 hover:bg-white/20"
              }`}
            >
              <MessageSquare size={20} />
              {messagesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
                  {messagesCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}