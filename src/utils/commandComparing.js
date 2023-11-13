module.exports = (existingCommand, localCommand) => {
  const changed = (a, b) => JSON.stringify(a) !== JSON.stringify(b);
  if (
    changed(existingCommand.name, localCommand.data.name) ||
    changed(existingCommand.description, localCommand.data.description)
  ) {
    return true;
  }

  const optionsChanged = changed(
    optionsArray(existingCommand),
    optionsArray(localCommand.data)
  );
  return optionsChanged;

  function optionsArray(cmd) {
    const cleanObj = (obj) => {
      for (const key in obj) {
        if (typeof obj[key] === "object") {
          cleanObj(obj[key]);
          if (
            !obj[key] ||
            (Array.isArray(obj[key]) && !obj[key].length === 0)
          ) {
            delete obj[key];
          }
        } else if (obj[key] === undefined) {
          delete obj[key];
        }
      }
    };
    const normalizeObject = (input) => {
      if (Array.isArray(input)) {
        return input.map((item) => normalizeObject(item));
      }

      const normnalizedItem = {
        type: input.type,
        name: input.name,
        description: input.description,
        options: input.options ? normalizeObject(input.options) : undefined,
        required: input.required,
      };

      return normnalizedItem;
    };
    return (cmd.options || []).map((option) => {
      let cleanedOption = JSON.parse(JSON.stringify(option));
      cleanedOption.options
        ? (cleanedOption.options = normalizeObject(cleanedOption.options))
        : (cleanedOption = normalizeObject(cleanedOption));
        cleanObj(cleanedOption)
        return {
          ...cleanedOption,
          choices: cleanedOption.choices ? JSON.stringify(cleanedOption.choices.map((c) => c.value)) : null,
        }
    });
  }
};
