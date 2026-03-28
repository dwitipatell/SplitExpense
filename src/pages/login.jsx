import React from "react";
import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-container">
      <div className="glass-card">
        <h1 className="logo">SplitExpense</h1>
        <p className="tagline">Split smart. Live better.</p>

        <form className="login-form">
          <div className="input-group">
            <input type="email" placeholder="Email" required />
          </div>

          <div className="input-group">
            <input type="password" placeholder="Password" required />
          </div>

          <button type="submit" className="login-btn">
            Login
          </button>

          <p className="extra">
            Don’t have an account? <span>Sign up</span>
          </p>
        </form>
      </div>
    </div>
  );
}