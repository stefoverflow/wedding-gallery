import React from "react";

export default function Toast({ toasts, liftedBy = 0 }) {
  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack" style={{ bottom: `${18 + liftedBy}px` }}>
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}

      <style>{`
        .toast-stack {
          position: fixed;
          left: 50%;
          transform: translateX(-50%);
          z-index: 200;
          display: flex;
          flex-direction: column;
          gap: 8px;
          width: min(92vw, 420px);
          transition: bottom 0.2s ease;
        }

        .toast {
          font-family: var(--serif);
          font-size: 0.95rem;
          padding: 12px 18px;
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-modal);
          text-align: center;
          animation: slideUp 0.2s ease;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .toast-success {
          background: #e5f4ea;
          color: var(--success);
          border: 1px solid var(--accent-soft);
        }

        .toast-error {
          background: var(--danger-soft);
          color: var(--danger);
          border: 1px solid #e3c3bd;
        }
      `}</style>
    </div>
  );
}
