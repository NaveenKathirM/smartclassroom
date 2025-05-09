import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import axios from 'axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5'];

const ManageTimetable = ({navigation}) => {
  const [timetable, setTimetable] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [subject, setSubject] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadTimetable = async () => {
      try {
        // Fetch timetable from the backend
        const response = await axios.get(
          'https://smart-classroom-backend-2.onrender.com//get-timetable',
        );
        setTimetable(response.data || {});
      } catch (error) {
        console.error('Error fetching timetable:', error);
        Alert.alert('Error', 'Failed to load timetable from the server.');
      }
    };

    loadTimetable();
  }, []);

  const saveTimetable = async () => {
    try {
      // Send the timetable to the backend
      const response = await axios.post(
        'https://smart-classroom-backend-2.onrender.com//save-timetable',
        timetable,
      );
      Alert.alert('Success', 'Timetable updated successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving timetable:', error);
      Alert.alert('Error', 'Failed to save timetable to the server.');
    }
  };

  const addSubject = () => {
    if (!selectedDay || !selectedPeriod || !subject.trim()) {
      Alert.alert('Error', 'Please select a day, period, and enter a subject.');
      return;
    }
    const updatedTimetable = {
      ...timetable,
      [selectedDay]: {
        ...(timetable[selectedDay] || {}),
        [selectedPeriod]: subject,
      },
    };
    setTimetable(updatedTimetable);
    setModalVisible(false);
    setSubject('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Manage Timetable</Text>
      <FlatList
        data={daysOfWeek}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <View style={styles.dayContainer}>
            <Text style={styles.dayTitle}>{item}</Text>
            {periods.map(period => (
              <TouchableOpacity
                key={period}
                style={styles.periodButton}
                onPress={() => {
                  setSelectedDay(item);
                  setSelectedPeriod(period);
                  setModalVisible(true);
                }}>
                <Text style={styles.periodText}>
                  {period}: {timetable[item]?.[period] || 'Add Subject'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      <TouchableOpacity style={styles.saveButton} onPress={saveTimetable}>
        <Text style={styles.saveButtonText}>Save Timetable</Text>
      </TouchableOpacity>

      {/* Modal for Adding Subjects */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Enter Subject for {selectedDay} - {selectedPeriod}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Subject Name"
              value={subject}
              onChangeText={setSubject}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={addSubject}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// 🔹 **Styles**
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9fafb', padding: 20},
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  dayContainer: {
    marginBottom: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#007BFF',
  },
  periodButton: {
    padding: 10,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    marginVertical: 4,
  },
  periodText: {fontSize: 16, color: '#333'},
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  saveButtonText: {color: '#fff', fontSize: 18, fontWeight: 'bold'},

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced6e0',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {flexDirection: 'row', justifyContent: 'space-between'},
  modalButton: {
    flex: 1,
    backgroundColor: '#007BFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  modalButtonText: {color: '#fff', fontSize: 16},
  cancelButton: {backgroundColor: '#FF4C4C'},
});

export default ManageTimetable;
