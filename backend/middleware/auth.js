const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_TTL = "12h";

function createAdminToken() {
  return jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: TOKEN_TTL });
}

// Constant-time comparison so login attempts can't be timed to guess the password.
function safeCompare(a, b) {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  if (bufA.length !== bufB.length) {
    // Still run a comparison of equal length buffers to avoid leaking length via timing.
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

function checkCredentials(username, password) {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const expectedPass = process.env.ADMIN_PASSWORD || "";
  return safeCompare(username, expectedUser) && safeCompare(password, expectedPass);
}

// Protects admin-only routes (like deleting photos).
function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Niste prijavljeni." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") throw new Error("wrong role");
    req.admin = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Sesija je istekla, prijavite se ponovo." });
  }
}

module.exports = { createAdminToken, checkCredentials, requireAdmin };
