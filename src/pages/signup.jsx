import {useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/signup.css";
import { supabase } from "../services/supabase";

export default function Signup() {
    const navigate = useNavigate();
    const [form , setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [capsLock , setCapsLock] = useState(false);
    const [error , setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleKey = (e) => {
        setCapsLock(e.getModifierState("Capslock"));
    };

    const validatePassword = (password) => {
        const minLength = /.{6,}/;
        const hasNumber = /[0-9]/;
        const hasUpper = /[A-Z]/;

        if(!minLength.test(password)) {
            return "password must be at least 6 character";
        }
        if (!hasNumber.test(password)){
            return "Password must include a number";
        }
        if(!hasUpper.test(password)){
            return "password must include an Uppercase letter";
        }
        return "";
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const passwordError = validatePassword(form.password);
        if (passwordError) {
        setError(passwordError);
        return;
        }

        if (form.password !== form.confirmPassword) {
        setError("Passwords do not match");
        return;
        }
        setError("");

        console.log("User:", form);

        navigate("/");
    };

    const handleGoogleSignup = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        });

        if (error) {
        console.log("Google error:", error.message);
        }
    };

    return (
        
    <div className="signup-page">
      <div className="signup-box">
        <h2>Create Account</h2>
        <p className="signup-subtext">Join SplitExpense</p>

        <form onSubmit={handleSubmit}>
            <div className="signup-group">
                <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                />
                <label>Full Name</label>
          </div>

            <div className="signup-group">
                <input
                    type="email"
                    name="email"
                    // placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
                <label>Email</label>
            </div>

            <div className="signup-group">
                <input
                    type="password"
                    name="password"
                    // placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    onKeyUp={handleKey}
                    required
                />
                <label>Password</label>
          </div>

          {capsLock && (
            <p className="warning">⚠ Caps Lock is ON</p>
          )}

            <div className="signup-group">
                <input
                    type="password"
                    name="confirmPassword"
                    // placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                />
                <label>Confirm Password</label>
            </div>
            <p className="hint">
            Must be 6+ chars, include 1 uppercase & 1 number
          </p>

          {error && <p className="error">{error}</p>}

            <button type="submit" className="signup-btn">
            Sign Up
            </button>

            <div className="google-wrapper">
                <button
                    type="button"
                    className="google-icon-btn"
                    onClick={handleGoogleSignup}
                    >
                    <img src="/google_signup.png" alt="Google" />
                </button>
            </div>
        </form>

        <p className="signup-footer">
          Already have an account?{" "}
          <span onClick={() => navigate("/")}>Login</span>
        </p>
      </div>
    </div>
    );
}