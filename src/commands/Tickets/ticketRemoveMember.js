const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const ticketSchema = require("../../schemas/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-remove-member")
    .setDescription("Remove a member to a ticket.")
    .addUserOption((option) =>
      option
        .setName("member")
        .setDescription("The member to remove from the ticket.")
        .setRequired(true)
    ),
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [],
  run: async (client, interaction) => {
    try {
      const { channel, options, guild } = interaction;
      await interaction.deferReply({ ephemeral: true });

      const memberToRemove = options.getUser("member");

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
        (member) => member.id === memberToRemove.id
      );
      if (!memberExistInServer)
        return await interaction.editReply({
          content: "This member does not exist in the server.",
          ephemeral: true,
        });

      const threadMember = await channel.members
        .fetch(memberToRemove.id)
        .catch((err) => {
          console.log(err);
        });

      if (!threadMember)
        return await interaction.editReply({
          content: "This member isn't in the ticket.",
          ephemeral: true,
        });

      await ticketSchema.findOneAndUpdate(
        {
          guildId: guild.id,
          ticketChannelId: channel.id,
          closed: false,
        },
        {
          $pull: {
            membersAdded: memberToRemove.id,
          },
        }
      );
      ticket.save();

      await channel.members.remove(memberToRemove.id);

      return await interaction.editReply({
        content: `Successfully removed ${memberToRemove} from the ticket.`,
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
    }
  },
};
