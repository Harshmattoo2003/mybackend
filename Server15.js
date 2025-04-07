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

const exam = new mongoose.Schema({
  name: String, 
});

const Exam= mongoose.model("Exam", exam);

app.get("/api/exams", async (req, res) => {
  const heads = await Exam.find();
  res.json(heads);
});

app.post("/api/exams", async (req, res) => {
  const newHead = new Exam(req.body);
  await newHead.save();
  res.json(newHead);
});
app.delete("/api/exams/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Exam.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Content type not found" });
    }
    
    res.json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting content type" });
  }
});
const PORT = process.env.PORT || 5013;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//exports.examAPI = functions.https.onRequest(app);
