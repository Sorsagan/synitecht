const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Send a ping to the bot")
    .setDMPermission(false)
    .addSubcommandGroup((subcommandgroup) =>
      subcommandgroup
        .setName("yarak")
        .setDescription("Test subcommand group")
        .addSubcommand((subcommand) => 
          subcommand
            .setName("subcommand1")
            .setDescription("Subcommand 1")
            .addUserOption((option) =>
              option
                .setName("user")
                .setDescription("User to ping")
            )
        )
        .addSubcommand((subcommand) => 
          subcommand
            .setName("subcommand2")
            .setDescription("Subcommand 2")
            .addStringOption((option) =>
            option
            .setName("string")
            .setDescription("String to send")
            )
            .addUserOption((option) =>
              option
                .setName("user2")
                .setDescription("User to ping 2")
            )
            )
    )
    .addSubcommand((subcommand) =>
    subcommand
    .setName("message")
    .setDescription("Message subcommand")
    )
    .toJSON(),
    userPermissions: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],
    testMode: true,
    devOnly: true,
    deleted: true,

    run: (client, interaction) => {
      return interaction.reply("Pong!");
    }
};
