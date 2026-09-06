import React, { useEffect, useRef, useState } from "react";
import { photoUrl } from "../api";

// Mirrors the .gallery column breakpoints below, so the number of skeleton
// tiles roughly matches how many columns are currently on screen.
function getSkeletonCount(width) {
  if (width < 640) return 1;
  if (width < 980) return 3;
  return 4;
}

export default function Gallery({
  photos,
  isAdmin,
  onOpenPhoto,
  onDelete,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}) {
  const sentinelRef = useRef(null);
  const [skeletonCount, setSkeletonCount] = useState(() =>
    typeof window !== "undefined" ? getSkeletonCount(window.innerWidth) : 4
  );

  // Keep the latest values in refs so the observer callback below always sees
  // current state without needing to be recreated every time a page loads
  // (onLoadMore's identity changes each page, which used to cause a fresh
  // observer per page - and a fresh observer fires immediately with whatever
  // the current intersection state is, cascading through pages with no
  // actual scrolling involved).
  const stateRef = useRef({ hasMore, loading, onLoadMore });
  useEffect(() => {
    stateRef.current = { hasMore, loading, onLoadMore };
  }, [hasMore, loading, onLoadMore]);

  useEffect(() => {
    const handleResize = () => setSkeletonCount(getSkeletonCount(window.innerWidth));
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    // An IntersectionObserver invokes its callback immediately with the
    // current intersection state as soon as it starts observing. Skip that
    // first call so loading only ever starts from a real scroll-triggered
    // crossing, not from the sentinel simply already being on screen.
    let skippedInitialCallback = false;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!skippedInitialCallback) {
          skippedInitialCallback = true;
          return;
        }
        const { hasMore: currentHasMore, loading: currentLoading, onLoadMore: currentOnLoadMore } =
          stateRef.current;
        if (entries[0].isIntersecting && currentHasMore && !currentLoading) {
          currentOnLoadMore?.();
        }
      },
      { rootMargin: "150px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading]);

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
    <>
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
        {loadingMore &&
          Array.from({ length: skeletonCount }).map((_, i) => (
            <div className="photo-tile skeleton-tile" key={`skeleton-${i}`} aria-hidden="true" />
          ))}
      </div>
      {hasMore && <div ref={sentinelRef} className="scroll-sentinel" aria-hidden="true" />}
      <style>{galleryStyles}</style>
    </>
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

  .skeleton-tile {
    height: 180px;
    background: linear-gradient(100deg, var(--line) 30%, rgba(255, 255, 255, 0.4) 50%, var(--line) 70%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.4s ease-in-out infinite;
  }

  @keyframes skeleton-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .scroll-sentinel {
    height: 1px;
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
