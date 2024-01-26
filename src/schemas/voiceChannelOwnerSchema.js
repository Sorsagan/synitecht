const { model, Schema } = require("mongoose");

const voiceChannelOwnerSchema = new Schema(
  {
    guildId: String,
    channelId: String,
    userId: String,
  },
  { strict: false }
);

module.exports = model("voiceChannelOwner", voiceChannelOwnerSchema);
