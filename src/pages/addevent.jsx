import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/addevent.css";

export default function AddEvent() {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [participants, setParticipants] = useState("");
  const [totalPeople, setTotalPeople] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");

  const handleCreate = () => {
        const peopleArray = participants.split(",");

        const eventData = {
            eventName,
            totalPeople,
            people: peopleArray,
            amount: Number(amount),
            paidBy
        };

        console.log("Full Event Data:", eventData);

        navigate("/dashboard");
    };

    return (
        <div className="add-event-page">
            <div className="add-event-box">

            <h2>Create New Event</h2>

            {/* Event Name */}
            <input
                placeholder="Event Title"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
            />

            <br /><br />

            {/* Total Participants */}
            <input
                placeholder="Total Participants"
                value={totalPeople}
                onChange={(e) => setTotalPeople(e.target.value)}
            />

            <br /><br />

            {/* Names */}
            <input
                placeholder="Participant Names"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
            />

            <br /><br />

            {/* Total Amount */}
            <input
                placeholder="Total Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <br /><br />

            {/* Paid By */}
            <input
                placeholder="Who Paid"
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value)}
            />

            <br /><br />

            <button onClick={handleCreate}>
                Create Event
            </button>

            </div>
        </div>
    );
}