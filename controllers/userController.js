const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(id, email) {
  return jwt.sign({ userId: id, email: email }, process.env.TOKEN);
}

const isPremiumUser = async (req, res, next) => {
  try {
    if (req.user.isPremiumUser) {
      return res.json({ isPremiumUser: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserSignUp = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    await User.findOne({ email: email })
      .then(async (user) => {
        if (user) {
          res
            .status(409)
            .send(
              `<script>alert('This email is already taken. Please choose another one.'); window.location.href='/'</script>`
            );
          } else {
            const hash = await bcrypt.hash(password, 10);
            const newUser = new User({
              name: name,
              email: email,
              password: hash,
            });
            await newUser.save();
            res
              .status(200)
              .send(
                `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
              );
          }
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

const postUserLogin = async (req, res, next) => {
  try {
    const email = req.body.loginEmail;
    const password = req.body.loginPassword;

    await User.findOne({ email: email }).then(async (user) => {
      if (user) {
        const result = await bcrypt.compare(password, user.password);
        if (result) {
          return res.status(200).json({
            success: true,
            message: "Login Successful!",
            token: generateAccessToken(user.id, user.email),
          });
        } else {
          return res.status(401).json({
            success: false,
            message: "Incorrect Password!",
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          message: "User doesn't Exists!",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    User.find()
      .select({ name: 1, totalExpenses: 1, _id: 0 })
      .sort({ totalExpenses: -1 })
      .then((users) => {
        const result = users.map((user) => ({
          name: user.name,
          totalExpenses: user.totalExpenses,
        }));
        res.send(JSON.stringify(result));
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  generateAccessToken,
  getLoginPage,
  postUserLogin,
  postUserSignUp,
  isPremiumUser,
  getAllUsers,
};