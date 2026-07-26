import React from "react";
import { photoUrl } from "../api";

export default function Gallery({ photos, isAdmin, onOpenPhoto, onDelete, loading }) {
  if (loading) {
    return (
      <div className="gallery-state">
        <p>Učitavanje fotografija...</p>
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
      {photos.map((photo, index) => (
        <figure className="photo-tile" key={photo.id}>
          <button
            className="photo-btn"
            onClick={() => onOpenPhoto(index)}
            aria-label="Prikaži fotografiju preko celog ekrana"
          >
            <img src={photoUrl(photo.url)} alt="" loading="lazy" />
          </button>
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
      ))}
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
    background: rgba(46, 42, 37, 0.72);
    color: #fff;
    font-size: 15px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
  }

  .delete-btn:hover {
    background: var(--danger);
  }

  .gallery-state {
    text-align: center;
    padding: 50px 20px 80px;
    color: var(--ink-soft);
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
