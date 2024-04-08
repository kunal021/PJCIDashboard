const mongoose = require("mongoose");

const courseModel = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSriimBJYwC_AJFizokCFrGVRWnQhR6fSckLA&s",
  },
  // video: {
  //   type: String,
  //   default: "",
  // },
});

const Course = mongoose.model("Course", courseModel);

module.exports = Course;
