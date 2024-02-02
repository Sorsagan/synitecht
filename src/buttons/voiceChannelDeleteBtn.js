const voiceChannelOwnerSchema = require("../schemas/voiceChannelOwnerSchema.js");
const channelTimeoutSchema = require("../schemas/channelTimeoutSchema.js");

module.exports = {
  customId: "voiceChannelDeleteBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    let dataOwnerVC = await voiceChannelOwnerSchema.findOne({});
    if (dataOwnerVC) {
      const voiceChannelId = dataOwnerVC.channelId;
      const voiceChannel = client.channels.cache.get(voiceChannelId);
      if (voiceChannel) {
        voiceChannel.delete();
        interaction.reply("Voice channel deleted.");
        await voiceChannelOwnerSchema.findOneAndDelete({
          channelId: voiceChannelId,
        });
        await channelTimeoutSchema.findOneAndDelete({
          channelId: voiceChannelId,
        });
      } else {
        interaction.reply("Failed to find voice channel.");
      }
    } else {
      interaction.reply("Failed to find voice channel owner data.");
    }
  },
};
