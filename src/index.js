require("dotenv/config");
require("colors");
const {
  Client,
  GatewayIntentBits,
  PermissionFlagsBits,
  Partials,
} = require("discord.js");
const eventHandler = require("./handlers/eventHandler");
const { GiveawaysManager } = require("discord-giveaways");
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
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.User, Partials.Channel, Partials.Message],
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
        const existingVoiceChannel = newState.guild.channels.cache.get(
          existingChannel.channelId
        );
        if (existingVoiceChannel) {
          newState.member.voice.setChannel(existingVoiceChannel);
        }
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
    const userChannel = await voiceChannelOwnerSchema.findOne({
      userId: oldState.member.user.id,
    });
    if (
      oldState.channel &&
      userChannel &&
      oldState.channel.id === userChannel.channelId
    ) {
      const existingTimeout = await channelTimeoutSchema.findOne({
        channelId: oldState.channelId,
      });

      if (existingTimeout) {
        // Update the existing timeout
        existingTimeout.timeout = Date.now() + 60000;
        await existingTimeout.save();
      } else {
        // Create a new timeout
        await channelTimeoutSchema.create({
          channelId: oldState.channelId,
          timeout: Date.now() + 60000,
        });
      }
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
          console.log(
            `Timeout for channel ${channelData.channelId}. Channel has ${channel.members.size} members.`
          );
          try {
            await channel.delete();
          } catch (error) {
            console.error(`Failed to delete channel: ${error}`);
          }
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
