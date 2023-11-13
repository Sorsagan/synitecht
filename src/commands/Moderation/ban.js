const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bans the mentioned user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("target")
        .setDescription("The user to ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
    option
    .setName("reason")
    .setDescription("Reason for banning the user.")
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  run: (client, interaction) => {
    const reason = interaction.options.getString("reason") ?? "No reason provided.";
    const targetuser = interaction.options.getMember("target");
    if (targetuser === null || !targetuser) {
      return interaction.reply("The user you mentioned is not a valid user.");// This means the target isn't in the server.
    } else if (!targetuser.bannable) {
      return interaction.reply("I cannot ban that user.");// This means the target either has a higher role than the bot or the target is the bot owner.
    } else if (targetuser.id === interaction.user.id) {
      return interaction.reply("You cannot ban yourself.");//Self explanatory.
    } else {    
      if (targetuser && targetuser.bannable) {
        targetuser.ban({ reason: reason});
        return interaction.reply(`${targetuser} has been banned.\nReason: ${reason}`);
      }
    }
  },
};