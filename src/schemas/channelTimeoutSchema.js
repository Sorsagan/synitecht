const { model, Schema } = require("mongoose");

const channelTimeoutSchema = new Schema(
  {
    channelId: String,
    timeout: Number,
  },
  { strict: false }
);

module.exports = model("timeoutChannel", channelTimeoutSchema);
