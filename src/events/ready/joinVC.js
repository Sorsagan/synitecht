const { joinVoiceChannel } = require("@discordjs/voice");
module.exports = async (client) => {
  joinVoiceChannel({
    channelId: "1200133117533491280",
    guildId: "882383171323314186",
    adapterCreator:
      client.guilds.cache.get("882383171323314186").voiceAdapterCreator,
  });
};
