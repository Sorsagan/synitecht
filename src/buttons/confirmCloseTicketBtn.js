const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const ticketSchema = require("../schemas/ticketSchema");
const ticketSetupSchema = require("../schemas/ticketSetupSchema");

module.exports = {
  customId: "confirmCloseTicketBtn",
  userPermissions: [PermissionFlagsBits.ManageThreads],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
        const { channel, guild } = interaction;

        const closingEmbed = new EmbedBuilder()
            .setTitle('Closing Ticket')
            .setDescription('Closing ticket in 5 seconds.')
            await channel.send({ embeds: [closingEmbed] });
            await interaction.deferReply();
            const closedEmbed = new EmbedBuilder()
            .setTitle('Ticket Closed')
            .setDescription('Ticket closed.')
            const setupTicket = await ticketSetupSchema.findOne({
                guildId: guild.id,
                ticketChannelId: channel.parentId,
                closed: false,
            })
            const ticket = await ticketSchema.findOne({
                guildId: guild.id,
                ticketChannelId: channel.id,
                closed: false,
            })

            const staffRole = guild.roles.cache.get(setupTicket.staffRoleId);   
            const hasRole = staffRole.members.has(ticket.ticketMemberId);
            if(!hasRole) {
                ticket.membersAdded.map(async (member) => {
                    await channel.members.remove(member);
                })
                await channel.members.remove(ticket.ticketMemberId);
            }
            await ticketSchema.findOneAndDelete({
                guildId: guild.id,
                ticketChannelId: channel.id,
                closed: false,  
            })

            await channel.setArchived(true);
            return await interaction.editReply({
                embeds: [closedEmbed]
            })
    } catch (error) {
        console.log(error);
    }
  },
};
