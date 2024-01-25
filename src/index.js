require("dotenv/config");
require("colors");
const { GiveawaysManager } = require("discord-giveaways");
const { Client, GatewayIntentBits } = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const fs = require("fs");
const { joinVoiceChannel } = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

client.giveawaysManager = new GiveawaysManager(client, {
  storage: "./giveaways.json",
  updateCountdownEvery: 5000,
  default: {
    botsCanWin: false,
    exemptPermissions: [],
    embedColor: "#FF0000",
    reaction: "🎉",
  },
});

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

client.once("ready", () => {
  joinVoiceChannel({
    channelId: "1200133117533491280",
    guildId: "882383171323314186",
    adapterCreator:
      client.guilds.cache.get("882383171323314186").voiceAdapterCreator,
  });
  // Wait for 5 seconds before cleaning up giveaways
  setTimeout(() => {
    cleanupGiveaways(client);
    setInterval(() => cleanupGiveaways(client), 60 * 60 * 1000);
  }, 5000);
});

eventHandler(client);

client.login(process.env.TOKEN);
