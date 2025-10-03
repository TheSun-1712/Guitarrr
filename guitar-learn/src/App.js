import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebaseConfig';

import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import LessonViewer from './components/LessonViewer';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/lesson/:lessonId" element={user ? <LessonViewer /> : <Navigate to="/login" />} />
        {/* Redirect base URL to dashboard if logged in, else to login */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;