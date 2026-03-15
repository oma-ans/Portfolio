# Spotify "Currently Listening" Setup

Follow these steps once before deploying to Vercel.

---

## 1. Create a Spotify Developer App

1. Go to https://developer.spotify.com/dashboard and log in
2. Click **Create app**
3. Fill in a name/description (e.g. "Portfolio Now Playing")
4. Set **Redirect URI** to: `http://127.0.0.1:3000/callback`
5. Check "Web API" under APIs used → Save
6. From the app dashboard, copy your **Client ID** and **Client Secret**

---

## 2. Get Your Refresh Token (one-time)

```bash
# Set your credentials
export SPOTIFY_CLIENT_ID=your_client_id_here
export SPOTIFY_CLIENT_SECRET=your_client_secret_here

# Run the token helper (requires Node 18+)
node scripts/get-spotify-token.js
```

Your browser will open Spotify's auth page. Log in and approve. The terminal will print your **refresh token**.

---

## 3. Add Environment Variables to Vercel

In your Vercel project dashboard → **Settings → Environment Variables**, add:

| Name | Value |
|---|---|
| `SPOTIFY_CLIENT_ID` | from step 1 |
| `SPOTIFY_CLIENT_SECRET` | from step 1 |
| `SPOTIFY_REFRESH_TOKEN` | from step 2 |

---

## 4. Deploy

```bash
npx vercel --prod
```

The live card will automatically show your current track whenever you have Spotify open and playing.

---

## Notes

- The card polls `/api/now-playing` every **30 seconds**
- When nothing is playing, the card shows a dimmed "Not currently listening" state
- Your credentials are never exposed to the browser — all Spotify API calls happen server-side in the Vercel function
