require("dotenv").config();

export default {
  port: 4030,
  mongoUri: process.env.MONGO_URI,
  logLevel: "info",
  logs: "dev",
  env: "development",
  sendgridApiKey: process.env.SENDGRID_API_KEY,
};
