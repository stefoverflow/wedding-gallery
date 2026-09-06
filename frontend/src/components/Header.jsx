import React from "react";

export default function Header({ isAdmin, onOpenLogin, onLogout }) {
  return (
    <header className="site-header">
      <div className="admin-corner">
        {isAdmin ? (
          <div className="admin-badge">
            <span>Prijavljeni ste kao admin</span>
            <button className="btn btn-sm btn-ghost" onClick={onLogout}>
              Odjava
            </button>
          </div>
        ) : (
          <button className="btn btn-sm btn-primary" onClick={onOpenLogin}>
            Prijava
          </button>
        )}
      </div>

      <div className="hero">
        <p className="eyebrow">Pozivamo vas da podelite trenutke</p>
        <h1 className="hero-names">
          Darko <span className="amp">&amp;</span> Andrijana
        </h1>
        <div className="divider divider-line" aria-hidden="true" />
        <h2 className="hero-title">Dobrodošli na naše venčanje</h2>
        <p className="hero-date">05 | 09 | 2026</p>
        <p className="hero-sub">
          Otpremite svoje fotografije sa proslave. Svaka fotografija je poklon koji čuvamo zauvek.
        </p>
      </div>

      <style>{`
        .site-header {
          position: relative;
          padding: 20px 20px 12px;
          text-align: center;
        }

        .admin-corner {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 5;
        }

        .admin-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: var(--ink-soft);
          background: var(--paper-raised);
          border: 1px solid var(--accent-soft);
          border-radius: 999px;
          padding: 6px 8px 6px 14px;
        }

        .hero {
          max-width: 640px;
          margin: 8px auto 0;
          padding: 28px 18px 8px;
        }

        .hero-names {
          font-family: var(--script);
          font-weight: 400;
          font-size: clamp(2.6rem, 10vw, 4.2rem);
          margin: 6px 0 0;
          color: var(--black);
          line-height: 1.15;
        }

        .hero-names .amp {
          color: var(--accent);
          font-size: 0.85em;
          padding: 0 0.05em;
        }

        .hero-title {
          font-family: var(--serif);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          font-size: 1.05rem;
          color: var(--accent-deep);
          margin: 4px 0 10px;
        }

        .hero-date {
          font-family: var(--serif);
          letter-spacing: 0.3em;
          color: var(--accent);
          font-size: 1.15rem;
          margin: 0 0 14px;
        }

        .hero-sub {
          color: var(--ink-soft);
          font-size: 1.05rem;
          max-width: 460px;
          margin: 0 auto;
        }

        @media (max-width: 480px) {
          .admin-badge span {
            display: none;
          }
          .hero {
            padding-top: 40px;
          }
        }
      `}</style>
    </header>
  );
}
