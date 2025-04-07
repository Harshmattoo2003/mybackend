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

const feeSchema = new mongoose.Schema({
  type: String,
      date: String,
      amount: Number,
      finetype: String,
      fineamount: Number,
      perday: String,
      status:String,
      fines: [{ days: Number, fine: Number }],
});

const feemastSchema = new mongoose.Schema({
  group: String,
  fees: [feeSchema],
});


const Feemast= mongoose.model("Feemast", feemastSchema);

app.get("/api/feemasts", async (req, res) => {
  const feemasts = await Feemast.find().sort({group:1});
  res.json(feemasts);
});

app.post("/api/feemasts", async (req, res) => {
  const { group,fees} =
  req.body;
  console.log("Received Data:", req.body);
  if (!group || !fees || !Array.isArray(fees) || fees.length === 0) {
    console.log("❌ Missing required fee fields");
    return res.status(400).json({ error: "Missing required fee fields" });
  }
  const newd = fees[0];
let feemast = await Feemast.findOne({ group });

if (feemast) {
  feemast.fees.push(newd);
  await feemast.save();
} else {
  feemast = new Feemast({
    group,
    fees: [newd],
  });
  await feemast.save();
}
// const feemast = new Feemast(req.body);
//   await feemast.save();
  res.json(feemast);
});
const PORT = process.env.PORT || 5010;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//exports.feemastAPI = functions.https.onRequest(app);
