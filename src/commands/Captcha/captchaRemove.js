const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const captchaSetupSchema = require("../../schemas/captchaSetupSchema");
const captchaSchema = require("../../schemas/captchaSchema");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("captcha-remove")
    .setDescription("Remove a captcha system."),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],
  run: async (client, interaction) => {
    try {
      const { guild } = interaction;
      const existingSetupCaptcha = await captchaSetupSchema.findOne({
        guildId: guild.id,
      });
      if (!existingSetupCaptcha) {
        return interaction.reply("No captcha setup exists for this server.");
      }
      if (existingSetupCaptcha) {
        await captchaSetupSchema.findOneAndDelete({
          guildId: guild.id,
        });
        await captchaSchema.deleteMany({
          guildUserFrom: guild.id,
        });
        interaction.reply("Captcha removed successfully.");
      }
    } catch (error) {
      console.error(error);
      interaction.reply(
        "An error occurred while removing the captcha. Please try again later."
      );
    }
  },
};
