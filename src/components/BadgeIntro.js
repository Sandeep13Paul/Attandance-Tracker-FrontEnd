import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function BadgeIntro({ badge, onDone }) {
    const [phase, setPhase] = useState("center"); // center → move
  
    useEffect(() => {
      const timer = setTimeout(() => {
        setPhase("move");
      }, 1200); // ⏱ show in center first
  
      return () => clearTimeout(timer);
    }, []);
  
    return (
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            layoutId={phase === "move" ? "badge" : undefined} // 🔥 ONLY here
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: phase === "center" ? 1.2 : 1,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onAnimationComplete={() => {
              if (phase === "move") {
                setTimeout(onDone, 400);
              }
            }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-10 rounded-3xl shadow-2xl text-center"
          >
            <div className="text-6xl">{badge.icon}</div>
            <div className="text-2xl font-bold mt-3">{badge.label}</div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
}