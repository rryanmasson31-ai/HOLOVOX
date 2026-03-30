import { Room, RoomEvent, Track } from "livekit-client";

export class LiveKitService {
  constructor() {
    this.room = null;
    this.tokenUrl = process.env.NEXT_PUBLIC_TOKEN_URL || "http://localhost:7860/token";
  }

  async joinMeeting(roomId, userId, isHost, callbacks = {}) {
    try {
      console.log("🎥 Requesting camera & microphone...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 24 } },
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      console.log("✅ Got local media");
      callbacks.onLocalStream?.(stream);

      console.log("🔑 Fetching token...");
      const res = await fetch(this.tokenUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, userId, isHost }),
      });
      if (!res.ok) throw new Error(`Token fetch failed: ${res.status}`);
      const { token, url } = await res.json();
      console.log("✅ Token received");

      // Use default ICE (LiveKit's own TURN) – no custom servers
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      this.setupEvents(callbacks);

      console.log("🔌 Connecting to LiveKit...");
      await this.room.connect(url, token);
      await new Promise((resolve) => this.room.once(RoomEvent.Connected, resolve));
      console.log("✅ Connected to LiveKit");

      // Publish tracks
      const tracks = stream.getTracks();
      console.log(`📹 Publishing ${tracks.length} tracks...`);
      for (const track of tracks) {
        await this.room.localParticipant.publishTrack(track);
        console.log(`   Published ${track.kind} track`);
      }
      console.log("✅ Tracks published");

      callbacks.onConnected?.();
    } catch (err) {
      console.error("❌ Join error:", err);
      callbacks.onError?.(err.message);
    }
  }

  setupEvents(callbacks) {
    if (!this.room) return;
    this.room.on(RoomEvent.ConnectionStateChanged, (state) => console.log("🔌 Connection state:", state));
    this.room.on(RoomEvent.Reconnecting, () => callbacks.onState?.("reconnecting"));
    this.room.on(RoomEvent.Reconnected, () => callbacks.onState?.("connected"));
    this.room.on(RoomEvent.Disconnected, (reason) => {
      console.log("❌ Disconnected:", reason);
      callbacks.onState?.("disconnected");
    });
    this.room.on(RoomEvent.ParticipantConnected, (p) => {
      console.log("👤 Participant connected:", p.identity);
      const meta = this.safeJSON(p.metadata);
      callbacks.onUserJoin?.(p.identity, meta?.isHost);
    });
    this.room.on(RoomEvent.ParticipantDisconnected, (p) => callbacks.onUserLeave?.(p.identity));
    this.room.on(RoomEvent.TrackPublished, (publication, participant) => {
      console.log("📢 Track published by", participant.identity, publication.kind);
    });
    this.room.on(RoomEvent.TrackSubscribed, (track, _, participant) => {
      console.log("📹 Track subscribed from", participant.identity, track.kind);
      if (track.kind === Track.Kind.Video) {
        const stream = new MediaStream([track.mediaStreamTrack]);
        callbacks.onVideoTrack?.(participant.identity, stream);
      }
    });
  }

  async toggleMute() {
    const pub = this.room?.localParticipant?.getTrackPublication(Track.Source.Microphone);
    if (!pub) return false;
    const newState = !pub.isMuted;
    await pub.setMuted(newState);
    return newState;
  }

  async toggleVideo() {
    const pub = this.room?.localParticipant?.getTrackPublication(Track.Source.Camera);
    if (!pub) return false;
    const newState = !pub.isMuted;
    await pub.setMuted(newState);
    return newState;
  }

  async startScreenShare() {
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
    const track = stream.getVideoTracks()[0];
    await this.room.localParticipant.publishTrack(track, {
      name: "screen",
      source: Track.Source.ScreenShare,
    });
    return stream;
  }

  async stopScreenShare() {
    const pub = this.room?.localParticipant?.getTrackPublication(Track.Source.ScreenShare);
    if (pub) await pub.unpublish();
  }

  async leaveMeeting() {
    if (!this.room) return;
    for (const pub of this.room.localParticipant.trackPublications.values()) {
      pub.track?.stop();
    }
    await this.room.disconnect();
    this.room = null;
  }

  getParticipantCount() {
    return this.room ? this.room.numParticipants : 0;
  }

  safeJSON(data) {
    try { return JSON.parse(data); } catch { return {}; }
  }
}