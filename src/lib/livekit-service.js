import { Room, RoomEvent, Track } from 'livekit-client';

export class LiveKitService {
  constructor() {
    this.room = null;
    this.tokenUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || 'https://holovoxserver-production.up.railway.app/token';
  }

  async joinMeeting(roomId, userId, isHost, callbacks) {
    try {
      // 1. Get token from your server
      const res = await fetch(this.tokenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, userId, isHost }),
      });
      const { token, url } = await res.json();

      // 2. Connect to LiveKit
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      this.room.on(RoomEvent.Reconnecting, () => callbacks.onConnectionState?.('reconnecting'));
      this.room.on(RoomEvent.Reconnected, () => callbacks.onConnectionState?.('reconnected'));
      this.room.on(RoomEvent.Disconnected, (reason) => {
        console.log('Disconnected from LiveKit:', reason);
        callbacks.onConnectionState?.('disconnected');
      });

      this.room.on(RoomEvent.ParticipantConnected, (participant) => {
        const metadata = participant.metadata ? JSON.parse(participant.metadata) : {};
        callbacks.onParticipantConnected?.(participant.identity, metadata.isHost);
      });
      this.room.on(RoomEvent.ParticipantDisconnected, (participant) => {
        callbacks.onParticipantDisconnected?.(participant.identity);
      });

      this.room.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === Track.Kind.Video) {
          const stream = new MediaStream();
          stream.addTrack(track.mediaStreamTrack);
          callbacks.onVideoTrack?.(participant.identity, stream);
        }
      });

      await this.room.connect(url, token);
      await new Promise((resolve) => this.room.once(RoomEvent.Connected, resolve));

      // 3. Publish local tracks
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      for (const track of localStream.getTracks()) {
        await this.room.localParticipant.publishTrack(track);
      }

      callbacks.onLocalStream?.(localStream);
      callbacks.onConnected?.();
    } catch (error) {
      console.error('Failed to join meeting:', error);
      callbacks.onError?.(error.message);
    }
  }

  async leaveMeeting() {
    if (this.room) {
      // Stop all local tracks
      const localPublications = Array.from(this.room.localParticipant.trackPublications.values());
      for (const pub of localPublications) {
        pub.track?.stop();
      }
      await this.room.disconnect();
    }
    this.room = null;
  }

  async toggleMute() {
    const micPub = this.room?.localParticipant?.getTrackPublication(Track.Source.Microphone);
    if (!micPub) return false;
    const newState = !micPub.isMuted;
    await micPub.setMuted(newState);
    return newState;
  }

  async toggleVideo() {
    const camPub = this.room?.localParticipant?.getTrackPublication(Track.Source.Camera);
    if (!camPub) return false;
    const newState = !camPub.isMuted;
    await camPub.setMuted(newState);
    return newState;
  }

  getParticipantCount() {
    return this.room ? this.room.participants.size + 1 : 1;
  }
}