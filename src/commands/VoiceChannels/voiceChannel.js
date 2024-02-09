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
  userPermissions: [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageRoles,
  ],
  botPermissions: [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageRoles,
  ],

  run: async (client, interaction) => {
    try {
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
          return interaction.reply({
            content: `The main voice channel has been set to ${
              interaction.options.getChannel("channel").name
            }.`,
            ephemeral: true,
          });
        }
        if (dataVC) {
          if (dataVC.channelId === interaction.options.getChannel("channel").id)
            return interaction.reply({
              content:
                "The channel you mentioned is already the main voice channel.",
              ephemeral: true,
            });
          await voiceChannelSchema.findOneAndUpdate(
            {
              guildId: interaction.guild.id,
            },
            {
              channelId: interaction.options.getChannel("channel").id,
            }
          );
          return interaction.reply({
            content: `The main voice channel has been set to ${
              interaction.options.getChannel("channel").name
            }.`,
            ephemeral: true,
          });
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
        let dataOwnerVC = await voiceChannelOwnerSchema.findOne({
          guildId: interaction.guild.id,
          channelId: interaction.member.voice.channel.id,
        });
        if (!dataVC)
          return interaction.reply({
            content: "There is no main voice channel set.",
            ephemeral: true,
          });
        if (!dataOwnerVC)
          return interaction.reply({
            content: "You don't have a voice channel.",
            ephemeral: true,
          });
        if (dataOwnerVC.channelId !== interaction.member.voice.channelId)
          return interaction.reply({
            content: "You are not the owner of this voice channel.",
            ephemeral: true,
          });
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
              }\n**Voice Chat Owner**: ${
                user ? user.user.username : "Unknown"
              }\n`
            );

          interaction.reply({
            embeds: [embed],
            components: [embedBtns],
            ephemeral: true,
          });
          setTimeout(async () => {
            if (interaction.message) {
              const disabledBtns = new ButtonBuilder()
                .setCustomId("voiceChannelSettingsBtn")
                .setLabel("Settings")
                .setStyle(ButtonStyle.Secondary)
                .setEmoji("⚙️")
                .setDisabled(true);
              new ButtonBuilder()
                .setCustomId("voiceChannelDeleteBtn")
                .setLabel("Delete")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("🗑️")
                .setDisabled(true);
              new ButtonBuilder()
                .setCustomId("cancelBtn")
                .setLabel("Cancel")
                .setStyle(ButtonStyle.Danger)
                .setEmoji("❌")
                .setDisabled(true);

              const newRow = new ActionRowBuilder().setComponents(disabledBtns);

              await interaction.editReply({
                components: [newRow],
                ephemeral: true,
              });
            }
          }, 30000);
        }
      }

      if (
        interaction.options.getSubcommand() === "add" ||
        interaction.options.getSubcommand() === "remove"
      ) {
        if (!interaction.member.voice.channel) {
          return interaction.reply({
            content: "You must be in a voice channel to use this command.",
            ephemeral: true,
          });
        }
        let dataOwnerVC = await voiceChannelOwnerSchema.findOne({
          guildId: interaction.guild.id,
          channelId: interaction.member.voice.channel.id,
        });
        const user = interaction.options.getUser("user");
        const channel = interaction.guild.channels.cache.get(
          dataOwnerVC.channelId
        );

        if (channel && user) {
          if (interaction.options.getSubcommand() === "add") {
            await channel.permissionOverwrites.create(user.id, {
              Connect: true,
            });
            interaction.reply({
              content: `Added ${user.username} to the voice channel.`,
              ephemeral: true,
            });
          } else if (interaction.options.getSubcommand() === "remove") {
            await channel.permissionOverwrites.create(user.id, {
              Connect: false,
            });
            interaction.reply({
              content: `Removed ${user.username} from the voice channel.`,
              ephemeral: true,
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
      interaction.reply({
        content: "An error occurred while executing this command.",
        ephemeral: true,
      });
    }
  },
};
