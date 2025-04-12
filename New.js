const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("MongoDB Error:", err));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/submit", express.static(path.join(__dirname, "submit"))); // Only if needed

const routesPath = path.join(__dirname, "Routes");

// fs.readdirSync(routesPath).forEach((file) => {
//   if (file.endsWith(".js")) {
//     const route = require(path.join(routesPath, file));
//     app.use("/api", route); // all routes will be prefixed with /api
//   }
// });
// Routes
app.use("/api/teach", require("./Routes/Server6"));
app.use("/api/teachers1", require("./Routes/Server7"));
app.use("/api/students", require("./Routes/Server8"));
app.use("/api/schools", require("./Routes/Server9"));
app.use("/api/fees", require("./Routes/Server10"));
app.use("/api/feetypes", require("./Routes/Server11"));
app.use("/api/feemasts", require("./Routes/Server12"));
app.use("/api/heads", require("./Routes/Server13"));
app.use("/api/expheads", require("./Routes/Server14"));
app.use("/api/exams", require("./Routes/Server15"));
app.use("/api/examnames", require("./Routes/Server16"));
app.use("/api/tests", require("./Routes/Server17"));
app.use("/api/contenttypes", require("./Routes/Server18"));
app.use("/api/contents", require("./Routes/Server19"));
app.use("/api/homeworks", require("./Routes/Server20"));
app.use("/api/certificates", require("./Routes/Server21"));
app.use("/api/types", require("./Routes/Server22"));
app.use("/api/sources", require("./Routes/Server23"));
app.use("/api/complaints", require("./Routes/Server24"));
app.use("/api/categorys", require("./Routes/Server25"));
app.use("/api/houses", require("./Routes/Server26"));

const PORT = process.env.PORT || 5025;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
