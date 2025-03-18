import { create } from 'zustand';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null }); // Start loading

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post('http://localhost:5000/api/auth/login', { withCredentials:true }, { email, password }, config);

      set({ 
        user: data.user, 
        isAuthenticated: true, 
        loading: false, 
        error: null 
      }); // Successful login
    } catch (error) {
      set({
        loading: false,
        error: error.response?.data?.message || 'An error occurred',
      }); // Error handling
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false }); // Reset state on logout
  }
}));

export default useAuthStore;