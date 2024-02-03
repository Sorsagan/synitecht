const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const ticketSetupSchema = require("../schemas/ticketSetupSchema");
const ticketSchema = require("../schemas/ticketSchema");

module.exports = {
  customId: "openTicketBtn",
  run: async (client, interaction) => {
    try {
      const { guild, member, channel } = interaction;

      const ticketSetup = await ticketSetupSchema.findOne({
        guildId: guild.id,
        ticketChannelId: channel.id,
      });
      if (!ticketSetup)
        return await interaction.editReply({
          content: "The ticket system has not been setup yet.",
          ephemeral: true,
        });
      if (ticketSetup.ticketType === "modal") {
        const ticketModal = new ModalBuilder()
          .setTitle("Ticket System")
          .setCustomId("ticketMdl")
          .setComponents(
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setLabel("Ticket Subject")
                .setCustomId("ticketSubject")
                .setPlaceholder("Enter a subject.")
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(100)
                .setRequired(true)
            ),
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setLabel("Ticket Description")
                .setCustomId("ticketDescription")
                .setPlaceholder("Enter a description.")
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(1)
                .setMaxLength(500)
                .setRequired(true)
            )
          );
        return interaction.showModal(ticketModal);
      } else {
        await interaction.deferReply({ ephemeral: true });
        const ticketChannel = guild.channels.cache.find(
          (channel) => channel.id === ticketSetup.ticketChannelId
        );
        const staffRole = guild.roles.cache.get(ticketSetup.staffRoleId);
        const username = member.user.globalName ?? member.user.username;

        const ticketEmbed = new EmbedBuilder()
          .setAuthor({
            name: username,
            iconURL: member.user.displayAvatarURL(),
          })
          .setTitle("Ticket System")
          .setDescription("Staff will be with you shortly.")
          .setFooter({ text: guild.name, iconURL: guild.iconURL() })
          .setTimestamp();

        const ticketButtons = new ActionRowBuilder().setComponents([
          new ButtonBuilder()
            .setCustomId("ticketCloseBtn")
            .setLabel("Close Ticket")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId("ticketLockBtn")
            .setLabel("Lock Ticket")
            .setStyle(ButtonStyle.Success),
        ]);
        let ticket = await ticketSchema.findOne({
          guildId: guild.id,
          ticketMemberId: member.id,
          parentTicketChannelId: channel.id,
          closed: false,
        });
        const ticketCount = await ticketSchema
          .findOne({
            guildId: guild.id,
            ticketMemberId: member.id,
            parentTicketChannelId: channel.id,
            closed: true,
          })
          .count();
        if (ticket) {
          return await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setTitle("Ticket System")
                .setDescription("You already have a ticket open.")
                .setTimestamp(),
            ],
          });
        }
        const thread = await ticketChannel.threads.create({
          name: `${ticketCount + 1}-${username}`,
          type: ChannelType.PrivateThread,
        });
        await thread.send({
          content: `${staffRole} - ticket created by ${member}`,
          components: [ticketButtons],
          embeds: [ticketEmbed],
        });

        if (!ticket) {
          ticket = await ticketSchema.create({
            guildId: guild.id,
            ticketChannelId: thread.id,
            ticketMemberId: member.id,
            parentTicketChannelId: channel.id,
            closed: false,
            membersAdded: [],
          });
          await ticket.save().catch((err) => console.log(err));
        }
        return await interaction.editReply({
          content: `Ticket created in ${thread}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
