const express = require("express");
const router = express.Router();
const leaderboardController = require("../controllers/leaderboardController");

router.get("/getLeaderboardPage", leaderboardController.getLeaderboardPage);

module.exports = router;
