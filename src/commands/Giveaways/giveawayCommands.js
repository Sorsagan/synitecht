const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Commands related to giveaways.")
    .setDMPermission(false)
    .addSubcommand((subcommand) =>
      subcommand
        .setName("create")
        .setDescription("Create a giveaway.")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The channel to create the giveaway in.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("prize")
            .setDescription("The prize of the giveaway.")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("winners")
            .setDescription("The amount of winners of the giveaway.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("duration")
            .setDescription("The duration of the giveaway.")
            .setRequired(true)
        )
        .addRoleOption((option) =>
          option
            .setName("role")
            .setDescription("Only people with this role can win the giveaway.")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("end")
        .setDescription("End a giveaway.")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message ID of the giveaway.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("reroll")
        .setDescription("Reroll a giveaway.")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message ID of the giveaway.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("delete")
        .setDescription("Delete a giveaway.")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message ID of the giveaway.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("pause")
        .setDescription("Pause a giveaway.")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message ID of the giveaway.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("resume")
        .setDescription("Resume a giveaway.")
        .addStringOption((option) =>
          option
            .setName("message-id")
            .setDescription("The message ID of the giveaway.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("list").setDescription("List all giveaways.")
    )
    .toJSON(),
  userPermissions: [PermissionFlagsBits.Administrator],
  botPermissions: [PermissionFlagsBits.Administrator],
  testMode: true,
  devOnly: true,

  run: (client, interaction) => {
    const subcommand = interaction.options.getSubcommand(true);
    if (subcommand === "create") {
      const channel = interaction.options.getChannel("channel");
      const prize = interaction.options.getString("prize");
      const winners = interaction.options.getInteger("winners");
      const duration = interaction.options.getString("duration");
      const durationMs = ms(duration);
      const role = interaction.options.getRole("role");
      if (channel.type !== 0)
        return interaction.reply({
          content: "The channel you mentioned is not a text channel.",
          ephemeral: true,
        });
      client.giveawaysManager
        .start(channel, {
          prize: prize,
          winnerCount: winners,
          duration: durationMs,
          hostedBy: interaction.user,
          messages: {
            giveaway: "🎉🎉 **GIVEAWAY** 🎉🎉",
            giveawayEnded: "🎉🎉 **GIVEAWAY ENDED** 🎉🎉",
            timeRemaining: "Time remaining: **{duration}**!",
            inviteToParticipate: `React with 🎉 to participate!${
              role ? ` Only members with the ${role.name} role can win.` : ""
            }`, //if role is specified in giveaway it supposed to print out but it dont fix it
            winMessage: "Congratulations, {winners}! You won **{this.prize}**!",
            embedFooter: "Giveaways",
            noWinner: "Giveaway cancelled, no valid participations.",
            hostedBy: "Hosted by: {this.hostedBy}",
            winners: "winner(s)",
            endedAt: "Ended at",
            units: {
              seconds: "seconds",
              minutes: "minutes",
              hours: "hours",
              days: "days",
              pluralS: false,
            },
            exemptMembers: (member) => {
              if (role && !member.roles.cache.has(role.id)) {
                // i guess it work??
                return true;
              }
              return false;
            },
          },
        })
        .catch((err) => {
          console.error(err);
          interaction.reply({
            content: "An error occurred while trying to start the giveaway.",
            ephemeral: true,
          });
        });
      interaction.reply({ content: "Giveaway created.", ephemeral: true });
    } else if (subcommand === "end") {
      const messageID = interaction.options.getString("message-id");
      client.giveawaysManager
        .edit(messageID, {
          setEndTimestamp: Date.now(),
        })
        .then(() => {
          interaction.reply({ content: "Giveaway ended.", ephemeral: true });
        })
        .catch((err) => {
          interaction.reply({
            content:
              "No giveaway found for " +
              messageID +
              ", please check and try again",
            ephemeral: true,
          });
        });
    } else if (subcommand === "reroll") {
      const messageID = interaction.options.getString("message-id");
      client.giveawaysManager
        .reroll(messageID)
        .then(() => {
          interaction.reply({ content: "Giveaway rerolled.", ephemeral: true });
        })
        .catch((err) => {
          interaction.reply({
            content:
              "No giveaway found for " +
              messageID +
              ", please check and try again",
            ephemeral: true,
          });
        });
    } else if (subcommand === "delete") {
      const messageID = interaction.options.getString("message-id");
      client.giveawaysManager
        .delete(messageID)
        .then(() => {
          interaction.reply({ content: "Giveaway deleted.", ephemeral: true });
        })
        .catch((err) => {
          interaction.reply({
            content:
              "No giveaway found for " +
              messageID +
              ", please check and try again",
            ephemeral: true,
          });
        });
    } else if (subcommand === "pause") {
      const messageID = interaction.options.getString("message-id");
      client.giveawaysManager
        .pause(messageID)
        .then(() => {
          interaction.reply({ content: "Giveaway paused.", ephemeral: true });
        })
        .catch((err) => {
          interaction.reply({
            content:
              "No giveaway found for " +
              messageID +
              ", please check and try again",
            ephemeral: true,
          });
        });
    } else if (subcommand === "resume") {
      const messageID = interaction.options.getString("message-id");
      client.giveawaysManager
        .unpause(messageID)
        .then(() => {
          interaction.reply({ content: "Giveaway resumed.", ephemeral: true });
        })
        .catch((err) => {
          interaction.reply({
            content:
              "No giveaway found for " +
              messageID +
              ", please check and try again",
            ephemeral: true,
          });
        });
    } else if (subcommand === "list") {
      if (!client.giveawaysManager.giveaways.length) {
        interaction.reply({
          content: "No giveaways found.",
          ephemeral: true,
        });
      } else {
        const giveaways = client.giveawaysManager.giveaways.filter(
          (g) => !g.ended
        );
        const giveawaysList = giveaways
          .map(
            (g) =>
              `**Prize:** ${g.prize}\n**Channel:** <#${
                g.channelId
              }>\n**Winners:** ${g.winnerCount}\n**Ends At:** <t:${Math.floor(
                g.endAt / 1000
              )}:R>\n**Message ID:** ${g.messageId}\n`
          )
          .join("\n");
        if (giveawaysList.trim() !== "") {
          interaction.reply({
            content: giveawaysList,
            ephemeral: true,
          });
        } else {
          interaction.reply({
            content: "No active giveaways found.",
            ephemeral: true,
          });
        }
      }
    }
  },
};
