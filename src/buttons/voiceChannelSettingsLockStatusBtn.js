const { PermissionFlagsBits } = require("discord.js");
const voiceChannelOwnerSchema = require("../schemas/voiceChannelOwnerSchema");

module.exports = {
  customId: "voiceChannelSettingsLockStatusBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const { guildId } = interaction;
    const userId = interaction.user.id;
    try {
      const data = await voiceChannelOwnerSchema.findOne({
        guildId: guildId,
        userId: userId,
      });

      if (data && data.channelId) {
        const channel = interaction.guild.channels.cache.get(data.channelId);
        if (channel) {
          const everyoneRole = interaction.guild.roles.everyone;
          const permissions = channel.permissionOverwrites.cache.get(
            everyoneRole.id
          );
          const isLocked = permissions
            ? permissions.deny.has(PermissionFlagsBits.ViewChannel) &&
              permissions.deny.has(PermissionFlagsBits.Connect)
            : false;

          if (isLocked) {
            await channel.permissionOverwrites.edit(guildId, {
              ViewChannel: true,
              Connect: true,
            });
            interaction.reply("Voice Channel is now unlocked.");
          }
          if (!isLocked) {
            await channel.permissionOverwrites.edit(guildId, {
              ViewChannel: false,
              Connect: false,
            });
            interaction.reply("Voice Channel is now locked.");
          }
        } else {
          interaction.reply(
            "Voice Channel is not setup. Please run /voicechannel setup to setup the voice channel."
          );
        }
      }
    } catch (err) {
      console.error(err);
    }
  },
};
