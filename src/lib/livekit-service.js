import {
  Room,
  RoomEvent,
  createLocalVideoTrack,
  createLocalAudioTrack,
  createLocalScreenTracks,
} from "livekit-client";

class LiveKitService {
  constructor() {
    this.room = null;
    this.videoTrack = null;
    this.audioTrack = null;
    this.screenTrack = null;
  }

  async joinMeeting(url, token, callbacks = {}) {
    this.room = new Room();

    await this.room.connect(url, token);

    // 🔥 CAMERA + MIC
    this.videoTrack = await createLocalVideoTrack();
    this.audioTrack = await createLocalAudioTrack();

    await this.room.localParticipant.publishTrack(this.videoTrack);
    await this.room.localParticipant.publishTrack(this.audioTrack);

    // 🔥 LOCAL STREAM
    const localStream = new MediaStream([
      this.videoTrack.mediaStreamTrack,
    ]);

    callbacks.onLocalStream?.(localStream);

    // 🔥 REMOTE STREAMS
    this.room.on(RoomEvent.TrackSubscribed, (track, pub, participant) => {
      if (track.kind === "video") {
        const stream = new MediaStream([track.mediaStreamTrack]);

        callbacks.onRemoteStream?.({
          id: participant.identity,
          stream,
        });
      }
    });
  }

  // 🎥 VIDEO TOGGLE
  toggleVideo(enabled) {
    if (this.videoTrack) {
      this.videoTrack.mediaStreamTrack.enabled = enabled;
    }
  }

  // 🎤 MIC TOGGLE
  toggleMic(enabled) {
    if (this.audioTrack) {
      this.audioTrack.mediaStreamTrack.enabled = enabled;
    }
  }

  // 🖥️ SCREEN SHARE
  async startScreenShare(callbacks) {
    const screenTracks = await createLocalScreenTracks();
    this.screenTrack = screenTracks[0];

    await this.room.localParticipant.publishTrack(this.screenTrack);

    const stream = new MediaStream([
      this.screenTrack.mediaStreamTrack,
    ]);

    callbacks?.onScreenStream?.(stream);
  }

  stopScreenShare() {
    if (!this.screenTrack) return;

    this.room.localParticipant.unpublishTrack(this.screenTrack);
    this.screenTrack.stop();
    this.screenTrack = null;
  }

  // 🚪 LEAVE
  leaveMeeting() {
    if (this.room) {
      this.room.disconnect();
      this.room = null;
    }
  }
}

export default new LiveKitService();