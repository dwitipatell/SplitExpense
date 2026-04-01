import "../styles/dashboard.css";
import { calculateGroupBalances, simplifyDebts } from "../utils/splitlogic";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import translations from "../utils/translations";

const INDIAN_LANGUAGES = [
  "English", "Hindi", "Gujarati", "Marathi", "Bengali",
  "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi", "Odia", "Urdu"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "English");
  const [newDisplayName, setNewDisplayName] = useState(() => localStorage.getItem("displayName") || "");
  const [newInitial, setNewInitial] = useState(() => localStorage.getItem("displayInitial") || "");

  const t = translations[language] || translations["English"];

  const people = ["Dwiti", "Vishakha", "Daksh"];
  const expenses = [
    { amount: 900, paidBy: "Dwiti" },
    { amount: 300, paidBy: "Vishakha" }
  ];

  const balances = calculateGroupBalances(expenses, people);
  const transactions = simplifyDebts(balances);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          const parsed = data.map(e => ({
            ...e,
            people: JSON.parse(e.people || "[]")
          }));
          setEvents(parsed);
        }
      }
    };
    getUser();
  }, []);

  const getAvatarColor = () => {
    const colors = ["#FF6B6B", "#FF7A18", "#6C63FF", "#00C9A7", "#F7971E", "#2196F3", "#E91E63", "#9C27B0"];
    const name = user?.email || "U";
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitial = () => {
    if (newInitial) return newInitial.toUpperCase();
    const name = user?.user_metadata?.full_name || user?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = () => {
    if (newDisplayName) return newDisplayName;
    return user?.user_metadata?.full_name || user?.email || "User";
  };

  const handleSaveProfile = () => {
    localStorage.setItem("displayName", newDisplayName);
    localStorage.setItem("displayInitial", newInitial);
    setShowProfile(false);
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    setShowLanguages(false);
  };

  const handleDeleteEvent = async (eventId) => {
    const confirmed = window.confirm(t.deleteConfirm);
    if (!confirmed) return;
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (!error) setEvents(events.filter(e => e.id !== eventId));
  };

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-top">
          <div className="icon active" onClick={() => navigate("/dashboard")}>🏠</div>
          <div className="icon" onClick={() => navigate("/dashboard")}>📄</div>
          <div className="icon" onClick={() => navigate("/dashboard")}>👥</div>
          <div className="icon" onClick={() => setShowSettings(!showSettings)}>⚙️</div>
        </div>
        <div className="sidebar-bottom">
          <div className="user-profile" onClick={() => setShowProfile(!showProfile)}>
            <div className="user-avatar" style={{ background: getAvatarColor() }}>
              {getInitial()}
            </div>
            <span className="user-name">{getDisplayName()}</span>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="main">
        <div className="navbar">
          <h2>{t.splitExpense}</h2>
        </div>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="profile-dropdown">
            <h4>{t.editProfile}</h4>
            <div className="profile-field">
              <label>{t.changeName}</label>
              <input placeholder={t.changeName} value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)} />
            </div>
            <div className="profile-field">
              <label>{t.changeLogoLetter}</label>
              <input placeholder={t.changeLogoLetter} maxLength={1} value={newInitial} onChange={(e) => setNewInitial(e.target.value)} />
            </div>
            <button className="save-btn" onClick={handleSaveProfile}>{t.save}</button>
          </div>
        )}

        <h1 className="welcome">{t.welcome}, {getDisplayName()}!</h1>

        <div className="content">
          <div className="left">
            <h3>{t.yourEvents}</h3>

            {events.length === 0 && (
              <p className="no-events">{t.noEvents}</p>
            )}

            {events.map((event, index) => (
              <div className="event-card" key={index}>
                <div className="event-left">
                  <div className="date">{event.date}</div>
                </div>
                <div className="event-middle">
                  <h4>{event.event_name}</h4>
                  <p>{event.total_people} participants</p>
                  <div className="avatars">
                    {event.people.map((name, i) => (
                      <span key={i}>{name.charAt(0).toUpperCase()}</span>
                    ))}
                  </div>
                </div>
                <div className="event-right">
                  <h3>₹{event.amount.toLocaleString()}</h3>
                  <span className="status blue">{t.ongoing}</span>
                </div>
                <button className="delete-btn" onClick={() => handleDeleteEvent(event.id)} title="Delete event">🗑️</button>
              </div>
            ))}
          </div>

          <div className="right">
            <button className="add-btn" onClick={() => navigate("/add-event")}>{t.addNewEvent}</button>

            <div className="box">
              <h4>{t.paymentReminders}</h4>
              {transactions.map((t2, index) => (
                <div className="reminder" key={index}>
                  <p>{t2.from} {t.pays} {t2.to} ₹{t2.amount}</p>
                  <button onClick={() => alert("Pay clicked")}>{t.payNow}</button>
                </div>
              ))}
            </div>

            <div className="box">
              <h4>{t.pendingFromOthers}</h4>
              {balances.filter(person => person.balance > 0).map((person, index) => (
                <div className="pending" key={index}>
                  <p>{person.name} {t.shouldReceive}</p>
                  <span>₹{person.balance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Overlay */}
      {showSettings && (
        <div className="settings-overlay" onClick={() => { setShowSettings(false); setShowLanguages(false); }}>
          <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
            <h3>{t.settings}</h3>

            <div className="settings-item" onClick={() => setShowLanguages(!showLanguages)}>
              <div className="settings-left"><span>🌐</span><span>{t.changeLanguage}</span></div>
              <span className="settings-arrow">{language} ›</span>
            </div>

            {showLanguages && (
              <div className="language-list">
                {INDIAN_LANGUAGES.map((lang) => (
                  <div
                    key={lang}
                    className={`language-item ${language === lang ? "selected" : ""}`}
                    onClick={() => handleLanguageChange(lang)}
                  >
                    {lang} {language === lang && "✓"}
                  </div>
                ))}
              </div>
            )}

            <div className="settings-item" onClick={() => alert("support@splitexpense.com")}>
              <div className="settings-left"><span>🎧</span><span>{t.contactCare}</span></div>
              <span className="settings-arrow">›</span>
            </div>

            <hr className="settings-divider" />

            <div className="settings-item logout" onClick={async () => { await supabase.auth.signOut(); navigate("/"); }}>
              <div className="settings-left"><span>🚪</span><span>{t.logout}</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}