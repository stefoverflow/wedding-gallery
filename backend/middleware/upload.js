const multer = require("multer");
const path = require("path");

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"]);

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB per photo
const MAX_FILES_PER_REQUEST = 20;

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeOk = ALLOWED_MIME_TYPES.has(file.mimetype);
  const extOk = ALLOWED_EXTENSIONS.has(ext);

  if (!mimeOk || !extOk) {
    const err = new Error(
      "Nepodržan tip fajla. Dozvoljene su samo slike (JPG, PNG, WEBP, HEIC)."
    );
    err.code = "INVALID_FILE_TYPE";
    return cb(err);
  }
  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES_PER_REQUEST,
  },
});

module.exports = { upload, MAX_FILE_SIZE_BYTES, MAX_FILES_PER_REQUEST };
