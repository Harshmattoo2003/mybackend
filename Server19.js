const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs=require("fs");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

mongoose.connect("mongodb+srv://harshmattoo2003:Harsh1504@harsh1.w21k9rh.mongodb.net/newdb?retryWrites=true&w=majority&appName=Harsh1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const content = new mongoose.Schema({
    name: String,
    file: String, 
    link: String,   
    uploadedby: String,
    createdon: String,
    title:String,
    classes:String,
});

const Content = mongoose.model("Content", content);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage });

app.get("/api/contents", async (req, res) => {
    try {
        const content = await Content.find();
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.post("/api/contents", upload.single("file"), async (req, res) => {
    try {
        const { name, link, uploadedby, createdon,title ,classes} = req.body;
        const file = req.file ? req.file.filename : null; 

        const newContent = new Content({ name, file, link, uploadedby, createdon,title,classes });
        await newContent.save();

        res.json(newContent);
    } catch (error) {
        res.status(500).json({ error: "Error adding content" });
    }
});

app.delete("/api/contents/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Content.findById(id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.file) {
            const filePath = path.join(__dirname, "uploads", content.file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Content.findByIdAndDelete(id);
        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting content" });
    }
});

const PORT = process.env.PORT || 5017;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
