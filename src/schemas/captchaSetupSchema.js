const { model, Schema } = require("mongoose");

const captchaSetupSchema = new Schema(
  {
    guildId: String,
    roleId: String,
    channelId: String,
  },
  { strict: false }
);

module.exports = model("captchaSetup", captchaSetupSchema);
