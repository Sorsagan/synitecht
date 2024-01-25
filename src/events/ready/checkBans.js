const { Collection } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = async (client) => {
  setInterval(async () => {
    // Fetch all bans from the database
    const bans = await moderationSchema.find({ type: "tempban" });

    // Iterate over each ban
    bans.forEach(async (ban) => {
      // Calculate the end time
      const endTime = ban.expirationTime.getTime();

      // Check if the ban has expired
      if (Date.now() > endTime) {
        // Fetch the guild and the user
        const guild = client.guilds.cache.get(ban.guildId);
        const user = await client.users.fetch(ban.userId);

        // Unban the user
        guild.members.unban(user);

        // Remove the ban from the database
        await moderationSchema.deleteOne({ _id: ban._id });
      }
    });
  }, 300000); // Run this every 5 minutes
};
