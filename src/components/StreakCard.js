import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import BadgeModal from "../Modals/BadgeModal";

/* 🔥 Badge system */
const BADGES = [
  // 🌱 BEGINNER
  { min: 0, label: "Getting Started", icon: "❄️", color: "bg-gray-400/30 text-gray-200" },
  { min: 1, label: "Started", icon: "🌱", color: "bg-emerald-400/30 text-emerald-200" },
  { min: 2, label: "Warming Up", icon: "☀️", color: "bg-yellow-300/30 text-yellow-200" },
  { min: 3, label: "On Fire", icon: "🔥", color: "bg-red-400/30 text-red-200" },

  // 💪 EARLY CONSISTENCY
  { min: 5, label: "Committed", icon: "💪", color: "bg-indigo-400/30 text-indigo-200" },
  { min: 7, label: "Consistent", icon: "🚀", color: "bg-blue-400/30 text-blue-200" },
  { min: 10, label: "Focused", icon: "🎯", color: "bg-green-400/30 text-green-200" },

  // 🧠 MID LEVEL
  { min: 14, label: "Disciplined", icon: "📘", color: "bg-sky-400/30 text-sky-200" },
  { min: 21, label: "Master", icon: "🧠", color: "bg-pink-400/30 text-pink-200" },
  { min: 30, label: "Elite", icon: "💎", color: "bg-cyan-400/30 text-cyan-200" },

  // ⚡ HIGH LEVEL
  { min: 45, label: "Relentless", icon: "⚡", color: "bg-yellow-400/30 text-yellow-200" },
  { min: 60, label: "Unstoppable", icon: "🔥🚀", color: "bg-orange-400/30 text-orange-200" },

  // 🏆 PRO LEVEL
  { min: 75, label: "Champion", icon: "🏆", color: "bg-amber-400/30 text-amber-200" },
  { min: 100, label: "Immortal", icon: "🧬", color: "bg-purple-500/30 text-purple-200" },

  // 👑 LEGENDARY
  { min: 150, label: "Mythic", icon: "🌌", color: "bg-indigo-500/30 text-indigo-200" },
  { min: 200, label: "God Mode", icon: "👑", color: "bg-fuchsia-500/30 text-fuchsia-200" },
];

export const getBadge = (streak) => {
  return [...BADGES].reverse().find((b) => streak >= b.min);
};

const getNextBadge = (streak) => {
  return BADGES.find((b) => b.min > streak) || null;
};

export default function StreakCard({ streak }) {
  const badge = getBadge(streak);
  const next = getNextBadge(streak);

  const prevBadge = useRef();
  const audioRef = useRef(null);

  const [showBadges, setShowBadges] = useState(false);

  /* 🔊 Initialize audio */
  useEffect(() => {
    audioRef.current = new Audio("/success.mp3");
  }, []);

  /* 🔊 Safe sound play (no error) */
  const playSound = () => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;

    const promise = audioRef.current.play();
    if (promise !== undefined) {
      promise.catch(() => {
        // ignore autoplay block
      });
    }
  };

  /* 🎉 Badge unlock effect */
  useEffect(() => {
    if (prevBadge.current && prevBadge.current !== badge.label) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      playSound(); // safe
    }

    prevBadge.current = badge.label;
  }, [badge]);

  /* 📊 Progress calculation */
  let progress = 100;
  if (next) {
    const currentMin = badge.min;
    const nextMin = next.min;

    progress =
      ((streak - currentMin) / (nextMin - currentMin)) * 100;
  }

  return (
    <motion.div
      className="
        relative
        h-full min-h-[140px]
        rounded-2xl p-4
        bg-gradient-to-r from-indigo-500 to-purple-600
        text-white shadow-md
        flex flex-col justify-between
      "
    >
      {/* 🔹 TOP LEFT */}
      <div className="text-xs opacity-80">
        CURRENT STREAK
      </div>

      {/* 🔹 BOTTOM LEFT (Badge + Progress) */}
      <div className="space-y-2">
        {/* Badge */}
        <motion.span
          layoutId="badge"
          key={badge.label}
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200 }}
          onClick={() => setShowBadges(true)}
          className={`cursor-pointer inline-block text-xs px-2 py-1 rounded-full ${badge.color}`}
        >
          {badge.icon} {badge.label}
        </motion.span>

        {/* Progress bar */}
        {next && (
          <div>
            <div className="text-[10px] opacity-70 mb-1">
              Next: {next.label} ({next.min - streak} days)
            </div>

            <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 🔥 RIGHT CENTER (number + flame) */}
      <div className="absolute top-4 right-4 flex items-center gap-1">
        <motion.div
          key={streak}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="flex items-center gap-2"
        >
          <span className="text-5xl font-bold leading-none">
            {streak}
          </span>

          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-3xl"
          >
            🔥
          </motion.span>
        </motion.div>
      </div>
      <BadgeModal
        open={showBadges}
        onClose={() => setShowBadges(false)}
        streak={streak}
        badges={BADGES}
      />
    </motion.div>
  );
}