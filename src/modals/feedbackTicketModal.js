// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=lNRGe5Xy0FM)
const { EmbedBuilder } = require("discord.js");

const ticketSetupSchema = require("../schemas/ticketSetupSchema");
const ticketSchema = require("../schemas/ticketSchema");

module.exports = {
  customI: "feedbackMdl",
  userPermissions: [],
  botPermissions: [],
  run: async (client, interaction) => {
    try {
      const { fields, guild, member, channel, message } = interaction;

      const feedbackMessage = fields.getTextInputValue("feedbackTicketMsg");
      const rating = fields.getTextInputValue("rateTicketMsg");

      await interaction.deferReply({ ephemeral: true });

      if (rating < 1 || rating > 5)
        return interaction.editReply({
          content: "Please provide a rating between 1 and 5",
        });
      let isNum = /^\d+$/.test(rating);
      if (!isNum)
        return interaction.editReply({
          content: "Please provide a valid number",
        });
      const ticketSetup = await ticketSetupSchema.findOne({
        guildId: guild.id,
        ticketChannelId: channel.parentId,
      });
      const ticket = await ticketSchema.findOne({
        guildId: guild.id,
        ticketChannelId: channel.id,
      });
      await ticket.findOneAndUpdate(
        { guildId: guild.id, ticketChannelId: channel.id },
        { feedbackMessage: feedbackMessage, rating: rating }
      );
      let stars = "";
      for (let i = 0; i < rating; i++) {
        stars += ":star:";
      }
      const allTickets = await ticketSchema.find({ guildId: guild.id });
      const allRatings = allTickets
        .map((t) => (t.rating !== null ? t.rating : 0))
        .reduce((acc, current) => {
          return acc + current;
        }, 0);
      const ar = Math.round(allRatings / allTickets.length);
      let averageStars = "";
      for (let i = 0; i < ar; i++) {
        averageStars += ":star:";
      }

      const feedbackEmbed = new EmbedBuilder()
        .setTitle("Ticket Feedback")
        .setDescription(
          `**Rating** ${stars}\n**Feedback** ${feedbackMessage}\n**Average Rating** ${averageStars}`
        )
        .setFooter(`Ticket ID: ${ticket.ticketId}`);

      await guild.channels.cache
        .get(ticketSetup.feedbackChannelId)
        .send({ embeds: [feedbackEmbed] });

      message.componenets[0].componenets[2].data.disabled = true;
      await message.edit({ componenets: message.componenets[0] });
      return await interaction.editReply({
        content: "Feedback has been submitted",
      });
    } catch (error) {
      console.log(error);
    }
  },
};
