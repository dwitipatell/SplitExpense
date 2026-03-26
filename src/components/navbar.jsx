import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <h2>SplitExpense</h2>

      <Link to="/">Login</Link>
      <br />
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}

export default Navbar;