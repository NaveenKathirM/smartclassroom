import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RTCPeerConnection, RTCView, mediaDevices} from 'react-native-webrtc';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.31:5000';

const StartPresentation = ({navigation}) => {
  const [meetingLink, setMeetingLink] = useState('');
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [meetingStarted, setMeetingStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const localStreamRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    return () => {
      if (peerConnection) peerConnection.close();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [peerConnection]);

  const generateMeetingLink = async () => {
    // Generate a random meeting link
    const link = `https://smartclassroom.com/session/${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    setMeetingLink(link);
    await AsyncStorage.setItem('presentationLink', link);

    Alert.alert('Meeting Link Created!', 'Notifying students...');

    socketRef.current = io(SOCKET_SERVER_URL);
    socketRef.current.emit('meeting-created', {meetingLink: link});

    startStreaming(link);
    setMeetingStarted(true);
  };

  const shareLink = async () => {
    try {
      await Share.share({message: `Join my presentation: ${meetingLink}`});
    } catch (error) {
      Alert.alert('Error', 'Could not share the link.');
    }
  };

  const startStreaming = async link => {
    try {
      const newPeerConnection = new RTCPeerConnection({
        iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
      });

      const localStream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(localStream);
      localStreamRef.current = localStream;

      localStream
        .getTracks()
        .forEach(track => newPeerConnection.addTrack(track, localStream));
      setPeerConnection(newPeerConnection);

      socketRef.current.emit('create-room', {meetingLink: link});

      socketRef.current.on('user-joined', async () => {
        const offer = await newPeerConnection.createOffer();
        await newPeerConnection.setLocalDescription(offer);
        socketRef.current.emit('offer', {offer, roomId: link});
      });

      socketRef.current.on('answer', async ({answer}) => {
        await newPeerConnection.setRemoteDescription(answer);
      });

      newPeerConnection.onicecandidate = event => {
        if (event.candidate)
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            roomId: link,
          });
      };

      socketRef.current.on('ice-candidate', async ({candidate}) => {
        if (candidate) await newPeerConnection.addIceCandidate(candidate);
      });

      socketRef.current.on('receive-message', data => {
        setMessages(prevMessages => [...prevMessages, data]);
      });
    } catch (error) {
      Alert.alert('Error', 'Could not start video stream.');
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const msg = {user: 'Teacher', text: message};
      socketRef.current.emit('send-message', msg);
      setMessages(prevMessages => [...prevMessages, msg]);
      setMessage('');
    }
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !videoEnabled;
      });
      setVideoEnabled(!videoEnabled);
    }
  };

  const stopCall = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
    }
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {stream && (
        <RTCView
          streamURL={stream.toURL()}
          style={styles.video}
          mirror={true}
        />
      )}

      {/* Meeting Link & Share Button */}
      {meetingLink && (
        <View style={styles.meetingInfo}>
          <Text style={styles.meetingLink}>{meetingLink}</Text>
          <TouchableOpacity style={styles.shareButton} onPress={shareLink}>
            <Text style={styles.shareButtonText}>📤 Share</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Control Buttons */}
      {meetingStarted && (
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={toggleMute}>
            <Text style={styles.controlText}>
              {isMuted ? '🔇 Unmute' : '🎙️ Mute'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
            <Text style={styles.controlText}>
              {videoEnabled ? '📹 Disable Video' : '📷 Enable Video'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={sendMessage}>
            <Text style={styles.controlText}>💬 Chat</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* End Call Button */}
      {meetingStarted && (
        <TouchableOpacity style={styles.endButton} onPress={stopCall}>
          <Text style={styles.controlText}>❌ End Call</Text>
        </TouchableOpacity>
      )}

      {/* Start Meeting Button */}
      {!meetingStarted && (
        <TouchableOpacity style={styles.button} onPress={generateMeetingLink}>
          <Text style={styles.buttonText}>🚀 Start Presentation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#000', justifyContent: 'flex-end'},
  video: {width: '100%', height: '80%', backgroundColor: 'black'},
  meetingInfo: {alignItems: 'center', marginBottom: 10},
  meetingLink: {color: '#fff', fontSize: 16, marginBottom: 5},
  shareButton: {backgroundColor: '#007BFF', padding: 10, borderRadius: 5},
  shareButtonText: {color: '#fff', fontSize: 16},
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#333',
  },
  controlButton: {backgroundColor: '#555', padding: 12, borderRadius: 10},
  controlText: {color: '#fff', fontSize: 16},
  endButton: {
    backgroundColor: 'red',
    padding: 14,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 14,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {color: '#fff', fontSize: 18, fontWeight: '600'},
});

export default StartPresentation;
