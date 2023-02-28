const express = require("express");
const router = express.Router();
const {
  createReminder,
  getReminder,
  updateReminder,
} = require("../controllers/remindController");

// router.post("/", createReminder);
router.get("/", getReminder);
router.put("/:id", updateReminder);

module.exports = router;
