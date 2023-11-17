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

  run: (client, interaction) => {
    const purgenumber = interaction.options.getNumber("number");
    {    
        if(purgenumber > 100){
            return interaction.reply("You cannot purge more than 100 messages at a time.");
        } else {
        if(purgenumber < 1){
            return interaction.reply("You cannot purge less than 1 message.");
        }else{
            interaction.channel.bulkDelete(purgenumber);
            return interaction.reply(`Purged ${purgenumber} messages.`);
        }
        }
    }
  },
};