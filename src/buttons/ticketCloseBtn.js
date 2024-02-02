const { ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits } = require("discord.js");

module.exports = {
    customId: 'ticketCloseBtn',
    userPermissions: [PermissionFlagsBits.ManageThreads],
    botPermissions: [],
    run: async (client, interaction) => {
        try {
         await interaction.deferReply();   
         const confirmCloseTicketEmbed = new EmbedBuilder()
            .setTitle('Confirm Close Ticket')
            .setDescription('Are you sure you want to close this ticket?')

            const confirmCloseTicketBtns = new ActionRowBuilder().setComponents([
                new ButtonBuilder()
                    .setCustomId('confirmCloseTicketBtn')
                    .setLabel('Confirm')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId('cancelCloseTicketBtn')
                    .setLabel('Cancel')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('feedbackTicketBtn')
                    .setLabel('Give Feedback')
                    .setStyle(ButtonStyle.Secondary),
            ])

            return await interaction.editReply({
                embeds: [confirmCloseTicketEmbed],
                components: [confirmCloseTicketBtns]
            })
        } catch (error) {
            console.log(error);
        }
    }
}