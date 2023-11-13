const { testServerId } = require("../../config.json");
const commandComparing = require("../../utils/commandComparing");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client) => {
  try {
    const [localCommands, applicationCommands] = await Promise.all([
      getLocalCommands(),
      getApplicationCommands(client, testServerId),
    ]);
    for (localCommand of localCommands) {
      const { data, deleted } = localCommand;
      const {
        name: commandName,
        description: commandDescription,
        options: commandOptions,
      } = data;
      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === commandName
      );
      if (deleted) {
        if (existingCommand) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${existingCommand.name}`.red);
        } else {
          console.log(`Skipped command ${existingCommand.name}`.grey);
        }
      } else if (existingCommand) {
        if (commandComparing(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            name: commandName,
            description: commandDescription,
            options: commandOptions,
          });
          console.log(`Updated command ${existingCommand.name}`.yellow);
        }
      } else {
        await applicationCommands.create({
          name: commandName,
          description: commandDescription,
          options: commandOptions,
        });
        console.log(`Registered command ${commandName}`.green);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
