import { useState, useRef } from "react";

export default function Stage4({ problem, handleSubmit}) {
  const [playing, setPlaying] = useState(false);
  const [watched, setWatched] = useState(false);
  const videoRef = useRef(null);

  // TODO: swap with real fetch when backend ready
  const videoUrl = "/two_sum.mp4";

  if (!videoUrl) return (
    <div className="mx-5 mt-5 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 text-center">
      <p className="text-white/30 text-sm">No visualization available yet.</p>
    </div>
  );

  const handlePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
      setWatched(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  return (
    <div className="px-5 mt-5 pb-6">
      <p className="text-[11px] uppercase tracking-widest text-white/30 mb-2">
        Optimal approach
      </p>
      {/* video */}
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        playsInline
        onEnded={() => setPlaying(false)}
        className="w-full rounded-2xl border border-white/10 mb-3"
      />

      {/* controls */}
      <div className="flex gap-2">
        <button
          onClick={handlePlayPause}
          className="flex-[2] bg-blue-500 text-white rounded-2xl py-3.5 text-[15px] font-medium active:opacity-85"
        >
          {playing ? "Pause" : "Play"}
        </button>
        <button
          className="flex-1 border bg-white text-black border-white/10 rounded-2xl py-3.5 text-[14px]"
          onClick={() => handleSubmit()}
        >
          Continue
        </button>
      </div>
    </div>
  );
}