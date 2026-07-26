const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();

const { upload, MAX_FILE_SIZE_BYTES, MAX_FILES_PER_REQUEST } = require("../middleware/upload");
const { requireAdmin } = require("../middleware/auth");
const { cloudinary, FOLDER } = require("../utils/cloudinary");
const store = require("../utils/photoStore");

// GET /api/photos - newest first, for the public gallery
router.get("/", async (req, res, next) => {
  try {
    const photos = await store.getAllSortedNewestFirst();
    res.json({ photos });
  } catch (err) {
    next(err);
  }
});

function uploadBufferToCloudinary(file, uploaderName, uploadedAt) {
  const id = uuidv4();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        public_id: `${FOLDER}/${id}`,
        context: { uploaderName: uploaderName || "", uploadedAt },
      },
      (err, result) => {
        if (err) return reject(err);
        resolve({ id, url: result.secure_url, uploadedAt });
      }
    );
    stream.end(file.buffer);
  });
}

// POST /api/photos - upload one or more photos (public, anyone at the wedding can post)
router.post("/", (req, res, next) => {
  upload.array("photos", MAX_FILES_PER_REQUEST)(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          error: `Fajl je prevelik. Maksimalna veličina je ${Math.round(
            MAX_FILE_SIZE_BYTES / (1024 * 1024)
          )}MB.`,
        });
      }
      if (err.code === "LIMIT_FILE_COUNT" || err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
          error: `Možete otpremiti najviše ${MAX_FILES_PER_REQUEST} fotografija odjednom.`,
        });
      }
      if (err.code === "INVALID_FILE_TYPE") {
        return res.status(400).json({ error: err.message });
      }
      console.error("Upload error:", err);
      return res.status(500).json({ error: "Otpremanje nije uspelo. Pokušajte ponovo." });
    }

    const files = req.files || [];
    if (files.length === 0) {
      return res.status(400).json({ error: "Niste izabrali nijednu fotografiju." });
    }

    const uploaderName =
      typeof req.body.uploaderName === "string" ? req.body.uploaderName.trim().slice(0, 60) : "";

    try {
      const uploadedAt = new Date().toISOString();
      const saved = await Promise.all(
        files.map((file) => uploadBufferToCloudinary(file, uploaderName, uploadedAt))
      );
      res.status(201).json({ photos: saved });
    } catch (uploadErr) {
      // Cloudinary rejects the file itself (too large for the account's plan,
      // corrupt image, etc.) - surface that as a proper 4xx instead of a bare 500.
      if (uploadErr?.http_code && uploadErr.http_code >= 400 && uploadErr.http_code < 500) {
        return res.status(400).json({
          error: "Otpremanje nije uspelo: fajl je odbijen (prevelik ili oštećen). Probajte drugu fotografiju.",
        });
      }
      next(uploadErr);
    }
  });
});

// DELETE /api/photos/:id - admin only
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const photo = await store.getPhotoById(req.params.id);
    if (!photo) {
      return res.status(404).json({ error: "Fotografija nije pronađena." });
    }

    await store.removePhoto(req.params.id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
