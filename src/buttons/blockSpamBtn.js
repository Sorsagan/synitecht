const { PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const moderationSchema = require("../schemas/autoModerationSchema");
const mConfig = require("../messageConfig.json");

module.exports = {
  customId: "blockSpamBtn",
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  run: async (client, interaction) => {
    const { guildId } = interaction;
    try {
      const data = await moderationSchema.findOne({ guildId: guildId });

      if (data) {
        const newBlockSpamValue = !data.blockSpam;
        data.blockSpam = newBlockSpamValue;
        await data.save();

        interaction.reply(
          `Spams will ${newBlockSpamValue ? "now" : "no longer"} be deleted.`
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
