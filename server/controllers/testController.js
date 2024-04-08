const Test = require("../models/testModel");

exports.getAllTest = async (req, res) => {
  try {
    const questions = await Test.find();
    res.status(200).json({
      message: "Sucess",
      length: questions.length,
      data: questions,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getTest = async (req, res) => {
  try {
    const question = await Test.findById(req.params.id);
    res.status(201).json({
      message: "Sucess",
      data: question,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.addTest = async (req, res) => {
  try {
    const newQuestion = await Test.create(req.body);
    res.status(201).json({
      message: "Sucess",
      data: newQuestion,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateTest = async (req, res) => {
  try {
    const question = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      message: "Sucess",
      data: question,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

exports.deleteTest = async (req, res) => {
  try {
    const question = await Test.findByIdAndDelete(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(201).json({
      message: "Sucess",
      data: question,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
