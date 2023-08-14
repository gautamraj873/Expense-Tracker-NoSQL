const path = require("path");
const Expense = require("../models/expenseModel");
const Download = require("../models/DownloadModel");
const AWS = require('aws-sdk');

exports.getReportsPage = (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "public", "views", "reports.html"));
};

exports.dailyReports = async (req, res, next) => {
  try {
    const date = req.body.date;
    const expenses = await Expense.find({ date: date, userId: req.user._id });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

exports.monthlyReports = async (req, res, next) => {
  try {
    const month = req.body.month;
    const userId = req.user._id;
    const expenses = await Expense.find({
      date: { $regex: `.*-${month}-.*` },
      userId: userId,
    });
    return res.send(expenses);
  } catch (error) {
    console.log(error);
  }
};

exports.downloadDailyReport = async (req, res) => {
  const date = req.body.date;
  const userId = req.user.id;
  try {
    const expenses = await Expense.findAll({
      where: { date: date, userId: req.user.id },
    });
    const stringifiedExpenses = JSON.stringify(expenses);
    const filename = `Expense${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(stringifiedExpenses, filename, userId);
    res.status(200).json({fileUrl, success: true});
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  } 
}

async function uploadToS3(data, filename, userId) {
  const BUCKET_NAME = process.env.BUCKET_NAME;
  const IAM_USER_KEY = process.env.IAM_USER_KEY;
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

  let s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  })

  const params = {
    Bucket: BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: 'public-read'
  }

  try {
    const s3response = await s3bucket.upload(params).promise();
    const fileUrl = s3response.Location;

    await Download.create({
      userId,
      fileUrl,
    });

    console.log('Upload Success:', s3response);
    return fileUrl;
  } catch (error) {
    console.error('Something went wrong:', error);
    throw error;
  }
}