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

// const feetypeSchema = new mongoose.Schema({
//   name: String, 
// });

// const Feetype= mongoose.model("Feetype", feetypeSchema);

// app.get("/api/feetypes", async (req, res) => {
//   const feetypes = await Feetype.find();
//   res.json(feetypes);
// });

// app.post("/api/feetypes", async (req, res) => {
//   const newFeetypes = new Feetype(req.body);
//   await newFeetypes.save();
//   res.json(newFeetypes);
// });
// app.delete("/api/feetypes/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedItem = await Feetype.findByIdAndDelete(id);
    
//     if (!deletedItem) {
//       return res.status(404).json({ error: "Content type not found" });
//     }
    
//     res.json({ success: true, message: "Exam deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error deleting content type" });
//   }
// });
// const PORT = process.env.PORT || 5009;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// //exports.feetypeAPI = functions.https.onRequest(app);
const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// Mongoose Schema
const feetypeSchema = new mongoose.Schema({
  name: String,
});

// Model
const Feetype = mongoose.model("Feetype", feetypeSchema);

// Routes
router.get("/", async (req, res) => {
  try {
    const feetypes = await Feetype.find();
    res.json(feetypes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feetypes" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newFeetype = new Feetype(req.body);
    await newFeetype.save();
    res.json(newFeetype);
  } catch (err) {
    res.status(500).json({ error: "Failed to create feetype" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await Feetype.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: "Feetype not found" });
    }

    res.json({ success: true, message: "Feetype deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete feetype" });
  }
});

module.exports = router;
