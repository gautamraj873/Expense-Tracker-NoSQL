const path = require("path");

exports.getLeaderboardPage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "leaderboard.html")
    );
  } catch {
    (err) => console.log(err);
  }
};