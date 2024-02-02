// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=lNRGe5Xy0FM)

const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ticketSetupSchema = require("../../schemas/ticketSetupSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Setup a ticket system.")
    .addChannelOption((option) =>
      option
        .setName("ticket-channel")
        .setDescription("The channel where tickets will be created.")
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName("feedback-channel")
        .setDescription("The channel where feedback will be sent.")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("staff-role")
        .setDescription("The role that will be able to see tickets.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("ticket-type")
        .setDescription("The type of ticket system you want.")
        .setRequired(true)
        .addChoices(
          { name: "Modal", value: "modal" },
          { name: "Button", value: "button" }
        )
        .setRequired(true)
    ),
    userPermissions: [PermissionFlagsBits.Administrator],
    botPermissions: [],
    run: async (client, interaction) => {
        try {
            const {guild, options} = interaction;
            const ticketChannel = options.getChannel('ticket-channel');
            const feedbackChannel = options.getChannel('feedback-channel');
            const staffRole = options.getRole('staff-role');
            const ticketType = options.getString('ticket-type');

            await interaction.deferReply({ ephemeral: true });

            const buttonTicketCreateEmbed = new EmbedBuilder()
                .setTitle('Ticket System')
                .setDescription('Click the button below to create a ticket.')
                .setFooter({text: 'Support Tickets'})
                .setTimestamp();

            const modalTicketCreateEmbed = new EmbedBuilder()
            .setTitle('Ticket System')
            .setDescription('Click the button below to create a ticket.')

            .setFooter({text: 'Support Tickets'})
            .setTimestamp();

            const ticketSetupEmbed = new EmbedBuilder()
                .setTitle('Ticket System')
                .setDescription('Ticket system setup successfully.\n**Don\'t forget to give members the permmision to send messages in threads.**')
                .addFields(
                    { name: 'Ticket Channel', value: `${ticketChannel}`, inline: true },
                    { name: 'Feedback Channel', value: `${feedbackChannel}`, inline: true },
                    { name: 'Staff Role', value: `${staffRole}`, inline: true },
                    { name: 'Ticket Type', value: `${ticketType}`, inline: true },
                )
                .setTimestamp();

            const openTicketButton = new ActionRowBuilder().addComponents([
                new ButtonBuilder()
                    .setCustomId('openTicketBtn')
                    .setLabel('Open Ticket')
                    .setStyle(ButtonStyle.Secondary),
            ])

            let setupTicket = await ticketSetupSchema.findOne({ ticketChannelId: ticketChannel.id });

            if(setupTicket){
                return await interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Ticket System').setDescription('Ticket system already setup.').setColor('Red').setTimestamp()] });
            } else {
                setupTicket = await ticketSetupSchema.create({
                    guildId: guild.id,
                    feedbackChannelId: feedbackChannel.id,
                    ticketChannelId: ticketChannel.id,
                    staffRoleId: staffRole.id,
                    ticketType: ticketType,
                });

                await setupTicket.save().catch(err => console.log(err));
            }

            if(ticketType === 'button'){
                await ticketChannel.send({ embeds: [buttonTicketCreateEmbed], components: [openTicketButton] });
            } else {
                await ticketChannel.send({ embeds: [modalTicketCreateEmbed], components: [openTicketButton]});
            }

            return await interaction.editReply({
                embeds: [ticketSetupEmbed],
            })
        } catch (error) {
            console.log(error);
        }
    }
};
