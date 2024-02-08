// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=et_bzG3WJDg)

const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exceptions = []) => {
  let buttons = [];
  const buttonFiles = getAllFiles(path.join(__dirname, "..", "buttons"));

  for (const buttonFile of buttonFiles) {
    const buttonObject = require(buttonFile);

    if (exceptions.includes(buttonObject.name)) continue;
    buttons.push(buttonObject);
  }
  return buttons;
};
