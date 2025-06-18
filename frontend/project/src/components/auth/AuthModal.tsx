import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: "login" | "signup";
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode }) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleSubmit = async () => {
    try {
      let token: string;
      if (mode === "signup") {
        await signup(name, email, password);
        alert("Signup successful! Please login.");
        setMode("login");
        return;
      } else {
        token = await login(email, password); // ✅ Removed unnecessary `as any`
      }

      const decoded: any = jwtDecode(token);
      const role = decoded.role?.toLowerCase();

      onClose(); // Close modal after login success

      if (role === "admin" || role === "manager") {
        navigate("/dashboard?role=admin");
      } else {
        navigate("/dashboard?role=user");
      }
    } catch (err) {
      console.error("Auth failed", err);
      alert("Login failed. Please check your credentials.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {mode === "login" ? "Login" : "Sign Up"}
        </h2>

        {mode === "signup" && (
          <input
            type="text"
            placeholder="Name"
            className="w-full mb-2 p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          {mode === "login" ? "Login" : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4">
          {mode === "login" ? "New user?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
};
