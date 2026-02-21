import { useState, useEffect, createContext, useContext } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";

// Pages
import AuthPage from "@/pages/AuthPage";
import FeedPage from "@/pages/FeedPage";
import ProfilePage from "@/pages/ProfilePage";
import MessagesPage from "@/pages/MessagesPage";
import Layout from "@/components/Layout";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

// Auth Context
export const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Axios interceptor for auth
const setupAxiosInterceptors = (token, logout) => {
  axios.defaults.headers.common["Authorization"] = token ? `Bearer ${token}` : "";
  
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("fightnet_token"));
  const [loading, setLoading] = useState(true);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("fightnet_token", authToken);
    localStorage.setItem("fightnet_user", JSON.stringify(userData));
    setupAxiosInterceptors(authToken, logout);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("fightnet_token");
    localStorage.removeItem("fightnet_user");
    setupAxiosInterceptors(null, logout);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("fightnet_user", JSON.stringify(userData));
  };

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("fightnet_token");
      const savedUser = localStorage.getItem("fightnet_user");
      
      if (savedToken && savedUser) {
        try {
          setupAxiosInterceptors(savedToken, logout);
          const response = await axios.get(`${API}/auth/me`);
          setUser(response.data);
          setToken(savedToken);
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-fight-black flex items-center justify-center">
        <div className="text-fight-red font-anton text-4xl animate-pulse">FIGHTNET</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      <div className="App min-h-screen bg-fight-black">
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
            <Route element={user ? <Layout /> : <Navigate to="/auth" />}>
              <Route path="/" element={<FeedPage />} />
              <Route path="/profile/:userId" element={<ProfilePage />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/messages/:userId" element={<MessagesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" theme="dark" />
      </div>
    </AuthContext.Provider>
  );
}

export default App;
