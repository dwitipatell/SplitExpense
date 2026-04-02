import "../styles/dashboard.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import translations from "../utils/translations";
import AddEvent from "./addevent";

const INDIAN_LANGUAGES = ["English", "Hindi", "Gujarati", "Marathi", "Bengali", "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi", "Odia", "Urdu"];
const AVATAR_COLORS = ["#FF7A18", "#38bdf8", "#00C9A7", "#ff4d4d", "#9C27B0", "#E91E63", "#FBBF24"];

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  
  // Modals & Popups States
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  
  const [eventToEdit, setEventToEdit] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Persistent Preferences
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "English");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  
  // Profile States
  const [displayName, setDisplayName] = useState(() => localStorage.getItem("displayName") || "");
  const [avatarInitial, setAvatarInitial] = useState(() => localStorage.getItem("avatarInitial") || "");
  const [avatarColor, setAvatarColor] = useState(() => localStorage.getItem("avatarColor") || "#FF7A18");

  // Temporary Edit States for Profile Popup
  const [editName, setEditName] = useState("");
  const [editInitial, setEditInitial] = useState("");
  const [editColor, setEditColor] = useState("");

  const t = translations[language] || translations["English"];

  const fetchEvents = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      setUser(currentUser);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEvents(data.map(e => ({
          ...e,
          people: JSON.parse(e.people || "[]"),
          paid_by_parsed: JSON.parse(e.paid_by || "[]")
        })));
      }
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setShowLanguages(false);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'short' });
    return (
      <div className="date-display">
        <span className="date-day">{day}</span>
        <span className="date-month">{month}</span>
      </div>
    );
  };

  const handleDeleteEvent = async (eventId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this event?")) return;
    
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (!error) {
      setEvents(events.filter(e => e.id !== eventId));
      if (selectedEvent?.id === eventId) setSelectedEvent(null);
    }
  };

  const handleEditEvent = (event, e) => {
    e.stopPropagation();
    setEventToEdit(event);
    setShowAddEvent(true);
  };

  // --- Profile Logic ---
  const getFallbackName = () => user?.email?.split('@')[0] || "User";
  const actualName = displayName || getFallbackName();
  const actualInitial = avatarInitial || actualName.charAt(0).toUpperCase();

  const handleOpenProfile = () => {
    setEditName(actualName);
    setEditInitial(actualInitial);
    setEditColor(avatarColor);
    setShowProfile(true);
  };

  const handleSaveProfile = () => {
    setDisplayName(editName);
    setAvatarInitial(editInitial);
    setAvatarColor(editColor);
    
    localStorage.setItem("displayName", editName);
    localStorage.setItem("avatarInitial", editInitial);
    localStorage.setItem("avatarColor", editColor);
    
    setShowProfile(false);
  };

  const myName = actualName;

  return (
    <div className="dashboard">
      <AddEvent 
        isOpen={showAddEvent} 
        onClose={() => {
          setShowAddEvent(false);
          setEventToEdit(null);
        }} 
        refreshEvents={fetchEvents}
        eventToEdit={eventToEdit}
      />

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="icon active">🏠</div>
          <div className="icon" onClick={() => setShowSettings(true)}>⚙️</div>
        </div>
        <div className="sidebar-bottom">
          <div className="user-profile" onClick={handleOpenProfile}>
            <div className="user-avatar" style={{ background: avatarColor }}>
              {actualInitial}
            </div>
            <span className="user-name">{actualName}</span>
          </div>
        </div>
      </div>

      <div className="main">
        <div className="navbar"><h2>SplitExpense</h2></div>

        {/* Profile Edit Dropdown */}
        {showProfile && (
          <div className="profile-dropdown highlight-box">
            <h4 style={{marginBottom: "5px", color: "white"}}>Edit Profile</h4>
            <p style={{fontSize: '12px', color: '#9ECCFA', marginBottom: '15px'}}>{user?.email}</p>
            
            <div className="profile-field">
              <label>Display Name</label>
              <input 
                value={editName} 
                onChange={e => setEditName(e.target.value)} 
                placeholder="Enter your name" 
              />
            </div>

            <div className="profile-field">
              <label>Logo Initial</label>
              <input 
                value={editInitial} 
                onChange={e => setEditInitial(e.target.value.toUpperCase())} 
                maxLength={2} 
                placeholder="e.g. D" 
              />
            </div>

            <div className="profile-field">
              <label>Logo Color</label>
              <div style={{display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap'}}>
                {AVATAR_COLORS.map(color => (
                  <div 
                    key={color}
                    onClick={() => setEditColor(color)}
                    style={{
                      width: '24px', height: '24px', borderRadius: '50%', background: color, 
                      cursor: 'pointer', border: editColor === color ? '2px solid white' : '2px solid transparent',
                      transition: '0.2s'
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
              <button className="save-btn" style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.2)'}} onClick={() => setShowProfile(false)}>Cancel</button>
              <button className="save-btn" onClick={handleSaveProfile}>Save</button>
            </div>
          </div>
        )}

        <div className="content">
          <div className="left">
            <h3>Active Events</h3>
            {events.length === 0 && <p className="no-events">{t.noEvents || "No events yet"}</p>}
            
            {events.map((event) => (
              <div className="event-card premium-card" key={event.id} onClick={() => setSelectedEvent(event)}>
                <div className="event-left"><div className="date">{formatDate(event.date)}</div></div>
                <div className="event-middle">
                  <h4>{event.event_name}</h4>
                  <p>{event.total_people} participants</p>
                </div>
                <div className="event-right">
                  <h3>₹{event.amount.toLocaleString()}</h3>
                  
                  {/* NEW CLEAN EDIT BUTTON HERE */}
                  <div className="event-actions">
                    <button className="edit-btn-small" onClick={(e) => handleEditEvent(event, e)}>Edit</button>
                    <button className="delete-btn" onClick={(e) => handleDeleteEvent(event.id, e)}>🗑️</button>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <div className="right">
            <button className="add-btn" onClick={() => { setEventToEdit(null); setShowAddEvent(true); }}>+ Add New Event</button>
            
            <div className="glass-box">
              <h4 className="box-title">Payment Reminders</h4>
              <div className="list-container">
                {events.map(event => {
                  const share = event.amount / event.total_people;
                  const myPaid = event.paid_by_parsed.find(p => p.name === myName)?.paid || 0;
                  if (myPaid < share) {
                    const bigPayer = event.paid_by_parsed.find(p => p.paid > share);
                    return (
                      <div className="elegant-card owe" key={event.id}>
                        <div className="card-info">
                          <p className="main-text">Pay <b>{bigPayer?.name || 'Group'}</b></p>
                          <p className="sub-text">for {event.event_name}</p>
                        </div>
                        <div className="card-amount red">₹{Math.round(share - myPaid)}</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="glass-box">
              <h4 className="box-title">Pending from Others</h4>
              <div className="list-container">
                {events.map(event => {
                  const share = event.amount / event.total_people;
                  const myPaid = event.paid_by_parsed.find(p => p.name === myName)?.paid || 0;
                  if (myPaid > share) {
                    return event.people.filter(p => p !== myName).map((person, idx) => {
                      const personPaid = event.paid_by_parsed.find(pay => pay.name === person)?.paid || 0;
                      const personOwes = share - personPaid;
                      if (personOwes > 0) {
                        return (
                          <div className="elegant-card receive" key={`${event.id}-${idx}`}>
                            <div className="card-info">
                              <p className="main-text"><b>{person}</b> owes you</p>
                              <p className="sub-text">from {event.event_name}</p>
                            </div>
                            <div className="card-amount green">₹{Math.round(personOwes)}</div>
                          </div>
                        );
                      }
                      return null;
                    });
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedEvent && (
        <div className="modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="settings-panel detail-box" onClick={e => e.stopPropagation()}>
            <div className="settings-header">
              <h3 style={{color: '#ff7a18'}}>{selectedEvent.event_name}</h3>
              <button className="close-btn" onClick={() => setSelectedEvent(null)}>✕</button>
            </div>
            <div className="detail-content">
              <div className="detail-row"><span>Total Amount:</span> <b>₹{selectedEvent.amount}</b></div>
              <div className="detail-row"><span>Individual Share:</span> <b>₹{Math.round(selectedEvent.amount / selectedEvent.total_people)}</b></div>
              <hr className="settings-divider" />
              <p><b>Date:</b> {selectedEvent.date}</p>
              <p><b>Group:</b> {selectedEvent.people.join(", ")}</p>
              <p style={{marginTop: '10px'}}><b>Payers:</b></p>
              {selectedEvent.paid_by_parsed.map((p, i) => (
                <div key={i} className="detail-row"><span>{p.name}</span> <span>₹{p.paid}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showSettings && (
        <div className="settings-overlay" onClick={() => { setShowSettings(false); setShowLanguages(false); }}>
          <div className="settings-panel highlight-box" onClick={(e) => e.stopPropagation()}>
            
            <div className="settings-header">
              <h3>{t.settings || "Settings"}</h3>
              <button className="close-btn" onClick={() => setShowSettings(false)}>✕</button>
            </div>

            <div className="settings-item" onClick={() => setShowLanguages(!showLanguages)}>
              <div className="settings-left"><span>🌐</span><span>{t.changeLanguage || "Change Language"}</span></div>
              <span className="settings-arrow">{language} ›</span>
            </div>

            {showLanguages && (
              <div className="language-list">
                {INDIAN_LANGUAGES.map((lang) => (
                  <div key={lang} className={`language-item ${language === lang ? "selected" : ""}`} onClick={() => handleLanguageChange(lang)}>
                    {lang} {language === lang && "✓"}
                  </div>
                ))}
              </div>
            )}

            <div className="settings-item" onClick={() => setDarkMode(!darkMode)}>
              <div className="settings-left"><span>{darkMode ? "☀️" : "🌙"}</span><span>Theme</span></div>
              <div className={`toggle ${darkMode ? "on" : ""}`}><div className="toggle-circle"></div></div>
            </div>

            <hr className="settings-divider" />

            <div className="settings-item logout" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>
              <div className="settings-left"><span style={{color: '#ff4d4d'}}>🚪</span><span style={{color: '#ff4d4d'}}>{t.logout || "Logout"}</span></div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}