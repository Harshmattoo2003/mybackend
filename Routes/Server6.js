// const express = require("express");
// const fs= require('fs');
// const cors = require("cors");

// const app = express();
// app.use(express.json()); 
// app.use(cors()); 

// app.get("/api/teach", (req, res) => {
//     // const requestedClass = req.query.class || ""; 
//     fs.readFile('Teachers.csv', "utf8",(err,data)=>{
//         if (err) {
//             return res.status(500).json({ error: "Error reading CSV file" });
//         }

//         const lines = data.trim().split("\n");
//         const periodsHeader = lines[0].split(",").slice(2).map(p => p.replace(/"/g, '')); // Extract period names

//         let timetableData = [];

//         for (let i = 1; i < lines.length; i++) {
//             const row = lines[i].split(",");
//             const dayMatch = row[1]?.replace(/"/g, '').trim(); // Keep the day value

//             // Process timetable data while skipping only "Class:" and "Classteacher:" cells
//             for (let j = 2; j < row.length; j++) { 
//                 const cell = row[j].trim().replace(/"/g, '');
//                 if (cell !== "-" && cell !== "") {
//                     const match = cell.match(/(.*?)\((.*?)\)/);
//                     if (match) {
//                         timetableData.push({
//                             day: dayMatch,  
//                             period: periodsHeader[j - 2],
//                             subject: match[1].trim(),
//                             name: match[2].trim()
//                         });
//                     }
//                 }
//             }
//         }

//         res.json(timetableData );
//     });
// });
// app.post("/api/teach",(req, res)=>{
//     const timetable = req.body;
//     const classes=timetable[0].class;
//     const ctname=timetable[0].ctname

//     const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//     const periods = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

//     let csv = `"","Days/Periods",${periods.map(p => `"${p}"`).join(",")}\n`;


//     let firstDay = days[0];
//     let firstDayRow = [`"Class: ${classes}"`, `"${firstDay}"`]; 
//     for (const period of periods) {
//         let dataa = timetable.find(t => t.day === firstDay && t.period === period);
//         firstDayRow.push(dataa ? `"${dataa.subject} (${dataa.name})"` : '"-"');
//     }
//     csv += firstDayRow.join(",") + "\n";


//     let secondDay = days[1];
//     let secondDayRow = [`"Classteacher: ${ctname}"`, `"${secondDay}"`];
//     for (const period of periods) {
//         let dataa = timetable.find(t => t.day === secondDay && t.period === period);
//         secondDayRow.push(dataa ? `"${dataa.subject} (${dataa.name})"` : '"-"');
//     }
//     csv += secondDayRow.join(",") + "\n";

    
//     for (let i = 2; i < days.length; i++) {
//         let day = days[i];
//         let row = [`""`, `"${day}"`]; 
//         for (const period of periods) {
//             let dataa = timetable.find(t => t.day === day && t.period === period);
//             row.push(dataa ? `"${dataa.subject} (${dataa.name})"` : '"-"');
//         }
//         csv += row.join(",") + "\n"; 
//     }

//     csv += "\n";

//     fs.appendFile("Teachers.csv", csv, (err) => {
//         if (err) {
//             console.error("Error writing to file:", err);
//             return res.status(500).json({ error: "Error saving data" });
//         }
//         res.status(201).json({ message: "Data successfully added" });
//     });
// })

// const PORT =5004;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
const express = require("express");
const fs = require("fs");
const router = express.Router();

// GET timetable data from CSV
router.get("/", (req, res) => {
  fs.readFile("Teachers.csv", "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading CSV file" });
    }

    const lines = data.trim().split("\n");
    const periodsHeader = lines[0].split(",").slice(2).map(p => p.replace(/"/g, ''));

    let timetableData = [];

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(",");
      const dayMatch = row[1]?.replace(/"/g, '').trim();

      for (let j = 2; j < row.length; j++) {
        const cell = row[j].trim().replace(/"/g, '');
        if (cell !== "-" && cell !== "") {
          const match = cell.match(/(.*?)\((.*?)\)/);
          if (match) {
            timetableData.push({
              day: dayMatch,
              period: periodsHeader[j - 2],
              subject: match[1].trim(),
              name: match[2].trim(),
            });
          }
        }
      }
    }

    res.json(timetableData);
  });
});

// POST to write new timetable to CSV
router.post("/", (req, res) => {
  const timetable = req.body;
  const classes = timetable[0].class;
  const ctname = timetable[0].ctname;

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const periods = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  let csv = `"","Days/Periods",${periods.map(p => `"${p}"`).join(",")}\n`;

  let firstDay = days[0];
  let firstDayRow = [`"Class: ${classes}"`, `"${firstDay}"`];
  for (const period of periods) {
    const data = timetable.find(t => t.day === firstDay && t.period === period);
    firstDayRow.push(data ? `"${data.subject} (${data.name})"` : '"-"');
  }
  csv += firstDayRow.join(",") + "\n";

  let secondDay = days[1];
  let secondDayRow = [`"Classteacher: ${ctname}"`, `"${secondDay}"`];
  for (const period of periods) {
    const data = timetable.find(t => t.day === secondDay && t.period === period);
    secondDayRow.push(data ? `"${data.subject} (${data.name})"` : '"-"');
  }
  csv += secondDayRow.join(",") + "\n";

  for (let i = 2; i < days.length; i++) {
    let day = days[i];
    let row = [`""`, `"${day}"`];
    for (const period of periods) {
      const data = timetable.find(t => t.day === day && t.period === period);
      row.push(data ? `"${data.subject} (${data.name})"` : '"-"');
    }
    csv += row.join(",") + "\n";
  }

  csv += "\n";

  fs.appendFile("Teachers.csv", csv, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).json({ error: "Error saving data" });
    }
    res.status(201).json({ message: "Data successfully added" });
  });
});

module.exports = router;
