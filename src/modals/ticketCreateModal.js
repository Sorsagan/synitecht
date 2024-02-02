// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=lNRGe5Xy0FM)
const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    ChannelType,
} = require('discord.js');

const ticketSetupSchema = require('../schemas/ticketSetupSchema');
const ticketSchema = require('../schemas/ticketSchema');
module.exports = {
    customId: 'ticketMdl',
    userPermissions: [],
    botPermissions: [],
    run: async (client, interaction) => {
        try {
            const { fields, guild, member, channel } = interaction;

            const sub = fields.getTextInputValue('ticketSubject');
            const desc = fields.getTextInputValue('ticketDescription');

            await interaction.deferReply({ ephemeral: true });

            const ticketSetup = await ticketSetupSchema.findOne({
                guildId: guild.id,
                ticketChannelId: channel.id
            })

            const ticketChannel = guild.channels.cache.find(channel => channel.id === ticketSetup.ticketChannelId);
            const staffRole = guild.roles.cache.get(ticketSetup.staffRoleId);
            const username = member.user.globalName ?? member.user.username;

            const ticketEmbed = new EmbedBuilder()
                .setTitle(`Ticket from ${username}`)
                .setDescription(`Subject: ${sub}\nDescription: ${desc}`)
                .setFooter({
                    text: `${guild.name} Tickets`,
                    iconURL: guild.iconURL()
                })
                .setTimestamp();

                const ticketButtons = new ActionRowBuilder().setComponents([
                    new ButtonBuilder()
                        .setCustomId('ticketCloseBtn')
                        .setLabel('Close Ticket')
                        .setStyle(ButtonStyle.Danger),
                    new ButtonBuilder()
                        .setCustomId('ticketLockBtn')
                        .setLabel('Lock Ticket')
                        .setStyle(ButtonStyle.Success),
                ])

                let ticket = await ticketSchema.findOne({
                    guildId: guild.id,
                    ticketMemberId: member.id,
                    parentTicketChannelId: channel.id,
                    closed: false,
                })

                const ticketCount = await ticketSchema.findOne({
                    guildId: guild.id,
                    closed: false,
                    ticketMmeberId: member.id,
                    parentTicketChannelId: channel.id,
                }).count()

                if(ticket){
                    return await interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Ticket System').setDescription('You already have a ticket open.').setColor('Red').setTimestamp()] });
                }

                const thread = await ticketChannel.threads.create({
                    name: `${ticketCount + 1}-${username}`,
                    type: ChannelType.PrivateThread,
                })

                await thread.send({
                    content: `${staffRole} - ticket created by ${member}`,
                    components: [ticketButtons],
                    embeds: [ticketEmbed],
                })

                if(!ticket){
                    ticket = await ticketSchema.create({
                        guildId: guild.id,
                        ticketMemberId: member.id,
                        ticketChannelId: thread.id,
                        parentTicketChannelId: channel.id,
                        closed: false,
                        membersAdded: [],
                    })

                    await ticket.save().catch(err => console.log(err))

                    return await interaction.editReply({ embeds: [new EmbedBuilder().setTitle('Ticket System').setDescription('Ticket created successfully.').setColor('Green').setTimestamp()] });
                }
        } catch (error) {
            console.log(error)
        }
    }
}