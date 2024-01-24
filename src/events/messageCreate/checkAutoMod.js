const autoModerationSchema = require("../../schemas/autoModeration");
const { DiscordAPIError } = require("discord.js");

// Set to keep track of processed message IDs
const processedMessages = new Set(); // need to find a way to clear this set
let userTimestamps = new Map();

module.exports = async (client) => {
  client.on("messageCreate", async (message) => {
    // Check if the message has already been processed
    if (processedMessages.has(message.id)) return;

    // Add the message ID to the set to mark it as processed
    processedMessages.add(message.id);

    if (message.author.bot) return;
    if (!message.guild) return;

    const dataAutoMod = await autoModerationSchema.findOne({
    guildId: message.guild.id,
    });

    if (!dataAutoMod) return;

    const deleteMessage = async (reason) => {
        try {
          const logChannel = message.guild.channels.cache.get(dataAutoMod.logchannel);
          const content = message.content;
          const author = message.author.tag;
          await message.delete();
          logChannel.send(`Deleted a message containing a ${reason} from ${author}:\n\`\`\`${content}\`\`\``);
        } catch (error) {
          if (error instanceof DiscordAPIError && error.code === 10008) {
            console.log("Message was already deleted.");
          } else {
            throw error;
          }
        }
      };

    if (dataAutoMod.deleteLinks && message.content.includes("http")) {
      await deleteMessage("link");
      return;
    }

    if (dataAutoMod.deleteInvites && message.content.includes("discord.gg")) {
      await deleteMessage("invite");
      return;
    }

    if (
      dataAutoMod.deleteMassMentions &&
      (message.mentions.users.size > 5 || message.mentions.roles.size > 5)
    ) {
      await deleteMessage("mass mention");
      return;
    }

    if (dataAutoMod.blockSpam) {
      let user = message.author.id;
      let now = Date.now();

      if (!userTimestamps.has(user)) {
        userTimestamps.set(user, [now]);
      } else {
        let timestamps = userTimestamps.get(user);
        timestamps.push(now);
        // Remove timestamps older than 5 seconds
        timestamps = timestamps.filter((timestamp) => now - timestamp < 5000);
        userTimestamps.set(user, timestamps);
        // If the user has sent more than 5 messages in the last 5 seconds, consider it spam
        if (timestamps.length > 5) {
          await deleteMessage("spam");
          return;
        }
      }
    }
  });
};
