import React, { useEffect, useState, useCallback } from "react";
import Header from "./components/Header";
import Dropzone from "./components/Dropzone";
import Gallery from "./components/Gallery";
import Lightbox from "./components/Lightbox";
import AdminLogin from "./components/AdminLogin";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";
import { fetchPhotos, deletePhoto } from "./api";

const TOKEN_KEY = "wedding_admin_token";

export default function App() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [toasts, setToasts] = useState([]);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

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
    setDeleteTargetId(null);
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
    }
  };

  const isAdmin = Boolean(token);

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
        />
      )}

      <Toast toasts={toasts} />

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
