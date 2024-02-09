const voiceChannelOwnerSchema = require("../schemas/voiceChannelOwnerSchema");

module.exports = {
  customId: "chanegeuserlimit_modal",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
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
      return interaction.reply({
        content: "You are not the owner of this voice channel.",
        ephemeral: true,
      });
    }

    const channel = client.channels.cache.get(voiceChannelOwner.channelId);
    const channelUserLimit = channel.userLimit;
    const { fields } = interaction;
    const newVCUserLimit = parseInt(
      fields.getTextInputValue("new_user_limit"),
      10
    );
    if (!voiceChannelOwner)
      return interaction.followUp({
        content: `You are not the owner of this voice channel.`,
        ephemeral: true,
      });
    if (newVCUserLimit === channelUserLimit) {
      return interaction.reply({
        content:
          "The channel limit you entered is the same as the current channel limit.",
        ephemeral: true,
      });
    }
    if (newVCUserLimit > 99) {
      return interaction.reply({
        content: "The channel limit you entered can't be more than 99.",
        ephemeral: true,
      });
    }
    if (newVCUserLimit < 1) {
      return interaction.reply({
        content: "The channel limit you entered can't be lower than 1.",
        ephemeral: true,
      });
    }
    if (!newVCUserLimit) {
      return interaction.reply({
        content: "You must enter an valid user limit. Ex: 34.",
        ephemeral: true,
      });
    }
    if (isNaN(newVCUserLimit)) {
      return interaction.reply({
        content: "The user limit you entered is not a valid number.",
        ephemeral: true,
      });
    }
    if (newVCUserLimit) {
      await interaction.deferReply({ ephemeral: true });
      await channel.setUserLimit(newVCUserLimit);
      await interaction.editReply({
        content: "Voice channel user limit changed.",
        ephemeral: true,
      });
      console.log(`Voice channel limit changed to ${newVCUserLimit}`);
    }
  },
};
