const express = require("express");
const router = express.Router();
const { checkCredentials, createAdminToken } = require("../middleware/auth");

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Unesite korisničko ime i lozinku." });
  }

  if (!checkCredentials(username, password)) {
    return res.status(401).json({ error: "Pogrešno korisničko ime ili lozinka." });
  }

  const token = createAdminToken();
  res.json({ token });
});

module.exports = router;
