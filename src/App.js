import Dashboard from "./pages/Dashboard";
import { useEffect, useState } from "react";
import Button from "./components/ui/Button";

function App() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Initialize theme (stored preference wins, otherwise follow OS)
    const stored = localStorage.getItem("theme");
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    const isDark = stored ? stored === "dark" : prefersDark;
    setDark(isDark);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen bg-[radial-gradient(60rem_60rem_at_20%_-10%,rgba(99,102,241,0.18),transparent),radial-gradient(60rem_60rem_at_80%_0%,rgba(16,185,129,0.14),transparent)] dark:bg-[radial-gradient(60rem_60rem_at_20%_-10%,rgba(99,102,241,0.10),transparent),radial-gradient(60rem_60rem_at_80%_0%,rgba(16,185,129,0.10),transparent)]">
        <div className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/70 backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
            <div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Attendance
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400">
                Track presence by user, subject, and date
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDark((v) => !v)}
              aria-pressed={dark}
            >
              {dark ? "Light mode" : "Dark mode"}
            </Button>
          </div>
        </div>

        <Dashboard />
    </div>
  );
}

export default App;