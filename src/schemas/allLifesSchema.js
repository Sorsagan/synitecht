const { model, Schema } = require("mongoose");

const allLifesSchema = new Schema(
  {
    userId: String,
    name: String,
    age: Number,
    gender: String,
    cash: Number,
    bank: Number,
    inventory: Array,
    job: String,
    workTimeout: Number,

  },
  { strict: false }
);

module.exports = model("allLifes", allLifesSchema);
