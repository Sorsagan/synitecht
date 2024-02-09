/*                 _ _            _     _   
                (_) |          | |   | |  
 ___ _   _ _ __  _| |_ ___  ___| |__ | |_ 
/ __| | | | '_ \| | __/ _ \/ __| '_ \| __|
\__ \ |_| | | | | | ||  __/ (__| | | | |_ 
|___/\__, |_| |_|_|\__\___|\___|_| |_|\__|
      __/ |                               
     |___/                                
*/
const captchaSetupSchema = require("../../schemas/captchaSetupSchema");
const captchaSchema = require("../../schemas/captchaSchema");
const svgCaptcha = require("svg-captcha");
const sharp = require("sharp");
const { AttachmentBuilder } = require("discord.js");
async function generateCaptcha() {
  const captcha = svgCaptcha.create({
    size: 6, // size of random string
    ignoreChars: "0o1i", // filter out some characters like 0o1i
    noise: 2, // number of noise lines
    color: true, // characters will have distinct colors instead of grey, for visibility
    background: "#cc9966", // light background for the captcha image
  });

  if (!captcha.data) {
    throw new Error("Failed to generate captcha: SVG data is undefined");
  }

  let pngBuffer;
  try {
    pngBuffer = await sharp(Buffer.from(captcha.data)).png().toBuffer();
  } catch (error) {
    throw new Error(`Failed to convert SVG to PNG: ${error.message}`);
  }

  return { text: captcha.text, data: pngBuffer };
}
async function isCaptchaSetForServer(guildId) {
  await captchaSetupSchema.findOne({
    guildId: guildId,
  });

  return true;
}
module.exports = async (client, member) => {
  try {
    const existingCaptcha = await captchaSchema.findOne({ userId: member.id });
    if (existingCaptcha) {
      try {
        await member.send(
          `A captcha already exists for you. Please complete it to verify yourself.`
        );
      } catch (error) {
        if (error.message.includes("Cannot send messages to this user")) {
          console.error(
            `Failed to send DM to user ${member.id}. User has DMs disabled.`
          );
          return;
        }
        throw error;
      }
      return;
    }

    if (await isCaptchaSetForServer(member.guild.id)) {
      const captcha = await generateCaptcha();

      const captchaData = new captchaSchema({
        userId: member.id,
        captchaText: captcha.text,
        guildUserFrom: member.guild.id,
      });

      await captchaData.save();
      const attachment = new AttachmentBuilder(captcha.data, {
        name: "captcha.png",
      });
      try {
        await member.send({
          content: `Welcome to the **${member.guild.name}**! Please complete this captcha in **5 minutes** to verify yourself:`,
          files: [attachment],
        });
      } catch (error) {
        if (error.message.includes("Cannot send messages to this user")) {
          console.error(
            `Failed to send DM to user ${member.id}. User has DMs disabled.`
          );
          return;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
};
