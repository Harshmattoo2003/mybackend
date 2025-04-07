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

const exphead = new mongoose.Schema({
  name: String, 
  description:String,
  amount:Number,
  date:String,
  invoice:Number,
  exphead:String,
});

const Exphead= mongoose.model("Exphead", exphead);

app.get("/api/expheads", async (req, res) => {
  const heads = await Exphead.find();
  res.json(heads);
});

app.post("/api/expheads", async (req, res) => {
  const newHead = new Exphead(req.body);
  await newHead.save();
  res.json(newHead);
});
app.delete("/api/expheads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Exphead.findByIdAndDelete(id);
    
    if (!deletedItem) {
      return res.status(404).json({ error: "Content type not found" });
    }
    
    res.json({ success: true, message: "Exam deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting content type" });
  }
});
const PORT = process.env.PORT || 5012;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//exports.expheadAPI = functions.https.onRequest(app);
