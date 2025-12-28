// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
  // Authentication
  REGISTER: `${API_BASE_URL}/mongo/auth/register/`,
  LOGIN: `${API_BASE_URL}/mongo/auth/login/`,
  LOGOUT: `${API_BASE_URL}/mongo/auth/logout/`,
  VERIFY: `${API_BASE_URL}/mongo/auth/verify/`,
  
  // Patients
  PATIENTS: `${API_BASE_URL}/mongo/patients/`,
  
  // Booking
  BOOK_TEST: `${API_BASE_URL}/mongo/book-test/`,
  
  // Dashboard
  DASHBOARD_STATS: `${API_BASE_URL}/mongo/dashboard/stats/`,
};

export { API_BASE_URL, BACKEND_URL };