const { model, Schema } = require('mongoose');

const autoModerationSchema = new Schema({
    logchannel: String,
    guildId: String,
    deleteInvites: Boolean,
    deleteLinks: Boolean,
    deleteMassMentions: Boolean,
    blockSpam: Boolean,
}, {strict: false})

module.exports = model('autoModeration', autoModerationSchema);