const { model, Schema } = require("mongoose");

let ticketSchema = new Schema(
  {
    guildId: String,
    ticketMemberId: String,
    ticketChannelId: String,
    parentTicketChannelId: String,
    rating: String,
    feedback: String,
    closed: Boolean,
    membersAdded: Array,
  },
  {
    strict: false,
  }
);

module.exports = model("ticket", ticketSchema);
