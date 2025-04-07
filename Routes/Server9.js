// const express = require("express");
// const functions = require("firebase-functions");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(express.json()); 
// app.use(cors());

// mongoose.connect("mongodb+srv://harshmattoo2003:Harsh1504@harsh1.w21k9rh.mongodb.net/newdb?retryWrites=true&w=majority&appName=Harsh1", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const schoolSchema = new mongoose.Schema({
//   username: String,
//   password:String,
//   fullname:String,
//   date_of_birth:String,
//   maritialstatus:String,
//   qualification:String,
//   workexp:Number,
//   mobileno:Number,
//   gender:String,
//   curaddress:String,
//   permaddress:String,
//   fathername:String,
//   mothername:String,
//   image:String,
//   contract:String,
//   role:String,
//   staffid:Number,
//   designation:String,
//   dateofjoin:String,
//   salary:Number,
  
// });

// const School= mongoose.model("School", schoolSchema);

// app.get("/api/schools", async (req, res) => {
//   const schools = await School.find();
//   res.json(schools);
// });

// app.post("/api/schools", async (req, res) => {
//   const newSchool = new School(req.body);
//   await newSchool.save();
//   res.json(newSchool);
// });
// const PORT = process.env.PORT || 5007;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.schoolAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Mongoose Schema
const schoolSchema = new mongoose.Schema({
  username: String,
  password: String,
  fullname: String,
  date_of_birth: String,
  maritialstatus: String,
  qualification: String,
  workexp: Number,
  mobileno: Number,
  gender: String,
  curaddress: String,
  permaddress: String,
  fathername: String,
  mothername: String,
  image: String,
  contract: String,
  role: String,
  staffid: Number,
  designation: String,
  dateofjoin: String,
  salary: Number,
});

// Model
const School = mongoose.model("School", schoolSchema);

// Routes
router.get("/", async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch schools" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newSchool = new School(req.body);
    await newSchool.save();
    res.json(newSchool);
  } catch (err) {
    res.status(500).json({ error: "Failed to add school" });
  }
});

module.exports = router;
