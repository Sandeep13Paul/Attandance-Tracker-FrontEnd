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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
    >
      <div className="text-sm opacity-80">Current Streak</div>

      {/* 🔥 Animated number */}
      <motion.div
        key={streak} // VERY IMPORTANT
        initial={{ scale: 0.6, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="flex items-center gap-3 mt-3"
      >
        <span className="text-5xl font-bold">{streak}</span>

        {/* 🔥 flame animation */}
        <motion.span
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="text-4xl"
        >
          🔥
        </motion.span>
      </motion.div>

      {/* Badge */}
      <div className="mt-4">
        <span className="px-3 py-1 rounded-full text-xs bg-white/20">
          {badge.icon} {badge.label}
        </span>
      </div>
    </motion.div>
  );
}