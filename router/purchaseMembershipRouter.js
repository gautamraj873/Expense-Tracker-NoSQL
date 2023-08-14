const express = require("express");
const router = express.Router();
const purchaseMembershipController = require("../controllers/purchaseMembershipController");
const authenticateMiddleware = require("../middleware/auth");

router.get("/premiumMembership", authenticateMiddleware, purchaseMembershipController.purchasePremium);

router.post("/updateTransactionStatus", authenticateMiddleware, purchaseMembershipController.updateTransactionStatus);

module.exports = router;
