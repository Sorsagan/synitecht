require("colors");
const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;

module.exports = async (client) => {
  console.log(`Logged in as ${client.user.tag}`.green);

  if (!mongoUrl) return;
  mongoose.set("strictQuery", true);

  if (await mongoose.connect(mongoUrl)) {
    console.log(`MongoDB connected in ${client.user.tag}`.green);
  }
};
