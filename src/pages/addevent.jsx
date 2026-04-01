import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import "../styles/addevent.css";

export default function AddEvent({ 
  isOpen, 
  onClose, 
  refreshEvents, 
  eventToEdit = null 
}) {
  const [eventName, setEventName] = useState("");
  const [totalPeople, setTotalPeople] = useState("1");
  const [participantNames, setParticipantNames] = useState([""]);
  const [amount, setAmount] = useState("");
  const [payers, setPayers] = useState([{ name: "", paid: "" }]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWarning, setShowWarning] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (eventToEdit) {
        setIsEditing(true);
        setEventName(eventToEdit.event_name || "");
        setAmount(eventToEdit.amount?.toString() || "");
        setTotalPeople(eventToEdit.total_people?.toString() || "1");
        setParticipantNames(eventToEdit.people || [localStorage.getItem("displayName") || "You"]);
        setPayers(eventToEdit.paid_by_parsed || [{ name: localStorage.getItem("displayName") || "You", paid: "" }]);
      } else {
        setIsEditing(false);
        const userDisplayName = localStorage.getItem("displayName") || "You";
        setEventName("");
        setAmount("");
        setTotalPeople("1");
        setParticipantNames([userDisplayName]);
        setPayers([{ name: userDisplayName, paid: "" }]);
      }
      setError("");
      setShowWarning(false);
    }
  }, [isOpen, eventToEdit]);

  const hasUnsavedChanges = 
    eventName.trim() || 
    amount || 
    participantNames.length > 1 || 
    payers.some(p => p.paid !== "");

  const handleTotalPeopleChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setTotalPeople(e.target.value);
    const updated = [...participantNames];
    const newNames = Array(count).fill("").map((_, i) => updated[i] || "");
    setParticipantNames(newNames);
  };

  const handlePayerChange = (index, field, value) => {
    const updated = [...payers];
    updated[index][field] = value;
    setPayers(updated);
  };

  const handleSave = async () => {
    const totalBill = Number(amount) || 0;
    const sumPaid = payers.reduce((sum, p) => sum + Number(p.paid || 0), 0);

    if (totalBill > 0 && sumPaid !== totalBill) {
      setError(`⚠️ Sum of payments (₹${sumPaid}) must equal Total Amount (₹${totalBill})`);
      return;
    }
    if (!eventName.trim()) {
      setError("⚠️ Event Title is required.");
      return;
    }

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    const eventData = {
      user_id: user.id,
      event_name: eventName.trim(),
      total_people: parseInt(totalPeople),
      people: JSON.stringify(participantNames),
      amount: totalBill,
      paid_by: JSON.stringify(payers),
      date: new Date().toISOString().split('T')[0]
    };

    let sbError;
    if (isEditing && eventToEdit) {
      const { error } = await supabase
        .from("events")
        .update(eventData)
        .eq("id", eventToEdit.id);
      sbError = error;
    } else {
      const { error } = await supabase.from("events").insert([eventData]);
      sbError = error;
    }

    setLoading(false);
    if (!sbError) {
      refreshEvents();
      resetAndClose();
    } else {
      setError(sbError.message);
    }
  };

  const resetAndClose = () => {
    setEventName(""); 
    setAmount(""); 
    setTotalPeople("1");
    setError(""); 
    setShowWarning(false); 
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`add-event-box modal-content addevent-scrollable ${isEditing ? 'edit-mode' : ''}`}>
        <button 
          className="close-btn" 
          onClick={() => hasUnsavedChanges ? setShowWarning(true) : resetAndClose()}
        >
          &times;
        </button>

        <h2>{isEditing ? "Edit Event" : "Create New Event"}</h2>

        <div className="form-scroll-container">
          <div className="input-wrapper">
            <label>Event Title</label>
            <input 
              placeholder="e.g. Dinner at BBQ" 
              value={eventName} 
              onChange={e => setEventName(e.target.value)} 
            />
          </div>

          <div className="input-wrapper">
            <label>Total Amount (₹)</label>
            <input 
              type="number" 
              placeholder="2000" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
            />
          </div>

          <hr className="section-divider" />

          <div className="input-wrapper">
            <label>Number of Participants</label>
            <input 
              type="number" 
              min="1" 
              value={totalPeople} 
              onChange={handleTotalPeopleChange} 
            />
          </div>

          {participantNames.map((name, i) => (
            <div className="input-wrapper participant-input" key={i}>
              <label>Participant {i + 1} {i === 0 && "(You)"}</label>
              <input 
                value={name} 
                disabled={i === 0} 
                placeholder="Friend Name"
                style={i === 0 ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                onChange={e => {
                  const up = [...participantNames]; 
                  up[i] = e.target.value; 
                  setParticipantNames(up);
                }}
              />
            </div>
          ))}

          <hr className="section-divider" />

          <div className="payer-header">
            <label>Who Paid?</label>
            <button 
              className="add-payer-row-btn" 
              onClick={() => setPayers([...payers, {name: "", paid: ""}])}
            >
              + Add Payer
            </button>
          </div>

          {payers.map((p, i) => (
            <div className="payer-row" key={i}>
              <input 
                className="payer-input-name" 
                placeholder="Full Name" 
                value={p.name} 
                onChange={e => handlePayerChange(i, 'name', e.target.value)} 
              />
              <input 
                className="payer-input-amount" 
                type="number" 
                placeholder="₹ Amount" 
                value={p.paid} 
                onChange={e => handlePayerChange(i, 'paid', e.target.value)} 
              />
              {payers.length > 1 && (
                <button 
                  className="remove-payer-btn" 
                  onClick={() => setPayers(payers.filter((_, idx) => idx !== i))}
                >
                  ×
                </button>
              )}
            </div>
          ))}

          {error && <p className="error-text">{error}</p>}
        </div>

        <button 
          className="create-event-submit" 
          onClick={handleSave} 
          disabled={loading}
        >
          {loading ? "Saving..." : isEditing ? "Update Event" : "Save Event"}
        </button>
      </div>

      {showWarning && (
        <div className="warning-overlay">
          <div className="warning-box">
            <div className="warning-icon">⚠️</div>
            <h3 className="warning-title">Unsaved Changes</h3>
            <p className="warning-message">Discard changes and exit?</p>
            <div className="warning-actions">
              <button className="warn-btn discard" onClick={resetAndClose}>Discard</button>
              <button className="warn-btn save" onClick={() => setShowWarning(false)}>Keep Editing</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}