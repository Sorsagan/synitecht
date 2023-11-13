const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kicks the mentioned user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("target")
        .setDescription("The user to kick.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],

  run: (client, interaction) => {
    const targetuser = interaction.options.getMember("target");
    if (targetuser === null || !targetuser) {
      return interaction.reply("The user you mentioned is not a valid user."); // This means the target isn't in the server.
    } else if (!targetuser.kickable) {
      return interaction.reply("I cannot kick that user."); // This means the target either has a higher role than the bot or the target is the bot owner.
    } else if (targetuser.id === interaction.user.id) {
      return interaction.reply("You cannot kick yourself."); //Self explanatory.
    } else {
      if (targetuser && targetuser.kickable) {
        targetuser.kick();
        return interaction.reply(`${targetuser} has been kicked.`);
    }
    }
  },
};
