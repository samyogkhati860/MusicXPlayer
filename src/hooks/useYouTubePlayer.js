import { useCallback, useEffect, useRef, useState } from "react";

export function useYouTubePlayer(tracks) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const iframeRef = useRef(null);
  const currentTrack = tracks[currentIndex] || null;

  const playerReady = useRef(false);
  const autoplayRequested = useRef(false);

  // Send a command to YouTube
  const postToPlayer = useCallback((func, args = []) => {
    const win = iframeRef.current?.contentWindow;

    if (!win || !playerReady.current) return;

    win.postMessage(
      JSON.stringify({
        event: "command",
        func,
        args,
      }),
      "*"
    );
  }, []);

  // Reset player when a completely new search result arrives
  useEffect(() => {
    setCurrentIndex(0);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
  }, [tracks]);

  // Listen to YouTube messages
  useEffect(() => {
    function handleMessage(e) {
      if (typeof e.data !== "string") return;

      let data;

      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }

      if (data.event === "onReady") {
        playerReady.current = true;

        // If the user selected a track before YouTube finished loading,
        // start it now.
        if (autoplayRequested.current) {
          postToPlayer("playVideo");
          autoplayRequested.current = false;
          setIsPlaying(true);
        }

        return;
      }

      if (data.event === "infoDelivery" && data.info) {
        if (typeof data.info.currentTime === "number") {
          setCurrentTime(data.info.currentTime);
        }

        if (
          typeof data.info.duration === "number" &&
          data.info.duration > 0
        ) {
          setDuration(data.info.duration);
        }

        if (typeof data.info.playerState === "number") {
          const state = data.info.playerState;

          // 1 = playing
          // 2 = paused
          // 0 = ended
          if (state === 1) {
            setIsPlaying(true);
          }

          if (state === 2) {
            setIsPlaying(false);
          }

          if (state === 0) {
            setCurrentIndex((idx) =>
              tracks.length ? (idx + 1) % tracks.length : idx
            );
            setIsPlaying(true);
            autoplayRequested.current = true;
          }
        }
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [postToPlayer, tracks.length]);

  // Every time a new iframe loads, tell YouTube we are listening.
  const handleIframeLoad = useCallback(() => {
    playerReady.current = false;

    const win = iframeRef.current?.contentWindow;

    if (!win) return;

    // Establish communication with the YouTube iframe.
    win.postMessage(
      JSON.stringify({
        event: "listening",
        id: currentTrack?.id,
        channel: "widget",
      }),
      "*"
    );

    // Ask YouTube for state updates.
    win.postMessage(
      JSON.stringify({
        event: "command",
        func: "addEventListener",
        args: ["onStateChange"],
      }),
      "*"
    );

    // YouTube can take a moment to become ready.
    // Give it a few attempts to acknowledge the player.
    const attempts = [200, 500, 1000];

    attempts.forEach((delay) => {
      setTimeout(() => {
        if (!iframeRef.current?.contentWindow) return;

        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({
            event: "listening",
            id: currentTrack?.id,
            channel: "widget",
          }),
          "*"
        );
      }, delay);
    });
  }, [currentTrack]);

  // Play / pause button
  const playPause = useCallback(() => {
    if (!currentTrack) return;

    if (isPlaying) {
      postToPlayer("pauseVideo");
      setIsPlaying(false);
    } else {
      if (!playerReady.current) {
        autoplayRequested.current = true;
        return;
      }

      postToPlayer("playVideo");
      setIsPlaying(true);
    }
  }, [currentTrack, isPlaying, postToPlayer]);

  // Next
  const goNext = useCallback(() => {
    if (tracks.length === 0) return;

    playerReady.current = false;
    autoplayRequested.current = true;

    setCurrentTime(0);
    setDuration(0);

    setCurrentIndex((idx) => (idx + 1) % tracks.length);
    setIsPlaying(true);
  }, [tracks.length]);

  // Previous
  const goPrev = useCallback(() => {
    if (tracks.length === 0) return;

    playerReady.current = false;
    autoplayRequested.current = true;

    setCurrentTime(0);
    setDuration(0);

    setCurrentIndex(
      (idx) => (idx - 1 + tracks.length) % tracks.length
    );

    setIsPlaying(true);
  }, [tracks.length]);

  // Select a song from the queue
  const playTrack = useCallback((i) => {
    playerReady.current = false;
    autoplayRequested.current = true;

    setCurrentIndex(i);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(true);
  }, []);

  // Seek
  const seek = useCallback(
    (pct) => {
      if (!playerReady.current) return;

      const newTime = (pct / 100) * (duration || 0);

      postToPlayer("seekTo", [newTime, true]);

      setCurrentTime(newTime);
    },
    [duration, postToPlayer]
  );

  // IMPORTANT:
  // autoplay is NOT tied to isPlaying.
  // The iframe only changes when the actual song changes.
  const embedSrc = currentTrack
    ? `https://www.youtube.com/embed/${currentTrack.id}?enablejsapi=1&autoplay=1&controls=0&playsinline=1`
    : "";

  return {
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
  };
}