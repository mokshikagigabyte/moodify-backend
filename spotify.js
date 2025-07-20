const axios = require('axios');
require('dotenv').config();

let accessToken = '';
let expiresAt = 0;

async function getAccessToken() {
  const now = Date.now();
  if (accessToken && now < expiresAt) return accessToken;

  const response = await axios.post('https://accounts.spotify.com/api/token',
    new URLSearchParams({ grant_type: 'client_credentials' }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(
          process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
        ).toString('base64')
      }
    }
  );

  accessToken = response.data.access_token;
  expiresAt = now + response.data.expires_in * 1000;
  return accessToken;
}

module.exports = { getAccessToken };
