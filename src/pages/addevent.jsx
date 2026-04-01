import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "../styles/addevent.css";

export default function AddEvent() {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [totalPeople, setTotalPeople] = useState("");
  const [participantNames, setParticipantNames] = useState([]);
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTotalPeopleChange = (e) => {
    const count = parseInt(e.target.value);
    setTotalPeople(e.target.value);
    if (!isNaN(count) && count > 0) {
      setParticipantNames(Array(count).fill(""));
    } else {
      setParticipantNames([]);
    }
  };

  const handleNameChange = (index, value) => {
    const updated = [...participantNames];
    updated[index] = value;
    setParticipantNames(updated);
  };

  const handleCreate = async () => {
    setError("");
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in!");
      setLoading(false);
      return;
    }

    const { error: supabaseError } = await supabase
      .from("events")
      .insert([{
        user_id: user.id,
        event_name: eventName,
        total_people: parseInt(totalPeople),
        people: JSON.stringify(participantNames),
        amount: Number(amount),
        paid_by: paidBy,
        date: new Date().getDate()
      }]);

    setLoading(false);

    if (supabaseError) {
      setError(supabaseError.message);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="add-event-page">
      <div className="add-event-box">
        <h2>Create New Event</h2>

        <div className="input-wrapper">
          <label>Event Title</label>
          <input
            placeholder="e.g. Goa Trip"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label>Total Participants</label>
          <input
            type="number"
            placeholder="e.g. 4"
            value={totalPeople}
            onChange={handleTotalPeopleChange}
          />
        </div>

        {participantNames.map((name, index) => (
          <div className="input-wrapper participant-input" key={index}>
            <label>Participant {index + 1}</label>
            <input
              placeholder="Enter name"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
            />
          </div>
        ))}

        {participantNames.length > 0 && <hr className="section-divider" />}

        <div className="input-wrapper">
          <label>Total Amount</label>
          <input
            placeholder="e.g. ₹2000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="input-wrapper">
          <label>Who Paid</label>
          <input
            placeholder="e.g. Daksh"
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
          />
        </div>

        {error && <p style={{ color: "red", fontSize: "13px" }}>{error}</p>}

        <button onClick={handleCreate} disabled={loading}>
          {loading ? "Creating..." : "Create Event"}
        </button>
      </div>
    </div>
  );
}