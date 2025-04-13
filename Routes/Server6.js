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
const path = require("path");
const filePath = path.join(__dirname, "Teachers.csv");

// GET timetable data from CSV
router.get("/download", (req, res) => {
  res.download(filePath, "Teachers.csv", (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).json({ error: "Error downloading the file" });
    }
  });
});

router.get("/", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Error reading CSV file" });
    }

    const lines = data.trim().split("\n");
    let classTimetables = [];

    for (let i = 0; i < lines.length; i++) {
      const headerLine = lines[i]?.split(",");
      if (headerLine[1]?.includes("Days/Periods")) {
        const periods = headerLine.slice(2).map(p => p.replace(/"/g, ""));

        const classLine = lines[i + 1]?.split(",");
        const ctLine = lines[i + 2]?.split(",");

        const className = classLine[0]?.replace(/"/g, "").replace("Class: ", "").trim();
        const classTeacher = ctLine[0]?.replace(/"/g, "").replace("Classteacher: ", "").trim();

        let timetable = [];

        // Loop from classLine down through next 6 lines
        for (let j = 1; j <= 6; j++) {
          const currentLine = lines[i + j]?.split(",");
          if (!currentLine) continue;

          const day = currentLine[1]?.replace(/"/g, "").trim();
          for (let k = 2; k < currentLine.length; k++) {
            const cell = currentLine[k].replace(/"/g, "").trim();
            if (cell && cell !== "-") {
              const match = cell.match(/(.*?)\s*\((.*?)\)/);
              if (match) {
                timetable.push({
                  day,
                  period: periods[k - 2] || `P${k - 1}`, // fallback if missing
                  subject: match[1].trim(),
                  name: match[2].trim()
                });
              }
            }
          }
        }

        classTimetables.push({
          class: className,
          ctname: classTeacher,
          periods,
          timetable
        });

        i += 6; // skip to next block
      }
    }

    res.json(classTimetables);
    // const periodsHeader = lines[0].split(",").slice(2).map(p => p.replace(/"/g, ''));

    // const className = lines[1].split(",")[0]?.replace("Class:", "").trim();
    // const classTeacher = lines[2].split(",")[0]?.replace("Classteacher:", "").trim();

    // let timetableData = [];

    // const parseRow = (row, dayLabel) => {
    //   const cells = row.split(",");
    //   for (let j = 1; j < cells.length; j++) {
    //     const cell = cells[j].trim().replace(/"/g, '');
    //     if (cell !== "-" && cell !== "") {
    //       const match = cell.match(/(.*?)\((.*?)\)/);
    //       if (match) {
    //         timetableData.push({
    //           day: dayLabel,
    //           period: periodsHeader[j - 1],
    //           subject: match[1].trim(),
    //           name: match[2].trim(),
    //           class: className,
    //           classTeacher: classTeacher
    //         });
    //       }
    //     }
    //   }
    // };

    // parseRow(lines[1], "Class Info");
    // parseRow(lines[2], "Classteacher Info");

    // // for (let i = 1; i < lines.length; i++) {
    // //   const row = lines[i].split(",");
    // //   const dayMatch = row[1]?.replace(/"/g, '').trim();

    // //   const className = row[0]?.replace(/"/g, '').trim();
    // //   const classTeacher = row[1]?.replace(/"/g, '').trim();

    // //   for (let j = 2; j < row.length; j++) {
    // //     const cell = row[j].trim().replace(/"/g, '');
    // //     if (cell !== "-" && cell !== "") {
    // //       const match = cell.match(/(.*?)\((.*?)\)/);
    // //       if (match) {
    // //         timetableData.push({
    // //           day: dayMatch,
    // //           period: periodsHeader[j - 2],
    // //           subject: match[1].trim(),
    // //           name: match[2].trim(),
    // //           class: className,  
    // //           classTeacher: classTeacher,
    // //         });
    // //       }
    // //     }
    // //   }
    // // }
    // for (let i = 3; i < lines.length; i++) {
    //   const row = lines[i].split(",");
    //   const day = row[0]?.replace(/"/g, '').trim();
    //   for (let j = 1; j < row.length; j++) {
    //     const cell = row[j].trim().replace(/"/g, '');
    //     if (cell !== "-" && cell !== "") {
    //       const match = cell.match(/(.*?)\((.*?)\)/);
    //       if (match) {
    //         timetableData.push({
    //           day: day,
    //           period: periodsHeader[j - 1],
    //           subject: match[1].trim(),
    //           name: match[2].trim(),
    //           class: className,
    //           classTeacher: classTeacher
    //         });
    //       }
    //     }
    //   }
    // }

    //res.json(timetableData);
  });
});

router.post("/", (req, res) => {
  console.log("Request body:", req.body); 
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

  fs.appendFile(filePath, csv, (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return res.status(500).json({ error: "Error saving data" });
    }
    res.status(201).json({ message: "Data successfully added" });
  });
});
router.delete('/:className', (req, res) => {
  const className = req.params.className; // e.g., '9A'

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to read timetable file', error: err });
    }

    const lines = data.split('\n');
    let startIndex = -1;

    // Find the line with "Class: 9A"
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().includes(`Class: ${className}`)) {
        startIndex = i - 1; // Include the period header above
        break;
      }
    }

    if (startIndex === -1) {
      return res.status(404).json({ message: `Class ${className} not found` });
    }

    const deleteCount = 8; // Period header + Class line + 5 weekday lines + 1 empty line
    const updatedLines = lines.filter((_, index) => index < startIndex || index >= startIndex + deleteCount);

    fs.writeFile(filePath, updatedLines.join('\n'), (err) => {
      if (err) {
        return res.status(500).json({ message: 'Failed to update timetable file', error: err });
      }
      res.json({ message: `Class ${className} and its header block deleted successfully.` });
    });
  });
});
router.delete('/', (req, res) => {
  fs.writeFile(filePath, '', (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to clear timetable file', error: err });
    }
    res.json({ message: 'All class timetable data has been cleared.' });
  });
});

module.exports = router;
