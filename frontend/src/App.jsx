import React, { useEffect, useState, useCallback } from "react";
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import Gallery from "./components/Gallery";
import Lightbox from "./components/Lightbox";
import AdminLogin from "./components/AdminLogin";
import ConfirmModal from "./components/ConfirmModal";
import SelectionBar from "./components/SelectionBar";
import Toast from "./components/Toast";
import { fetchPhotos, deletePhoto, deletePhotos } from "./api";

const TOKEN_KEY = "wedding_admin_token";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [toasts, setToasts] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkDeleteConfirm, setBulkDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const loadPhotos = useCallback(async () => {
    try {
      const data = await fetchPhotos();
      setPhotos(data);
    } catch (err) {
      showToast("Nije moguće učitati fotografije. Proverite konekciju.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadPhotos();
  }, [loadPhotos]);

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    setToken(newToken);
    setShowLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken("");
    setSelectedIds(new Set());
    showToast("Odjavljeni ste.", "success");
  };

  const handleDelete = (id) => {
    setDeleteTargetId(id);
  };

  const cancelDelete = () => {
    setDeleteTargetId(null);
  };

  const confirmDelete = async () => {
    const id = deleteTargetId;
    setIsDeleting(true);
    try {
      await deletePhoto(id, token);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      setLightboxIndex(null);
      showToast("Fotografija je obrisana.", "success");
    } catch (err) {
      if (err.message?.toLowerCase().includes("sesij") || err.message?.toLowerCase().includes("prijav")) {
        handleLogout();
      }
      showToast(err.message || "Brisanje nije uspelo.", "error");
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => setSelectedIds(new Set());

  const confirmBulkDelete = async () => {
    setIsDeleting(true);
    const ids = Array.from(selectedIds);
    const { succeededIds, failedCount, authExpired } = await deletePhotos(ids, token);

    setPhotos((prev) => prev.filter((p) => !succeededIds.includes(p.id)));
    setSelectedIds(new Set());
    setIsDeleting(false);
    setBulkDeleteConfirm(false);

    if (failedCount === 0) {
      showToast(
        succeededIds.length === 1
          ? "Fotografija je obrisana."
          : `Obrisano je ${succeededIds.length} fotografija.`,
        "success"
      );
    } else if (succeededIds.length === 0) {
      showToast("Brisanje nije uspelo.", "error");
    } else {
      showToast(`Obrisano ${succeededIds.length}, ${failedCount} nije uspelo.`, "error");
    }

    if (authExpired) handleLogout();
  };

  const isAdmin = Boolean(token);
  const showSelectionBar = isAdmin && selectedIds.size > 0;

  return (
    <>
      <Header
        isAdmin={isAdmin}
        onOpenLogin={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      <Dropzone onUploaded={loadPhotos} showToast={showToast} />

      <div className="divider" aria-hidden="true">
        <span>&amp;</span>
      </div>

      <main>
        <Gallery
          photos={photos}
          isAdmin={isAdmin}
          loading={loading}
          onOpenPhoto={setLightboxIndex}
          onDelete={handleDelete}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
        />
      </main>

      <footer className="site-footer">
        <p>S ljubavlju, Darko &amp; Andrijana</p>
      </footer>

      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          isAdmin={isAdmin}
          onDelete={handleDelete}
          showToast={showToast}
        />
      )}

      {showLogin && (
        <AdminLogin
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          showToast={showToast}
        />
      )}

      {deleteTargetId !== null && (
        <ConfirmModal
          title="Obriši fotografiju?"
          message="Ova fotografija će biti trajno uklonjena iz galerije."
          confirmLabel="Obriši"
          cancelLabel="Otkaži"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isConfirming={isDeleting}
        />
      )}

      {bulkDeleteConfirm && (
        <ConfirmModal
          title={
            selectedIds.size === 1
              ? "Obriši izabranu fotografiju?"
              : `Obriši ${selectedIds.size} izabranih fotografija?`
          }
          message="Ova radnja se ne može opozvati."
          confirmLabel="Obriši"
          cancelLabel="Otkaži"
          onConfirm={confirmBulkDelete}
          onCancel={() => setBulkDeleteConfirm(false)}
          isConfirming={isDeleting}
        />
      )}

      {showSelectionBar && (
        <SelectionBar
          count={selectedIds.size}
          onDelete={() => setBulkDeleteConfirm(true)}
          onClear={clearSelection}
        />
      )}

      <Toast toasts={toasts} liftedBy={showSelectionBar ? 64 : 0} />

      <style>{`
        .site-footer {
          text-align: center;
          padding: 20px 20px 40px;
          color: var(--ink-faint);
          font-style: italic;
          font-size: 0.95rem;
        }
      `}</style>
    </>
  );
}
