const { PermissionFlagsBits, EmbedBuilder} = require("discord.js");
const moderationSchema = require("../../schemas/moderation");
const mConfig = require("../../messageConfig.json");

module.exports = {
    customId: 'banBtn',
    userPermissions: [],
    botPermissions: [PermissionFlagsBits.BanMembers],

    run: async (client, interaction) => {
        const{ message, channel, guildId, guild, user } = interaction;

        const embedAuthor = message
    }
}