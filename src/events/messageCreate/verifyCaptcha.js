const Captcha = require("../../schemas/captchaSchema");
const captchaSetupSchema = require("../../schemas/captchaSetupSchema");

module.exports = async (client, message) => {
  if (message.author.bot) return;

  if (message.channel.type === 1) {
    const captchaData = await Captcha.findOne({ userId: message.author.id });

    if (captchaData && message.content === captchaData.captchaText) {
      const captchaSetup = await captchaSetupSchema.findOne({
        guildId: captchaData.guildUserFrom,
      });
      if (!captchaSetup) {
        console.log(
          `No captcha setup found for guild ${captchaData.guildUserFrom}`
        );
        return;
      }
      await Captcha.deleteOne({ userId: message.author.id });
      message.reply("You have been verified!");
      const guild = client.guilds.cache.get(captchaData.guildUserFrom);
      const member = guild.members.cache.get(message.author.id);
      member.roles.add(captchaSetup.roleId);
    } else if (captchaData) {
      message.reply("Incorrect captcha, please try again.");
    }
  }
};
