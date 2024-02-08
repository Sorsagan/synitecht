// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=et_bzG3WJDg)

module.exports = async (client, guildId) => {
  let applicationCommands = [];

  if (guildId) {
    const guild = await client.guilds.fetch(guildId);
    applicationCommands = guild.commands;
  } else {
    applicationCommands = client.application.commands;
  }
  await applicationCommands.fetch();
  return applicationCommands;
};
