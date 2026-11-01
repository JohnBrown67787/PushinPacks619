"use client";

import { useState } from "react";
import styles from "./AdminLogin.module.css";
import { IconLock, IconUser } from "./Icons";

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const VALID_USERNAME = "Pushinpacks619";
  const VALID_PASSWORD = "Push@6199";

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (username === VALID_USERNAME && password === VALID_PASSWORD) {
        // Store auth token in localStorage
        localStorage.setItem("adminAuth", JSON.stringify({
          authenticated: true,
          timestamp: Date.now(),
        }));
        onLoginSuccess();
      } else {
        setError("Invalid username or password");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.loginHeader}>
          <div className={styles.lockIcon}>
            <IconLock size={32} />
          </div>
          <h1 className={styles.title}>Admin Console</h1>
          <p className={styles.subtitle}>Secure Access Required</p>
        </div>

        <form onSubmit={handleLogin} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              <IconUser size={18} />
              Username
            </label>
            <input
              id="username"
              type="text"
              className={styles.input}
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              autoFocus
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              <IconLock size={18} />
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading || !username || !password}
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.hint}>
            🔒 This area is restricted to administrators only.
          </p>
        </div>
      </div>
    </div>
  );
}
