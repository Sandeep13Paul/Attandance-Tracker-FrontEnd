import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { Filler } from "../components/Filters";
import AttendanceTable from "../components/AttendanceTable";
import AttendanceChart from "../components/AttendanceChart";
import AttendanceCalendar from "../components/AttendanceCalendar";
import { fetchAttendance } from "../services/api";
import AttendanceControls from "../components/AttendanceControls";
import UserSubjectForm from "../components/UserSubjectForm";
import SubjectAttendanceSummary from "../components/SubjectAttendanceSummary";
import Card from "../components/ui/Card";
import StatCard from "../components/ui/StatCard";
import SubjectChart from "../components/SubjectChart";
import { fetchSubjectStats } from "../services/api";
import { fetchUsers } from "../services/api";
import { useRealtime } from "../Hooks/WebSocketHook";
import { fetchStreak, fetchLowAttendance, fetchNeeded } from "../services/api";
import { fetchWeeklyTrend } from "../services/api";
import { WeeklyTrend } from "../components/WeeklyTrendChart";
import StreakCard from "../components/StreakCard";

export default function Dashboard({ authInfo }) {
  const [data, setData] = useState([]);
  const [start] = useState("2026-01-01");
  const [end] = useState("2026-12-31");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [subjectStats, setSubjectStats] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lowSubjects, setLowSubjects] = useState([]);
  const [weeklyTrend, setWeeklyTrend] = useState([]);
  const [neededData, setNeededData] = useState([]);
  

  const isAdmin = Boolean(authInfo?.isAdmin);
  // Backend already filters results based on authHeader/role.
  // For students, we show what the API returns.
  const visibleData = useMemo(() => data, [data]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchAttendance(start, end, page, size);
      setData(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (e) {
      setError(e?.message || "Failed to load attendance.");
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [start, end, page, size]);

  useRealtime(loadData);

  useEffect(() => {
    setPage(0);
  }, [start, end]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadSubjectStats = useCallback(async () => {
    const res = await fetchSubjectStats(
      isAdmin ? selectedUserId : null
    );
    setSubjectStats(res.data || []);
  }, [selectedUserId, isAdmin]);

  useEffect(() => {
    loadSubjectStats();
  }, [loadSubjectStats]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers().then((res) => setUsers(res || []));
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && users.length > 0 && !selectedUserId) {
      setSelectedUserId(users[0].id);
    }
  }, [users, isAdmin, selectedUserId]);

  const loadStreak = useCallback(async () => {
    try {
      const res = await fetchStreak();
      setStreak(res.data || 0);
    } catch (e) {
      console.error("streak error", e);
    }
  }, []);

  useEffect(() => {
    loadStreak();
  }, [loadStreak]);

  const loadLowSubjects = useCallback(async () => {
    try {
      const res = await fetchLowAttendance();
      setLowSubjects(res.data || []);
    } catch (e) {
      console.error("low attendance error", e);
    }
  }, []);

  useEffect(() => {
    loadLowSubjects();
  }, [loadLowSubjects]);

  const loadTrend = useCallback(async () => {
    try {
      const res = await fetchWeeklyTrend(start, end);

      console.log("TREND API:", res);

      setWeeklyTrend(res.data || []); // ✅ THIS IS THE FIX
    } catch (e) {
      console.error("trend error", e);
    }
  }, [start, end]);

  useEffect(() => {
    loadTrend();
  }, [loadTrend]);

  const refreshAll = useCallback(() => {
    loadData();
    loadSubjectStats();
    loadStreak();
    loadLowSubjects();
    loadTrend();
  }, [loadData, loadSubjectStats, loadStreak, loadLowSubjects, loadTrend]);

  const loadNeeded = async () => {
    const res = await fetchNeeded(authInfo?.userId);
    setNeededData(res.data || []);
  };

  useEffect(() => {
    loadNeeded();
  }, [loadNeeded]);

  const totalNeeded = neededData.reduce((sum, s) => sum + s.needed, 0);

  const worst = neededData.reduce((max, s) =>
    s.needed > max.needed ? s : max,
    { needed: 0 }
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
            Attendance Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Manage users/subjects, mark attendance, and analyze trends.
          </p>
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          Range: <span className="font-medium">{start}</span> →{" "}
          <span className="font-medium">{end}</span>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100">
          {error}
        </div>
      )}

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Records"
          value={loading ? "…" : page * size + visibleData.length}
          hint="In current date range"
          tone="neutral"
        />
        <StatCard
          label="Present"
          value={
            loading
              ? "…"
              : `${visibleData.length ? Math.round((visibleData.filter((d) => d.present).length / visibleData.length) * 100) : 0}%`
          }
          hint={loading ? "" : `${visibleData.filter((d) => d.present).length} present`}
          tone="success"
        />
        <StatCard
          label="Absent"
          value={loading ? "…" : visibleData.filter((d) => !d.present).length}
          hint="Marked absent"
          tone="danger"
        />
        <StatCard
          label="Needed"
          value={totalNeeded}
          hint={
            totalNeeded === 0
              ? "All subjects safe 🎉"
              : `Max: ${worst.subject} (${worst.needed})`
          }
          tone={totalNeeded === 0 ? "success" : "warning"}
          className={
            s.needed === 0
              ? "text-green-500"
              : "text-red-500"
          }
        />

        {/* 🔥 Hover popup */}
        <div className="absolute hidden group-hover:block z-50 bg-white dark:bg-slate-900 shadow-xl rounded-xl p-4 w-64 top-full mt-2">
          {neededData.map((s) => (
            <div key={s.subject} className={`flex justify-between text-sm py-1 px-2 rounded ${
              s.needed === 0
                ? "text-green-500 bg-green-500/10"
                : "text-red-500 bg-red-500/10"
            }`}>
              <span>{s.subject}</span>
              <span>
                {s.needed === 0
                  ? "✅ Safe"
                  : `${s.needed} needed`}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="sm:col-span-2 lg:col-span-4 mb-5" hint="Excludes weekends & holidays" title="Streak counts only working days">
        <StreakCard streak={streak} />
      </div>

      {lowSubjects.length > 0 && (
        <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-6">
          ⚠️ Low Attendance:
          {lowSubjects.map((s) => (
            <div key={s.subject}>
              {s.subject} - {Math.round(s.percent)}%
            </div>
          ))}
        </div>
      )}

      <div className="grid gap-5">
        {isAdmin && (
          <Card
            title="Add users & subjects"
            description="Admin-only: create users and subjects for attendance tracking."
          >
            <UserSubjectForm refresh={loadData} />
          </Card>
        )}

        <Card
          title="Mark attendance"
          description={
            isAdmin
              ? "Admin: select a user and subject, then mark present/absent."
              : "Select a subject, then mark your attendance."
          }
        >
          <AttendanceControls
            refresh={refreshAll}   // ✅ FIX
            data={visibleData}
            isAdmin={isAdmin}
            currentUserId={authInfo?.userId || ""}
          />
        </Card>

        {/* <Card
          title="Filter"
          description="Limit records by date range to focus the dashboard."
        >
          <Filters
            start={start}
            end={end}
            setStart={setStart}
            setEnd={setEnd}
            onFilter={loadData}
          />
        </Card> */}

        <Card
          title="Attendance log"
          description="Recent records in a clean, sortable-looking table."
          className="mt-4"
        >
          <AttendanceTable data={visibleData} loading={loading} />
          <div className="flex justify-between items-center mt-4">
            <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
            <span className="text-sm">Page {page + 1} of {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
          </div>
        </Card>

        <Card
          className="mt-4"
          title="Subject-wise Attendance Log"
          description="Total classes attended out of classes held, per subject."
        >
          <SubjectAttendanceSummary data={visibleData} loading={loading} />
        </Card>

        <div className="grid gap-5 mt-4">
          <Card title="Subject-wise Attendance Graph" description="Total classes attended out of classes held, per subject.">
            {isAdmin && (
              <div className="mb-3">
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="h-12 px-4 rounded-xl border bg-white text-black border-gray-300 dark:bg-slate-900 dark:text-white dark:border-slate-700"
                >
                  <option value="">Select User</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <SubjectChart data={subjectStats} />
          </Card>
        </div>

        <div className="grid gap-20 lg:grid-cols-2 mt-4">
          <Card title="Monthly attendance" description="Percentage present by month.">
            <AttendanceChart data={visibleData} />
          </Card>

          <Card title="Calendar view" description="Quick glance presence heatmap.">
            <AttendanceCalendar data={visibleData} />
          </Card>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="col-span-1 lg:col-span-2 mt-4" title="Weekly Trend" description="Attendance % per week">
            <div className="p-4 mt-2">
              <WeeklyTrend data={weeklyTrend} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}