import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="login-box">
        <h1 className="logo">SplitExpense</h1>
        <p className="tagline">Split smart. Live better.</p>

        <form className="form">
          <div className="input-group">
            <input type="email" required />
            <label>Email</label>
          </div>

          <div className="input-group">
            <input type="password" required />
            <label>Password</label>
          </div>

          <button className="btn">Login</button>
        </form>

        <p className="bottom-text">
          Don’t have an account?{''} 
          <span onClick={()=>navigate("/signup")}>Sign up</span>
        </p>
      </div>
    </div>
  );
}