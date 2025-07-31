import { createSlice } from '@reduxjs/toolkit';

// Get initial state from localStorage
const getInitialState = () => {
  if (typeof window !== 'undefined') {
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        return {
          token: parsed.token || null,
          user: parsed.user || null,
          role: parsed.role || 'user',
          isAuthenticated: !!(parsed.token && parsed.user)
        };
      }
    } catch (error) {
      console.error('Error reading auth from localStorage:', error);
    }
  }
  
  return {
    token: null,
    user: null,
    role: 'user',
    isAuthenticated: false
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setUser: (state, action) => {
      const { token, user, role } = action.payload;
      
      state.token = token;
      state.user = user;
      state.role = role;
      state.isAuthenticated = true;

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth', JSON.stringify({
          token,
          user,
          role,
          isAuthenticated: true
        }));
      }
    },
    
    updateUser: (state, action) => {
      const { user } = action.payload;
      
      // Merge existing user data with new data
      state.user = {
        ...state.user,
        ...user
      };
      
      if (typeof window !== 'undefined') {
        const currentAuth = {
          token: state.token,
          user: state.user,
          role: state.role,
          isAuthenticated: state.isAuthenticated
        };
        localStorage.setItem('auth', JSON.stringify(currentAuth));
      }
    },

    // New action to update specific user fields
    updateUserField: (state, action) => {
      const { field, value } = action.payload;
      
      if (state.user) {
        state.user[field] = value;
        
        if (typeof window !== 'undefined') {
          const currentAuth = {
            token: state.token,
            user: state.user,
            role: state.role,
            isAuthenticated: state.isAuthenticated
          };
          localStorage.setItem('auth', JSON.stringify(currentAuth));
        }
      }
    },

    // New action to update multiple user fields
    updateUserFields: (state, action) => {
      const fields = action.payload;
      
      if (state.user) {
        Object.keys(fields).forEach(key => {
          state.user[key] = fields[key];
        });
        
        if (typeof window !== 'undefined') {
          const currentAuth = {
            token: state.token,
            user: state.user,
            role: state.role,
            isAuthenticated: state.isAuthenticated
          };
          localStorage.setItem('auth', JSON.stringify(currentAuth));
        }
      }
    },
         
    clearUser: (state) => {
      state.token = null;
      state.user = null;
      state.role = 'user';
      state.isAuthenticated = false;

      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth');
      }
    }
  },
});

export const { 
  setUser, 
  clearUser, 
  updateUser, 
  updateUserField, 
  updateUserFields 
} = authSlice.actions;

export default authSlice.reducer;