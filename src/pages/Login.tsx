import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  AuthError,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../config/firebase";
import styles from "../styles/Login.module.css";

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
    <div className={styles.loginContainer}>
      {/* Left Side - Features */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresCard}>
          <h2 className={styles.featuresTitle}>Website Features</h2>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span>→</span>
              Track your daily tasks and routines
            </li>
            <li className={styles.featureItem}>
              <span>→</span>
              Set reminders and get notifications
            </li>
            <li className={styles.featureItem}>
              <span>→</span>
              Analyze your productivity patterns
            </li>
            <li className={styles.featureItem}>
              <span>→</span>
              Sync across all your devices
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.loginSection}>
        <div className={styles.loginContent}>
          <div className={styles.loginHeader}>
            <h2 className={styles.loginTitle}>Login</h2>
            {error && <p className={styles.errorMessage}>{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="Password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={styles.submitButton}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Social Login */}
          <div className={styles.socialLogin}>
            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <div className={styles.dividerText}>Or continue with</div>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className={styles.googleButton}
            >
              Continue with Google
            </button>
          </div>

          <div className={styles.registerLink}>
            <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
