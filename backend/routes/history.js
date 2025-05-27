const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const History = require('../models/History'); // apna model yahan import karo

// Multer setup for PDF upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/pdfs'); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// POST /api/history/upload
router.post('/upload', upload.single('pdf'), async (req, res) => {
  try {
    const { email } = req.body;
    const pdfFile = req.file.filename;

    const history = new History({
      email,
      pdfFile,
    });

    await history.save();

    res.status(200).json({ message: 'PDF uploaded and history saved' });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/history/:email (Fetch history for specific email)
router.get('/:email', async (req, res) => {
  try {
    const userEmail = req.params.email;

    // Fetch the history records for the given email
    const history = await History.find({ email: userEmail });

    // Append the correct full path for the PDF
    const updatedHistory = history.map(item => ({
      ...item._doc,
      fullPath: path.join('uploads/pdfs', item.pdfFile), // Path to PDF
    }));

    // Send the response with the updated history
    res.json(updatedHistory);
  } catch (err) {
    console.error('Error fetching history:', err);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;