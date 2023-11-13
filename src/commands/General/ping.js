const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Send a ping to the bot")
    .setDMPermission(false)
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("test")
        .setDescription("Test subcommand group")
        .addSubcommand((subcommand) => {
          subcommand
            .setName("subcommand1")
            .setDescription("Subcommand 1")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("User to ping")
                .setRequired(true)
            );
        })
        .addSubcommand((subcommand) => {
          subcommand
            .setName("subcommand2")
            .setDescription("Subcommand 2")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("User to ping")
                .setRequired(true)
            );
        })
    ).toJSON(),
    userPermission: [PermissionFlagsBits.ADMINISTRATOR],
    botPermission: [PermissionFlagsBits.ADMINISTRATOR],

    run: (client, interaction) => {
        return interaction.reply({content: "Pong!"})
    }
};
