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

// const head = new mongoose.Schema({
//   name: String, 
// });

// const Head= mongoose.model("Head", head);

// app.get("/api/heads", async (req, res) => {
//   const heads = await Head.find();
//   res.json(heads);
// });

// app.post("/api/heads", async (req, res) => {
//   const newHead = new Head(req.body);
//   await newHead.save();
//   res.json(newHead);
// });
// app.delete("/api/heads/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedItem = await Head.findByIdAndDelete(id);
    
//     if (!deletedItem) {
//       return res.status(404).json({ error: "Content type not found" });
//     }
    
//     res.json({ success: true, message: "Exam deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting content type" });
//   }
// });
// const PORT = process.env.PORT || 5011;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.headAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Schema
const headSchema = new mongoose.Schema({
  name: String,
});

// Model
const Head = mongoose.model("Head", headSchema);

// GET all heads
router.get("/", async (req, res) => {
  try {
    const heads = await Head.find();
    res.json(heads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch heads" });
  }
});

// POST new head
router.post("/", async (req, res) => {
  try {
    const newHead = new Head(req.body);
    await newHead.save();
    res.json(newHead);
  } catch (err) {
    res.status(500).json({ error: "Failed to save head" });
  }
});

// DELETE head by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Head.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Head not found" });
    }

    res.json({ success: true, message: "Head deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting head" });
  }
});

module.exports = router;
