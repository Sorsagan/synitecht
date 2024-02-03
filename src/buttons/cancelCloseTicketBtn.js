const { PermissionFlagsBits } = require("discord.js");

module.exports = {
  customId: "cancelCloseTicketBtn",
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [],
  run: async (client, interaction) => {
    try {
      return await interaction.reply({
        content: "Ticket close cancelled!",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
