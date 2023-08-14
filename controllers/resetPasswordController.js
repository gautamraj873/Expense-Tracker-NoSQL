const path = require("path");
const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");
const bcrypt = require("bcrypt");
const Sib = require("sib-api-v3-sdk");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

exports.forgotPasswordPage = async (req, res, next) => {
  try {
    res
      .status(200)
      .sendFile(
        path.join(__dirname, "../", "public", "views", "forgotPassword.html")
      );
  } catch (error) {
    console.log(error);
  }
};

exports.sendMail = async (req, res, next) => {
  try {
    const email = req.body.email;
    const recepientEmail = await User.findOne({ email: email });

    if (recepientEmail) {
      const requestId = uuid.v4();
      const resetRequest = new ResetPassword({
        id: requestId,
        isActive: true,
        userId: recepientEmail._id,
      });
      await resetRequest.save();

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      const msg = {
        to: email,
        from: "gautamraj873@gmail.com",
        name: "Expense Tracker",
        subject: "Expense Tracker Reset Password",
        text: "Link Below",
        html: `<h3>Hi! We received a request from you to reset the password. Here is the link below:</h3>
        <a href="http://16.171.85.224:3000/password/resetPasswordPage/${requestId}">Click Here</a>`
      };
      const emailResponse = await sgMail.send(msg);
      return res.status(200).json({ message: "Reset password link successfully sent to your email address!", success: true });
    } else {
      throw new Error("Please provide the registered email!");
    }
  } catch (error) {
    console.log(error);
    return res.status(409).json({ error: error.message, message: "Failed to send reset password email." });
  }
};

exports.resetPasswordPage = async (req, res, next) => {
  try {
    res.status(200).sendFile(path.join(__dirname, "../", "public", "views", "resetPassword.html"));
  } catch (error) {
    console.log(error);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const requestId = req.headers.referer.split("/");
    const password = req.body.password;
    const checkResetRequest = await ResetPassword.findOne({
      id: requestId[requestId.length - 1],
      isActive: true,
    });
    if (checkResetRequest) {
      const userId = checkResetRequest.userId;
      const result = await ResetPassword.updateOne(
        { id: requestId },
        { $set: { isActive: false } }
      );
      const newPassword = await bcrypt.hash(password, 10);
      const user = await User.updateOne(
        { _id: userId },
        { $set: { password: newPassword } }
      );
      return res
        .status(200)
        .json({ message: "Password successfully changed!" });
    } else {
      return res
      .status(409)
      .json({ message: "The link has already been used. Request a new link!" });
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ message: "Failed to change password!" });
  }
}; 