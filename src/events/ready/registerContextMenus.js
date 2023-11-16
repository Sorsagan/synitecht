const { testServerId } = require("../../config.json");
const getApplicationContextMenus = require("../../utils/getApplicationCommands");
const getLocalContextMenus = require("../../utils/getlocalContextMenus");

module.exports = async (client) => {
  try {
    const localContextMenus = getLocalContextMenus();
    const applicationContextMenus = await getApplicationContextMenus(client);// testServerId
    for (const localContextMenu of localContextMenus) {
      const { data } = localContextMenu;

      const contextMenuName = data.name;
      const contextMenuType = data.type;

      const existingContextMenu = await applicationContextMenus.cache.find(
        (cmd) => cmd.name === contextMenuName
      );
      if (existingContextMenu) {
        if (localContextMenu.deleted) {
          await applicationContextMenus.delete(existingContextMenu.id);
          console.log(`Deleted command ${contextMenuName}`.red);
          continue;
        }
    } else {
        if (localContextMenu.deleted) {
          console.log(`Skipped command ${contextMenuName}`.grey);
          continue;
        }

        await applicationContextMenus.create({ name: contextMenuName, type: contextMenuType });
        console.log(`Registered command ${contextMenuName}`.green);
    }
    }
  } catch (error) {
    console.log(`CTMError: ${error}`);
  }
};
