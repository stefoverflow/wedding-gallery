require("dotenv").config();

const express = require("express");
const cors = require("cors");

const photosRouter = require("./routes/photos");
const adminRouter = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 4000;

// Allow the configured frontend origin(s). Falls back to allowing all origins
// in case CORS_ORIGIN isn't set (fine for quick local testing, tighten in production).
const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim())
  : true;

app.use(cors({ origin: corsOrigins }));
app.use(express.json());

app.use("/api/photos", photosRouter);
app.use("/api/admin", adminRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Fallback error handler for anything unexpected
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Nešto je pošlo po zlu na serveru." });
});

app.listen(PORT, () => {
  console.log(`Wedding gallery API running on http://localhost:${PORT}`);
});
