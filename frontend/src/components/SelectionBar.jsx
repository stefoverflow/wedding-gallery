import React from "react";

export default function SelectionBar({ count, onDelete, onClear }) {
  if (count === 0) return null;

  return (
    <div className="selection-bar">
      <div className="selection-bar-inner">
        <span className="selection-count">
          {count} {count === 1 ? "fotografija izabrana" : "fotografija izabrano"}
        </span>
        <div className="selection-actions">
          <button className="btn btn-sm btn-ghost" onClick={onClear}>
            Otkaži izbor
          </button>
          <button className="btn btn-sm btn-danger" onClick={onDelete}>
            Obriši izabrano
          </button>
        </div>
      </div>

      <style>{`
        .selection-bar {
          position: fixed;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 90;
          display: flex;
          justify-content: center;
          animation: selectionBarIn 0.2s ease;
        }

        @keyframes selectionBarIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }

        .selection-bar-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          width: 100%;
          max-width: 1100px;
          padding: 14px 20px;
          padding-bottom: calc(14px + env(safe-area-inset-bottom, 0px));
          background: var(--paper-raised);
          border-top: 1px solid var(--accent-soft);
          box-shadow: 0 -8px 24px -12px rgba(47, 58, 45, 0.25);
        }

        .selection-count {
          color: var(--ink);
          font-size: 0.95rem;
        }

        .selection-actions {
          display: flex;
          gap: 8px;
        }

        @media (min-width: 640px) {
          .selection-bar {
            bottom: 24px;
            padding: 0 20px;
          }

          .selection-bar-inner {
            max-width: 640px;
            padding: 14px 22px;
            border: 1px solid var(--accent-soft);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-modal);
          }
        }
      `}</style>
    </div>
  );
}
