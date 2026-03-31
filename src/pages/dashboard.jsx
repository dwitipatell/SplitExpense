import React from "react";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">SplitExpense</h2>
        <ul>
          <li className="active">Dashboard</li>
          <li>Groups</li>
          <li>Activity</li>
          <li>Settings</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main">

        {/* Navbar */}
        <div className="navbar">
          <h1>Dashboard</h1>
          <div className="user">👤 Vishh</div>
        </div>

        {/* Cards */}
        <div className="cards">
          <div className="card">
            <h3>Total Balance</h3>
            <p>₹1200</p>
          </div>

          <div className="card red">
            <h3>You Owe</h3>
            <p>₹500</p>
          </div>

          <div className="card green">
            <h3>You Are Owed</h3>
            <p>₹18000</p>
          </div>
        </div>

        {/* Events Section */}
        <div className="events">
          <h2>Your Events</h2>

          <div className="event-card">
            <h3>Messy Door</h3>
            <p>Total: ₹2000</p>
            <p>Status: Settling</p>
          </div>

          <div className="event-card">
            <h3>Weekend Dinner</h3>
            <p>Total: ₹4,200</p>
            <p>Status: Ongoing</p>
          </div>

        </div>

        {/* Transactions */}
        <div className="transactions">
          <h2>Recent Activity</h2>

          <div className="transaction">
            <p>You paid ₹500 for Dinner 🍔</p>
            <span>2 hours ago</span>
          </div>

          <div className="transaction">
            <p>Rahul owes you ₹250</p>
            <span>Yesterday</span>
          </div>

          <div className="transaction">
            <p>You owe Neha ₹300</p>
            <span>2 days ago</span>
          </div>
        </div>

      </div>

      {/* Floating Button */}
      <button className="fab">+</button>

    </div>
  );
}