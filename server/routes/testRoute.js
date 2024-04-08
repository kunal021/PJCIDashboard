const express = require("express");
const testController = require("../controllers/testController");
const router = express.Router();

router.route("/").get(testController.getAllTest).post(testController.addTest);

router
  .route("/:id")
  .get(testController.getTest)
  .patch(testController.updateTest)
  .delete(testController.deleteTest);

module.exports = router;
