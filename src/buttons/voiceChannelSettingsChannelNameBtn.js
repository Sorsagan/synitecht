const { PermissionFlagsBits, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");

module.exports = {
  customId: "voiceChannelSettingsChannelNameBtn",
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const changeNameModal = new ModalBuilder()
    .setTitle("Change Voice Channel Name")
    .setCustomId("chanegename_modal")
    .setComponents(
        new ActionRowBuilder().setComponents(
            new TextInputBuilder()
            .setCustomId("new_vc_name")
            .setLabel("New Voice Channel Name")
            .setPlaceholder("Enter a new voice channel name.")
            .setStyle(TextInputStyle.Short)
            .setMinLength(2)
            .setMaxLength(100)
            .setRequired(true)
        )
    )
    return await interaction.showModal(changeNameModal);
  },
};
