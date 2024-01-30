const { model, Schema } = require('mongoose');

let ticketSetupSchema = new Schema({
    guildId: String,
    feedbackChannelId: String,
    ticketChannelId: String,
    staffRoleId: String,
    ticketType: String,
},
{
    strict: false,
});

module.exports = model('ticket-setup', ticketSetupSchema);