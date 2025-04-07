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

// const contenttype = new mongoose.Schema({
//   name: String, 
// });

// const Contenttype= mongoose.model("Contenttype", contenttype);

// app.get("/api/contenttypes", async (req, res) => {
//   const heads = await Contenttype.find();
//   res.json(heads);
// });

// app.post("/api/contenttypes", async (req, res) => {
//   const newHead = new Contenttype(req.body);
//   await newHead.save();
//   res.json(newHead);
// });
// app.delete("/api/contenttypes/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const deletedItem = await Contenttype.findByIdAndDelete(id);
      
//       if (!deletedItem) {
//         return res.status(404).json({ error: "Content type not found" });
//       }
      
//       res.json({ success: true, message: "Content type deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ error: "Error deleting content type" });
//     }
//   });
// const PORT = process.env.PORT || 5016;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.examnameAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Schema
const contenttypeSchema = new mongoose.Schema({
  name: String,
});

// Model
const Contenttype = mongoose.model("Contenttype", contenttypeSchema);

// GET all content types
router.get("/", async (req, res) => {
  try {
    const types = await Contenttype.find();
    res.json(types);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch content types" });
  }
});

// POST new content type
router.post("/", async (req, res) => {
  try {
    const newType = new Contenttype(req.body);
    await newType.save();
    res.json(newType);
  } catch (err) {
    res.status(500).json({ error: "Failed to create content type" });
  }
});

// DELETE content type
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Contenttype.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Content type not found" });
    }

    res.json({ success: true, message: "Content type deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting content type" });
  }
});

module.exports = router;
