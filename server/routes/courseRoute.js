const express = require("express");
const courseControllerr = require("../controllers/courseController");
const router = express.Router();

router
  .route("/")
  .get(courseControllerr.getAllCourse)
  .post(courseControllerr.addCourse);

router
  .route("/:id")
  .get(courseControllerr.getCourse)
  .patch(courseControllerr.updateCourse)
  .delete(courseControllerr.deleteCourse);

module.exports = router;
