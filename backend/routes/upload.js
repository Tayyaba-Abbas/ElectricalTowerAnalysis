const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const Upload = require('../models/Upload');
const mongoose = require('mongoose');
const router = express.Router();

// Save uploaded images in /uploads folder
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // unique filename
  }
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const email = req.body.email;

    console.log("Received email from request body:", email);

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const originalImagePath = req.file.path;
    const originalFileName = path.basename(originalImagePath); // e.g., 1743927165422.jpg

    // Construct the segmented image path
    const segmentedImagePath = path.join('segment_output', 'results', originalFileName);

    // Run Python script and pass original and target segmented path
    const pythonProcess = spawn('C:\\Python313\\python.exe', ['run_model.py', originalImagePath, segmentedImagePath]);

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        return res.status(500).json({ message: 'Python script failed' });
      }

      const uploadRecord = new Upload({
        email,
        originalImage: originalImagePath,
        segmentedImage: segmentedImagePath // save constructed path
      });

      await uploadRecord.save();

      res.json({ success: true, segmentedImage: segmentedImagePath });
    });

  } catch (err) {
    console.error('Error in upload route:', err);
    res.status(500).send('Server Error');
  }
});

// Route to fetch the segmented images for a specific user
router.get('/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log("Received email:", email);  // Log the email to confirm it's being received
    const uploads = await Upload.find({ email });

    if (uploads.length > 0) {
      console.log(`Found ${uploads.length} uploads for ${email}`);
      res.status(200).json(uploads);
    } else {
      res.status(404).json({ message: 'No uploads found for this user' });
    }
  } catch (error) {
    console.error('Error fetching uploads:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;