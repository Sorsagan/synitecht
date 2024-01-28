require("dotenv/config");
require("colors");
const { GiveawaysManager } = require("discord-giveaways");
const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const fs = require("fs");
const { joinVoiceChannel } = require("@discordjs/voice");
const voiceChannelSchema = require("./schemas/voiceChannelSchema");
const channelTimeoutSchema = require("./schemas/channelTimeoutSchema");
const voiceChannelOwnerSchema = require("./schemas/voiceChannelOwnerSchema");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
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
  setTimeout(() => {
    cleanupGiveaways(client);
    setInterval(() => cleanupGiveaways(client), 60 * 60 * 1000);
  }, 5000);
});

client.on("voiceStateUpdate", async (oldState, newState) => {
  const dataVC = await voiceChannelSchema.findOne({
    guildId: newState.guild.id,
  });
  if (!dataVC) return;
  try {
    if (newState.channelId === dataVC.channelId) {
      // Check if the user already has a channel
      const existingChannel = await voiceChannelOwnerSchema.findOne({
        userId: newState.member.user.id,
        guildId: newState.guild.id,
      });
      if (existingChannel) {
        // The user already has a channel, so don't create a new one
        return;
      }

      const username = newState.member.user.username;
      const newChannel = await newState.guild.channels.create({
        name: `${username}'s Channel`,
        type: 2,
        permissionOverwrites: [
          {
            id: newState.guild.roles.everyone,
            deny: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.Connect,
            ],
          },
          {
            id: newState.member.user.id,
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.Connect,
            ],
          },
        ],
      });
      newState.setChannel(newChannel);

      await voiceChannelOwnerSchema.create({
        channelId: newChannel.id,
        userId: newState.member.user.id,
        guildId: newChannel.guild.id,
      });
    }
    if (
      oldState.channel &&
      oldState.channel.name === `${oldState.member.user.username}'s Channel`
    ) {
      await channelTimeoutSchema.create({
        channelId: oldState.channelId,
        timeout: Date.now() + 60000,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

setInterval(async () => {
  const channels = await channelTimeoutSchema.find({});
  channels.forEach(async (channelData) => {
    if (Date.now() >= channelData.timeout) {
      const channel = client.channels.cache.get(channelData.channelId);
      if (channel) {
        if (channel.members.size === 0) {
          console.log(`Timeout for channel ${channelData.channelId}. Channel has ${channel.members.size} members.`);
          await channel.delete();
          await channelTimeoutSchema.deleteOne({
            channelId: channelData.channelId,
          });
          await voiceChannelOwnerSchema.deleteOne({
            channelId: channelData.channelId,
          });
        }
      } else {
        // The channel doesn't exist, so just delete the database entries
        await channelTimeoutSchema.deleteOne({
          channelId: channelData.channelId,
        });
        await voiceChannelOwnerSchema.deleteOne({
          channelId: channelData.channelId,
        });
      }
    }
  });
}, 60000);
eventHandler(client);

client.login(process.env.TOKEN);
