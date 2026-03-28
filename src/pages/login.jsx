// I've added a loading state and the redirection logic to send users to the dashboard upon a successful login



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { supabase } from "../services/supabase";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    const { data, error: supabaseError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false); // Stop loading

    if (supabaseError) {
      setError(supabaseError.message);
    } else {
      console.log("Logged in!", data.user);
      // Redirect to the dashboard page
      navigate("/dashboard"); 
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="logo">SplitExpense</h1>
        <p className="tagline">Split smart. Live better.</p>

        <form className="form" onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
          </div>

          {error && <p className="error-text">{error}</p>}

          {/* Button shows "Loading..." and is disabled while checking */}
          <button className="btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="bottom-text">
          Don't have an account?{" "}
          <span 
            onClick={() => navigate("/signup")} 
            style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}