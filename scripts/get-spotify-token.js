/**
 * One-time script to get your Spotify refresh token.
 * Run with: node scripts/get-spotify-token.js
 *
 * Before running, set these two environment variables:
 *   export SPOTIFY_CLIENT_ID=your_client_id
 *   export SPOTIFY_CLIENT_SECRET=your_client_secret
 *
 * Make sure your Spotify app has this Redirect URI added:
 *   http://localhost:3000/callback
 */

const http = require('http');
const { exec } = require('child_process');

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = 'http://127.0.0.1:3000/callback';
const SCOPE = 'user-read-currently-playing user-read-playback-state';

if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error('\nError: Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET before running.\n');
    process.exit(1);
}

const authUrl =
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: SCOPE,
        redirect_uri: REDIRECT_URI,
    });

console.log('\nOpening Spotify auth in your browser...');
console.log('If it does not open automatically, visit:\n' + authUrl + '\n');

// Try to open the browser
const openCmd =
    process.platform === 'darwin' ? `open "${authUrl}"` :
    process.platform === 'win32' ? `start "" "${authUrl}"` :
    `xdg-open "${authUrl}"`;
exec(openCmd, () => {});

// Start a temporary local server to catch the OAuth callback
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost:3000');
    if (url.pathname !== '/callback') return;

    const code = url.searchParams.get('code');
    const error = url.searchParams.get('error');

    if (error || !code) {
        res.writeHead(400);
        res.end('Authorization denied or failed. You can close this tab.');
        server.close();
        return;
    }

    // Exchange auth code for tokens
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization:
                'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        },
        body: new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI,
        }),
    });

    const json = await tokenRes.json();

    if (!json.refresh_token) {
        res.writeHead(500);
        res.end('Failed to get refresh token. Check your client credentials.');
        console.error('\nSpotify API error:', json);
        server.close();
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end('<h2 style="font-family:monospace">Success! Check your terminal for the refresh token. You can close this tab.</h2>');

    console.log('\n========================================');
    console.log('YOUR SPOTIFY REFRESH TOKEN:');
    console.log(json.refresh_token);
    console.log('========================================');
    console.log('\nAdd this to your Vercel project as the environment variable:');
    console.log('  SPOTIFY_REFRESH_TOKEN=' + json.refresh_token + '\n');

    server.close();
});

server.listen(3000, () => {
    console.log('Waiting for Spotify callback on http://localhost:3000/callback ...\n');
});
