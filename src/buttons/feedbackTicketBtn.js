const { ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
    customId: 'feedbackTicketBtn',
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        try {
            const feedbackTicketModal = new ModalBuilder()
            .setTitle('Feedback Ticket')
            .setCustomId('feedbackMdl')
            .setComponents(
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                        .setLabel('Rating')
                        .setCustomId('rateTicketMsg')
                        .setPlaceholder('Enter a rating between 1 and 5.')
                        .setStyle(TextInputStyle.Short)
                ),
                new ActionRowBuilder().setComponents(
                    new TextInputBuilder()
                    .setLabel('Feedback')
                    .setCustomId('feedbackTicketMsg')
                    .setPlaceholder('Enter your feedback.')
                    .setStyle(TextInputStyle.Paragraph)
                )
            )

            return interaction.showModal(feedbackTicketModal);
        } catch (error) {
            console.log(error);
        }
    }
}