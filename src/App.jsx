import React, { useEffect } from "react";
import Background from "./components/Background.jsx";
import SearchBar from "./components/SearchBar.jsx";
import Polaroid from "./components/Polaroid.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import PlayerControls from "./components/PlayerControls.jsx";
import Queue from "./components/Queue.jsx";
import { useYouTubeSearch } from "./hooks/useYouTubeSearch.js";
import { fetchPlaylistTracks } from "./utils/youtubeApi.js";
import { useYouTubePlayer } from "./hooks/useYouTubePlayer.js";
import { DEFAULT_QUERY } from "./config.js";
import SavedPlaylists from "./components/SavedPlaylists.jsx";

export default function App() {
 const {
  tracks,
  setTracks,
  loading,
  error,
  runSearch,
} = useYouTubeSearch();
  const {
    iframeRef,
    embedSrc,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    handleIframeLoad,
    playPause,
    goNext,
    goPrev,
    playTrack,
    seek,
  } = useYouTubePlayer(tracks);
const handlePlaylistLoad = async (url) => {
  const match = url.match(/[?&]list=([^&]+)/);

  if (!match) {
    throw new Error("That doesn't look like a valid YouTube playlist URL.");
  }

  const playlistId = match[1];

  const playlistTracks = await fetchPlaylistTracks(playlistId);

  if (playlistTracks.length === 0) {
    throw new Error("No playable videos found in that playlist.");
  }

  setTracks(playlistTracks);
};
  // Populate a starter queue on first load.
  useEffect(() => {
    runSearch(DEFAULT_QUERY);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="relative w-full min-h-screen flex flex-col items-center overflow-hidden px-5 py-8"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}
    >
      <Background imageUrl={currentTrack?.thumb} />

      {currentTrack && (
        <iframe
          key={currentTrack.id}
          ref={iframeRef}
          title="player"
          src={embedSrc}
          allow="autoplay; encrypted-media"
          onLoad={handleIframeLoad}
          style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
        />
      )}

      <div className="relative w-full max-w-sm flex flex-col items-center gap-6">
       <SearchBar
  onSearch={runSearch}
  onPlaylistLoad={handlePlaylistLoad}
  loading={loading}
/>
        {error && (
          <div className="w-full text-center text-sm text-white/90 bg-black/20 rounded-lg py-2 px-3">{error}</div>
        )}

        <Polaroid track={currentTrack} />

        <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />

        <PlayerControls isPlaying={isPlaying} onPrev={goPrev} onPlayPause={playPause} onNext={goNext} />

        <Queue
  tracks={tracks}
  currentIndex={currentIndex}
  isPlaying={isPlaying}
  loading={loading}
  onPlayTrack={playTrack}
/>

<SavedPlaylists
  tracks={tracks}
  onLoadPlaylist={setTracks}
/>
      </div>
    </div>
  );
}
