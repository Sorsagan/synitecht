const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");
const captchaSchema = require("../../schemas/captchaSetupSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("captcha-setup")
    .setDescription("Setup a captcha system.")
    .addChannelOption((option) =>
      option
        .setName("captcha-channel")
        .setDescription("The channel where captcha logs will be sent.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("The role will be given after verification.")
        .setRequired(true)
    ),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [],
  run: async (client, interaction) => {
    try {
      if (interaction.options.getChannel("captcha-channel").type !== 0) {
        return interaction.reply("The channel should be a text channel.");
      }
      const { guild, options } = interaction;
      const captchaChannel = options.getChannel("captcha-channel");
      const role = options.getRole("role");

      const existingCaptcha = await captchaSchema.findOne({
        guildId: guild.id,
      });
      if (existingCaptcha) {
        return interaction.reply(
          "A captcha setup already exists for this server."
        );
      }

      await captchaSchema.create({
        guildId: guild.id,
        roleId: role.id,
        channelId: captchaChannel.id,
      });

      interaction.reply("Captcha setup completed successfully.");
    } catch (error) {
      console.error(error);
      interaction.reply(
        "An error occurred while setting up the captcha. Please try again later."
      );
    }
  },
};
