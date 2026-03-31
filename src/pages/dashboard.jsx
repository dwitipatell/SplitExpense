import React from "react";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <div className="icon active">🏠</div>
        <div className="icon">📄</div>
        <div className="icon">👥</div>
      </div>

      {/* Main */}
      <div className="main">

        {/* Navbar */}
        <div className="navbar">
          <h2>SplitExpense</h2>
          <div className="user">N</div>
        </div>

        <h1 className="welcome">Welcome Back, Nikhil Sharma!</h1>

        <div className="content">

          {/* LEFT */}
          <div className="left">

            <h3>Your Events</h3>

            {/* Card 1 */}
            <div className="event-card">
              <div className="event-left">
                <div className="date">28</div>
              </div>

              <div className="event-middle">
                <h4>Manali Trip (Aug '24)</h4>
                <p>6 participants</p>
                <div className="avatars">
                  <span>N</span><span>S</span><span>P</span>
                  <span>R</span><span>M</span><span>K</span>
                </div>
              </div>

              <div className="event-right">
                <h3>₹28,500</h3>
                <span className="status green">Settling</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="event-card">
              <div className="event-left">
                <div className="date">05</div>
              </div>

              <div className="event-middle">
                <h4>Weekend Dinner</h4>
                <p>4 participants</p>
                <div className="avatars">
                  <span>N</span><span>S</span><span>P</span><span>R</span>
                </div>
              </div>

              <div className="event-right">
                <h3>₹4,200</h3>
                <span className="status blue">Ongoing</span>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="right">

            <button className="add-btn">+ Add New Event</button>

            <div className="box">
              <h4>Payment Reminders</h4>

              <div className="reminder">
                <p>You owe Shivam ₹1,250</p>
                <button>Pay Now</button>
              </div>

              <div className="reminder">
                <p>You owe Rahul ₹750</p>
                <button>Pay Now</button>
              </div>
            </div>

            <div className="box">
              <h4>Pending from Others</h4>

              <div className="pending">
                <p>Simran owes you</p>
                <span>₹3,400</span>
              </div>

              <div className="pending">
                <p>Pooja owes you</p>
                <span>₹525</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}