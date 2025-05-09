import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Analytics = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(
          'https://smart-classroom-backend-2.onrender.com//get-quiz-results',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setResults(response.data);
      } catch (error) {
        console.error('Error fetching results:', error);
        Alert.alert('Error', 'Failed to fetch quiz results.');
      }
    };

    fetchResults();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Performance Analytics</Text>

      {results.length > 0 ? (
        <ScrollView contentContainerStyle={styles.chartContainer}>
          {results.map((result, index) => (
            <View key={index} style={styles.chartRow}>
              <View style={styles.rowHeader}>
                <Text style={styles.studentUsername}>
                  {result.studentUsername || 'Unknown'}
                </Text>
                <Text style={styles.percentageText}>{result.percentage}%</Text>
              </View>
              <View style={styles.chartWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${result.percentage}%`,
                      backgroundColor:
                        result.percentage >= 75
                          ? '#28a745'
                          : result.percentage >= 50
                          ? '#ffc107'
                          : '#dc3545',
                    },
                  ]}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data available to display</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9fc',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 20,
  },
  chartContainer: {
    paddingBottom: 10,
  },
  chartRow: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
    elevation: 3,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  studentUsername: {
    fontSize: 18,
    fontWeight: '600',
    color: '#34495e',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495e',
  },
  chartWrapper: {
    height: 20,
    backgroundColor: '#ecf0f1',
    borderRadius: 10,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
});

export default Analytics;
