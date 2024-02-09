/*                 _ _            _     _   
                (_) |          | |   | |  
 ___ _   _ _ __  _| |_ ___  ___| |__ | |_ 
/ __| | | | '_ \| | __/ _ \/ __| '_ \| __|
\__ \ |_| | | | | | ||  __/ (__| | | | |_ 
|___/\__, |_| |_|_|\__\___|\___|_| |_|\__|
      __/ |                               
     |___/                                
*/
const captchaSchema = require("../../schemas/captchaSchema");
const captchaSetupSchema = require("../../schemas/captchaSetupSchema");

module.exports = async (client, message) => {
  let captchaSchemalogchannel;
  try {
    if (message.author.bot) return;

    if (message.channel.type === 1) {
      const captchaSchemaData = await captchaSchema.findOne({
        userId: message.author.id,
      });

      console.log(`User message: ${message.content}`);
      console.log(
        `Stored captcha: ${
          captchaSchemaData ? captchaSchemaData.captchaText : "No captcha found"
        }`
      );

      if (
        captchaSchemaData &&
        message.content === captchaSchemaData.captchaText
      ) {
        const captchaSchemaSetup = await captchaSetupSchema.findOne({
          guildId: captchaSchemaData.guildUserFrom,
        });
        if (!captchaSchemaSetup) {
          console.log(
            `No captchaSchema setup found for guild ${captchaSchemaData.guildUserFrom}`
          );
          return;
        }
        await captchaSchema.deleteOne({ userId: message.author.id });
        message.reply("You have been verified!");
        captchaSchemalogchannel = client.channels.cache.get(
          captchaSchemaSetup.channelId
        );
        captchaSchemalogchannel.send(
          `User ${message.author} has been verified by captcha.`
        );
        const guild = client.guilds.cache.get(captchaSchemaData.guildUserFrom);
        const member = await guild.members.fetch(message.author.id);
        member.roles.add(captchaSchemaSetup.roleId);
      } else if (captchaSchemaData) {
        message.reply("Incorrect captchaSchema, please try again.");
      }
    }
  } catch (error) {
    console.error(error);
    if (captchaSchemalogchannel) {
      captchaSchemalogchannel.send(
        `Something went wrong when verifying user ${message.author}: ${error.message}`
      );
    }
  }
};
