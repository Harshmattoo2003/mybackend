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

// const source = new mongoose.Schema({
//   name: String, 
// });

// const Source= mongoose.model("Source", source);

// app.get("/api/sources", async (req, res) => {
//   const heads = await Source.find();
//   res.json(heads);
// });

// app.post("/api/sources", async (req, res) => {
//   const newHead = new Source(req.body);
//   await newHead.save();
//   res.json(newHead);
// });
// app.delete("/api/sources/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const deletedItem = await Source.findByIdAndDelete(id);
      
//       if (!deletedItem) {
//         return res.status(404).json({ error: "Content type not found" });
//       }
      
//       res.json({ success: true, message: "Content type deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ error: "Error deleting content type" });
//     }
//   });
// const PORT = process.env.PORT || 5021;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.examnameAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// --- SCHEMA ---
const sourceSchema = new mongoose.Schema({
  name: String,
});

const Source = mongoose.model("Source", sourceSchema);

// --- ROUTES ---

// GET all sources
router.get("/", async (req, res) => {
  try {
    const sources = await Source.find();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: "Error fetching sources" });
  }
});

// POST a new source
router.post("/", async (req, res) => {
  try {
    const newSource = new Source(req.body);
    await newSource.save();
    res.json(newSource);
  } catch (error) {
    res.status(500).json({ error: "Error saving source" });
  }
});

// DELETE a source
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Source.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Source not found" });
    }

    res.json({ success: true, message: "Source deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting source" });
  }
});

module.exports = router;
