const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const { embedColorInfo } = require("../../messageConfig.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverstats")
    .setDescription("Sends an embed with server stats.")
    .setDMPermission(false)
    .toJSON(),
    userPermissions: [PermissionFlagsBits.Administrator],
    botPermissions: [PermissionFlagsBits.Administrator],

    run: (client, interaction) => {
    const embed = new EmbedBuilder()
    .setTitle("Server Stats")
    .setDescription(`Server stats for **${interaction.guild.name}**`)
    .addFields({ name: 'Server ID', value: `${interaction.guild.id}` },
    { name: 'Server Owner', value: `${interaction.guild.ownerId}` },
    { name: 'Server Created', value: `${interaction.guild.createdAt}` },
    { name: 'Server Members', value: `${interaction.guild.memberCount}`},
    { name: 'Server Channels', value: `${interaction.guild.channels.cache.size}` },
    { name: 'Server Roles', value: `${interaction.guild.roles.cache.size}`},
    { name: 'Server Emojis', value: `${interaction.guild.emojis.cache.size}`},
    { name: 'Server Boosts', value: `${interaction.guild.premiumSubscriptionCount}`},
    { name: 'Server Boost Level', value: `${interaction.guild.premiumTier}`},
    )
    .setThumbnail(`${interaction.guild.iconURL({ dynamic: true })}`)
    .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.avatarURL({ dynamic: true })}` })
    .setColor(`${embedColorInfo}`)
    return interaction.reply({ embeds: [embed] });
    }
};
