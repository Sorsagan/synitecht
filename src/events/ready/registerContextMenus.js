require('colors')
const { testServerId } = require("../../config.json");
const getApplicationContextMenus = require("../../utils/getApplicationCommands");
const getLocalContextMenus = require("../../utils/getLocalContextMenus");

module.exports = async (client) => {
  try {
    const [localContextMenus, applicationContextMenus] = await Promise.all([
      getLocalContextMenus(),
      getApplicationContextMenus(client, testServerId),
    ])

    for(const localContextMenu of localContextMenus) {
      const { data, deleted } = localContextMenu;
      const {
        name: contextMenuName,
        type: contextMenuType,
      } = data;   

      const existingContextMenu = await applicationContextMenus.cache.find((cmd) => cmd.name === contextMenuName);

      if(deleted){
        if(existingContextMenu){
          await applicationContextMenus.delete(existingContextMenu.id);
          console.log(`Deleted context menu ${contextMenuName}`.red);
        }else{
          console.log(`Skipped context menu ${contextMenuName}`.grey);
        }
      } else if (existingContextMenu){
        if(existingContextMenu.type !== contextMenuType){
          await applicationContextMenus.edit(existingContextMenu.id, {name: contextMenuName, type: contextMenuType});
          console.log(`Edited context menu ${contextMenuName}`.yellow);
      }
    } else{
      await applicationContextMenus.create({name: contextMenuName, type: contextMenuType});
      console.log(`Registered context menu ${contextMenuName}`.green);
    }
  }
  } catch (error) {
    console.log(error);
  }
}