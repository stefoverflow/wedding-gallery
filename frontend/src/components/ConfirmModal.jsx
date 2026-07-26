import React from "react";

export default function ConfirmModal({
  title = "Da li ste sigurni?",
  message,
  confirmLabel = "Obriši",
  cancelLabel = "Otkaži",
  onConfirm,
  onCancel,
}) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} role="alertdialog" aria-modal="true">
        <button className="modal-close" onClick={onCancel} aria-label="Zatvori">
          ✕
        </button>
        <p className="eyebrow">Potvrda</p>
        <h3 className="modal-title">{title}</h3>
        {message && <p className="modal-message">{message}</p>}

        <div className="modal-confirm-actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 18, 15, 0.5);
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
          margin: 4px 0 12px;
        }

        .modal-message {
          color: var(--ink-soft);
          font-size: 0.98rem;
          margin: 0 0 24px;
        }

        .modal-confirm-actions {
          display: flex;
          gap: 12px;
        }

        .modal-confirm-actions .btn {
          flex: 1;
        }
      `}</style>
    </div>
  );
}
