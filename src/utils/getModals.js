// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=et_bzG3WJDg)

const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exceptions = []) => {
  let modals = [];
  const modalFiles = getAllFiles(path.join(__dirname, "..", "modals"));

  for (const modalFile of modalFiles) {
    const modalObject = require(modalFile);

    if (exceptions.includes(modalObject.name)) continue;
    modals.push(modalObject);
  }
  return modals;
};
