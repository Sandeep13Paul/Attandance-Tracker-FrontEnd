import { motion, AnimatePresence } from "framer-motion";

export default function BadgeModal({ open, onClose, streak, badges }) {
  if (!open) return null;

  // 👉 find next badge
  const nextBadge = badges.find((b) => b.min > streak);

  // 👉 count unlocked
  const unlockedCount = badges.filter((b) => streak >= b.min).length;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-[420px] shadow-2xl"
        >
          {/* HEADER */}
          <h2 className="text-lg font-semibold mb-1">
            Your Badge Journey
          </h2>

          <div className="text-xs opacity-90 mb-4">
            {unlockedCount} / {badges.length} unlocked
          </div>

          {/* LIST */}
          <div className="space-y-3 max-h-[400px] overflow-auto pr-1">
            {badges.map((b) => {
              const unlocked = streak >= b.min;
              const isNext = nextBadge && nextBadge.label === b.label;
              const isHidden = !unlocked && !isNext;

              return (
                <div
                  key={b.label}
                  className={`flex justify-between items-center p-4 rounded-xl transition-all
                    ${
                      unlocked
                        ? "bg-emerald-500/25 text-emerald-900 dark:text-emerald-200 border border-emerald-400/40"
                        : isNext
                        ? "bg-yellow-400/20 text-yellow-900 dark:text-yellow-200 border border-yellow-400/30"
                        : "bg-slate-300 text-slate-500 dark:bg-slate-800 dark:text-slate-400 blur-[1px]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {/* ICON */}
                    <span className="text-2xl drop-shadow">
                      {isHidden ? "🔒" : b.icon}
                    </span>

                    {/* TEXT */}
                    <div>
                      <div className="font-semibold text-base">
                        {isHidden ? "???" : b.label}
                      </div>

                      <div className="text-xs opacity-80">
                        {unlocked
                          ? "Unlocked"
                          : isNext
                          ? `${b.min - streak} days to unlock`
                          : "Keep going to discover"}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT ICON */}
                  {unlocked && (
                    <span className="text-lg font-bold text-emerald-500">
                      ✔
                    </span>
                  )}

                  {isNext && !unlocked && (
                    <span className="text-xs font-semibold text-yellow-600">
                      NEXT
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* BUTTON */}
          <button
            onClick={onClose}
            className="mt-5 w-full py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:opacity-90 transition"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}