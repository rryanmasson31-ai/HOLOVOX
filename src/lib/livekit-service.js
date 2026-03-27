// lib/livekit-service.js
import { Room, RoomEvent, Track } from 'livekit-client';

export class LiveKitService {
  constructor() {
    this.room = null;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.signalingUrl = process.env.NEXT_PUBLIC_SIGNALING_URL || 'wss://holovoxserver-production.up.railway.app/ws';
    this.livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL || 'wss://syncrys-8lcpweam.livekit.cloud';
    this.pendingJoin = null;
    this.isConnecting = false;
  }

  async joinMeeting(roomId, userId, isHost, callbacks) {
    if (this.isConnecting) {
      console.log('Already connecting, please wait...');
      return false;
    }
    
    try {
      this.isConnecting = true;
      console.log('📡 Connecting to signaling server...');
      console.log(`   URL: ${this.signalingUrl}`);
      console.log(`   Room: ${roomId}, User: ${userId}, Host: ${isHost}`);
      
      this.pendingJoin = { roomId, userId, isHost, callbacks };
      await this.connectSignaling();
      return true;
    } catch (error) {
      console.error('Failed to join meeting:', error);
      callbacks.onError?.(error.message);
      this.isConnecting = false;
      return false;
    }
  }

  connectSignaling() {
    return new Promise((resolve, reject) => {
      const { roomId, userId, isHost, callbacks } = this.pendingJoin;
      
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.close();
      }
      
      this.ws = new WebSocket(this.signalingUrl);
      
      const timeout = setTimeout(() => {
        if (this.ws && this.ws.readyState !== WebSocket.OPEN) {
          this.ws.close();
          reject(new Error('WebSocket connection timeout'));
        }
      }, 10000);
      
      this.ws.onopen = () => {
        clearTimeout(timeout);
        console.log('✅ Signaling WebSocket connected');
        this.reconnectAttempts = 0;
        
        const joinMsg = {
          type: 'join',
          roomId,
          userId,
          isHost
        };
        console.log('📤 Sending join message:', joinMsg);
        this.ws.send(JSON.stringify(joinMsg));
        
        resolve();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 Received message:', data.type);
          this.handleSignalingMessage(data, callbacks);
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        clearTimeout(timeout);
        console.error('WebSocket error:', error);
        reject(error);
      };
      
      this.ws.onclose = (event) => {
        clearTimeout(timeout);
        console.log(`WebSocket closed: ${event.code} - ${event.reason}`);
        if (event.code !== 1000) {
          this.handleReconnection(callbacks);
        }
      };
    });
  }

  handleSignalingMessage(data, callbacks) {
    switch(data.type) {
      case 'ready':
        console.log('🎫 LiveKit token received');
        console.log(`   URL: ${data.url}`);
        console.log(`   User: ${data.userId}`);
        this.connectLiveKit(data.token, data.roomId, data.userId, callbacks);
        break;
        
      case 'user-joined':
        console.log(`👤 User joined: ${data.userId} (Host: ${data.isHost})`);
        callbacks.onUserJoined?.(data.userId, data.isHost);
        break;
        
      case 'user-left':
        console.log(`👋 User left: ${data.userId}`);
        callbacks.onUserLeft?.(data.userId);
        break;
        
      case 'existing-participants':
        console.log(`📋 Existing participants: ${data.participants.length}`);
        if (data.participants.length > 0) {
          console.log('   Participants:', data.participants);
        }
        callbacks.onExistingParticipants?.(data.participants, data.hostId);
        break;
        
      case 'host-changed':
        console.log(`👑 Host changed to: ${data.newHostId}`);
        callbacks.onHostChanged?.(data.newHostId);
        break;
        
      case 'pong':
        break;
        
      case 'error':
        console.error('Server error:', data.message);
        callbacks.onError?.(data.message);
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  }

  async connectLiveKit(token, roomId, userId, callbacks) {
    try {
      console.log('🎥 Connecting to LiveKit...');
      console.log(`   URL: ${this.livekitUrl}`);
      
      this.room = new Room({
        adaptiveStream: true,
        dynacast: true,
        publishDefaults: {
          videoSimulcastLayers: false,
          audioPreset: 'speech',
          videoPreset: 'h720',
        },
      });

      this.room
        .on(RoomEvent.ParticipantConnected, (participant) => {
          console.log(`🎥 Participant connected: ${participant.identity}`);
          try {
            const metadata = participant.metadata ? JSON.parse(participant.metadata) : {};
            callbacks.onParticipantConnected?.(participant.identity, metadata.isHost);
          } catch (e) {
            callbacks.onParticipantConnected?.(participant.identity, false);
          }
        })
        .on(RoomEvent.ParticipantDisconnected, (participant) => {
          console.log(`👋 Participant disconnected: ${participant.identity}`);
          callbacks.onParticipantDisconnected?.(participant.identity);
        })
        .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          console.log(`📹 Track subscribed: ${track.kind} from ${participant.identity}`);
          if (track.kind === Track.Kind.Video) {
            const stream = new MediaStream();
            stream.addTrack(track.mediaStreamTrack);
            callbacks.onVideoTrack?.(participant.identity, stream);
          } else if (track.kind === Track.Kind.Audio) {
            callbacks.onAudioTrack?.(participant.identity);
          }
        })
        .on(RoomEvent.LocalTrackPublished, () => {
          console.log('✅ Local tracks published');
          callbacks.onConnected?.();
          this.isConnecting = false;
        })
        .on(RoomEvent.Disconnected, () => {
          console.log('❌ Disconnected from LiveKit');
          callbacks.onError?.('Disconnected from media server');
        });

      await this.room.connect(this.livekitUrl, token);
      console.log('✅ Connected to LiveKit room');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🎥 Requesting camera and microphone...');
      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      console.log('✅ Got local media');
      console.log(`   Video tracks: ${localStream.getVideoTracks().length}`);
      console.log(`   Audio tracks: ${localStream.getAudioTracks().length}`);
      
      if (this.room && this.room.localParticipant) {
        const videoTrack = localStream.getVideoTracks()[0];
        const audioTrack = localStream.getAudioTracks()[0];
        
        if (videoTrack) {
          console.log('📹 Publishing video track...');
          await this.room.localParticipant.publishTrack(videoTrack, {
            simulcast: false,
            videoEncoding: {
              maxBitrate: 1_500_000,
              maxFramerate: 24,
            }
          });
          console.log('✅ Video track published');
        }
        
        if (audioTrack) {
          console.log('🎤 Publishing audio track...');
          await this.room.localParticipant.publishTrack(audioTrack);
          console.log('✅ Audio track published');
        }
        
        callbacks.onLocalStream?.(localStream);
      } else {
        throw new Error('Room or localParticipant is null');
      }
      
    } catch (error) {
      console.error('Failed to connect to LiveKit:', error);
      callbacks.onError?.(error.message);
      this.isConnecting = false;
      throw error;
    }
  }

  handleReconnection(callbacks) {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.pendingJoin) {
      this.reconnectAttempts++;
      console.log(`🔄 Reconnecting... Attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      
      setTimeout(() => {
        this.joinMeeting(
          this.pendingJoin.roomId,
          this.pendingJoin.userId,
          this.pendingJoin.isHost,
          this.pendingJoin.callbacks
        );
      }, 2000 * this.reconnectAttempts);
    } else {
      console.log('❌ Max reconnection attempts reached');
      callbacks.onError?.('Max reconnection attempts reached');
      this.isConnecting = false;
    }
  }

  async toggleMute() {
    if (!this.room || !this.room.localParticipant) {
      console.log('No active meeting');
      return false;
    }
    
    try {
      const micTrack = this.room.localParticipant.getTrack(Track.Source.Microphone);
      if (micTrack) {
        const newState = !micTrack.isMuted;
        await micTrack.publication.setMuted(newState);
        console.log(`Microphone ${newState ? 'muted' : 'unmuted'}`);
        return newState;
      }
      return false;
    } catch (error) {
      console.error('Error toggling mute:', error);
      return false;
    }
  }

  async toggleVideo() {
    if (!this.room || !this.room.localParticipant) {
      console.log('No active meeting');
      return false;
    }
    
    try {
      const videoTrack = this.room.localParticipant.getTrack(Track.Source.Camera);
      if (videoTrack) {
        const newState = !videoTrack.isMuted;
        await videoTrack.publication.setMuted(newState);
        console.log(`Camera ${newState ? 'off' : 'on'}`);
        return newState;
      }
      return false;
    } catch (error) {
      console.error('Error toggling video:', error);
      return false;
    }
  }

  async leaveMeeting() {
    console.log('👋 Leaving meeting...');
    this.isConnecting = false;
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({ type: 'leave' }));
        console.log('📤 Sent leave message to signaling server');
      } catch (error) {
        console.error('Error sending leave message:', error);
      }
      this.ws.close();
      this.ws = null;
    }
    
    if (this.room) {
      try {
        await this.room.disconnect();
        console.log('✅ Disconnected from LiveKit');
      } catch (error) {
        console.error('Error disconnecting from LiveKit:', error);
      }
      this.room = null;
    }
    
    this.pendingJoin = null;
    this.reconnectAttempts = 0;
  }

  getParticipantCount() {
    if (!this.room || !this.room.participants) {
      return 1;
    }
    return this.room.participants.size + 1;
  }
}