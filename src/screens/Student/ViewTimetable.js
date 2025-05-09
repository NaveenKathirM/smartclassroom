import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, ScrollView} from 'react-native';
import axios from 'axios';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const periods = ['Period 1', 'Period 2', 'Period 3', 'Period 4', 'Period 5'];

const ViewTimetable = () => {
  const [timetable, setTimetable] = useState({});

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
      }
    };
    loadTimetable();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 Weekly Timetable</Text>
      <ScrollView>
        <FlatList
          data={daysOfWeek}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <View style={styles.dayContainer}>
              <Text style={styles.dayTitle}>{item}</Text>
              {periods.map((period, index) => (
                <View key={index} style={styles.periodContainer}>
                  <Text style={styles.periodText}>
                    {period}: {timetable[item]?.[period] || 'No class'}
                  </Text>
                </View>
              ))}
            </View>
          )}
        />
      </ScrollView>
    </View>
  );
};

// 🔹 **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#007BFF',
  },
  dayContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
  },
  dayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007BFF',
  },
  periodContainer: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    marginLeft: 10,
    marginRight: 10,
  },
  periodText: {
    fontSize: 16,
    color: '#333',
  },
});

export default ViewTimetable;
