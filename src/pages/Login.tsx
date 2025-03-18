import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  AuthError,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      const firebaseError = err as AuthError;
      if (firebaseError.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (firebaseError.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (firebaseError.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else {
        setError("Failed to login. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError("");
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      const firebaseError = err as AuthError;
      if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Login cancelled. Please try again.");
      } else if (firebaseError.code === "auth/popup-blocked") {
        setError("Login popup was blocked. Please allow popups and try again.");
      } else {
        setError("Failed to login with Google. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-2/3 items-center justify-center p-12">
        <div className="w-full max-w-2xl border border-gray-800 rounded-3xl p-8">
          <h2 className="text-2xl font-light mb-8">Website Features</h2>
          <ul className="space-y-4 text-gray-400">
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Track your daily tasks and routines
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Set reminders and get notifications
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Analyze your productivity patterns
            </li>
            <li className="flex items-center">
              <span className="mr-2">→</span>
              Sync across all your devices
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/3 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-light mb-2">Login</h2>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-gray-600 transition-colors"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black rounded-lg px-4 py-3 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Social Login */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full border border-gray-800 rounded-lg px-4 py-3 flex items-center justify-center hover:border-gray-600 transition-colors disabled:opacity-50"
              >
                
                <span>Continue with Google</span>
              </button>
            </div>
          </div>

          <div className="text-center text-gray-500">
            <Link to="/register" className="hover:text-white transition-colors">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
