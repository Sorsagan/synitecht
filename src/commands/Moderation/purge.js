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
    let amount = interaction.options.getNumber("number");
    if (amount > 100) amount = 100;
    if (amount < 1) amount = 1;
  
    // Acknowledge the interaction immediately
    await interaction.deferReply();
  
    const messages = await interaction.channel.messages.fetch({ limit: amount });
    const twoWeeksAgo = Date.now() - 14 * 24 * 60 * 60 * 1000;
    const messagesToDelete = messages.filter((msg) => msg.createdTimestamp > twoWeeksAgo);
  
    try {
      await interaction.channel.bulkDelete(messagesToDelete);

    } catch (error) {
      console.error(`Failed to delete messages: ${error}`);
    }
  
    results(messagesToDelete);

    async function results(deletedMessages) {
      const results = {};
      for (const [, deleted] of deletedMessages) {
        const user = `${deleted.author.username}#${deleted.author.discriminator}`;
        if (!results[user]) results[user] = 0;
        results[user]++;
      }
    
      const userMessageMap = Object.entries(results);
    
      const finalResult = `${deletedMessages.size} message${
        deletedMessages.size > 1 ? "s" : ""
      } were removed!\n\n${userMessageMap
        .map(([user, messages]) => `**${user}** : ${messages}`)
        .join("\n")}`;
    
      try {
        await interaction.editReply(finalResult);
      } catch (error) {
        console.error(`Failed to edit reply: ${error}`);
      }
    }
  },
};
