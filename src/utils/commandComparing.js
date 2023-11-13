module.exports = (existingCommand, localCommand) => {
  const {
    name: existingName,
    description: existingDescription,
    options: existingOptions = [],
  } = existingCommand;
  const {
    data: {
      name: localName,
      description: localDescription,
      options: localOptions = [],
    },
  } = localCommand;
  const hasDifference = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
  const checkOptions = (existingOptions, localOptions) => {
    return localOptions.some((localOption) => {
      const existingOption = existingOptions.find(
        (opt) => opt.name === localOption.name
      );
      if (!existingOption) return true;
      return hasDifference(localOption, existingOption);
    });
  };
  if (
    existingName !== localName ||
    existingDescription !== localDescription ||
    checkOptions(existingOptions, localOptions)
  ) {
    return true;
  }
  return false;
};
