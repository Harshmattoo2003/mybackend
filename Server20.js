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
app.use("/submit", express.static(path.join(__dirname, "submit"))); 

mongoose.connect("mongodb+srv://harshmattoo2003:Harsh1504@harsh1.w21k9rh.mongodb.net/newdb?retryWrites=true&w=majority&appName=Harsh1", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log("MongoDB Error:", err));

const homework = new mongoose.Schema({
    classes: String,
    section: String,    
    createdby: String,
    date: String,
    subdate:String,
    eval:String,
    evalby:String,
    marks:Number,
    file:String,
    subject:String,
    description:String,
    submit:[{message:String,file:String,name:String,status:String,obtmarks:Number}],
});

const Homework = mongoose.model("Homework", homework);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const submitStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "submit/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); 
    }
});

const upload = multer({ storage });
const submitupload = multer({storage: submitStorage });

app.get("/api/homeworks", async (req, res) => {
    try {
        const content = await Homework.find();
        res.json(content);
    } catch (error) {
        res.status(500).json({ error: "Error fetching data" });
    }
});

app.post("/api/homeworks", upload.single("file"), async (req, res) => {
    try {
        const { classes, createdby, section,subject ,date,subdate,marks,description} = req.body;
        const file = req.file ? req.file.filename : null; 

        const newContent = new Homework({ classes, createdby, section,subject ,date,subdate,marks,description,file});
        await newContent.save();

        res.json(newContent);
    } catch (error) {
        res.status(500).json({ error: "Error adding content" });
    }
});

app.put("/api/homeworks/submit/:id", submitupload.single("file"), async (req, res) => {
    try {
        const { message,status,obtmarks,name } = req.body;
        const { id } = req.params;
        const file = req.file ? req.file.filename : null;

        const homework = await Homework.findById(id);
        if (!homework) {
            return res.status(404).json({ error: "Homework not found" });
        }
        const existingSubmission = homework.submit.find(sub => sub.name === name);
        if (existingSubmission) {
            existingSubmission.file = file;
            existingSubmission.message = message;

        } else {
            homework.submit.push({
                message,
                file,
                name,
                status: status || "Submitted",
                obtmarks: null, 
            });
        }
        await homework.save();

        res.json({ success: true, message: "Submission added successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error submitting homework" });
    }
});
app.put("/api/homeworks/:id1/:id2",  async (req, res) => {
    try {
        const { status,obtmarks,eval,evalby } = req.body;
        const { id1,id2 } = req.params;
        console.log(obtmarks);
        let marksObj;
        try {
          marksObj = typeof obtmarks === 'string' ? JSON.parse(obtmarks) : obtmarks;
        } catch (e) {
          return res.status(400).json({ error: "Invalid obtmarks format" });
        }

        console.log("Final obtmarks after parsing:", JSON.stringify(obtmarks, null, 2));
        await Homework.findOneAndUpdate(
            { _id: id1, "submit._id": id2 },
            {
                $set: {
                    "submit.$.status": status ,
                    "submit.$.obtmarks": obtmarks,
                    eval: eval,
                    evalby: evalby
                }
            },
            { new: true }
        );
        console.log("done")
        res.json({ success: true, message: "Submission added successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Error submitting homework" });
    }
});

app.delete("/api/homeworks/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const content = await Homework.findById(id);

        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (content.file) {
            const filePath = path.join(__dirname, "uploads", content.file);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await Homework.findByIdAndDelete(id);
        res.json({ message: "Content deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting content" });
    }
});

const PORT = process.env.PORT || 5018;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
