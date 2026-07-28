import React from "react";
import { photoUrl } from "../api";

export default function Gallery({
  photos,
  isAdmin,
  onOpenPhoto,
  onDelete,
  loading,
  selectedIds,
  onToggleSelect,
}) {
  if (loading) {
    return (
      <div className="gallery-state">
        <span className="spinner" aria-hidden="true" />
        <style>{galleryStyles}</style>
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="gallery-state">
        <p className="empty-title">Još uvek nema fotografija.</p>
        <p className="empty-sub">Budite prvi koji će podeliti uspomenu sa proslave!</p>
        <style>{galleryStyles}</style>
      </div>
    );
  }

  return (
    <div className="gallery">
      {photos.map((photo, index) => {
        const isSelected = selectedIds?.has(photo.id);
        return (
          <figure className={`photo-tile ${isSelected ? "selected" : ""}`} key={photo.id}>
            <button
              className="photo-btn"
              onClick={() => onOpenPhoto(index)}
              aria-label="Prikaži fotografiju preko celog ekrana"
            >
              <img src={photoUrl(photo.url)} alt="" loading="lazy" />
            </button>
            {isAdmin && (
              <button
                className={`select-checkbox ${isSelected ? "checked" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleSelect(photo.id);
                }}
                aria-label={isSelected ? "Poništi izbor fotografije" : "Izaberi fotografiju"}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            )}
            {isAdmin && (
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(photo.id);
                }}
                aria-label="Obriši fotografiju"
                title="Obriši fotografiju"
              >
                🗑
              </button>
            )}
          </figure>
        );
      })}
      <style>{galleryStyles}</style>
    </div>
  );
}

const galleryStyles = `
  .gallery {
    columns: 2 220px;
    column-gap: 10px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 12px 60px;
  }

  @media (min-width: 640px) {
    .gallery {
      columns: 3 240px;
      column-gap: 14px;
      padding: 0 20px 70px;
    }
  }

  @media (min-width: 980px) {
    .gallery {
      columns: 4 260px;
    }
  }

  .photo-tile {
    position: relative;
    margin: 0 0 10px;
    break-inside: avoid;
    border-radius: var(--radius-sm);
    overflow: hidden;
    box-shadow: var(--shadow-card);
    background: var(--line);
    outline: 2px solid transparent;
    outline-offset: -2px;
    transition: outline-color 0.2s ease;
  }

  .photo-tile:hover {
    outline-color: var(--accent-soft);
  }

  .photo-tile.selected {
    outline-color: var(--accent);
  }

  @media (min-width: 640px) {
    .photo-tile {
      margin-bottom: 14px;
    }
  }

  .photo-btn {
    display: block;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
  }

  .photo-btn img {
    width: 100%;
    display: block;
    transition: transform 0.35s ease;
  }

  .photo-btn:hover img {
    transform: scale(1.03);
  }

  .delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: none;
    background: var(--danger);
    color: #fff;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }

  .delete-btn:hover {
    background: #9c2e22;
  }

  .select-checkbox {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 1.5px solid var(--accent-soft);
    background: rgba(255, 255, 255, 0.9);
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    backdrop-filter: blur(2px);
  }

  .select-checkbox svg {
    width: 15px;
    height: 15px;
  }

  .select-checkbox.checked {
    background: var(--accent);
    border-color: var(--accent);
  }

  .gallery-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 50px 20px 80px;
    color: var(--ink-soft);
  }

  .spinner {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--line);
    border-top-color: var(--accent);
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .empty-title {
    font-size: 1.3rem;
    color: var(--ink);
    margin-bottom: 4px;
  }

  .empty-sub {
    margin: 0;
  }
`;
