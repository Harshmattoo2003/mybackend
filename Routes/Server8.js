// const express = require("express");
// const functions = require("firebase-functions");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();
// app.use(express.json()); 
// app.use(cors({
//   origin: "*", 
//   methods: ["GET", "POST", "DELETE","PUT"], 
//   credentials: true
// }));

// mongoose.connect("mongodb+srv://harshmattoo2003:Harsh1504@harsh1.w21k9rh.mongodb.net/newdb?retryWrites=true&w=majority&appName=Harsh1", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const feeSchema = new mongoose.Schema({
//   type: String,
//       date: String,
//       amount: Number,
//       finetype: String,
//       fineamount: Number,
//       perday: String,
//       status:String,
//       fines: [{ days: Number, fine: Number }],
// });


// const studentSchema = new mongoose.Schema({
//   username: String,
//   password:String,
//   firstname:String,
//   lastname:String,
//   admission_date:String,
//   date_of_birth:String,
//   mobileno:Number,
//   gender:String,
//   curaddress:String,
//   permaddress:String,
//   fathername:String,
//   fatherno:Number,
//   fatherocu:String,
//   mothername:String,
//   motherno:Number,
//   motherocu:String,
//   image:String,
//   admissionno:Number,
//   rollno:Number,
//   class:String,
//   section:String,
//   category:String,
//   religion:String,
//   caste:String,
//   blood:String,
//   house:String,
//   fatherimg:String,
//   motherimg:String,
//   amount:Number,
//   fees:[{group:String,fee:[feeSchema]}],
//   attendance: [
//     {
//       date: String,
//       attendance: String,
//       entry: String,
//       exit: String,
//     }
//   ],
// });

// const Student= mongoose.model("Student", studentSchema);

// app.get("/api/students", async (req, res) => {
//   const students = await Student.find();
//   res.json(students);
// });

// app.post("/api/students", async (req, res) => {
//   const newStudent = new Student(req.body);
//   await newStudent.save();
//   res.json(newStudent);
// });
// app.delete("/api/students/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedItem = await Student.findByIdAndDelete(id);
    
//     if (!deletedItem) {
//       return res.status(404).json({ error: "Content type not found" });
//     }
    
//     res.json({ success: true, message: "Exam deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting content type" });
//   }
// });
// app.post("/api/students/delete-multiple", async (req, res) => {
//   try {
//     const { ids } = req.body;

//     if (!ids || !Array.isArray(ids)) {
//       return res.status(400).json({ error: "Invalid request, expected array of IDs" });
//     }

//     const result = await Student.deleteMany({ _id: { $in: ids } });

//     res.status(200).json({ message: `${result.deletedCount} student(s) deleted` });
//   } catch (error) {
//     console.error("Error deleting students:", error);
//     res.status(500).json({ error: "Error deleting students" });
//   }
// });
// app.put("/api/students/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { date, attendance, entry, exit } = req.body;

//     const updatedStudent = await Student.findByIdAndUpdate(id);
//     if (!updatedStudent) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     const existingAttendance = updatedStudent.attendance.find((a) => a.date === date);

//     if (existingAttendance) {
//       existingAttendance.attendance = attendance;
//       existingAttendance.entry = entry;
//       existingAttendance.exit = exit;
//     } else {
//       updatedStudent.attendance.push({ date, attendance, entry, exit });
//     }

//     await updatedStudent.save();

//     res.status(200).json({ message: "Attendance updated", student: updatedStudent });
//   } catch (error) {
//     res.status(500).json({ error: "Error updating attendance" });
//   }
// });
// const PORT = process.env.PORT || 5006;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.studentAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const feeSchema = new mongoose.Schema({
  type: String,
  date: String,
  amount: Number,
  finetype: String,
  fineamount: Number,
  perday: String,
  status: String,
  fines: [{ days: Number, fine: Number }],
});

const studentSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  admission_date: String,
  date_of_birth: String,
  mobileno: Number,
  gender: String,
  curaddress: String,
  permaddress: String,
  fathername: String,
  fatherno: Number,
  fatherocu: String,
  mothername: String,
  motherno: Number,
  motherocu: String,
  image: String,
  admissionno: Number,
  rollno: Number,
  class: String,
  section: String,
  category: String,
  religion: String,
  caste: String,
  blood: String,
  house: String,
  fatherimg: String,
  motherimg: String,
  amount: Number,
  fees: [{ group: String, fee: [feeSchema] }],
  attendance: [
    {
      date: String,
      attendance: String,
      entry: String,
      exit: String,
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

// Get all students
router.get("/", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Add new student
router.post("/", async (req, res) => {
  const newStudent = new Student(req.body);
  await newStudent.save();
  res.json(newStudent);
});

// Delete one student
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Student.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Student not found" });
    }

    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
});

// Delete multiple students
router.post("/delete-multiple", async (req, res) => {
  try {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ error: "Invalid request, expected array of IDs" });
    }

    const result = await Student.deleteMany({ _id: { $in: ids } });

    res.status(200).json({ message: `${result.deletedCount} student(s) deleted` });
  } catch (error) {
    console.error("Error deleting students:", error);
    res.status(500).json({ error: "Error deleting students" });
  }
});

// Update attendance
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, attendance, entry, exit } = req.body;

    const updatedStudent = await Student.findById(id);
    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existingAttendance = updatedStudent.attendance.find((a) => a.date === date);

    if (existingAttendance) {
      existingAttendance.attendance = attendance;
      existingAttendance.entry = entry;
      existingAttendance.exit = exit;
    } else {
      updatedStudent.attendance.push({ date, attendance, entry, exit });
    }

    await updatedStudent.save();

    res.status(200).json({ message: "Attendance updated", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ error: "Error updating attendance" });
  }
});

module.exports = router;
