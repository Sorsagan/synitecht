const { model, Schema } = require("mongoose");

const voiceChannelSchema = new Schema(
  {
    guildId: String,
    channelId: String,
  },
  { strict: false }
);

module.exports = model("voiceChannel", voiceChannelSchema);
