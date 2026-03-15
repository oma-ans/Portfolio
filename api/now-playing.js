export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;

    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
        return res.status(500).json({ error: 'Spotify credentials not configured' });
    }

    // Exchange refresh token for a fresh access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64'),
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: SPOTIFY_REFRESH_TOKEN,
        }),
    });

    if (!tokenResponse.ok) {
        return res.status(500).json({ error: 'Failed to refresh access token' });
    }

    const { access_token } = await tokenResponse.json();

    // Fetch currently playing track
    const npResponse = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
        headers: { Authorization: `Bearer ${access_token}` },
    });

    // 204 = Spotify is open but nothing is playing
    if (npResponse.status === 204) {
        return res.status(200).json({ isPlaying: false });
    }

    if (!npResponse.ok) {
        return res.status(500).json({ error: 'Failed to fetch now playing' });
    }

    const data = await npResponse.json();

    if (!data || !data.item) {
        return res.status(200).json({ isPlaying: false });
    }

    return res.status(200).json({
        isPlaying: data.is_playing,
        title: data.item.name,
        artist: data.item.artists.map(a => a.name).join(', '),
        album: data.item.album.name,
        albumArt: data.item.album.images[0]?.url ?? '',
        progress: data.progress_ms,
        duration: data.item.duration_ms,
        trackUrl: data.item.external_urls?.spotify ?? '',
    });
}
