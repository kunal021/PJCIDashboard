const mongoose = require("mongoose");

const testModel = mongoose.Schema({
  number: {
    type: String,
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    maxlength: 5,
  },
  answer: {
    type: String,
    required: true,
  },
});

const Test = mongoose.model("Test", testModel);

module.exports = Test;
