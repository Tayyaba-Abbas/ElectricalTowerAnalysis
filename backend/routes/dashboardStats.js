const express = require('express');
const router = express.Router();
const Upload = require('../models/Upload');
const History = require('../models/History');

// GET /api/dashboard/stats/:email
router.get('/stats/:email', async (req, res) => {
  const { email } = req.params;

  try {
    // 1. Total Analysis (All uploads)
    const totalAnalysis = await Upload.countDocuments({ email });

    // 2. Recent Uploads (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentUploads = await Upload.countDocuments({
      email,
      createdAt: { $gte: sevenDaysAgo }
    });

    // 3. Completed Reports (History)
    const completedReports = await History.countDocuments({ email });

    res.json({
      totalAnalysis,
      recentUploads,
      completedReports
    });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

module.exports = router;
 