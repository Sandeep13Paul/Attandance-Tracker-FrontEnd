import { motion } from "framer-motion";

const getBadge = (streak) => {
  if (streak >= 15) return { label: "Legend", icon: "🏆" };
  if (streak >= 7) return { label: "Consistent", icon: "🚀" };
  if (streak >= 3) return { label: "On Fire", icon: "🔥" };
  return { label: "Getting Started", icon: "❄️" };
};

export default function StreakCard({ streak }) {
  const badge = getBadge(streak);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="
        h-full min-h-[105px]
        rounded-2xl p-4
        bg-gradient-to-r from-indigo-500 to-purple-600
        text-white shadow-md
        flex flex-col justify-between
      "
    >
      {/* 🔹 Top Row */}
      <div className="flex justify-between items-start">
        {/* LEFT: Title */}
        <div className="text-xs opacity-80">
          CURRENT STREAK
        </div>

        {/* RIGHT: Animated value */}
        <motion.div
          key={streak}
          initial={{ scale: 0.7 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180 }}
          className="flex items-center gap-1 text-center"
        >
          <span className="text-5xl font-bold leading-none">{streak}</span>

          <motion.span
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="text-3xl"
          >
            🔥
          </motion.span>
        </motion.div>
      </div>

      {/* 🔹 Bottom Badge */}
      <div>
        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
          {badge.icon} {badge.label}
        </span>
      </div>
    </motion.div>
  );
}