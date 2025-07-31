// store/index.js - Final fixed version
"use client";
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';
import bookingReducer from './bookingSlice';
import locationReducer from './locationSlice';

// Persist config
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'booking', 'location'],
  // Add serialize/deserialize functions to handle any issues
  serialize: (data) => {
    try {
      return JSON.stringify(data);
    } catch (error) {
      console.warn('Serialization error:', error);
      return '{}';
    }
  },
  deserialize: (data) => {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.warn('Deserialization error:', error);
      return {};
    }
  }
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  booking: bookingReducer,
  location: locationReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with comprehensive serializable check ignoring
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/FLUSH',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER'
        ],
        ignoredActionsPaths: [
          'meta.arg',
          'payload.timestamp',
          'payload.result',
          'meta.baseQueryMeta',
          'result'
        ],
        ignoredPaths: [
          'items.dates',
          '_persist',
          'register',
          'rehydrate'
        ],
        // More comprehensive ignoring
        warnAfter: 128,
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Create persistor with error handling
export const persistor = persistStore(store, null, () => {
  console.log('Persistor rehydration complete');
});

// Add error handling for persistor
persistor.subscribe(() => {
  const state = persistor.getState();
  if (state.bootstrapped) {
    console.log('Redux persist bootstrapped');
  }
});

export default store;