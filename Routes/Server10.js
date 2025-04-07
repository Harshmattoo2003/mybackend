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

// const feeSchema = new mongoose.Schema({
//   name: String, 
// });

// const Fee= mongoose.model("Fee", feeSchema);

// app.get("/api/fees", async (req, res) => {
//   const fees = await Fee.find();
//   res.json(fees);
// });

// app.post("/api/fees", async (req, res) => {
//   const newFee = new Fee(req.body);
//   await newFee.save();
//   res.json(newFee);
// });
// app.delete("/api/fees/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedItem = await Fee.findByIdAndDelete(id);
    
//     if (!deletedItem) {
//       return res.status(404).json({ error: "Content type not found" });
//     }
    
//     res.json({ success: true, message: "Exam deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting content type" });
//   }
// });
// const PORT = process.env.PORT || 5008;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.feeAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Mongoose Schema
const feeSchema = new mongoose.Schema({
  name: String,
});

// Model
const Fee = mongoose.model("Fee", feeSchema);

// Routes
router.get("/", async (req, res) => {
  try {
    const fees = await Fee.find();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch fees" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newFee = new Fee(req.body);
    await newFee.save();
    res.json(newFee);
  } catch (err) {
    res.status(500).json({ error: "Failed to create fee" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Fee.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Fee not found" });
    }

    res.json({ success: true, message: "Fee deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete fee" });
  }
});

module.exports = router;
