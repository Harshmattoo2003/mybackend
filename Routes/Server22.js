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

// const type = new mongoose.Schema({
//   name: String, 
// });

// const Type= mongoose.model("Type", type);

// app.get("/api/types", async (req, res) => {
//   const heads = await Type.find();
//   res.json(heads);
// });

// app.post("/api/types", async (req, res) => {
//   const newHead = new Type(req.body);
//   await newHead.save();
//   res.json(newHead);
// });
// app.delete("/api/types/:id", async (req, res) => {
//     try {
//       const { id } = req.params;
//       const deletedItem = await Type.findByIdAndDelete(id);
      
//       if (!deletedItem) {
//         return res.status(404).json({ error: "Content type not found" });
//       }
      
//       res.json({ success: true, message: "Content type deleted successfully" });
//     } catch (error) {
//       res.status(500).json({ error: "Error deleting content type" });
//     }
//   });
// const PORT = process.env.PORT || 5020;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.examnameAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// --- SCHEMA ---
const typeSchema = new mongoose.Schema({
  name: String,
});

const Type = mongoose.model("Type", typeSchema);

// --- ROUTES ---

// GET all types
router.get("/", async (req, res) => {
  try {
    const types = await Type.find();
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: "Error fetching content types" });
  }
});

// POST a new type
router.post("/", async (req, res) => {
  try {
    const newType = new Type(req.body);
    await newType.save();
    res.json(newType);
  } catch (error) {
    res.status(500).json({ error: "Error saving content type" });
  }
});

// DELETE a type
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedType = await Type.findByIdAndDelete(id);

    if (!deletedType) {
      return res.status(404).json({ error: "Content type not found" });
    }

    res.json({ success: true, message: "Content type deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting content type" });
  }
});

module.exports = router;
