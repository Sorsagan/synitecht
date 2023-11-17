const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Un bans the mentioned user.")
    .setDMPermission(false)
    .addStringOption((id) =>
      id
        .setName("id")
        .setDescription("The user's id to un ban.")
        .setRequired(true)
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],

  run: async (client, interaction) => {
    const userid = interaction.options.getString("id");

    if (userid === interaction.user.id) {
      return interaction.reply("You cannot un ban yourself."); //Self explanatory.
    } else {
      try {
        await interaction.guild.bans.fetch(userid);
        await interaction.guild.members.unban(userid);
        return interaction.reply(`${client.users.cache.get(userid)} has been unbanned.`);
      } catch (error) {
        return interaction.reply("The user you mentioned is not a valid user or not banned.");
      }
    }
  },
};
