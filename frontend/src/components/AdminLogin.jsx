import React, { useState } from "react";
import { adminLogin } from "../api";

export default function AdminLogin({ onClose, onLoginSuccess, showToast }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const token = await adminLogin(username.trim(), password);
      onLoginSuccess(token);
      showToast("Uspešno ste prijavljeni.", "success");
    } catch (err) {
      setError(err.message || "Prijava nije uspela.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Zatvori">
          ✕
        </button>
        <p className="eyebrow">Administrator</p>
        <h3 className="modal-title">Prijava</h3>

        <form onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="admin-username">
            Korisničko ime
          </label>
          <input
            id="admin-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <label className="field-label" htmlFor="admin-password">
            Lozinka
          </label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          {error && <p className="modal-error">{error}</p>}

          <button type="submit" className="btn btn-primary modal-submit" disabled={isSubmitting}>
            {isSubmitting ? "Prijavljivanje..." : "Prijavi se"}
          </button>
        </form>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(22, 28, 20, 0.5);
          z-index: 110;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .modal-card {
          position: relative;
          background: var(--paper-raised);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-modal);
          padding: 32px 28px;
          width: 100%;
          max-width: 360px;
          text-align: center;
        }

        .modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          border: none;
          background: none;
          font-size: 1.1rem;
          color: var(--ink-soft);
          cursor: pointer;
        }

        .modal-title {
          font-family: var(--serif);
          font-size: 1.5rem;
          margin: 4px 0 20px;
        }

        .field-label {
          display: block;
          text-align: left;
          font-size: 0.85rem;
          color: var(--ink-soft);
          margin: 12px 0 4px;
        }

        .modal-card input {
          width: 100%;
          font-family: var(--serif);
          font-size: 1rem;
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--line);
          background: var(--paper);
        }

        .modal-card input:focus {
          border-color: var(--accent);
        }

        .modal-error {
          color: var(--danger);
          font-size: 0.88rem;
          margin: 12px 0 0;
        }

        .modal-submit {
          width: 100%;
          margin-top: 22px;
        }
      `}</style>
    </div>
  );
}
