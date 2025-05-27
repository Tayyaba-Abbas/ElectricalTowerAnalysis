// import path from 'path';
// import { fileURLToPath } from 'url';
// import express from 'express';
// import multer from 'multer';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// import { spawn } from 'child_process'; // 👈 Added child_process

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = 3000;

// app.use(cors());
// app.use(bodyParser.json());
// //app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use('/uploads', express.static('uploads'));
// app.use('/results', express.static('results'));

// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   next();
// });


// // Multer setup
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "backend/uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });

// const upload = multer({ storage: storage });

// // Upload + prediction route
// app.post("/upload", upload.single("image"), (req, res) => {
//   const imagePath = path.join(__dirname, 'uploads', req.file.filename);

//   // Run Python model
//   const pythonProcess = spawn('python', [path.join(__dirname, 'backend', 'model.py'),       imagePath]);
  
//   let predictionData = '';
  
//   pythonProcess.stdout.on('data', (data) => {
//     predictionData += data.toString();
//   });
  
//   pythonProcess.stderr.on('data', (data) => {
//     console.error(`stderr: ${data}`);
//   });
  
//   pythonProcess.on('close', (code) => {
//     console.log(`Python process exited with code ${code}`);
  
//     res.json({
//       message: "Image uploaded and analyzed!",
//       imageUrl: `/uploads/${req.file.filename}`,
//       prediction: predictionData.trim(), // ✅ use it here
//     });
//   });
// });
  
  
// // Root route to test if server is up
// app.get('/', (req, res) => {
//   res.send('🚀 Server is running fine!');
// });
// // Start server
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at: http://localhost:${PORT}`);
// });





import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import multer from 'multer';
import cors from 'cors';
import bodyParser from 'body-parser';
import { spawn } from 'child_process'; // 👈 Added child_process
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import recordsRoute from './routes/records.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📦 Load .env variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log("MONGO_URI:", process.env.MONGO_URI); // Debug check

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:8080', // Allow frontend origin
  credentials: true                // Allow cookies, tokens, etc. if needed
}));

// 🔧 Middleware
app.use(express.json());

 app.use(bodyParser.json());
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads', express.static('uploads'));
app.use('/results', express.static('results'));






// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected!"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use('/api/records', recordsRoute);

app.get('/api/records/test', (req, res) => {
  res.json({ message: "Route works!" });
});


// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "backend/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Upload + prediction route
app.post("/upload", upload.single("image"), (req, res) => {
  const imagePath = path.join(__dirname, 'uploads', req.file.filename);

  // Run Python model
  const pythonProcess = spawn('python', [path.join(__dirname, 'backend', 'model.py'),       imagePath]);
  
  let predictionData = '';
  
  pythonProcess.stdout.on('data', (data) => {
    predictionData += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
  
    res.json({
      message: "Image uploaded and analyzed!",
      imageUrl: `/uploads/${req.file.filename}`,
      prediction: predictionData.trim(), // ✅ use it here
    });
  });
});
  
  
// Root route to test if server is up
app.get('/', (req, res) => {
  res.send('🚀 Server is running fine!');
});
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});


