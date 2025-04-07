const express = require("express");
const multer = require("multer");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs=require("fs");

const app = express();
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "DELETE","PUT"], 
    credentials: true
}));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

mongoose.connect("mongodb+srv://harshmattoo2003:Harsh1504@harsh1.w21k9rh.mongodb.net/newdb?retryWrites=true&w=majority&appName=Harsh1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const certificate = new mongoose.Schema({
    name: String,
    center: String,    
    left: String,
    right: String,
    file:String,
    cname:String,
    body:String,
    file1:String,
});

const Cerificate = mongoose.model("Certificate", certificate);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

// const submitStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "submit/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname); 
//     }
// });

const upload = multer({ storage });
//const submitupload = multer({storage: submitStorage });

app.get("/api/certificates", async (req, res) => {
    try {
        const content = await Cerificate.find();
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.post("/api/certificates",upload.fields([{ name: "file" }, { name: "file1" }]), async (req, res) => {
    try {
        const { name,center,left,right,cname,body} = req.body;
        const file1Path = req.files["file"] ? req.files["file"][0].filename : null;
        const file2Path = req.files["file1"] ? req.files["file1"][0].filename : null;

        const newContent = new Cerificate({name,center,left,right,cname,body,file:file1Path, file1:file2Path});
        await newContent.save();

        res.json(newContent);
    } catch (error) {
        res.status(500).json({ error: "Error adding content" });
    }
});

app.delete("/api/certificates/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Cerificate.findById(id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.file) {
            const filePath = path.join(__dirname, "uploads", content.file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Cerificate.findByIdAndDelete(id);
        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting content" });
    }
});

const PORT = process.env.PORT || 5019;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
