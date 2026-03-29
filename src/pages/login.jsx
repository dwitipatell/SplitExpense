import React from "react";
import "../styles/login.css";

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