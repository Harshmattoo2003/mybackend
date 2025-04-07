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

// const complaint = new mongoose.Schema({
//   type: String,
//   source:String,
//   by:String,
//   phone:Number,
//   date:String,
//   description:String,
//   action:String,
//   note:String, 
// });

// const Complaint= mongoose.model("Complaint", complaint);

// app.get("/api/complaints", async (req, res) => {
//   const heads = await Complaint.find();
//   res.json(heads);
// });

// app.post("/api/complaints", async (req, res) => {
//   const newHead = new Complaint(req.body);
//   await newHead.save();
//   res.json(newHead);
// });
// app.delete("/api/complaints/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const deletedItem = await Complaint.findByIdAndDelete(id);
      
//       if (!deletedItem) {
//         return res.status(404).json({ error: "Content type not found" });
//       }
      
//       res.json({ success: true, message: "Content type deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ error: "Error deleting content type" });
//     }
//   });
// const PORT = process.env.PORT || 5022;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.examnameAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// --- SCHEMA ---
const complaintSchema = new mongoose.Schema({
  type: String,
  source: String,
  by: String,
  phone: Number,
  date: String,
  description: String,
  action: String,
  note: String,
});

const Complaint = mongoose.model("Complaint", complaintSchema);

// --- ROUTES ---

// GET all complaints
router.get("/", async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: "Error fetching complaints" });
  }
});

// POST a new complaint
router.post("/", async (req, res) => {
  try {
    const newComplaint = new Complaint(req.body);
    await newComplaint.save();
    res.json(newComplaint);
  } catch (error) {
    res.status(500).json({ error: "Error saving complaint" });
  }
});

// DELETE a complaint
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Complaint.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    res.json({ success: true, message: "Complaint deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting complaint" });
  }
});

module.exports = router;
