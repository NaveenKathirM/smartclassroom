import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Image} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Get the token from AsyncStorage
        const accessToken = await AsyncStorage.getItem('access_token');
        if (!accessToken) {
          throw new Error('No token found');
        }

        // Make the API call to Flask backend
        const response = await axios.get(
          'https://smart-classroom-backend-2.onrender.com//students',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        setStudents(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching students:', error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const renderStudentCard = ({item}) => {
    const attendanceColor =
      item.attendance >= 75
        ? '#28a745'
        : item.attendance >= 50
        ? '#ffc107'
        : '#dc3545';

    return (
      <View style={styles.studentCard}>
        <View style={styles.studentInfo}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png',
            }}
            style={styles.icon}
          />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentUsername}>
              Username: {item.username}
            </Text>
          </View>
        </View>
        <View style={styles.attendanceWrapper}>
          <Text style={[styles.attendance, {color: attendanceColor}]}>
            Attendance: {item.attendance}%
          </Text>
        </View>
        <View style={styles.extraDetails}>
          <Text style={styles.detailText}>Class: {item.class}</Text>
          <Text style={styles.detailText}>
            Register No: {item.registerNumber}
          </Text>
          <Text style={styles.detailText}>Mobile: {item.mobileNumber}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student List</Text>
      {loading ? (
        <Text style={styles.noDataText}>Loading students...</Text>
      ) : students.length > 0 ? (
        <FlatList
          data={students}
          renderItem={renderStudentCard}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.noDataText}>No students available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  icon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentDetails: {
    marginLeft: 15,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  studentUsername: {
    fontSize: 14,
    color: '#666',
  },
  attendanceWrapper: {
    marginTop: 5,
  },
  attendance: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  extraDetails: {
    marginTop: 10,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  noDataText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 50,
  },
});

export default StudentList;
