import { Room, RoomEvent, Track } from 'livekit-client';

export let room = null;
let localStream = null;
let ws = null;
let currentRoomId = null;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;

export async function stopMeeting() {
  // Clean up WebSocket
  if (ws) {
    ws.close();
    ws = null;
  }
  
  // Clean up LiveKit room
  if (room) {
    await room.disconnect();
    room = null;
  }
  
  // Clean up local tracks
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
}

async function connectWebSocket(roomId, userId, isHost, onConnectionState) {
  // Use relative WebSocket URL for Hugging Face Spaces
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsURL = `${protocol}//${window.location.host}/ws`;
  
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(wsURL);
    
    socket.onopen = () => {
      console.log("WebSocket connected");
      reconnectAttempts = 0;
      socket.send(JSON.stringify({ type: "join", roomId, userId, isHost }));
      if (onConnectionState) onConnectionState("signaling-connected");
      resolve(socket);
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
      if (onConnectionState) onConnectionState("signaling-error");
      reject(error);
    };
    
    socket.onclose = () => {
      console.log("WebSocket disconnected");
      if (onConnectionState) onConnectionState("signaling-disconnected");
      
      // Attempt to reconnect
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && currentRoomId) {
        reconnectAttempts++;
        setTimeout(() => {
          console.log(`Reconnecting signaling... Attempt ${reconnectAttempts}`);
          connectWebSocket(currentRoomId, userId, isHost, onConnectionState)
            .then(newSocket => {
              ws = newSocket;
            })
            .catch(err => console.error("Reconnection failed:", err));
        }, 2000 * reconnectAttempts);
      }
    };
  });
}

export async function startMeeting(roomId, isHost, onParticipantUpdate, onConnectionState) {
  currentRoomId = roomId;
  const userId = localStorage.getItem('meeting_user_id') || crypto.randomUUID();
  localStorage.setItem('meeting_user_id', userId);
  
  try {
    // Connect to signaling server to get LiveKit token
    if (onConnectionState) onConnectionState("connecting-signaling");
    ws = await connectWebSocket(roomId, userId, isHost, onConnectionState);
    
    // Wait for LiveKit credentials
    const livekitCredentials = await new Promise((resolve, reject) => {
      ws.onmessage = async (msg) => {
        const data = JSON.parse(msg.data);
        if (data.type === "ready") {
          resolve({ url: data.url, token: data.token });
        } else if (data.type === "user-joined") {
          if (onParticipantUpdate) {
            onParticipantUpdate(data.userId, null, data.isHost, "joined");
          }
        } else if (data.type === "user-left") {
          if (onParticipantUpdate) {
            onParticipantUpdate(data.userId, null, false, "left");
          }
        } else if (data.type === "host-changed") {
          if (onParticipantUpdate) {
            onParticipantUpdate(null, null, data.newHostId, "host-changed");
          }
        }
      };
      
      // Timeout after 10 seconds
      setTimeout(() => reject(new Error("Timeout waiting for LiveKit credentials")), 10000);
    });
    
    // Connect to LiveKit
    if (onConnectionState) onConnectionState("connecting-livekit");
    room = new Room({
      adaptiveStream: true,
      dynacast: true,
      publishDefaults: {
        videoSimulcastLayers: [
          { width: 1280, height: 720, bitrate: 1_500_000 },
          { width: 640, height: 360, bitrate: 500_000 },
          { width: 320, height: 180, bitrate: 200_000 }
        ],
        videoEncoding: {
          maxBitrate: 1_500_000,
          maxFramerate: 24,
        },
      },
    });
    
    // Setup LiveKit event handlers
    room
      .on(RoomEvent.ParticipantConnected, (participant) => {
        console.log("Participant connected:", participant.identity);
        if (onParticipantUpdate) {
          const isHostParticipant = participant.metadata === '{"isHost":true}';
          onParticipantUpdate(participant.identity, null, isHostParticipant, "joined");
        }
      })
      .on(RoomEvent.ParticipantDisconnected, (participant) => {
        console.log("Participant disconnected:", participant.identity);
        if (onParticipantUpdate) {
          onParticipantUpdate(participant.identity, null, false, "left");
        }
      })
      .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        console.log("Track subscribed:", track.kind, participant.identity);
        if (track.kind === Track.Kind.Video || track.kind === Track.Kind.Audio) {
          const stream = new MediaStream();
          stream.addTrack(track.mediaStreamTrack);
          const isHostParticipant = participant.metadata === '{"isHost":true}';
          if (onParticipantUpdate) {
            onParticipantUpdate(participant.identity, stream, isHostParticipant, "track-subscribed");
          }
        }
      })
      .on(RoomEvent.LocalTrackPublished, () => {
        console.log("Local track published");
        if (onConnectionState) onConnectionState("connected");
      })
      .on(RoomEvent.Disconnected, () => {
        console.log("Disconnected from LiveKit");
        if (onConnectionState) onConnectionState("livekit-disconnected");
      });
    
    // Connect to LiveKit room
    await room.connect(livekitCredentials.url, livekitCredentials.token);
    console.log("Connected to LiveKit room");
    
    // Get local media
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        frameRate: { ideal: 24, max: 30 }
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    
    localStream = mediaStream;
    
    // Publish local tracks
    await Promise.all([
      room.localParticipant.publishTrack(mediaStream.getVideoTracks()[0], {
        simulcast: true,
        videoEncoding: { maxBitrate: 1_500_000, maxFramerate: 24 }
      }),
      room.localParticipant.publishTrack(mediaStream.getAudioTracks()[0])
    ]);
    
    // Set local video element
    const localVideo = document.getElementById("localVideo");
    if (localVideo) {
      localVideo.srcObject = mediaStream;
    }
    
    if (onConnectionState) onConnectionState("connected");
    
  } catch (error) {
    console.error("Failed to start meeting:", error);
    if (onConnectionState) onConnectionState("error", error.message);
    throw error;
  }
}

// Helper functions for media controls
export async function toggleMute() {
  if (!room) return false;
  
  const micTrack = room.localParticipant.getTrack(Track.Source.Microphone);
  if (micTrack) {
    await micTrack.publication.setMuted(!micTrack.isMuted);
    return !micTrack.isMuted;
  }
  return false;
}

export async function toggleVideo() {
  if (!room) return false;
  
  const videoTrack = room.localParticipant.getTrack(Track.Source.Camera);
  if (videoTrack) {
    await videoTrack.publication.setMuted(!videoTrack.isMuted);
    return !videoTrack.isMuted;
  }
  return false;
}

export async function toggleScreenShare() {
  if (!room) return false;
  
  const screenTrack = room.localParticipant.getTrack(Track.Source.ScreenShare);
  if (screenTrack) {
    // Stop screen share
    await room.localParticipant.unpublishTrack(screenTrack.publication.track);
    return false;
  } else {
    // Start screen share
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
      });
      await room.localParticipant.publishTrack(screenStream.getVideoTracks()[0], {
        source: Track.Source.ScreenShare,
        simulcast: false
      });
      
      // Stop screen sharing when the user clicks "Stop sharing" in browser UI
      screenStream.getVideoTracks()[0].onended = () => {
        toggleScreenShare();
      };
      return true;
    } catch (error) {
      console.error("Failed to share screen:", error);
      return false;
    }
  }
}

export function getParticipantCount() {
  if (!room) return 1; // Just local participant
  return room.participants.size + 1;
}

export function isMuted() {
  if (!room) return false;
  const micTrack = room.localParticipant.getTrack(Track.Source.Microphone);
  return micTrack ? micTrack.isMuted : false;
}

export function isVideoOff() {
  if (!room) return false;
  const videoTrack = room.localParticipant.getTrack(Track.Source.Camera);
  return videoTrack ? videoTrack.isMuted : true;
}

export function isScreenSharing() {
  if (!room) return false;
  const screenTrack = room.localParticipant.getTrack(Track.Source.ScreenShare);
  return !!screenTrack;
}