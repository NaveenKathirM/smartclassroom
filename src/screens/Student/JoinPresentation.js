import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RTCPeerConnection, RTCView} from 'react-native-webrtc';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://192.168.1.31:5000';

const JoinPresentation = () => {
  const [meetingId, setMeetingId] = useState('');
  const [stream, setStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const remoteStreamRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const fetchMeetingId = async () => {
      const link = await AsyncStorage.getItem('presentationLink');
      if (link) {
        setMeetingId(link);
      } else {
        Alert.alert('No Meeting', 'No active meeting found.');
      }
    };

    fetchMeetingId();
  }, []);

  const joinMeeting = async () => {
    if (!meetingId) {
      Alert.alert('No Meeting', 'No active meeting found.');
      return;
    }

    try {
      const newPeerConnection = new RTCPeerConnection({
        iceServers: [{urls: 'stun:stun.l.google.com:19302'}],
      });

      newPeerConnection.ontrack = event => {
        if (event.streams && event.streams[0]) {
          setStream(event.streams[0]);
          remoteStreamRef.current = event.streams[0];
        }
      };

      setPeerConnection(newPeerConnection);

      // Connect to Socket Server
      socketRef.current = io(SOCKET_SERVER_URL);
      socketRef.current.emit('join-room', {roomId: meetingId});

      socketRef.current.on('offer', async ({offer}) => {
        await newPeerConnection.setRemoteDescription(offer);
        const answer = await newPeerConnection.createAnswer();
        await newPeerConnection.setLocalDescription(answer);
        socketRef.current.emit('answer', {answer, roomId: meetingId});
      });

      newPeerConnection.onicecandidate = event => {
        if (event.candidate) {
          socketRef.current.emit('ice-candidate', {
            candidate: event.candidate,
            roomId: meetingId,
          });
        }
      };

      socketRef.current.on('ice-candidate', async ({candidate}) => {
        if (candidate) await newPeerConnection.addIceCandidate(candidate);
      });

      // Receive messages
      socketRef.current.on('receive-message', data => {
        setMessages(prevMessages => [...prevMessages, data]);
      });
    } catch (error) {
      Alert.alert('Error', 'Could not join the presentation.');
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      const msg = {user: 'Student', text: message};
      socketRef.current.emit('send-message', msg);
      setMessages(prevMessages => [...prevMessages, msg]);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎥 Join Live Presentation</Text>

      {stream && (
        <RTCView
          streamURL={stream.toURL()}
          style={styles.video}
          mirror={true}
        />
      )}

      <TouchableOpacity style={styles.joinButton} onPress={joinMeeting}>
        <Text style={styles.joinButtonText}>Join Now</Text>
      </TouchableOpacity>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <Text style={styles.chatMessage}>
            <Text style={{fontWeight: 'bold'}}>{item.user}: </Text>
            {item.text}
          </Text>
        )}
      />

      {/* Message Input */}
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={message}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🔹 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 20},
  video: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#333',
  },
  joinButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  joinButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  input: {
    width: '80%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#FF5733',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  sendButtonText: {color: '#fff', fontSize: 16, fontWeight: '600'},
  chatMessage: {
    fontSize: 16,
    color: '#fff',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-start',
  },
});

export default JoinPresentation;
