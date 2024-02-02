// Code snippet inspired by [ The North Solution ](https://www.youtube.com/watch?v=xnTc-864uAI)
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatpromptCommandInteraction,
  EmbedBuilder,
  codeBlock,
} = require("discord.js");
const axios = require("axios");
const NVIDIADeveloperToken = process.env.NVIDIA_API_KEY;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("askai")
    .setDescription("Ask a question to the AI.")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("The question to ask.")
        .setRequired(true)
    )
    .addNumberOption((option) =>
      option
        .setName("temperature")
        .setDescription("The temperature of the AI.")
        .setRequired(false)
        .setMinValue(0.1)
        .setMaxValue(1)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],
  /**
   *
   * @param {Client} client
   * @param {ChatpromptCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply();
    const prompt = interaction.options.getString("prompt");
    const temperature = interaction.options.getNumber("temperature") || 0.7;
    if (prompt.length > 2048)
      return interaction.followUp({
        content: `The prompt is too long. Please make sure the prompt is less than 2048 characters.`,
        ephemeral: true,
      });
    if (isNaN(temperature) || temperature < 0.1 || temperature > 1)
      return interaction.followUp({
        content: `The temperature must be between 0.1 and 1.`,
        ephemeral: true,
      });
    try {
      await createApiRequestAndReply(temperature, prompt, interaction);
    } catch (error) {
      console.log(error);
      interaction.followUp({
        content: `An error occured. Please try again later.`,
        ephemeral: true,
      });
    }
    async function createApiRequestAndReply(temperature, prompt, interaction) {
      let data = "";
      const invokeUrl = `https://api.nvcf.nvidia.com/v2/nvcf/pexec/functions/0e349b44-440a-44e1-93e9-abe8dcb27158`;
      const headers = {
        Authorization: `Bearer ${NVIDIADeveloperToken}`,
        Accept: "text/event-stream",
        "Content-Type": "application/json",
      };
      const payload = {
        messages: [
          {
            content: prompt,
            role: "user",
          },
        ],
        temperature: temperature,
        top_p: 0.7,
        max_tokens: 1024,
        seed: 42,
        stream: true,
      };
      const response = await axios
        .post(invokeUrl, payload, { headers: headers, responseType: "stream" })
        .catch((error) => {
          console.log(error);
          interaction.reply({
            content: `An error occured. Please try again later.`,
            ephemeral: true,
          });
        });
      response.data.on("data", async (chunk) => {
        try {
          let responseData = chunk.toString("utf8");
          let jsonData = responseData.replace("data: ", "");
          const parsedData = JSON.parse(jsonData);
          data += parsedData.choices[0].delta.content;
        } catch {
          const chunk = await truncateMessage(data, 4096);
          sendMessage(interaction, chunk, prompt);
        }
      });
    }

    async function sendMessage(interaction, chunk, prompt) {
      const userMsg = await truncateMessage(prompt, 256);
      const embed = new EmbedBuilder()
        .setTitle("AI Response")
        .setDescription(
          `**Prompt:** ${userMsg}\n\n**Response:** ${codeBlock(chunk)}`
        )
        .setTimestamp()
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
        });
      interaction.editReply({ embeds: [embed] });
    }

    async function truncateMessage(message, length) {
      const maxLength = length;
      if (message.length > maxLength) {
        return message.substring(0, maxLength);
      }
      return message;
    }
  },
};
