require("dotenv/config")
const { GiveawaysManager } = require('discord-giveaways');
const { Client, GatewayIntentBits } = require("discord.js")
const eventHandler = require("./handlers/eventHandler");

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
    storage: './giveaways.json',
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: '#FF0000',
        reaction: '🎉'
    }
  });

eventHandler(client);

client.login(process.env.TOKEN);