// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=et_bzG3WJDg)

const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exceptions = []) => {
  let localContextMenus = [];
  const menuFiles = getAllFiles(path.join(__dirname, "..", "contextmenus"));

  for (const menuFile of menuFiles) {
    const menuObject = require(menuFile);

    if (exceptions.includes(menuObject.name)) continue;
    localContextMenus.push(menuObject);
  }
  return localContextMenus;
};
