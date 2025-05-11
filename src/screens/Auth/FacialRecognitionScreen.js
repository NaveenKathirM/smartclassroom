import React, {useState, useRef, useEffect, useCallback} from 'react';
import {View, Text, Alert, StyleSheet} from 'react-native';
import {Buffer} from 'buffer';
import {Camera, CameraType} from 'react-native-camera-kit'; // Correct import for CameraKit
import axios from 'axios';
import RNFS from 'react-native-fs';

const FacialRecognitionScreen = ({route, navigation}) => {
  const {studentId} = route.params; // Get studentId from route params
  const cameraRef = useRef(null);
  const [capturedImages, setCapturedImages] = useState([]);
  const [count, setCount] = useState(0);
  const [faceBounds, setFaceBounds] = useState(null);
  const [progress, setProgress] = useState(0);
  const [capturing, setCapturing] = useState(true); // To control automatic capture

  const sendImagesToServer = useCallback(async () => {
    try {
      const formData = new FormData();
      formData.append('studentId', studentId);

      // Loop through the captured images and append them to FormData
      for (let index = 0; index < capturedImages.length; index++) {
        const imageUri = capturedImages[index];
        if (!imageUri) {
          console.error('Undefined image at index:', index);
          return;
        }

        // Read the image file as binary data
        const binaryData = await RNFS.readFile(imageUri, 'base64'); // Read the file and convert to base64
        console.log('Sending binary image:', imageUri);

        // Append the binary data as a file to FormData
        formData.append('images', {
          uri: imageUri,
          type: 'image/jpeg',
          name: `image${index}.jpg`,
          data: binaryData,
        });
      }

      // Send the images to the backend
      const response = await axios.post(
        'http://192.168.1.23:6777/store-facial-data',
        formData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );

      Alert.alert('Success', 'Facial data stored successfully.');
      setCount(0);
      navigation.navigate('Login');
    } catch (error) {
      console.log('Axios error:', error);
      Alert.alert('Error', 'Failed to store facial data.');
    }
  }, [capturedImages, studentId, navigation]);

  // Automatically capture 5 pictures with different intervals for the first and subsequent captures
  useEffect(() => {
    if (capturing && count < 5 && studentId?.length > 0) {
      const intervalTime = count === 0 ? 2000 : 1000; // 2 seconds for subsequent captures
      const interval = setInterval(() => {
        handleCapture();
      }, intervalTime);

      return () => clearInterval(interval);
    }
  }, [count, capturing]);

  // Handle image capture
  const handleCapture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5};
      const data = await cameraRef.current.capture(options);
      console.log('Captured Data:', data);

      // Get the URI of the captured image
      if (data.uri) {
        setCapturedImages(prev => [...prev, data.uri]); // Store the URI of the image
        setCount(prev => prev + 1);
        setProgress(((count + 1) / 5) * 100); // Update progress after each capture

        if (count + 1 >= 5) {
          setCapturing(false); // Stop capturing after 5 images
        }
      } else {
        console.log('No image URI returned');
      }
    }
  };

  // Send images to the server once the count reaches 5
  useEffect(() => {
    if (count >= 5) {
      sendImagesToServer();
    }
  }, [count, sendImagesToServer]);

  // Handle face detection
  const handleFaceDetection = faces => {
    if (faces && faces.length > 0) {
      const detectedFace = faces[0];
      setFaceBounds(detectedFace.bounds);
    }
  };

  return (
    <View style={styles.container}>
      {/* Camera Component */}
      <Camera
        ref={cameraRef}
        style={styles.camera}
        cameraType={CameraType.Front} // Use front camera
        flashMode="auto" // Auto flash mode
        faceDetectionMode="accurate" // Enable accurate face detection
        onFacesDetected={handleFaceDetection}>
        {faceBounds && (
          <View
            style={{
              position: 'absolute',
              top: faceBounds.origin.y,
              left: faceBounds.origin.x,
              width: faceBounds.size.width,
              height: faceBounds.size.height,
              borderRadius: 50,
              borderColor: 'green',
              borderWidth: 2,
            }}
          />
        )}
      </Camera>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Face Recognition: {Math.round(progress)}%
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${progress}%`}]} />
        </View>
      </View>

      {/* Message after completing 5 captures */}
      {count >= 5 && (
        <Text style={styles.completeText}>
          All pictures captured! Sending data...
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  progressContainer: {
    position: 'absolute',
    bottom: 100,
    left: '30%',
    transform: [{translateX: -50}],
    width: '80%',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
  },
  progressBar: {
    width: '100%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    marginTop: 5,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 5,
  },
  completeText: {
    position: 'absolute',
    bottom: 120,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FacialRecognitionScreen;
