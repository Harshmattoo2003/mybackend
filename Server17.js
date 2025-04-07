const express = require("express");
const functions = require("firebase-functions");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json()); 
app.use(cors());

mongoose.connect("mongodb+srv://harshmattoo2003:Harsh1504@harsh1.w21k9rh.mongodb.net/newdb?retryWrites=true&w=majority&appName=Harsh1", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const question = new mongoose.Schema({
    ques:String,
    opt1:String,
    opt2:String,
    opt3:String,
    opt4:String,
    answer:String,

  });
  const sub = new mongoose.Schema({
    subjectName:String,
    questions:[question],
    date:String,
    starttime:String,
    duration:Number,
    maxmarks:Number,

  });

const test = new mongoose.Schema({
  name: String, 
  group:String,
  subjects:[sub],
});

const Test= mongoose.model("Test", test);

app.get("/api/tests", async (req, res) => {
  const heads = await Test.find();
  res.json(heads);
});

app.put("/api/tests/:id", async (req, res) => {
  try {
    console.log("Received PUT request:", req.body);
      const  {subjects} = req.body;

    if (!Array.isArray(subjects)) {
      return res.status(400).json({ message: "Subjects must be an array!" });
    }
      const exam = await Test.findById(req.params.id);
      if (!exam) {
          return res.status(404).json({ message: "Exam not found" });
      }

      subjects.forEach(subject => {
        const subjectIndex = exam.subjects.findIndex(sub => sub.subjectName === subject.subjectName);
  
        if (subjectIndex !== -1) {
          exam.subjects[subjectIndex].questions.push(...subject.questions);
        } else {
          exam.subjects.push(subject);
        }
      })

      await exam.save();
      res.json(exam);
  } catch (error) {
      res.status(500).json({ message: "Error updating exam", error });
  }
});

app.post("/api/tests", async (req, res) => {
  const newHead = new Test(req.body);
  await newHead.save();
  res.json(newHead);
});
const PORT = process.env.PORT || 5015;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//exports.testAPI = functions.https.onRequest(app);
