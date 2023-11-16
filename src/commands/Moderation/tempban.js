const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");
const messageConfig = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tempban")
    .setDescription("Temporarily bans the mentioned user.")
    .setDMPermission(false)
    .addUserOption((user) =>
    user
    .setName("target")
    .setDescription("The user to tempban.")
    .setRequired(true)
    )
    .addStringOption((option) =>
    option
    .setName("duration")
    .setDescription("Duration of the ban.")
    .setRequired(true)
    )
    .addStringOption((option) =>
    option
    .setName("reason")
    .setDescription("Reason for banning the user.")
    )
    .toJSON(),
    userPermissions: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],

    run: (client, interaction) => {
      const { options, guild } = interaction;
      const target = options.getMember("target");
      const duration = options.getString("duration");
      let durationInMs;
      const reason = options.getString("reason") || "No reason provided.";
      if (target === null || !target) {
        return interaction.reply("The user you mentioned is not a valid user.");// This means the target isn't in the server.
      } else if (target.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply(messageConfig.hasHigherRolePosition);// This means the target has a higher role than the user.
      } else if (target.id === interaction.user.id) {
        return interaction.reply(messageConfig.unableToInteractWithYourself);//Self explanatory.
      } else {    
        if (target && target.bannable) {
          switch (duration.slice(-1)) {
            case 's': // seconds
              durationInMs = parseInt(duration) * 1000;
              break;
            case 'm': // minutes
              durationInMs = parseInt(duration) * 60 * 1000;
              break;
            case 'h': // hours
              durationInMs = parseInt(duration) * 60 * 60 * 1000;
              break;
            case 'd': // days
              durationInMs = parseInt(duration) * 24 * 60 * 60 * 1000;
              break;
            case 'w': // weeks
              durationInMs = parseInt(duration) * 7 * 24 * 60 * 60 * 1000;
              break;
            default:
              return interaction.reply('Invalid duration. Please specify the duration in seconds (s), minutes (m), hours (h), days (d), or weeks (w).');
          }
          dataTemp = new moderationSchema({
            userId: target.id,
            guildId: guild.id,
            reason: reason,
            staffId: interaction.user.id,
            expirationTime: new Date(Date.now() + durationInMs),
            type: "tempban",
          })
          dataTemp.save();
          target.ban({ reason: reason });
          return interaction.reply(`${target} has been banned.\nReason: ${reason}`);
    }}}
};