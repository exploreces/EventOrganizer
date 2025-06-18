import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { jwtDecode } from "jwt-decode";
import api from "../utils/api";

interface User {
  id: number;
  email: string;
  role: string;
  name: string;
  avatar?: string;
  createdAt?: string;
}

interface DecodedToken {
  sub: number;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<string>;
  signup: (name: string, email: string, password: string) => Promise<string>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post("/api/login", { email, password });
    const { token } = res.data;
    localStorage.setItem("token", token);
    const decoded: DecodedToken = jwtDecode(token);
    const newUser = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
      name: decoded.name,
    };
    setUser(newUser);
    return token;
  }, []);

  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await api.post("/api/register", { name, email, password });
      const { token } = res.data;
      localStorage.setItem("token", token);
      const decoded: DecodedToken = jwtDecode(token);
      const newUser = {
        id: decoded.sub,
        email: decoded.email,
        role: decoded.role,
        name: decoded.name,
      };
      setUser(newUser);
      return token;
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp * 1000 > Date.now()) {
        setUser({
          id: decoded.sub,
          email: decoded.email,
          role: decoded.role,
          name: decoded.name,
        });
      } else {
        logout();
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
