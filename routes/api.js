const express = require('express');
const axios = require('axios');
const { getAccessToken } = require('../spotify/token');
const Mood = require('../models/Mood');

const router = express.Router();

// Get mood-based playlists
router.get('/:emotion', async (req, res) => {
  const mood = req.params.emotion;
  try {
    await Mood.create({ mood });

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
    res.status(500).json({ error: 'Spotify playlist fetch failed' });
  }
});

// Manual search
router.get('/search/manual', async (req, res) => {
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
    res.status(500).json({ error: 'Manual search failed' });
  }
});

module.exports = router;
