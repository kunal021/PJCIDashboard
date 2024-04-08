const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const courseRouter = require("./routes/courseRoute");
const testRouter = require("./routes/testRoute");
const PORT = process.env.PORT;

const app = express();
app.use(cors());

app.use(express.json());
mongoose
  .connect(process.env.DATABASE_URI, {})
  .then(() => console.log("DB is connected"));

app.use("/api/courses", courseRouter);
app.use("/api/test", testRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
