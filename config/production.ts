require("dotenv").config();

export default {
  port: 4040,
  mongoUri: process.env.MONGO_URI,
  logLevel: "info",
  logs: "prod",
  env: "production",
  sendgridApiKey: process.env.SENDGRID_API_KEY,
};
