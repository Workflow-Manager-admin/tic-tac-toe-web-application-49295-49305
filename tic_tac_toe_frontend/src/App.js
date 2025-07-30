import React, { useState, useEffect } from 'react';
import './App.css';

// Routing & Page imports
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./utils/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import GamePlay from "./pages/GamePlay";
import GameHistory from "./pages/GameHistory";

// PUBLIC_INTERFACE
function App() {
  /**
   * Root App: sets up theme switching, routing, and auth context.
   */
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  // PrivateRoute to protect authenticated pages
  const PrivateRoute = ({ children }) => {
    const { token } = React.useContext(AuthContext);
    return token ? children : <Navigate to="/login" />;
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <Layout>
            <Routes>
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/play" element={<PrivateRoute><GamePlay /></PrivateRoute>} />
              <Route path="/history" element={<PrivateRoute><GameHistory /></PrivateRoute>} />
              <Route path="*" element={<p>Page not found</p>} />
            </Routes>
          </Layout>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
