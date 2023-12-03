const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Clears the specified amount of messages.")
    .setDMPermission(false)
    .addNumberOption((int) =>
      int
        .setName("number")
        .setDescription("The number of messages to purge.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ManageMessages],
  botPermissions: [PermissionFlagsBits.ManageMessages],

  run: async (client, interaction) => {
    const purgenumber = interaction.options.getNumber("number");
  
    if(purgenumber > 100){
      return interaction.reply("You cannot purge more than 100 messages at a time.");
    } else if(purgenumber < 1){
      return interaction.reply("You cannot purge less than 1 message.");
    } else {
      const messages = await interaction.channel.messages.fetch({ limit: purgenumber });
      const messagesArray = Array.from(messages.values());
      for (let i = 0; i < purgenumber; i += 10) {
        const batch = messagesArray.slice(i, i + 10);
        try {
          await interaction.channel.bulkDelete(batch);
        } catch (error) {
          if (error.code === 50034) {
            return interaction.reply("You cannot delete messages that are 14 days old or older.");
          } else {
            console.error(error);
          }
        }
      }
      return interaction.reply(`Purged ${purgenumber} messages.`);
    }
  },
};