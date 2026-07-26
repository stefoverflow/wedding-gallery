import React, { useEffect, useCallback } from "react";
import { photoUrl } from "../api";

export default function Lightbox({ photos, index, onClose, onNavigate, isAdmin, onDelete }) {
  const photo = photos[index];

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((index + 1) % photos.length);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + photos.length) % photos.length);
    },
    [index, photos.length, onClose, onNavigate]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  if (!photo) return null;

  const downloadName = `darko-i-andrijana-${photo.id}.jpg`;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <div className="lightbox-image-wrap">
          <img src={photoUrl(photo.url)} alt="" />

          {photos.length > 1 && (
            <>
              <button
                className="nav-btn nav-prev"
                onClick={() => onNavigate((index - 1 + photos.length) % photos.length)}
                aria-label="Prethodna fotografija"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="nav-btn nav-next"
                onClick={() => onNavigate((index + 1) % photos.length)}
                aria-label="Sledeća fotografija"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </div>

        <div className="lightbox-toolbar">
          {photo.uploaderName && <span className="uploader-tag">Od: {photo.uploaderName}</span>}
          <div className="toolbar-actions">
            <a
              className="btn btn-sm"
              href={photoUrl(photo.url)}
              download={downloadName}
              onClick={(e) => e.stopPropagation()}
            >
              ⬇ Preuzmi
            </a>
            {isAdmin && (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(photo.id)}
              >
                Obriši
              </button>
            )}
            <button className="btn btn-sm btn-ghost" onClick={onClose} aria-label="Zatvori">
              ✕
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .lightbox-overlay {
          position: fixed;
          inset: 0;
          background: rgba(20, 18, 15, 0.92);
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.15s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .lightbox-content {
          max-width: min(92vw, 900px);
          max-height: 88vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .lightbox-image-wrap {
          position: relative;
          max-width: 100%;
        }

        .lightbox-content img {
          max-width: 100%;
          max-height: 74vh;
          border-radius: 6px;
          object-fit: contain;
        }

        .lightbox-toolbar {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          flex-wrap: wrap;
        }

        .uploader-tag {
          color: #e9e3d6;
          font-size: 0.95rem;
          font-style: italic;
        }

        .toolbar-actions {
          display: flex;
          gap: 8px;
          margin-left: auto;
        }

        .toolbar-actions .btn {
          background: rgba(255, 253, 249, 0.94);
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(20, 18, 15, 0.5);
          color: #fff;
          border: none;
          width: 44px;
          height: 44px;
          padding: 0;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn svg {
          width: 22px;
          height: 22px;
        }

        .nav-btn:hover {
          background: rgba(20, 18, 15, 0.8);
        }

        .nav-prev {
          left: -8px;
        }

        .nav-next {
          right: -8px;
        }

        @media (max-width: 640px) {
          .nav-prev { left: 4px; }
          .nav-next { right: 4px; }
          .lightbox-content img { max-height: 66vh; }
        }
      `}</style>
    </div>
  );
}
