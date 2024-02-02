const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const autoModerationSchema = require("../../schemas/autoModerationSchema");
const mConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("Commands related to automod.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("setup")
        .setDescription("Setup the automod.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("Automod log actions channel.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("settings")
        .setDescription("Change the automod settings.")
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("remove").setDescription("Remove the automod.")
    )

    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],

  run: async (client, interaction) => {
    const channel = interaction.options.getChannel("channel");
    let setupEnabled = interaction.options.getBoolean("enabled");
    const subcmd = interaction.options.getSubcommand();
    let dataAutoMod = await autoModerationSchema.findOne({
      guildId: interaction.guild.id,
    });
    switch (subcmd) {
      case "setup":
        if (!channel || !(channel instanceof TextChannel)) {
          return interaction.reply(
            "The channel you mentioned is not a valid channel."
          );
        } else if (dataAutoMod) {
          return interaction.reply("Automod is already setup.");
        } else if (!dataAutoMod) {
          dataAutoMod = new autoModerationSchema({
            guildId: interaction.guild.id,
            logchannel: channel.id,
            deleteInvites: true,
            deleteLinks: true,
            deleteMassMentions: true,
            blockSpam: true,
          });
          dataAutoMod.save();
          if (setupEnabled === null) {
            setupEnabled = true;
          }
          interaction.guild.channels.cache
            .get(channel.id)
            .send("Automod has been setup in this channel.");
          return interaction.reply(`Automod has been setup in ${channel}.`);
        }
        break;
      case "remove":
        if (dataAutoMod) {
          autoModerationSchema
            .findOneAndDelete({ guildId: interaction.guild.id })
            .then(() => {
              return interaction.reply("Automod has been removed.");
            });
        } else {
          return interaction.reply("Automod is not setup.");
        }
        break;
      case "settings":
        if (!dataAutoMod) {
          return interaction.reply("Automod is not setup.");
        } else if (dataAutoMod) {
          const embedBtns = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
              .setCustomId("deleteInvitesBtn")
              .setLabel("Delete Invites")
              .setStyle(ButtonStyle.Danger)
              .setEmoji("📩"),
            new ButtonBuilder()
              .setCustomId("deleteLinksBtn")
              .setLabel("Delete Links")
              .setStyle(ButtonStyle.Danger)
              .setEmoji("🔗"),
            new ButtonBuilder()
              .setCustomId("deleteMassMentionsBtn")
              .setLabel("Delete Mass Mentions")
              .setStyle(ButtonStyle.Danger)
              .setEmoji("🗣️"),
            new ButtonBuilder()
              .setCustomId("blockSpamBtn")
              .setLabel("Block Spam")
              .setStyle(ButtonStyle.Danger)
              .setEmoji("🚫"),
            new ButtonBuilder()
              .setCustomId("cancelBtn")
              .setLabel("Cancel")
              .setStyle(ButtonStyle.Secondary)
              .setEmoji("❌")
          );
          const embed = new EmbedBuilder()
            .setTitle("Auto Mod Settings")
            .setColor(mConfig.embedColorInfo)
            .setDescription(
              `**Delete Invites:** ${dataAutoMod.deleteInvites}\n**Delete Links:** ${dataAutoMod.deleteLinks}\n**Delete Mass Mentions:** ${dataAutoMod.deleteMassMentions}\n**Block Spam:** ${dataAutoMod.blockSpam}`
            );
          return interaction.reply({
            embeds: [embed],
            components: [embedBtns],
          });
        }
        break;
    }
  },
};
