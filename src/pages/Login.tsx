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
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      const firebaseError = err as AuthError;
      switch (firebaseError.code) {
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
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
      provider.setCustomParameters({
        prompt: "select_account",
      });
      await signInWithPopup(auth, provider);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google login error:", err);
      const firebaseError = err as AuthError;
      switch (firebaseError.code) {
        case "auth/popup-closed-by-user":
          setError("Login cancelled. Please try again.");
          break;
        case "auth/popup-blocked":
          setError(
            "Login popup was blocked. Please allow popups and try again."
          );
          break;
        case "auth/account-exists-with-different-credential":
          setError(
            "An account already exists with the same email address but different sign-in credentials."
          );
          break;
        default:
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
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
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
                  disabled={loading}
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
                  disabled={loading}
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
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
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
