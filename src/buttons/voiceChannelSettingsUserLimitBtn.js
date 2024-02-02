const { PermissionFlagsBits, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  customId: "voiceChannelSettingsUserLimitBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const changeUserLimitModal = new ModalBuilder()
    .setTitle("Change Voice Channel User Limit")
    .setCustomId("chanegeuserlimit_modal")
    .setComponents(
        new ActionRowBuilder().setComponents(
            new TextInputBuilder()
            .setCustomId("new_user_limit")
            .setLabel("New Voice Channel User Limit")
            .setPlaceholder("Enter a new voice channel user limit.")
            .setStyle(TextInputStyle.Short)
            .setMinLength(1)
            .setMaxLength(2)
            .setRequired(true)
        )
    )
    return await interaction.showModal(changeUserLimitModal);
  },
};
