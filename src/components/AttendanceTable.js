import { useMemo, useState } from "react";
import Button from "./ui/Button";
import { Input, Select } from "./ui/Field";

export default function AttendanceTable({ data, loading = false }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all"); // all | present | absent
  const [sort, setSort] = useState("date_desc"); // date_desc | date_asc

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = Array.isArray(data) ? data : [];

    if (status !== "all") {
      const wantPresent = status === "present";
      rows = rows.filter((r) => Boolean(r.present) === wantPresent);
    }

    if (q) {
      rows = rows.filter((r) => {
        const hay = `${r.userName || ""} ${r.subjectName || ""} ${r.date || ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    rows = [...rows].sort((a, b) => {
      const ad = a.date || "";
      const bd = b.date || "";
      if (sort === "date_asc") return ad.localeCompare(bd);
      return bd.localeCompare(ad);
    });

    return rows;
  }, [data, query, sort, status]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/70 dark:border-slate-800">
      <div className="flex flex-col gap-3 border-b border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/20 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-2 sm:grid-cols-3 sm:items-end">
          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Search
            </span>
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="User, subject, or date…"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Status
            </span>
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </Select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Sort
            </span>
            <Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="date_desc">Newest first</option>
              <option value="date_asc">Oldest first</option>
            </Select>
          </label>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Showing <span className="font-medium">{filtered.length}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery("");
              setStatus("all");
              setSort("date_desc");
            }}
            disabled={!query && status === "all" && sort === "date_desc"}
          >
            Reset
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-900/40 dark:text-slate-300">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Subject</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200/70 bg-white/60 dark:divide-slate-800 dark:bg-slate-950/20">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={`skeleton-${i}`} className="animate-pulse">
                  <td className="px-4 py-3">
                    <div className="h-4 w-40 rounded bg-slate-200/70 dark:bg-slate-800" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-44 rounded bg-slate-200/70 dark:bg-slate-800" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-4 w-28 rounded bg-slate-200/70 dark:bg-slate-800" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="h-6 w-20 rounded-full bg-slate-200/70 dark:bg-slate-800" />
                  </td>
                </tr>
              ))}

            {!loading &&
              filtered.map((a, i) => (
              <tr
                key={i}
                className="hover:bg-slate-50/80 dark:hover:bg-slate-900/30"
              >
                <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                  {a.userName}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                  {a.subjectName}
                </td>
                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                  {a.date}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
                      a.present
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                        : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
                    ].join(" ")}
                  >
                    {a.present ? "Present" : "Absent"}
                  </span>
                </td>
              </tr>
            ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-slate-500 dark:text-slate-400"
                >
                  No matching records. Try adjusting filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}