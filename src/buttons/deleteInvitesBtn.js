const { PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const moderationSchema = require("../schemas/autoModeration");
const mConfig = require("../messageConfig.json");

module.exports = {
    customId: 'deleteInvitesBtn',
    userPermissions: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],

    run: async (client, interaction) => {
      const{ guildId } = interaction;
      try {
        const data = await moderationSchema.findOne({ guildId: guildId });

        if (data) {
          const newDeleteInvitesValue = !data.deleteInvites;
          data.deleteInvites = newDeleteInvitesValue;
          await data.save();

          interaction.reply(`Invites will ${newDeleteInvitesValue ? 'now' : 'no longer'} be deleted.`);
        } else {
          interaction.reply('Auto Moderation is not setup. Please run /automod setup to setup the automod.')
        }
      } catch (err) {
        console.error(err);
      }
  }
}