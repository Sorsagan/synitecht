const { model, Schema } = require('mongoose');

const moderationSchema = new Schema({
    logchannel: String,
    userId: String,
    guildId: String,
    staffId: String,
    reason: String,
    expirationTime: Date,
    type: String,
}, {strict: false})

module.exports = model('moderation', moderationSchema);