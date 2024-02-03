const fs = require("fs");
module.exports = async (client) => {
  function cleanupGiveaways(client) {
    console.log("Cleaning up giveaways...".random);
    const activeGiveaways = client.giveawaysManager.giveaways
      .filter((g) => !g.ended)
      .map((g) => ({
        messageID: g.messageID,
        channelID: g.channelID,
        guildID: g.guildID,
        startAt: g.startAt,
        endAt: g.endAt,
        ended: g.ended,
        winnerCount: g.winnerCount,
        prize: g.prize,
        messages: g.messages,
        hostedBy: g.hostedBy,
        pause: g.pause,
        setEndTimestamp: g.setEndTimestamp,
        botsCanWin: g.botsCanWin,
        exemptPermissions: g.exemptPermissions,
        bonusEntries: g.bonusEntries,
        extraData: g.extraData,
        lastChance: g.lastChance,
        embedColor: g.embedColor,
        embedColorEnd: g.embedColorEnd,
        reaction: g.reaction,
      }));
    console.log(`Found ${activeGiveaways.length} active giveaways.`.green);
    fs.writeFileSync(
      "./giveaways.json",
      JSON.stringify(activeGiveaways, null, 2)
    );
    console.log("Ended Giveaways cleaned up!".rainbow);
  }
  setTimeout(() => {
    cleanupGiveaways(client);
    setInterval(() => cleanupGiveaways(client), 60 * 60 * 1000);
  }, 5000);
};
