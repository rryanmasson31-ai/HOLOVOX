"use client";

import { useEffect, useRef, useState } from "react";
import liveKitService from "@/lib/livekit-service";

export default function MeetingPage({ params }) {
  const { id } = params;

  const localVideoRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [participants, setParticipants] = useState([]);

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [micEnabled, setMicEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // 🔥 JOIN MEETING
  useEffect(() => {
    async function start() {
      const res = await fetch("http://localhost:3001/get-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: id,
          identity: "user-" + Math.floor(Math.random() * 10000),
        }),
      });

      const { token, url } = await res.json();

      await liveKitService.joinMeeting(url, token, {
        onLocalStream: (stream) => {
          setLocalStream(stream);
        },

        onRemoteStream: ({ id, stream }) => {
          setParticipants((prev) => {
            const exists = prev.find((p) => p.id === id);

            if (exists) {
              return prev.map((p) =>
                p.id === id ? { ...p, stream } : p
              );
            }

            return [...prev, { id, stream }];
          });
        },
      });
    }

    start();
  }, [id]);

  // 🔥 LOCAL VIDEO BIND
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      const video = localVideoRef.current;

      video.srcObject = localStream;
      video.muted = true;
      video.playsInline = true;

      video.play().catch(() => {});
    }
  }, [localStream]);

  return (
    <div className="w-full h-screen bg-black text-white flex flex-col">

      {/* HEADER */}
      <div className="p-3 border-b border-gray-800">
        Meeting ID: {id}
      </div>

      {/* VIDEO AREA */}
      <div className="flex flex-1 gap-2 p-2">

        {/* LOCAL */}
        <div className="w-64 h-40 bg-gray-900">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* REMOTE */}
        <div className="flex-1 grid grid-cols-3 gap-2">
          {participants.map((p) => (
            <RemoteVideo key={p.id} stream={p.stream} />
          ))}
        </div>
      </div>

      {/* CONTROLS */}
      <div className="p-3 flex justify-center gap-3 bg-gray-900">

        {/* VIDEO */}
        <button
          onClick={() => {
            const newState = !videoEnabled;
            setVideoEnabled(newState);
            liveKitService.toggleVideo(newState);
          }}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          {videoEnabled ? "Cam Off" : "Cam On"}
        </button>

        {/* MIC */}
        <button
          onClick={() => {
            const newState = !micEnabled;
            setMicEnabled(newState);
            liveKitService.toggleMic(newState);
          }}
          className="px-4 py-2 bg-gray-700 rounded"
        >
          {micEnabled ? "Mute" : "Unmute"}
        </button>

        {/* SCREEN SHARE */}
        <button
          onClick={async () => {
            if (!screenSharing) {
              await liveKitService.startScreenShare();
            } else {
              liveKitService.stopScreenShare();
            }

            setScreenSharing(!screenSharing);
          }}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          {screenSharing ? "Stop Share" : "Share Screen"}
        </button>

        {/* LEAVE */}
        <button
          onClick={() => {
            liveKitService.leaveMeeting();
            window.location.href = "/";
          }}
          className="px-4 py-2 bg-red-600 rounded"
        >
          Leave
        </button>

      </div>
    </div>
  );
}

// 🔥 REMOTE VIDEO COMPONENT
function RemoteVideo({ stream }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && stream) {
      ref.current.srcObject = stream;
      ref.current.muted = true;
      ref.current.playsInline = true;
      ref.current.play().catch(() => {});
    }
  }, [stream]);

  return (
    <video
      ref={ref}
      autoPlay
      playsInline
      className="w-full h-40 bg-black object-cover"
    />
  );
}