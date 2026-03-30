import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "../styles/signup.css";

export default function Signup() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [capsLock, setCapsLock] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false); // 👈 added

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleKey = (e) => {
        setCapsLock(e.getModifierState("CapsLock"));
    };

    const validatePassword = (password) => {
        const minLength = /.{6,}/;
        const hasNumber = /[0-9]/;
        const hasUpper = /[A-Z]/;
        if (!minLength.test(password)) return "Password must be at least 6 characters";
        if (!hasNumber.test(password)) return "Password must include a number";
        if (!hasUpper.test(password)) return "Password must include an uppercase letter";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordError = validatePassword(form.password);
        if (passwordError) { setError(passwordError); return; }
        if (form.password !== form.confirmPassword) { setError("Passwords do not match"); return; }

        setError("");
        setLoading(true);

        const { error: supabaseError } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { full_name: form.name } }
        });

        setLoading(false);

        if (supabaseError) { setError(supabaseError.message); return; }

        setShowPopup(true); // 👈 show popup instead of alert
    };

    return (
        <div className="signup-page">
            <div className="signup-box">
                <h2>Create Account</h2>
                <p className="signup-subtext">Join SplitExpense</p>

                <form onSubmit={handleSubmit}>
                    <div className="signup-group">
                        <input type="text" name="name" value={form.name} onChange={handleChange} required />
                        <label>Full Name</label>
                    </div>
                    <div className="signup-group">
                        <input type="email" name="email" value={form.email} onChange={handleChange} required />
                        <label>Email</label>
                    </div>
                    <div className="signup-group">
                        <input type="password" name="password" value={form.password} onChange={handleChange} onKeyUp={handleKey} required />
                        <label>Password</label>
                    </div>
                    {capsLock && <p className="warning">⚠ Caps Lock is ON</p>}
                    <div className="signup-group">
                        <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
                        <label>Confirm Password</label>
                    </div>
                    <p className="hint">Must be 6+ chars, include 1 uppercase & 1 number</p>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="signup-btn" disabled={loading}>
                        {loading ? "Signing up..." : "Sign Up"}
                    </button>
                </form>

                <p className="signup-footer">
                    Already have an account?{" "}
                    <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>Login</span>
                </p>
            </div>

            {/* 👇 Elegant Popup */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <div className="popup-icon">📧</div>
                        <h3>Verify your email</h3>
                        <p>We've sent a confirmation link to <strong>{form.email}</strong>. Please check your inbox and verify before logging in.</p>
                        <button className="popup-btn" onClick={() => navigate("/")}>
                            Go to Login
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}