import React, { useCallback, useRef, useState } from "react";
import { validateFiles, uploadPhotos } from "../api";

export default function Dropzone({ onUploaded, showToast }) {
  const [isDragging, setIsDragging] = useState(false);
  const [pending, setPending] = useState([]); // [{file, previewUrl}]
  const [uploaderName, setUploaderName] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef(null);

  const addFiles = useCallback(
    (fileList) => {
      const files = Array.from(fileList || []);
      if (files.length === 0) return;

      const { valid, errors } = validateFiles(files);

      if (errors.length > 0) {
        showToast(errors.join(" "), "error");
      }
      if (valid.length === 0) return;

      const withPreviews = valid.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setPending((prev) => [...prev, ...withPreviews]);
    },
    [showToast]
  );

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const removePending = (index) => {
    setPending((prev) => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[index].previewUrl);
      copy.splice(index, 1);
      return copy;
    });
  };

  const handleUpload = async () => {
    if (pending.length === 0) return;
    setIsUploading(true);
    setProgress(0);
    try {
      const uploaded = await uploadPhotos(
        pending.map((p) => p.file),
        uploaderName.trim(),
        setProgress
      );
      showToast(
        uploaded.length > 1
          ? `Otpremljeno je ${uploaded.length} fotografija. Hvala vam!`
          : "Fotografija je uspešno otpremljena. Hvala vam!",
        "success"
      );
      pending.forEach((p) => URL.revokeObjectURL(p.previewUrl));
      setPending([]);
      onUploaded();
    } catch (err) {
      showToast(err.message || "Otpremanje nije uspelo. Pokušajte ponovo.", "error");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="dropzone-wrap">
      <div
        className={`dropzone ${isDragging ? "dragging" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        aria-label="Otpremite fotografije - kliknite ili prevucite fajlove ovde"
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          hidden
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <div className="dropzone-icon" aria-hidden="true">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 16V4M12 4L7 9M12 4l5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="dropzone-text">
          Prevucite fotografije ovde <span>ili kliknite da izaberete</span>
        </p>
        <p className="dropzone-hint">JPG, PNG, WEBP ili HEIC · do 20MB po fotografiji</p>
      </div>

      {pending.length > 0 && (
        <div className="pending-panel">
          <div className="pending-grid">
            {pending.map((p, i) => (
              <div className="pending-thumb" key={p.previewUrl}>
                <img src={p.previewUrl} alt="" />
                <button
                  className="pending-remove"
                  onClick={() => removePending(i)}
                  aria-label="Ukloni fotografiju"
                  disabled={isUploading}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            className="name-input"
            placeholder="Vaše ime (opciono)"
            value={uploaderName}
            maxLength={60}
            onChange={(e) => setUploaderName(e.target.value)}
            disabled={isUploading}
          />

          {isUploading && (
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
          )}

          <button className="btn btn-primary upload-btn" onClick={handleUpload} disabled={isUploading}>
            {isUploading
              ? `Otpremanje... ${progress}%`
              : `Otpremi ${pending.length} ${pending.length === 1 ? "fotografiju" : "fotografija"}`}
          </button>
        </div>
      )}

      <style>{`
        .dropzone-wrap {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 18px;
        }

        .dropzone {
          border: 1.5px dashed var(--gold-soft);
          background: var(--paper-raised);
          border-radius: var(--radius-lg);
          padding: 34px 20px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .dropzone:hover,
        .dropzone.dragging {
          border-color: var(--gold);
          background: #fffefb;
        }

        .dropzone-icon {
          color: var(--gold);
          display: flex;
          justify-content: center;
          margin-bottom: 10px;
        }

        .dropzone-text {
          margin: 0;
          font-size: 1.15rem;
          color: var(--ink);
        }

        .dropzone-text span {
          color: var(--ink-soft);
          font-style: italic;
        }

        .dropzone-hint {
          margin: 6px 0 0;
          font-size: 0.85rem;
          color: var(--ink-faint);
        }

        .pending-panel {
          margin-top: 16px;
          background: var(--paper-raised);
          border: 1px solid var(--line);
          border-radius: var(--radius-md);
          padding: 16px;
        }

        .pending-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
          gap: 8px;
          margin-bottom: 12px;
        }

        .pending-thumb {
          position: relative;
          aspect-ratio: 1;
          border-radius: var(--radius-sm);
          overflow: hidden;
          background: var(--line);
        }

        .pending-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pending-remove {
          position: absolute;
          top: 3px;
          right: 3px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: none;
          background: rgba(46, 42, 37, 0.75);
          color: #fff;
          font-size: 14px;
          line-height: 1;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .name-input {
          width: 100%;
          font-family: var(--serif);
          font-size: 1rem;
          padding: 10px 14px;
          border-radius: 999px;
          border: 1px solid var(--line);
          background: var(--paper);
          margin-bottom: 12px;
        }

        .name-input:focus {
          border-color: var(--gold);
        }

        .upload-btn {
          width: 100%;
        }

        .progress-track {
          height: 6px;
          border-radius: 999px;
          background: var(--line);
          overflow: hidden;
          margin-bottom: 12px;
        }

        .progress-fill {
          height: 100%;
          background: var(--gold);
          transition: width 0.2s ease;
        }
      `}</style>
    </div>
  );
}
