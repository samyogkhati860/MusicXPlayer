# sunkissed — Polaroid Music Player

A React + Tailwind music player UI (Polaroid album art, blurred background)
wired to the YouTube Data API v3 for search and the YouTube IFrame embed
for real playback.

## File hierarchy

```
music-player/
├── public/
│   └── favicon.svg              # tab icon
├── src/
│   ├── components/
│   │   ├── Background.jsx       # blurred album-art backdrop + tint overlay
│   │   ├── SearchBar.jsx        # search input, calls onSearch(query)
│   │   ├── Polaroid.jsx         # polaroid frame showing current album art
│   │   ├── ProgressBar.jsx      # seek slider bound to player time
│   │   ├── PlayerControls.jsx   # prev / play-pause / next buttons
│   │   ├── EqBars.jsx           # small animated "now playing" bars
│   │   ├── QueueItem.jsx        # single row in the queue list
│   │   └── Queue.jsx            # queue header + list of QueueItem
│   ├── hooks/
│   │   ├── useYouTubeSearch.js  # search() + videos.list -> track objects
│   │   └── useYouTubePlayer.js  # hidden iframe + postMessage player control
│   ├── utils/
│   │   ├── format.js            # parseISODuration, formatTime
│   │   └── youtubeApi.js        # raw fetch calls to the YouTube Data API
│   ├── config.js                # reads the API key from env, default query
│   ├── App.jsx                  # composes everything together
│   ├── main.jsx                 # React entry point
│   └── index.css                # Tailwind directives
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── .gitignore
```

### Why split it up this way

- **components/** — anything that returns JSX and is reusable/isolated on
  its own gets its own file. `Queue.jsx` only lays out the list; each row's
  markup lives in `QueueItem.jsx` so it's easy to restyle a single row
  without scrolling through the whole list.
- **hooks/** — anything stateful that isn't rendering: talking to the
  YouTube Data API (`useYouTubeSearch`) and driving the hidden YouTube
  player via `postMessage` (`useYouTubePlayer`). This is what lets
  `App.jsx` stay short — it just wires hooks to components.
- **utils/** — pure functions with no React and no side effects
  (formatting time, parsing ISO 8601 durations, building API URLs).
- **config.js** — the one place that knows about environment variables,
  so nothing else needs to reach into `import.meta.env` directly.

## Setup

```bash
npm install
cp .env.example .env
# put your YouTube Data API v3 key in .env
npm run dev
```

### About the API key

The key now lives in `.env` (via `VITE_YT_API_KEY`) instead of being
hardcoded in the source, and `.env` is git-ignored. This is still a
**client-side** key — it ships to the browser in the built app, so
restrict it in the Google Cloud console (HTTP referrer restriction +
YouTube Data API v3 only, maybe a daily quota) before deploying it
anywhere public. If you previously shared a key in chat or committed it
anywhere, rotate it.
