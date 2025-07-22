const express = require('express');
const router = express.Router();
const { getAccessToken } = require('../spotify');
const Mood = require('../models/Mood');
const axios = require('axios');

// Mood-based playlist
router.get('/mood/:emotion', async (req, res) => {
  const mood = req.params.emotion;

  // Save mood to MongoDB
  await Mood.create({ mood });

  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q: `${mood} mood`,
        type: 'playlist',
        limit: 5
      }
    });

    res.json(response.data.playlists.items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Spotify mood fetch failed' });
  }
});

// Manual search (emoji or text)
router.get('/search', async (req, res) => {
  const q = req.query.q;
  try {
    const token = await getAccessToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q,
        type: 'track,artist,playlist',
        limit: 10
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
