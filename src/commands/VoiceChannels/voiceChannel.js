const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const voiceChannelSchema = require("../../schemas/voiceChannelSchema");
const voiceChannelOwnerSchema = require("../../schemas/voiceChannelOwnerSchema");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("voicechat")
    .setDescription("Commands related to voicechat.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set the main voice channel.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to set as main voice channel.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("dashboard")
        .setDescription("Dashboard for voicechat settings.")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add a user to the voice channel.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to add to the voice channel.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("remove")
        .setDescription("Remove a user from the voice channel.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user to remove from the voice channel.")
            .setRequired(true)
        )
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
  testMode: true,
  devOnly: true,

  run: async (client, interaction) => {
    if (interaction.options.getSubcommand() === "set") {
      const channel = interaction.options.getChannel("channel");
      if (channel.type !== 2)
        return interaction.reply({
          content: `This channel is not a voice channel. Please select a voice channel.`,
          ephemeral: true,
        });
      let dataVC = await voiceChannelSchema.findOne({
        guildId: interaction.guild.id,
      });
      if (!dataVC) {
        dataVC = await voiceChannelSchema.create({
          guildId: interaction.guild.id,
          channelId: interaction.options.getChannel("channel").id,
        });
        interaction.reply(
          `The main voice channel has been set to ${
            interaction.options.getChannel("channel").name
          }.`
        );
      }
      if (dataVC) {
        if (dataVC.channelId === interaction.options.getChannel("channel").id)
          return interaction.reply(
            "The channel you mentioned is already the main voice channel."
          );
        await voiceChannelSchema.findOneAndUpdate(
          {
            guildId: interaction.guild.id,
          },
          {
            channelId: interaction.options.getChannel("channel").id,
          }
        );
        interaction.reply(
          `The main voice channel has been set to ${
            interaction.options.getChannel("channel").name
          }.`
        );
      }
    }
    if (interaction.options.getSubcommand() === "dashboard") {
      if (!interaction.member.voice.channel) {
        return interaction.reply({
          content: "You must be in a voice channel to use this command.",
          ephemeral: true,
        });
      }
      let dataVC = await voiceChannelSchema.findOne({
        guildId: interaction.guild.id,
      });
      let dataOwnerVC = await voiceChannelOwnerSchema.findOne();
      if (!dataVC)
        return interaction.reply("There is no main voice channel set.");
      if (dataVC) {
        const embedBtns = new ActionRowBuilder().setComponents(
          new ButtonBuilder()
            .setCustomId("voiceChannelSettingsBtn")
            .setLabel("Settings")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("⚙️"),
          new ButtonBuilder()
            .setCustomId("voiceChannelDeleteBtn")
            .setLabel("Delete")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("🗑️"),
          new ButtonBuilder()
            .setCustomId("cancelBtn")
            .setLabel("Cancel")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("❌")
        );
        const channel = interaction.guild.channels.cache.get(
          dataOwnerVC.channelId
        );
        const user = interaction.guild.members.cache.get(dataOwnerVC.userId);
        const embed = new EmbedBuilder()
          .setTitle("Voice Channel Dashboard")
          .setColor(mConfig.embedColorInfo)
          .setDescription(
            `**Voice Chat Name**: ${
              channel ? channel.name : "Unknown"
            }\n**Voice Chat Owner**: ${user ? user.user.username : "Unknown"}\n`
          );

        return interaction.reply({
          embeds: [embed],
          components: [embedBtns],
        });
      }
    }
    if (interaction.options.getSubcommand() === "add") {
      let dataOwnerVC = await voiceChannelOwnerSchema.findOne();
      const user = interaction.options.getUser("user");
      const channel = interaction.guild.channels.cache.get(
        dataOwnerVC.channelId
      );

      if (channel && user) {
        await channel.permissionOverwrites.create(user.id, { Connect: true });
        interaction.reply(`Added ${user.username} to the voice channel.`);
      }
    }
    if (interaction.options.getSubcommand() === "remove") {
      let dataOwnerVC = await voiceChannelOwnerSchema.findOne();
      const user = interaction.options.getUser("user");
      const channel = interaction.guild.channels.cache.get(
        dataOwnerVC.channelId
      );

      if (channel && user) {
        await channel.permissionOverwrites.create(user.id, { Connect: false });
        interaction.reply(`Removed ${user.username} from the voice channel.`);
      }
    }
  },
};
