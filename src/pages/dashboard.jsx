import "../styles/dashboard.css";
import { calculateGroupBalances, simplifyDebts } from "../utils/splitlogic";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Dashboard() {

  const navigate = useNavigate();
  const people = ["Dwiti", "Vishakha", "Daksh"];

  const expenses = [
    { amount: 900, paidBy: "Dwiti" },
    { amount: 300, paidBy: "Vishakha" }
  ];

  const balances = calculateGroupBalances(expenses, people);
  const transactions = simplifyDebts(balances);
  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState("");

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

            <button 
              className="add-btn"
              onClick={() => navigate("/add-event")}
            >
              + Add New Event
            </button>

           <div className="box">
              <h4>Payment Reminders</h4>

              {transactions.map((t, index) => (
                <div className="reminder" key={index}>
                  <p>{t.from} pays {t.to} ₹{t.amount}</p>
                  <button onClick={() => alert("Pay clicked")}>
                    Pay Now
                  </button>
                </div>
              ))}
            </div>

            <div className="box">
              <h4>Pending from Others</h4>

              {balances
                .filter(person => person.balance > 0)
                .map((person, index) => (
                  <div className="pending" key={index}>
                    <p>{person.name} should receive</p>
                    <span>₹{person.balance}</span>
                  </div>
                ))}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}