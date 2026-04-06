import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { signupAuth, loginAuth, logoutAuth, refreshAuth } from "@/api/auth";
import type { AuthResponse } from "@/api/auth";
import { setAuthToken, clearAuthToken } from "@/config/axios";
import { getCurrentUser } from "@/api/user";
import axios from "axios";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("accessToken");

        if (token) {
          setIsAuthenticated(true);
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } else {
          const refreshResponse = await refreshAuth();
          setAuthToken(refreshResponse.accessToken);
          setIsAuthenticated(true);
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        // Only hard-logout when refresh is definitively invalid (401/403).
        // For transient errors (network/5xx), don't force a logout; allow the user to retry.
        const status = axios.isAxiosError(err) ? err.response?.status : undefined;
        if (status === 401 || status === 403) {
          clearAuthToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response: AuthResponse = await loginAuth({ email, password });
      setAuthToken(response.accessToken);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success("Login successful");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      const response: AuthResponse = await signupAuth({ firstName, lastName, email, password });
      setAuthToken(response.accessToken);
      setUser(response.user);
      setIsAuthenticated(true);
      toast.success("Signup successful");
      navigate("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutAuth();
    } catch {
      // Even if logout fails, clear local state
    } finally {
      clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login");
    }
  };

  const values = {
    isAuthenticated,
    setIsAuthenticated,
    isLoading,
    user,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

export const UserAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("UserAuth must be used within AuthContextProvider");
  return ctx;
};