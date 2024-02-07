const { model, Schema } = require("mongoose");

const captchaSchema = new Schema(
  {
    userId: String,
    captchaText: String,
    guildUserFrom: String,
    createdAt: { type: Date, default: Date.now, expires: "5m" }, // captcha will be deleted after 5 minutes
  },
  { strict: false }
);

module.exports = model("captcha", captchaSchema);
