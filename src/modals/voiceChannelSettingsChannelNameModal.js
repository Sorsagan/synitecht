const voiceChannelOwnerSchema = require("../schemas/voiceChannelOwnerSchema");

module.exports = {
  customId: "chanegename_modal",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.user.id);
    const voiceChannel = member.voice.channel;

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
    const channelName = channel.name;
    const { fields } = interaction;
    const newVCName = fields.getTextInputValue("new_vc_name");
    if (!voiceChannelOwner)
      return interaction.followUp({
        content: `You are not the owner of this voice channel.`,
        ephemeral: true,
      });
    if (newVCName === channelName) {
      return interaction.reply({
        content: "The channel name you entered is the same as the current channel name.",
        ephemeral: true,
      });
    }
    if (newVCName.length > 100) {
      return interaction.reply({
        content: "The channel name you entered is too long.",
        ephemeral: true,
      });
    }
    if (newVCName.length < 2) {
      return interaction.reply({
        content: "The channel name you entered is too short.",
        ephemeral: true,
      });
    }
    if (!newVCName) {
      return interaction.reply({
        content: "You must enter a channel name.",
        ephemeral: true,
      });
    }
    if (newVCName) {
      await interaction.deferReply({ ephemeral: true });
      await channel.setName(newVCName);
      await interaction.editReply({
        content: "Voice channel name changed.",
        ephemeral: true,
      });
      console.log(`Voice channel name changed to ${newVCName}`);
    }
  },
};