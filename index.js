const express = require('express');
const json2csv = require('json2csv').parse;
const fs= require('fs')

const { AsyncParser } =require('@json2csv/node');


const app = express();

// Sample JSON data
const jsonData = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
    { name: 'Doe', age: 40, city: 'Chicago' }
];

// Convert JSON data to CSV format
const csvData = json2csv(jsonData);

app.get('/download/csv', (req, res) => {
    const filePath = './data.json'; // Assuming data.json is in the same directory

   
    const parser = new AsyncParser();
  
    // 1. Create a readable stream for the JSON file
    const jsonStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  
  
    // 3. Handle errors gracefully
    jsonStream.on('error', (err) => {
      console.error('Error reading JSON file:', err);
      res.status(500).send('Error reading data file');
    });
    jsonStream.on('data', (data) => {
      console.error('Error reading JSON file:', data);
    //   res.status(500).send('Error reading data file');
    });

    // Set appropriate response headers for CSV download
  res.setHeader('Content-disposition', 'attachment; filename=data.csv');
  res.set('Content-Type', 'text/csv');
  
    parser.parse(jsonStream).pipe(res);


  });
// Start the server
const PORT = 3003
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// const express = require('express');
// const router = express.Router();
// const path = require('path');
// const fs = require('fs');
// const cors = require('cors');
// const rateLimit = require('express-rate-limit');
// const app = express();
// const downloadLimit = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 100, // 100 requests per hour
//   message: 'Too many file download requests from this IP, please try again later'
// });
// app.use(cors());
// app.get('/download/:id',downloadLimit, function (req, res) {
//     try {
//         const id = req.params.id;
//         const filepath = path.join(__dirname, '/uploads', id);
//         // Check if the file exists
//         if (!fs.existsSync(filepath)) {
//             res.status(404).send('File not found');
//             return;
//         }
//         // Set headers for the download response
//         const fileSize = fs.statSync(filepath).size;
//         // Handle range requests for resuming downloads
//         const range = req.headers.range;
//         res.set({
//             'Content-Type': 'application/octet-stream',
//             'Content-Length': fileSize,
//             'Content-Disposition': `attachment; id="${id}"`,
//             'Cache-Control': 'public, max-age=31536000'
//         });
//         if (range) {
//             const parts = range.replace(/bytes=/, '').split('-');
//             const start = parseInt(parts[0], 10);
//             console.log('start: ', start);
//             const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//             console.log('end: ', end);
//             const chunksize = (end - start) + 1;
//             res.writeHead(206, {
//                 'Content-Type': 'application/octet-stream',
//                 'Content-Range': `bytes ${start}-${end}/${fileSize}`,
//                 'Content-Length': chunksize,
//             });
//             const file = fs.createReadStream(filepath, { start, end });
//             let downloadedBytes = 0;
//             file.on('data', function (chunk) {
//                 downloadedBytes += chunk.length;
//                 res.write(chunk);
//             });
//             file.on('end', function () {
//                 console.log('Download completed');
//                 res.end();
//             });
//             file.on('error', function (err) {
//                 console.log('Error while downloading file:', err);
//                 res.status(500).send('Error while downloading file');
//             });
//         } else {
//             // Handle full file download requests
//             const file = fs.createReadStream(filepath);
//             file.pipe(res);
//         }
//     } catch (error) {
//         console.log('error: ', error);
//         res.send(500)
//     }
// });
// server.listen(3000, () => {
//   console.log('Server is listening on port 3000');
// });
