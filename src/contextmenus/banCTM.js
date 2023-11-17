const { ContextMenuCommandBuilder, ApplicationCommandType, SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Ban the user")
    .setType(ApplicationCommandType.User),
    userPermissions: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
    deleted:true,
    run: (client, interaction) => {
      const { targetuser, reason } = interaction;
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