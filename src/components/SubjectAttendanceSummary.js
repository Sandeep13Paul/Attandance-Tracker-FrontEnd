import { useMemo, useState } from "react";
import { Input } from "./ui/Field";

export default function SubjectAttendanceSummary({ data, loading = false }) {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const bySubject = new Map();
    const list = Array.isArray(data) ? data : [];

    for (const r of list) {
      const key = r.subjectId || r.subjectName || "Unknown";
      const name = r.subjectName || "Unknown";
      const cur = bySubject.get(key) || { key, subject: name, present: 0, total: 0 };
      cur.total += 1;
      if (r.present) cur.present += 1;
      bySubject.set(key, cur);
    }

    const q = query.trim().toLowerCase();
    const out = Array.from(bySubject.values())
      .map((s) => ({ ...s, percent: s.total ? Math.round((s.present / s.total) * 100) : 0 }))
      .filter((s) => !q || s.subject.toLowerCase().includes(q))
      .sort((a, b) => b.percent - a.percent || b.total - a.total);

    return out;
  }, [data, query]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <label className="grid gap-1 sm:max-w-xs">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Search subject
          </span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Math, English…"
          />
        </label>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {loading ? "Loading…" : `${rows.length} subjects`}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
              <tr>
                <th className="px-4 py-3">Subject</th>
                <th className="px-4 py-3">Attended</th>
                <th className="px-4 py-3">Held</th>
                <th className="px-4 py-3">%</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200/70 bg-white/60 dark:divide-slate-800 dark:bg-slate-950/20">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`s-${i}`} className="animate-pulse">
                    <td className="px-4 py-3">
                      <div className="h-4 w-48 rounded bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 rounded bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-16 rounded bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-4 w-20 rounded bg-slate-200/70 dark:bg-slate-800" />
                    </td>
                  </tr>
                ))}

              {!loading &&
                rows.map((s) => (
                  <tr
                    key={s.key}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-900/30"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {s.subject}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {s.present}
                    </td>
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                      {s.total}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
                          <div
                            className="h-full rounded-full bg-indigo-600 dark:bg-indigo-500"
                            style={{ width: `${s.percent}%` }}
                          />
                        </div>
                        <span className="text-slate-700 dark:text-slate-300">
                          {s.percent}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}

              {!loading && rows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                  >
                    No subject stats yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

