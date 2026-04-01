import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import "../styles/settings.css";

const INDIAN_LANGUAGES = [
  "English", "Hindi", "Gujarati", "Marathi", "Bengali",
  "Tamil", "Telugu", "Kannada", "Malayalam", "Punjabi",
  "Odia", "Assamese", "Urdu", "Sanskrit", "Maithili",
  "Konkani", "Sindhi", "Dogri", "Manipuri", "Bodo"
];

export default function Settings() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [showLanguages, setShowLanguages] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="settings-page">

      {/* Header */}
      <div className="settings-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>← Back</button>
        <h2>Settings</h2>
      </div>

      {/* Options */}
      <div className="settings-box">

        {/* Language */}
        <div className="settings-item" onClick={() => setShowLanguages(!showLanguages)}>
          <div className="settings-left">
            <span className="settings-icon">🌐</span>
            <span>Change Language</span>
          </div>
          <span className="settings-value">{selectedLanguage} ›</span>
        </div>

        {showLanguages && (
          <div className="language-list">
            {INDIAN_LANGUAGES.map((lang) => (
              <div
                key={lang}
                className={`language-item ${selectedLanguage === lang ? "selected" : ""}`}
                onClick={() => { setSelectedLanguage(lang); setShowLanguages(false); }}
              >
                {lang}
                {selectedLanguage === lang && <span>✓</span>}
              </div>
            ))}
          </div>
        )}

        {/* Customer Care */}
        <div className="settings-item" onClick={() => alert("Customer care: support@splitexpense.com")}>
          <div className="settings-left">
            <span className="settings-icon">🎧</span>
            <span>Contact Customer Care</span>
          </div>
          <span className="settings-arrow">›</span>
        </div>

        {/* Divider */}
        <hr className="settings-divider" />

        {/* Logout */}
        <div className="settings-item logout" onClick={handleLogout}>
          <div className="settings-left">
            <span className="settings-icon">🚪</span>
            <span>Log Out</span>
          </div>
        </div>

      </div>
    </div>
  );
}