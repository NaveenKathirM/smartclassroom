import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.31:5000',
});

export const signUp = async userData => {
  try {
    const response = await api.post('/signup', userData);
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : 'An error occurred during sign up';
  }
};

export const login = async credentials => {
  try {
    const response = await api.post('/login', credentials); // Make POST request to the '/login' route
    return response.data; // Return the response data (e.g., token and user type)
  } catch (error) {
    throw error.response
      ? error.response.data
      : 'An error occurred during login';
  }
};

export const startPresentation = async meetingLink => {
  try {
    const response = await api.post('/start-presentation', {meetingLink});
    return response.data; // Return the success message
  } catch (error) {
    throw error.response
      ? error.response.data
      : 'An error occurred while starting the presentation';
  }
};

export const joinPresentation = async (username, meetingLink) => {
  try {
    const response = await api.post('/join-presentation', {
      username,
      meetingLink,
    });
    return response.data;
  } catch (error) {
    throw error.response
      ? error.response.data
      : 'An error occurred while joining the presentation';
  }
};
