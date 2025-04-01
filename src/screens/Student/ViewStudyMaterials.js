import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Linking 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewStudyMaterials = ({ navigation }) => {
  const [studyMaterials, setStudyMaterials] = useState([]);

  // 📌 Fetch Study Materials
  useEffect(() => {
    const fetchMaterials = async () => {
      const storedMaterials = JSON.parse(await AsyncStorage.getItem('studyMaterials')) || [];
      setStudyMaterials(storedMaterials);
    };
    fetchMaterials();
  }, []);

  // 📌 Open PDF File in Browser or PDF Viewer
  const openPDF = async (uri) => {
    try {
      const supported = await Linking.canOpenURL(uri);
      if (supported) {
        await Linking.openURL(uri);
      } else {
        Alert.alert('Error', 'Cannot open this file.');
      }
    } catch (error) {
      console.error('Open File Error:', error);
      Alert.alert('Error', 'Failed to open the file.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 Study Materials</Text>
      <Text style={styles.subtitle}>Click on a file to open it.</Text>

      {studyMaterials.length === 0 ? (
        <Text style={styles.noDataText}>No study materials available.</Text>
      ) : (
        <FlatList
          data={studyMaterials}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.fileCard} onPress={() => openPDF(item.uri)}>
              <Text style={styles.fileText}>📄 {item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🔹 **Enhanced Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  noDataText: {
    fontSize: 18,
    color: '#95a5a6',
    marginTop: 20,
  },
  fileCard: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  fileText: {
    fontSize: 18,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ViewStudyMaterials;
