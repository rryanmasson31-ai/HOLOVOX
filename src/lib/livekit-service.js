import { Room, RoomEvent, Track } from "livekit-client";

export class LiveKitService {
  constructor() {
    this.room = null;
    this.tokenUrl = process.env.NEXT_PUBLIC_TOKEN_URL || "https://holovoxserver-production.up.railway.app/token";
  }

  // =========================
  // JOIN MEETING
  // =========================
  async joinMeeting(roomId, userId, callbacks = {}) {
    try {
      // 1. GET TOKEN
      const res = await fetch(this.tokenUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId, userId }),
      });

      if (!res.ok) throw new Error("Failed to fetch token");

      const { token, url } = await res.json();

      // 2. CREATE ROOM
      this.room = new Room({
        adaptiveStream: true, // 🔥 auto quality control
        dynacast: true,       // 🔥 send only needed streams
      });

      // 3. SETUP EVENTS
      this.setupEvents(callbacks);

      // 4. CONNECT
      await this.room.connect(url, token);

      // 5. WAIT UNTIL FULLY CONNECTED
      await new Promise((resolve) =>
        this.room.once(RoomEvent.Connected, resolve)
      );

      // 6. GET USER MEDIA
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // 7. PUBLISH TRACKS
      for (const track of stream.getTracks()) {
        await this.room.localParticipant.publishTrack(track);
      }

      callbacks.onLocalStream?.(stream);
      callbacks.onConnected?.();

    } catch (err) {
      console.error("❌ Join error:", err);
      callbacks.onError?.(err.message);
    }
  }

  // =========================
  // EVENTS (REAL-TIME)
  // =========================
  setupEvents(callbacks) {
    // connection states
    this.room.on(RoomEvent.Reconnecting, () => {
      callbacks.onState?.("reconnecting");
    });

    this.room.on(RoomEvent.Reconnected, () => {
      callbacks.onState?.("connected");
    });

    this.room.on(RoomEvent.Disconnected, (reason) => {
      console.log("❌ Disconnected:", reason);
      callbacks.onState?.("disconnected");
    });

    // participants
    this.room.on(RoomEvent.ParticipantConnected, (p) => {
      const meta = this.safeJSON(p.metadata);
      callbacks.onUserJoin?.(p.identity, meta?.isHost);
    });

    this.room.on(RoomEvent.ParticipantDisconnected, (p) => {
      callbacks.onUserLeave?.(p.identity);
    });

    // video tracks
    this.room.on(RoomEvent.TrackSubscribed, (track, _, participant) => {
      if (track.kind === Track.Kind.Video) {
        const stream = new MediaStream([track.mediaStreamTrack]);
        callbacks.onVideoTrack?.(participant.identity, stream);
      }
    });
  }

  // =========================
  // TOGGLE MIC
  // =========================
  async toggleMute() {
    const pub = this.room?.localParticipant?.getTrackPublication(
      Track.Source.Microphone
    );
    if (!pub) return false;

    const newState = !pub.isMuted;
    await pub.setMuted(newState);
    return newState;
  }

  // =========================
  // TOGGLE VIDEO
  // =========================
  async toggleVideo() {
    const pub = this.room?.localParticipant?.getTrackPublication(
      Track.Source.Camera
    );
    if (!pub) return false;

    const newState = !pub.isMuted;
    await pub.setMuted(newState);
    return newState;
  }

  // =========================
  // SCREEN SHARE
  // =========================
  async startScreenShare() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });

    const track = stream.getVideoTracks()[0];

    await this.room.localParticipant.publishTrack(track, {
      name: "screen",
      source: Track.Source.ScreenShare,
    });

    return stream;
  }

  async stopScreenShare() {
    const pub = this.room?.localParticipant?.getTrackPublication(
      Track.Source.ScreenShare
    );

    if (pub) {
      await pub.unpublish();
    }
  }

  // =========================
  // LEAVE
  // =========================
  async leaveMeeting() {
    if (!this.room) return;

    // stop local tracks
    this.room.localParticipant.tracks.forEach((pub) => {
      pub.track?.stop();
    });

    await this.room.disconnect();
    this.room = null;
  }

  // =========================
  // PARTICIPANT COUNT
  // =========================
  getParticipantCount() {
    return this.room ? this.room.numParticipants : 0;
  }

  // =========================
  // SAFE JSON
  // =========================
  safeJSON(data) {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
}