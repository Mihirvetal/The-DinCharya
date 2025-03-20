import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, AuthError } from "firebase/auth";
import { auth } from "../config/firebase";
import styles from "../styles/Register.module.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered successfully:", userCredential.user);

      // Navigate to login page after successful registration
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      const firebaseError = err as AuthError;
      if (firebaseError.code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password should be at least 6 characters");
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };
// this is regisrer page
  return (
    <div className={styles.registerContainer}>
      {/* Left Side - Features */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresCard}>
          <h2 className={styles.featuresTitle}>Welcome to DinCharya</h2>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <span>→</span>
              Organize your daily tasks efficiently
            </li>
            <li className={styles.featureItem}>
              <span>→</span>
              Track your progress and achievements
            </li>
            <li className={styles.featureItem}>
              <span>→</span>
              Get personalized productivity insights
            </li>
            <li className={styles.featureItem}>
              <span>→</span>
              Stay focused and motivated
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className={styles.registerSection}>
        <div className={styles.registerContent}>
          <div className={styles.registerHeader}>
            <h2 className={styles.registerTitle}>Create Account</h2>
            <p className={styles.registerSubtitle}>
              Join DinCharya to manage your tasks effectively
            </p>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <form onSubmit={handleSubmit} className={styles.registerForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email" className={styles.label}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
                placeholder="Enter your email"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password" className={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
                minLength={6}
                placeholder="Create a password"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="confirmPassword" className={styles.label}>
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={styles.input}
                required
                disabled={loading}
                minLength={6}
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <div className={styles.loginLink}>
            Already have an account?{" "}
            <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
