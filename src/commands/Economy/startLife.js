const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const allLifesDB = require("../../schemas/allLifesSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("startlife")
    .setDescription("Start a life.")
    .addStringOption((option) =>
      option.setName("name").setDescription("Give us your name.").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("gender").setDescription("Give us your gender.").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("birthday").setDescription("Give us your birthday.").setRequired(true)
    )
    .toJSON(),
  userPermissions: [],
  botPermissions: [],

  run: async (client, interaction) => {
    const lifeName = interaction.options.getString("name");
    const lifeGender = interaction.options.getString("gender");
    const lifeBirthday = interaction.options.getString("birthday");
    const lifeId = interaction.user.id;

   let lifeData = allLifesDB.findOne({
        userId: lifeId
    })

    if(lifeData) {
        return interaction.reply("If you want to start a new life you need to die first.")
    } else {
        allLifesDB.create({
            userId: lifeId,
            name: lifeName,
            gender: lifeGender,
            age: 0,
            cash: 0,
            bank: 0,
            job: 'Unemployed',
        })
    }


  },
};
