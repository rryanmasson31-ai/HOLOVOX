"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRoomContext, useLocalParticipant, useParticipants, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check, AlertCircle, ThumbsUp, Smile, Heart, Laugh, Frown, UserIcon, Crown,
} from "lucide-react";

import TopBar from "./TopBar";
import VideoArea from "./VideoArea";
import RightSidebar from "./RightSidebar";
import WhiteboardOverlay from "./WhiteboardOverlay";
import SettingsModal from "./SettingsModal";
import SecurityModal from "./SecurityModal";

export default function MeetingUI({ isHost, roomId, router }) {
  const room = useRoomContext();
  const localParticipant = useLocalParticipant();
  const participants = useParticipants();
  const tracks = useTracks();

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const recordingStreamRef = useRef(null);

  // UI states
  const [viewMode, setViewMode] = useState("360");
  const [activeStreamId, setActiveStreamId] = useState("local");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState("good");
  const [showControls, setShowControls] = useState(true);
  const [notification, setNotification] = useState(null);
  const [hoveredParticipant, setHoveredParticipant] = useState(null);
  const [showReactions, setShowReactions] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [whiteboardMode, setWhiteboardMode] = useState("draw");
  const [whiteboardColor, setWhiteboardColor] = useState("#E62064");
  const [whiteboardData, setWhiteboardData] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showSecurity, setShowSecurity] = useState(false);
  const [meetingLocked, setMeetingLocked] = useState(false);
  const [hideProfilePictures, setHideProfilePictures] = useState(false);
  const [permissions, setPermissions] = useState({
    chat: true, shareScreen: true, startVideo: true,
    shareWhiteboard: true, renameSelf: true,
  });
  const [participantNames, setParticipantNames] = useState({});

  // Refs
  const controlsTimeoutRef = useRef(null);
  const videoRefs = useRef({});
  const chatContainerRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawingRef = useRef(false);
  const localVideoRef = useRef(null);
  const mainVideoRef = useRef(null);

  // Derive streams
  const localVideoTrack = tracks.find(
    t => t.participant.identity === localParticipant.localParticipant?.identity && t.source === Track.Source.Camera
  );
  const localStream = useMemo(() => {
    if (!localVideoTrack?.publication?.track?.mediaStream) return null;
    return new MediaStream([localVideoTrack.publication.track.mediaStreamTrack]);
  }, [localVideoTrack]);

  const remoteTracks = tracks.filter(
    t => t.participant.identity !== localParticipant.localParticipant?.identity && t.source === Track.Source.Camera
  );
  const remoteStreams = useMemo(() => {
    const map = new Map();
    remoteTracks.forEach(track => {
      const stream = new MediaStream([track.publication.track.mediaStreamTrack]);
      map.set(track.participant.identity, stream);
    });
    return map;
  }, [remoteTracks]);

  const activeStream = useMemo(() => {
    return activeStreamId === "local" ? localStream : remoteStreams.get(activeStreamId);
  }, [activeStreamId, localStream, remoteStreams]);

  const remotePeers = participants
    .filter(p => p.identity !== localParticipant.localParticipant?.identity)
    .map(p => ({
      id: p.identity,
      stream: remoteStreams.get(p.identity),
      isHost: p.metadata ? JSON.parse(p.metadata)?.isHost : false,
      isMuted: false,
      isVideoOff: false,
      name: participantNames[p.identity] || `Guest ${p.identity.slice(0, 6)}`,
    }));

  const participantCount = participants.length + 1;

  // Helper functions
  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/meeting/${roomId}?role=guest`);
    showNotification("Invite link copied to clipboard!", "success");
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Auto-hide controls
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

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      recordingStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      recordedChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Recording error:", error);
    }
  };

  const stopRecording = () => {
    const mediaRecorder = mediaRecorderRef.current;
    if (!mediaRecorder) return;
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `holovox-meeting-${Date.now()}.webm`;
      a.click();
      recordedChunksRef.current = [];
      if (recordingStreamRef.current) {
        recordingStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
    setIsRecording(false);
  };

  // Reactions
  const addReaction = (reactionType) => {
    const reaction = { id: Date.now(), type: reactionType, sender: "You", timestamp: new Date() };
    setReactions([...reactions, reaction]);
    showNotification(`You sent a ${reactionType} reaction`);
    setShowReactions(false);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== reaction.id)), 3000);
  };

  const getReactionIcon = (type) => {
    switch (type) {
      case "thumbsup": return <ThumbsUp size={24} className="text-yellow-400" />;
      case "smile": return <Smile size={24} className="text-yellow-400" />;
      case "heart": return <Heart size={24} className="text-red-400" />;
      case "laugh": return <Laugh size={24} className="text-yellow-400" />;
      case "frown": return <Frown size={24} className="text-yellow-400" />;
      default: return <Smile size={24} className="text-yellow-400" />;
    }
  };

  // Whiteboard functions
  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
    isDrawingRef.current = true;
  };

  const draw = (e) => {
    if (!isDrawingRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvasRef.current.width / rect.width);
    const y = (e.clientY - rect.top) * (canvasRef.current.height / rect.height);
    if (whiteboardMode === "erase") {
      ctxRef.current.globalCompositeOperation = "destination-out";
      ctxRef.current.lineWidth = 20;
    } else {
      ctxRef.current.globalCompositeOperation = "source-over";
      ctxRef.current.strokeStyle = whiteboardColor;
      ctxRef.current.lineWidth = 2;
    }
    ctxRef.current.lineTo(x, y);
    ctxRef.current.stroke();
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(x, y);
  };

  const stopDrawing = () => {
    isDrawingRef.current = false;
    const imageData = canvasRef.current.toDataURL();
    setWhiteboardData([...whiteboardData, imageData]);
  };

  const clearWhiteboard = () => {
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      setWhiteboardData([]);
      showNotification("Whiteboard cleared", "success");
    }
  };

  const downloadWhiteboard = () => {
    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvasRef.current.toDataURL();
    link.click();
    showNotification("Whiteboard downloaded", "success");
  };

  // Security functions
  const toggleMeetingLock = () => {
    setMeetingLocked(!meetingLocked);
    showNotification(meetingLocked ? "Meeting unlocked" : "Meeting locked - No new participants can join");
  };

  const toggleHideProfilePictures = () => {
    setHideProfilePictures(!hideProfilePictures);
    showNotification(hideProfilePictures ? "Profile pictures visible" : "Profile pictures hidden");
  };

  const updatePermissions = (permission, value) => {
    if (isHost) {
      setPermissions({ ...permissions, [permission]: value });
      showNotification(`${permission} ${value ? "enabled" : "disabled"}`, "success");
    }
  };

  const removeParticipant = (peerId) => {
    if (isHost) showNotification("Participant removed", "success");
  };

  const renameParticipant = (peerId, newName) => {
    if (permissions.renameSelf || isHost) {
      setParticipantNames({ ...participantNames, [peerId]: newName });
      showNotification("Name updated", "success");
    } else {
      showNotification("Renaming is disabled by host", "error");
    }
  };

  const endMeeting = () => {
    if (isHost) {
      showNotification("Ending meeting for everyone...", "info");
      setTimeout(async () => {
        await room.disconnect();
        router.push("/home");
      }, 1000);
    }
  };

  const leaveMeeting = async () => {
    await room.disconnect();
    router.push("/home");
  };

  // Media controls
  const toggleAudio = async () => {
    if (localParticipant.isMicrophoneEnabled) {
      await localParticipant.localParticipant.setMicrophoneEnabled(false);
      setIsMuted(true);
    } else {
      await localParticipant.localParticipant.setMicrophoneEnabled(true);
      setIsMuted(false);
    }
    showNotification(isMuted ? "Microphone unmuted" : "Microphone muted");
  };

  const toggleVideo = async () => {
    if (permissions.startVideo || isHost) {
      if (localParticipant.isCameraEnabled) {
        await localParticipant.localParticipant.setCameraEnabled(false);
        setIsVideoOff(true);
      } else {
        await localParticipant.localParticipant.setCameraEnabled(true);
        setIsVideoOff(false);
      }
      showNotification(isVideoOff ? "Camera turned on" : "Camera turned off");
    } else {
      showNotification("Video is disabled by host", "error");
    }
  };

  const toggleScreenShare = async () => {
    if (permissions.shareScreen || isHost) {
      if (isScreenSharing) {
        const screenPub = localParticipant.localParticipant.getTrackPublication(Track.Source.ScreenShare);
        if (screenPub) await screenPub.unpublish();
        setIsScreenSharing(false);
        showNotification("Stopped screen sharing");
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        const track = stream.getVideoTracks()[0];
        await localParticipant.localParticipant.publishTrack(track, { source: Track.Source.ScreenShare });
        setIsScreenSharing(true);
        showNotification("Started screen sharing");
        track.onended = () => setIsScreenSharing(false);
      }
    } else {
      showNotification("Screen sharing is disabled by host", "error");
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && permissions.chat) {
      setMessages([
        ...messages,
        { id: Date.now(), text: newMessage, sender: "You", timestamp: new Date() },
      ]);
      setNewMessage("");
      showNotification("Message sent", "success");
    } else if (!permissions.chat) {
      showNotification("Chat is disabled by host", "error");
    }
  };

  // Simulate connection quality (remove in production)
  useEffect(() => {
    const interval = setInterval(() => {
      const qualities = ["good", "average", "poor"];
      setConnectionQuality(qualities[Math.floor(Math.random() * qualities.length)]);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Initialize whiteboard canvas
  useEffect(() => {
    if (showWhiteboard && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const ctx = canvas.getContext("2d");
      ctx.strokeStyle = whiteboardColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctxRef.current = ctx;
    }
  }, [showWhiteboard, whiteboardColor]);

  return (
    <div className="h-full w-full flex overflow-hidden bg-slate-700 text-white">
      {/* Global notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 ${
              notification.type === "success" ? "bg-green-600" :
              notification.type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}
          >
            {notification.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating reactions */}
      <div className="fixed top-20 right-20 z-50 space-y-2">
        {reactions.map((reaction) => (
          <motion.div
            key={reaction.id}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/60 backdrop-blur-lg rounded-full p-3"
          >
            {getReactionIcon(reaction.type)}
          </motion.div>
        ))}
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col relative">
        <TopBar
          isHost={isHost}
          meetingLocked={meetingLocked}
          showControls={showControls}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          roomId={roomId}
        />

        <VideoArea
          viewMode={viewMode}
          setViewMode={setViewMode}
          activeStream={activeStream}
          activeStreamId={activeStreamId}
          setActiveStreamId={setActiveStreamId}
          localStream={localStream}
          localVideoRef={localVideoRef}
          mainVideoRef={mainVideoRef}
          remotePeers={remotePeers}
          hideProfilePictures={hideProfilePictures}
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          participantNames={participantNames}
          hoveredParticipant={hoveredParticipant}
          setHoveredParticipant={setHoveredParticipant}
          isHost={isHost}
          renameParticipant={renameParticipant}
          removeParticipant={removeParticipant}
          showControls={showControls}
          toggleAudio={toggleAudio}
          isRecording={isRecording}
          stopRecording={stopRecording}
          startRecording={startRecording}
          toggleVideo={toggleVideo}
          toggleScreenShare={toggleScreenShare}
          isScreenSharing={isScreenSharing}
          showReactions={showReactions}
          setShowReactions={setShowReactions}
          addReaction={addReaction}
          setShowWhiteboard={setShowWhiteboard}
          permissions={permissions}
          setShowSettings={setShowSettings}
          setShowSecurity={setShowSecurity}
          endMeeting={endMeeting}
          leaveMeeting={leaveMeeting}
          showParticipants={showParticipants}
          setShowParticipants={setShowParticipants}
          participantCount={participantCount}
          showChat={showChat}
          setShowChat={setShowChat}
          messagesCount={messages.length}
        />
      </div>

      <RightSidebar
        showParticipants={showParticipants}
        showChat={showChat}
        setShowParticipants={setShowParticipants}
        setShowChat={setShowChat}
        remotePeers={remotePeers}
        participantCount={participantCount}
        isHost={isHost}
        removeParticipant={removeParticipant}
        participantNames={participantNames}
        messages={messages}
        chatContainerRef={chatContainerRef}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        sendMessage={sendMessage}
        permissions={permissions}
        copyLink={copyLink}
      />

      {/* Whiteboard overlay */}
      {showWhiteboard && (
        <WhiteboardOverlay
          setShowWhiteboard={setShowWhiteboard}
          whiteboardMode={whiteboardMode}
          setWhiteboardMode={setWhiteboardMode}
          whiteboardColor={whiteboardColor}
          setWhiteboardColor={setWhiteboardColor}
          clearWhiteboard={clearWhiteboard}
          downloadWhiteboard={downloadWhiteboard}
          canvasRef={canvasRef}
          startDrawing={startDrawing}
          draw={draw}
          stopDrawing={stopDrawing}
        />
      )}

      {/* Modals */}
      {showSettings && <SettingsModal setShowSettings={setShowSettings} />}
      {showSecurity && isHost && (
        <SecurityModal
          setShowSecurity={setShowSecurity}
          meetingLocked={meetingLocked}
          toggleMeetingLock={toggleMeetingLock}
          hideProfilePictures={hideProfilePictures}
          toggleHideProfilePictures={toggleHideProfilePictures}
          permissions={permissions}
          updatePermissions={updatePermissions}
        />
      )}

      <style jsx>{`
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}