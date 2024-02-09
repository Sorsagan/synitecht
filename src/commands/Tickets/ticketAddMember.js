const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const ticketSchema = require("../../schemas/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-add-member")
    .setDescription("Add a member to a ticket.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageThreads)
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to add to the ticket.")
        .setRequired(true)
    ),
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [],
  run: async (client, interaction) => {
    try {
      const { channel, options, guild } = interaction;
      await interaction.deferReply({ ephemeral: true });

      const memberToAdd = options.getUser("member");

      const ticket = await ticketSchema.findOne({
        guildId: guild.id,
        ticketChannelId: channel.id,
        closed: false,
      });

      if (!ticket)
        return await interaction.editReply({
          content: "This channel is not a ticket.",
          ephemeral: true,
        });

      const memberExistInServer = guild.members.cache.find(
        (member) => member.id === memberToAdd.id
      );
      if (!memberExistInServer)
        return await interaction.editReply({
          content: "This member does not exist in the server.",
          ephemeral: true,
        });

      ticket.membersAdded.push(memberToAdd.id);
      ticket.save();

      const threadMember = await channel.members
        .fetch(memberToAdd.id)
        .catch(() => null);

      if (threadMember)
        return await interaction.editReply({
          content: "This member is already in the ticket.",
          ephemeral: true,
        });

      await channel.members.add(memberToAdd.id);

      return await interaction.editReply({
        content: `Successfully added ${memberToAdd} to the ticket.`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
