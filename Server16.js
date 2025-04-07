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

const examname = new mongoose.Schema({
  name: String, 
});

const Examname= mongoose.model("Examname", examname);

app.get("/api/examnames", async (req, res) => {
  const heads = await Examname.find();
  res.json(heads);
});

app.post("/api/examnames", async (req, res) => {
  const newHead = new Examname(req.body);
  await newHead.save();
  res.json(newHead);
});
app.delete("/api/examnames/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Examname.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Content type not found" });
    }
    
    res.json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting content type" });
  }
});
const PORT = process.env.PORT || 5014;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//exports.examnameAPI = functions.https.onRequest(app);
