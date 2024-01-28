const { Collection } = require("discord.js");
const moderationSchema = require("../../schemas/moderation");

module.exports = async (client) => {
  setInterval(async () => {
    const bans = await moderationSchema.find({ type: "tempban" });

    bans.forEach(async (ban) => {
      const endTime = ban.expirationTime.getTime();

      if (Date.now() > endTime) {
        const guild = client.guilds.cache.get(ban.guildId);
        const user = await client.users.fetch(ban.userId);

        guild.members.unban(user);

        await moderationSchema.deleteOne({ _id: ban._id });
      }
    });
  }, 300000);
};