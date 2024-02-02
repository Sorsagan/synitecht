const voiceChannelOwnerSchema = require("../schemas/voiceChannelOwnerSchema");

module.exports = {
  customId: "changeuserlimit_modal",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    try {
      const guild = client.guilds.cache.get(interaction.guildId);
      const member = guild.members.cache.get(interaction.user.id);
      const voiceChannel = member.voice.channel;

      // Check if the user is in a voice channel
      if (!voiceChannel) {
        return interaction.reply({
          content: `You are not in a voice channel.`,
          ephemeral: true,
        });
      }
      const voiceChannelOwner = await voiceChannelOwnerSchema.findOne({
        guildId: guild.id,
        channelId: voiceChannel.id,
      });
      if (voiceChannelOwner.channelId !== voiceChannel.id) {
        return interaction.reply(
          "You are not the owner of this voice channel."
        );
      }
      const channel = client.channels.cache.get(voiceChannelOwner.channelId);
      const channelUserLimit = channel.userLimit;
      const { fields } = interaction;
      const newUserLimit = fields.getTextInputValue("new_user_limit");
      if (!newUserLimit) {
        return interaction.reply("You must enter a user limit.");
      }
      if (newUserLimit === channelUserLimit) {
        return interaction.reply(
          "The user limit you entered is the same as the current user limit."
        );
      }
      if (newUserLimit < 0) {
        return interaction.reply("The user limit you entered is too low.");
      }
      if (newUserLimit > 99) {
        return interaction.reply("The user limit you entered is too high.");
      }
      if (newUserLimit) {
        const newUserLimitNumber = parseInt(newUserLimit, 10);
        if (isNaN(newUserLimitNumber)) {
          return interaction.reply("The user limit you entered is not a valid number.");
        }
        await interaction.deferReply({ ephemeral: true });
        try {
          await channel.setUserLimit(newUserLimitNumber);
          interaction.editReply("Voice channel user limit changed.");
          console.log(`Voice channel user limit changed to ${newUserLimitNumber}`);
        } catch (error) {
          console.error('Error setting user limit:', error);
          interaction.editReply("An error occurred while changing the user limit.");
        }
      }
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "An error occurred while changing the user limit.",
        ephemeral: true,
      });
    }
  },
};
