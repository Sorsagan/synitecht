const {
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const voiceChannelOwnerSchema = require("../schemas/voiceChannelOwnerSchema");

module.exports = {
  customId: "voiceChannelSettingsBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });
    const guild = client.guilds.cache.get(interaction.guildId);
    const member = guild.members.cache.get(interaction.user.id);
    const voiceChannel = member.voice.channel;
    const voiceChannelOwner = await voiceChannelOwnerSchema.findOne({
      guildId: guild.id,
      voiceChannelId: voiceChannel.id,
    });
    if (!voiceChannelOwner)
      return interaction.followUp({
        content: `You are not the owner of this voice channel.`,
        ephemeral: true,
      });
    const channel = client.channels.cache.get(voiceChannelOwner.channelId);
    const everyoneRole = guild.roles.everyone;
    const permissions = channel.permissionsFor(everyoneRole);
    const isConnectableByEveryone = permissions.has(
      PermissionFlagsBits.Connect
    );
    const voiceChannelSettingsEmbed = new EmbedBuilder()
      .setTitle(`Voice Channel Settings`)
      .addFields(
        {
          name: `**Voice Channel Settings**`,
          value: `**Voice Channel Name:** ${channel.name}`,
        },
        {
          name: `**Voice Channel Bitrate:**`,
          value: `${channel.bitrate}`,
        },
        {
          name: `**Voice Channel User Limit:**`,
          value: `${channel.userLimit}`,
        },
        {
          name: `**Voice Channel Lock:**`,
          value: `${isConnectableByEveryone ? "Unlocked" : "Locked"}`,
        }
      )
      .setColor("#0099ff")
      .setTimestamp();
    const embedBtns = new ActionRowBuilder().setComponents(
      new ButtonBuilder()
        .setCustomId("voiceChannelSettingsChannelNameBtn")
        .setLabel("Channel Name")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("📝"),
      new ButtonBuilder()
        .setCustomId("voiceChannelSettingsLockStatusBtn")
        .setLabel("Lock Status")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("🔒"),
      new ButtonBuilder()
        .setCustomId("voiceChannelSettingsUserLimitBtn")
        .setLabel("User Limit")
        .setStyle(ButtonStyle.Secondary)
        .setEmoji("👥")
    );
    await interaction.followUp({
      embeds: [voiceChannelSettingsEmbed],
      components: [embedBtns],
      ephemeral: true,
    });

    setTimeout(async () => {
      const disabledBtns = new ActionRowBuilder().setComponents(
        new ButtonBuilder()
          .setCustomId("voiceChannelSettingsChannelNameBtn")
          .setLabel("Channel Name")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("📝")
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("voiceChannelSettingsLockStatusBtn")
          .setLabel("Lock Status")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("🔒")
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId("voiceChannelSettingsUserLimitBtn")
          .setLabel("User Limit")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("👥")
          .setDisabled(true)
      );

      if (interaction.message) {
        await interaction.editReply({
          embeds: [voiceChannelSettingsEmbed],
          components: [disabledBtns],
          ephemeral: true,
        });
      }
    }, 30000);

    return await interaction.message.delete();
  },
};
