const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const connectDB = require("./util/database");

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), { flags: "a" });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined", { stream: accessLogStream }));

const userRouter = require("./router/userRouter");
const expenseRouter = require("./router/expenseRouter");
const purchaseMembershipRouter = require("./router/purchaseMembershipRouter");
const leaderboardRouter = require("./router/leaderboardRouter");
const resetPasswordRouter = require("./router/resetPasswordRouter");
const reportsRouter = require("./router/reportsRouter");

app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", expenseRouter);
app.use("/expense", expenseRouter);
app.use("/purchase", purchaseMembershipRouter);
app.use("/premium", leaderboardRouter);
app.use("/password", resetPasswordRouter);
app.use("/reports", reportsRouter);

connectDB()
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
