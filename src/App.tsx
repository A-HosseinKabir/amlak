// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { BookmarkProvider } from './contexts/BookmarkContext';
import { AppLayout } from './components/layout/AppLayout';
import {
  DiscoverPage,
  MapPage,
  ChatsPage,
  SavedPage,
  ProfilePage,
} from './components/pages';
import { PrivateRoute } from './components/features/auth/PrivateRoute';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookmarkProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout />}>
                <Route index element={<DiscoverPage />} />
                <Route path="map" element={<MapPage />} />
                <Route path="chats" element={<ChatsPage />} />
                <Route path="saved" element={<SavedPage />} />
                <Route
                  path="profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
              </Route>
            </Routes>
          </BrowserRouter>
        </BookmarkProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}