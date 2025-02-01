import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const users = JSON.parse(await AsyncStorage.getItem('users')) || [];
      const attendanceRecords = {};
      
      // Retrieve attendance data for each student
      for (const user of users.filter((u) => u.type === 'Student')) {
        const attendanceKey = `attendance_${user.username}`;
        const attendance = JSON.parse(await AsyncStorage.getItem(attendanceKey)) || [];
        const percentage = ((attendance.length / 10) * 100).toFixed(2); // Assuming 10 classes
        attendanceRecords[user.username] = percentage;
      }

      // Attach attendance to student records
      const studentData = users
        .filter((user) => user.type === 'Student')
        .map((student) => ({
          ...student,
          attendance: attendanceRecords[student.username] || 0,
        }));

      setStudents(studentData);
    };

    fetchStudents();
  }, []);

  const renderStudentCard = ({ item }) => {
    const attendanceColor =
      item.attendance >= 75 ? '#28a745' : item.attendance >= 50 ? '#ffc107' : '#dc3545';

    return (
      <View style={styles.studentCard}>
        <View style={styles.studentInfo}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1077/1077012.png' }}
          style={styles.icon}
        />
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentUsername}>Username: {item.username}</Text>
          </View>
        </View>
        <View style={styles.attendanceWrapper}>
          <Text style={[styles.attendance, { color: attendanceColor }]}>
            Attendance: {item.attendance}%
          </Text>
        </View>
        <View style={styles.extraDetails}>
          <Text style={styles.detailText}>Class: {item.class || 'N/A'}</Text>
          <Text style={styles.detailText}>Register No: {item.registerNumber || 'N/A'}</Text>
          <Text style={styles.detailText}>Mobile: {item.mobileNumber || 'N/A'}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student List</Text>
      {students.length > 0 ? (
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
    shadowOffset: { width: 0, height: 2 },
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
