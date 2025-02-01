import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GetStartedScreen from '../screens/getStartedPage';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import TeacherDashboard from '../screens/Teacher/Dashboard';
import StudentDashboard from '../screens/Student/Dashboard';
import StudentList from '../screens/Teacher/StudentList';
import QuizScreen from '../screens/Teacher/QuizScreen';
import StudentQuizScreen from '../screens/Student/StudentQuizScreen';
import AttendQuizScreen from '../components/AttendedQuizScreen';
import Analytics from '../screens/Teacher/Analytics';
import AdminDashboard from '../screens/Admin/Dashboard';
import AttendanceScreen from '../screens/Student/AttendanceScreen';
import TeacherAttendanceScreen from '../screens/Teacher/TeacherAttendanceScreen';

const Stack = createStackNavigator();

const AppNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="GetStarted" component={GetStartedScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="TeacherDashboard" component={TeacherDashboard} />
    <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
    <Stack.Screen name="StudentList" component={StudentList} />
    <Stack.Screen name="QuizScreen" component={QuizScreen} />
    <Stack.Screen name="StudentQuizScreen" component={StudentQuizScreen} />
    <Stack.Screen name="AttendQuiz" component={AttendQuizScreen} />
    <Stack.Screen name="Analytics" component={Analytics} />
    <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
    <Stack.Screen name='AttendanceScreen' component={AttendanceScreen}/>
    <Stack.Screen name='TeacherAttendanceScreen' component={TeacherAttendanceScreen}/>
  </Stack.Navigator>
);

export default AppNavigator;
