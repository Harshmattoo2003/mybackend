// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(express.json()); 
// app.use(cors());

// mongoose.connect("mongodb://127.0.0.1:27017/newdb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const teacherSchema = new mongoose.Schema({
//   name: String,
//   subject:String,
//   classteacher:String,
//   teaches:Array,
//   limit:Array,
//   count:Number,
// });

// const Teacher= mongoose.model("Teacher", teacherSchema);

// app.get("/api/teachers1", async (req, res) => {
//   const teachers = await Teacher.find();
//   res.json(teachers);
// });

// // app.post("/api/admins", async (req, res) => {
// //   const newAdmin = new Admin(req.body);
// //   await newAdmin.save();
// //   res.json(newAdmin);
// // });
// const PORT = process.env.PORT || 5005;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const teacherSchema = new mongoose.Schema({
  name: String,
  subject: String,
  classteacher: String,
  teaches: Array,
  limit: Array,
  count: Number,
});

const Teacher = mongoose.model("Teacher", teacherSchema);

// Get all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
});

module.exports = router;
