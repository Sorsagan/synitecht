const { ContextMenuCommandBuilder, ApplicationCommandType, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("test")
    .setType(ApplicationCommandType.Message),
    userPermissions: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    run: (client, interaction) => {
      return interaction.reply("Ping!");
    }
};