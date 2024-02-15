import { getCookie, setCookie, deleteCookie } from "cookies-next";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import axios from "../src/utils/axios";
import { decode } from "jsonwebtoken";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  accountType: {
    id: number;
    name: string;
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const token = getCookie(process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string);
    if (token) {
      const userData = decode(token) as User;
      console.log(userData, "tu san");

      setUser(userData);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
      JSON.stringify({
        email,
        password,
      }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const userData = decode(response.data) as User;

    setCookie(
      process.env.NEXT_PUBLIC_AUTH_COOKIE_KEY as string,
      response.data,
      {
        maxAge: 60 * 60 * 24,
        path: "/",
      }
    );

    setUser(userData);
  };

  const logout = () => {
    deleteCookie(process.env.NEXT_AUTH_COOKIE_KEY as string);

    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
