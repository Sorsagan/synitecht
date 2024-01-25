const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout the mentioned user.")
    .setDMPermission(false)
    .addUserOption((user) =>
      user
        .setName("target")
        .setDescription("The user to timeout.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("duration")
        .setDescription("Duration of the ban.")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reason").setDescription("Reason for banning the user.")
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.ModerateMembers],
  botPermissions: [PermissionFlagsBits.ModerateMembers],

  run: (client, interaction) => {
    const { options } = interaction;
    const target = interaction.options.getMember("target");
    const duration = options.getString("duration");
    const reason =
      interaction.options.getString("reason") || "No reason provided.";
    let durationInMs;
    if (target === null || !target) {
      return interaction.reply("The user you mentioned is not a valid user."); // This means the target isn't in the server.
    } else if (!target.kickable) {
      return interaction.reply("I cannot timeout that user."); // This means the target either has a higher role than the bot or the target is the bot owner.
    } else if (target.id === interaction.user.id) {
      return interaction.reply("You cannot timeout yourself."); //Self explanatory.
    } else {
      if (target && target.moderatable) {
        switch (duration.slice(-1)) {
          case "s": // seconds
            durationInMs = parseInt(duration) * 1000;
            break;
          case "m": // minutes
            durationInMs = parseInt(duration) * 60 * 1000;
            break;
          case "h": // hours
            durationInMs = parseInt(duration) * 60 * 60 * 1000;
            break;
          case "d": // days
            durationInMs = parseInt(duration) * 24 * 60 * 60 * 1000;
            break;
          case "w": // weeks
            durationInMs = parseInt(duration) * 7 * 24 * 60 * 60 * 1000;
            break;
          default:
            return interaction.reply(
              "Invalid duration. Please specify the duration in seconds (s), minutes (m), hours (h), days (d), or weeks (w)."
            );
        }
        target.timeout(durationInMs, reason);
        return interaction.reply(
          `${target} has been timed out for ${duration}.\nReason: ${reason}`
        );
      }
    }
  },
};
