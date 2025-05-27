import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from './mongoClients.js';

const router = express.Router();

router.get('/recent', async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) return res.status(400).json({ error: 'Missing email query param' });

  try {
    const db = await getDb();
    const collection = db.collection('predictions');
    const predictions = await collection
      .find({ email: userEmail })
      .sort({ timestamp: -1 })
      .limit(5)
      .toArray();

    if (!predictions.length) return res.status(404).json({ message: 'No records found' });
    res.json(predictions);
  } catch (err) {
    console.error('Error in /recent:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) return res.status(400).json({ error: 'Missing email query param' });

  try {
    const db = await getDb();
    const collection = db.collection('predictions');
    const predictions = await collection
      .find({ email: { $regex: `^${userEmail}$`, $options: 'i' } })

      .sort({ timestamp: -1 })
      .toArray();

    res.json(predictions);
  } catch (err) {
    console.error('Error in /all:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/prediction/:id', async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid ID format' });

  try {
    const db = await getDb();
    const collection = db.collection('predictions');
    const prediction = await collection.findOne({ _id: new ObjectId(id) });

    if (!prediction) return res.status(404).json({ message: 'Prediction not found' });
    res.json(prediction);
  } catch (err) {
    console.error('Error fetching prediction detail:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/summary', async (req, res) => {
  const userEmail = req.query.email;
  if (!userEmail) {
    console.log('❌ /summary route called without email query param');
    return res.status(400).json({ error: 'Missing email query param' });
  }

  console.log(`📥 /summary route called for email: ${userEmail}`);


  try {
    const db = await getDb();
    const collection = db.collection('predictions');
    const matchQuery = { email: { $regex: `^${userEmail}$`, $options: 'i' } };

    console.log('🔍 Running countDocuments with matchQuery:', matchQuery);

    const totalPredictions = await collection.countDocuments(matchQuery);
    console.log(`📊 Total predictions found: ${totalPredictions}`);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    console.log(`🔍 Counting predictions since: ${sevenDaysAgo}`);

    const recentPredictions = await collection.countDocuments({
      ...matchQuery,
      timestamp: { $gte: sevenDaysAgo },
    });
    console.log(`📊 Recent predictions in last 7 days: ${recentPredictions}`);

    res.json({ totalPredictions, recentPredictions });
    console.log('✅ /summary response sent');
  } catch (err) {
    console.error('❌ Error in /summary route:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


export default router;