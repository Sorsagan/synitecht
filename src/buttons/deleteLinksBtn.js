const { PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const moderationSchema = require("../schemas/autoModeration");
const mConfig = require("../messageConfig.json");

module.exports = {
    customId: 'deleteLinksBtn',
    userPermissions: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],

    run: async (client, interaction) => {
      const{ message, channel, guildId, guild, user } = interaction;
      try {
        const data = await moderationSchema.findOne({ guildId: guildId });

        if (data) {
          const newDeleteLinksValue = !data.deleteLinks;
          data.deleteLinks = newDeleteLinksValue;
          await data.save();

          interaction.reply(`Links will ${newDeleteLinksValue ? 'now' : 'no longer'} be deleted.`);
        } else {
          interaction.reply('Auto Moderation is not setup. Please run /automod setup to setup the automod.')
        }
      } catch (err) {
        console.error(err);
      }
  }
}