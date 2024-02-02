const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const moderationSchema = require("../schemas/autoModerationSchema");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "deleteMassMentionsBtn",
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  run: async (client, interaction) => {
    const { guildId } = interaction;
    try {
      const data = await moderationSchema.findOne({ guildId: guildId });

      if (data) {
        const newDeleteMassMentionsValue = !data.deleteMassMentions;
        data.deleteMassMentions = newDeleteMassMentionsValue;
        await data.save();

        interaction.reply(
          `Mass Mentions will ${
            newDeleteMassMentionsValue ? "now" : "no longer"
          } be deleted.`
        );
      } else {
        interaction.reply(
          "Auto Moderation is not setup. Please run /automod setup to setup the automod."
        );
      }
    } catch (err) {
      console.error(err);
    }
  },
};
