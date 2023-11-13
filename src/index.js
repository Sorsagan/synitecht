require("dotenv/config")

const { Client, GateawayIntentBits } = require("discord.js")
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
    intents: [
        GateawayIntentBits.Guilds,
        GateawayIntentBits.GuildMembers,
        GateawayIntentBits.GuildMessages,
        GateawayIntentBits.MessageContent,
    ],
});

eventHandler(client);

client.login(process.env.TOKEN);