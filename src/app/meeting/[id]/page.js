"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { LiveKitService } from "@/lib/livekit-service";
import { 
  Mic, MicOff, Video, VideoOff, Phone, Maximize2, Users, Copy, Crown, 
  UserIcon, X, AlertCircle, Check
} from "lucide-react";

// Dynamically import ThreeSixtyView to avoid SSR issues
const ThreeSixtyView = dynamic(() => import('@/components/ThreeSixtyView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white/60">Loading 360° view...</p>
      </div>
    </div>
  )
});

export default function MeetingPage() {
  const { id: roomId } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const isHost = searchParams.get("role") === "host";
  
  const [liveKitService] = useState(() => new LiveKitService());
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState(new Map());
  const [participants, setParticipants] = useState(new Map());
  const [connectionState, setConnectionState] = useState("connecting");
  const [viewMode, setViewMode] = useState("360"); // Default to 360 view
  const [activeStreamId, setActiveStreamId] = useState("local");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showNotification, setShowNotification] = useState(null);
  
  const localVideoRef = useRef(null);
  const mainVideoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const notify = (message, type = "info") => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 3000);
  };

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(controlsTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("meeting_user_id") || crypto.randomUUID();
    localStorage.setItem("meeting_user_id", userId);
    
    console.log("🎬 Initializing meeting...");
    console.log(`   Room: ${roomId}`);
    console.log(`   User: ${userId}`);
    console.log(`   Role: ${isHost ? "Host" : "Guest"}`);
    
    const callbacks = {
      onConnected: () => {
        console.log("✅ Connected to meeting");
        setConnectionState("connected");
        notify("Connected to meeting", "success");
      },
      
      onLocalStream: (stream) => {
        console.log("📹 Local stream received");
        console.log(`   Video tracks: ${stream.getVideoTracks().length}`);
        console.log(`   Audio tracks: ${stream.getAudioTracks().length}`);
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          console.log("   Local video element updated");
        }
        
        if (activeStreamId === "local" && mainVideoRef.current) {
          mainVideoRef.current.srcObject = stream;
          console.log("   Main video updated with local stream");
        }
      },
      
      onVideoTrack: (participantId, stream) => {
        console.log(`📹 Video track from ${participantId}`);
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.set(participantId, stream);
          return newMap;
        });
        
        if (activeStreamId === participantId && mainVideoRef.current) {
          mainVideoRef.current.srcObject = stream;
          console.log(`   Main video updated with ${participantId}'s stream`);
        }
      },
      
      onParticipantConnected: (participantId, isHostParticipant) => {
        console.log(`👤 Participant connected: ${participantId} (Host: ${isHostParticipant})`);
        setParticipants(prev => {
          const newMap = new Map(prev);
          newMap.set(participantId, { isHost: isHostParticipant, isMuted: false, isVideoOff: false });
          return newMap;
        });
        notify(`${isHostParticipant ? "Host" : "Guest"} joined the meeting`, "info");
      },
      
      onParticipantDisconnected: (participantId) => {
        console.log(`👋 Participant disconnected: ${participantId}`);
        setParticipants(prev => {
          const newMap = new Map(prev);
          newMap.delete(participantId);
          return newMap;
        });
        setRemoteStreams(prev => {
          const newMap = new Map(prev);
          newMap.delete(participantId);
          return newMap;
        });
        
        if (activeStreamId === participantId) {
          setActiveStreamId("local");
          if (mainVideoRef.current && localStream) {
            mainVideoRef.current.srcObject = localStream;
          }
        }
        notify("Participant left", "info");
      },
      
      onUserJoined: (userId, isHostUser) => {
        console.log(`👤 User joined: ${userId}`);
        setParticipants(prev => {
          const newMap = new Map(prev);
          newMap.set(userId, { isHost: isHostUser, isMuted: false, isVideoOff: false });
          return newMap;
        });
      },
      
      onUserLeft: (userId) => {
        console.log(`👋 User left: ${userId}`);
        setParticipants(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      },
      
      onExistingParticipants: (participantsList, hostId) => {
        console.log(`📋 Existing participants: ${participantsList.length}`);
        participantsList.forEach(p => {
          setParticipants(prev => {
            const newMap = new Map(prev);
            newMap.set(p.userId, { isHost: p.isHost, isMuted: false, isVideoOff: false });
            return newMap;
          });
        });
      },
      
      onError: (error) => {
        console.error("Meeting error:", error);
        setConnectionState("error");
        notify(error, "error");
      }
    };
    
    liveKitService.joinMeeting(roomId, userId, isHost, callbacks);
    
    return () => {
      console.log("🧹 Cleaning up meeting...");
      liveKitService.leaveMeeting();
    };
  }, [roomId, isHost]);

  useEffect(() => {
    if (!mainVideoRef.current) return;
    
    console.log(`🎬 Active stream changed to: ${activeStreamId}`);
    
    let newStream = null;
    if (activeStreamId === "local") {
      newStream = localStream;
      console.log(`   Using local stream`);
    } else {
      newStream = remoteStreams.get(activeStreamId);
      console.log(`   Using remote stream from ${activeStreamId}`);
    }
    
    if (newStream) {
      console.log(`   Setting main video source`);
      mainVideoRef.current.srcObject = newStream;
    } else {
      console.log(`   No stream available for ${activeStreamId}`);
      mainVideoRef.current.srcObject = null;
    }
  }, [activeStreamId, localStream, remoteStreams]);

  const handleToggleMute = async () => {
    const muted = await liveKitService.toggleMute();
    setIsMuted(muted);
    notify(muted ? "Microphone muted" : "Microphone unmuted");
  };
  
  const handleToggleVideo = async () => {
    const off = await liveKitService.toggleVideo();
    setIsVideoOff(off);
    notify(off ? "Camera turned off" : "Camera turned on");
  };
  
  const handleLeave = async () => {
    await liveKitService.leaveMeeting();
    router.push("/home");
  };
  
  const copyInviteLink = () => {
    const link = `${window.location.origin}/meeting/${roomId}?role=guest`;
    navigator.clipboard.writeText(link);
    notify("Invite link copied!", "success");
  };
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      notify("Fullscreen mode", "info");
    } else {
      document.exitFullscreen();
    }
  };

  const activeStream = activeStreamId === "local" ? localStream : remoteStreams.get(activeStreamId);
  const participantCount = participants.size + 1;

  return (
    <div className="h-screen w-screen bg-black text-white flex overflow-hidden">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 ${
          showNotification.type === "success" ? "bg-green-600" : 
          showNotification.type === "error" ? "bg-red-600" : "bg-blue-600"
        }`}>
          {showNotification.type === "success" && <Check size={18} />}
          {showNotification.type === "error" && <AlertCircle size={18} />}
          <span className="text-sm font-medium">{showNotification.message}</span>
        </div>
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Top Bar */}
        <div className={`absolute top-0 left-0 right-0 z-20 px-6 py-4 bg-gradient-to-b from-black/60 to-transparent transition-transform duration-300 ${
          showControls ? "translate-y-0" : "-translate-y-full"
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold flex items-center gap-2">
                Meeting Room
                {isHost && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center gap-1">
                    <Crown size={12} /> Host
                  </span>
                )}
              </h1>
              <p className="text-xs text-white/60">
                Room: {roomId.slice(0, 8)}... • {participantCount} participant{participantCount !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode(m => m === "normal" ? "360" : "normal")}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition flex items-center gap-2"
              >
                {viewMode === "normal" ? (
                  <>
                    <Maximize2 size={16} />
                    Switch to 360°
                  </>
                ) : (
                  <>
                    <Video size={16} />
                    Switch to Normal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Video Area */}
        <div className="flex-1 relative bg-black overflow-hidden">
          {/* Loading Overlay */}
          {connectionState === "connecting" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/90 z-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-white/80">Connecting to meeting...</p>
                <p className="text-sm text-white/40 mt-2">Please wait</p>
              </div>
            </div>
          )}
          
          {/* Main Video - Both views always rendered, toggled via CSS */}
          <div className="w-full h-full">
            {/* Normal View */}
            <div className={`w-full h-full relative ${viewMode === "normal" ? "block" : "hidden"}`}>
              {activeStream ? (
                <video
                  ref={mainVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      {activeStreamId === "local" ? (
                        <VideoOff size={48} className="text-white/40" />
                      ) : (
                        <UserIcon size={48} className="text-white/40" />
                      )}
                    </div>
                    <p className="text-white/60">
                      {activeStreamId === "local" 
                        ? "Your camera is off" 
                        : "Waiting for video stream..."}
                    </p>
                    {activeStreamId !== "local" && (
                      <p className="text-sm text-white/40 mt-2">
                        Click on a thumbnail to switch view
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Video Mode Indicator */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg text-xs">
                Standard View
              </div>
            </div>
            
            {/* 360° View */}
            <div className={`w-full h-full ${viewMode === "360" ? "block" : "hidden"}`}>
              {activeStream ? (
                <ThreeSixtyView 
                  stream={activeStream} 
                  isVisible={viewMode === "360"}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900">
                  <div className="text-center">
                    <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-4">
                      <Maximize2 size={48} className="text-white/40" />
                    </div>
                    <p className="text-white/60">Select a video source for 360° view</p>
                    <p className="text-sm text-white/40 mt-2">
                      Click on a thumbnail below to switch
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Thumbnails Bar */}
          <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-8 pb-4 px-6 transition-transform duration-300 ${
            showControls ? "translate-y-0" : "translate-y-full"
          }`}>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
              {/* Local Thumbnail */}
              <button
                onClick={() => {
                  console.log("🖱️ Clicked local thumbnail");
                  setActiveStreamId("local");
                }}
                className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                  activeStreamId === "local" 
                    ? "border-cyan-500 shadow-lg shadow-cyan-500/30" 
                    : "border-white/20 hover:border-white/40"
                }`}
              >
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                  <UserIcon size={10} />
                  You {isHost && "👑"}
                </div>
                <div className="absolute top-1 right-1 flex gap-1">
                  {isMuted && <MicOff size={12} className="text-red-400" />}
                  {isVideoOff && <VideoOff size={12} className="text-red-400" />}
                </div>
                {activeStreamId === "local" && (
                  <div className="absolute inset-0 ring-2 ring-cyan-500 rounded-xl pointer-events-none"></div>
                )}
              </button>
              
              {/* Remote Thumbnails */}
              {Array.from(remoteStreams.entries()).map(([id, stream]) => {
                const isActive = activeStreamId === id;
                const participant = participants.get(id);
                return (
                  <button
                    key={id}
                    onClick={() => {
                      console.log(`🖱️ Clicked thumbnail for: ${id}`);
                      setActiveStreamId(id);
                    }}
                    className={`relative flex-shrink-0 w-40 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                      isActive 
                        ? "border-cyan-500 shadow-lg shadow-cyan-500/30" 
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <video
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                      ref={(el) => {
                        if (el && stream) {
                          el.srcObject = stream;
                        }
                      }}
                    />
                    <div className="absolute bottom-1 left-1 bg-black/60 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      {participant?.isHost ? <Crown size={10} /> : <UserIcon size={10} />}
                      {participant?.isHost ? "Host" : `Guest`}
                    </div>
                    {isActive && (
                      <div className="absolute inset-0 ring-2 ring-cyan-500 rounded-xl pointer-events-none"></div>
                    )}
                  </button>
                );
              })}
              
              {/* Empty state */}
              {remoteStreams.size === 0 && connectionState === "connected" && (
                <div className="flex-shrink-0 w-40 h-24 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <p className="text-xs text-white/40">Waiting for others to join...</p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Controls Bar */}
        <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20 transition-transform duration-300 ${
          showControls ? "translate-y-0" : "translate-y-24"
        }`}>
          <div className="flex gap-3 bg-black/80 backdrop-blur-xl px-4 py-3 rounded-2xl border border-white/20 shadow-2xl">
            <button
              onClick={handleToggleMute}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                isMuted ? "bg-red-600 hover:bg-red-700" : "bg-white/10 hover:bg-white/20"
              }`}
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
            
            <button
              onClick={handleToggleVideo}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${
                isVideoOff ? "bg-red-600 hover:bg-red-700" : "bg-white/10 hover:bg-white/20"
              }`}
              title={isVideoOff ? "Turn on camera" : "Turn off camera"}
            >
              {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
            </button>
            
            <button
              onClick={toggleFullscreen}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              title="Fullscreen"
            >
              <Maximize2 size={20} />
            </button>
            
            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center relative transition"
              title="Participants"
            >
              <Users size={20} />
              {participantCount > 1 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full text-xs flex items-center justify-center">
                  {participantCount}
                </span>
              )}
            </button>
            
            <button
              onClick={handleLeave}
              className="w-14 h-14 rounded-xl bg-red-600 hover:bg-red-700 flex items-center justify-center transition shadow-lg shadow-red-600/30"
              title="Leave meeting"
            >
              <Phone size={24} className="rotate-135" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 flex flex-col z-30 animate-slide-in-right">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Participants</h3>
              <p className="text-xs text-white/40 mt-1">{participantCount} in meeting</p>
            </div>
            <button onClick={() => setShowParticipants(false)} className="p-2 hover:bg-white/10 rounded-lg transition">
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium flex items-center gap-2">
                    You
                    {isHost && (
                      <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full text-xs flex items-center gap-1">
                        <Crown size={10} /> Host
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400"></span>
                    Connected
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {isMuted && <MicOff size={14} className="text-red-400" />}
                {isVideoOff && <VideoOff size={14} className="text-red-400" />}
              </div>
            </div>
            
            {Array.from(participants.entries()).map(([id, data]) => (
              <div key={id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    data.isHost ? "bg-gradient-to-br from-amber-500 to-orange-600" : "bg-white/10"
                  }`}>
                    {data.isHost ? <Crown size={18} /> : <UserIcon size={18} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {data.isHost ? "Host" : "Guest"}
                    </p>
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      Connected
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 border-t border-white/10">
            <button
              onClick={copyInviteLink}
              className="w-full bg-gradient-to-r from-[#E62064] to-[#E62064]/80 hover:from-[#E62064]/90 hover:to-[#E62064]/70 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            >
              <Copy size={16} />
              Copy Invite Link
            </button>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}