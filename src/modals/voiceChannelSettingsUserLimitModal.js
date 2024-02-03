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
      return interaction.reply("You are not the owner of this voice channel.");
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
      return interaction.reply(
        "The channel limit you entered is the same as the current channel limit."
      );
    }
    if (newVCUserLimit > 99) {
      return interaction.reply(
        "The channel limit you entered can't be more than 99."
      );
    }
    if (newVCUserLimit < 1) {
      return interaction.reply(
        "The channel limit you entered can't be lower than 1."
      );
    }
    if (!newVCUserLimit) {
      return interaction.reply("You must enter an valid user limit. Ex: 34.");
    }
    if (isNaN(newVCUserLimit)) {
      return interaction.reply(
        "The user limit you entered is not a valid number."
      );
    }
    if (newVCUserLimit) {
      await interaction.deferReply({ ephemeral: true });
      await channel.setUserLimit(newVCUserLimit);
      interaction.editReply("Voice channel user limit changed.");
      console.log(`Voice channel name changed to ${newVCUserLimit}`);
    }
  },
};
