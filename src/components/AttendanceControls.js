import { useEffect, useState } from "react";
import { fetchUsers, fetchSubjects, markAttendance, markAll } from "../services/api";
import Button from "./ui/Button";
import { Select } from "./ui/Field";

export default function AttendanceControls({
  refresh,
  data = [],
  isAdmin = false,
  currentUserId = "",
}) {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [userId, setUserId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!isAdmin && currentUserId) {
      setUserId(String(currentUserId));
    }
  }, [isAdmin, currentUserId]);

  const today = new Date().toISOString().split("T")[0];
  const selectedSubject = subjects.find(
    (s) => String(s.id) === String(subjectId)
  );
  const alreadyMarked = data.some((a) => {
    if (String(a.userId) !== String(userId) || a.date !== today) return false;
    if (subjectId && a.subjectId != null)
      return String(a.subjectId) === String(subjectId);
    if (selectedSubject?.name && a.subjectName)
      return a.subjectName === selectedSubject.name;
    return false;
  });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
        .then(setUsers)
        .catch(() => setUsers([]));
    } else {
      setUsers([]);
    }
    fetchSubjects()
      .then(setSubjects)
      .catch(() => setSubjects([]));
  }, [isAdmin]);

  return (
    <div className="grid gap-4 md:grid-cols-12 md:items-end">
      {isAdmin ? (
        <label className="grid gap-1 md:col-span-4">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            User
          </span>
          <Select value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">Select user</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </Select>
        </label>
      ) : (
        <div className="md:col-span-4">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            User
          </div>
          <div className="mt-1 h-10 rounded-xl border border-slate-200 bg-white/70 px-3 text-sm leading-10 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
            You
          </div>
        </div>
      )}

      <label className="grid gap-1 md:col-span-4">
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          Subject
        </span>
        <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </label>

      <div className="flex flex-wrap gap-2 md:col-span-4 md:justify-end">
        <Button
          variant="success"
          disabled={
            !subjectId ||
            alreadyMarked ||
            (role === "ADMIN" && !userId)
          }
          onClick={async () => {
            try {
              await markAttendance(role === "ADMIN" ? userId : null, subjectId, true);
              refresh();
            } catch (e) {
              window.alert(e?.message || "Could not mark present");
            }
          }}
        >
          Present
        </Button>
        <Button
          variant="danger"
          disabled={
            !subjectId ||
            alreadyMarked ||
            (role === "ADMIN" && !userId)
          }
          onClick={async () => {
            try {
              await markAttendance(role === "ADMIN" ? userId : null, subjectId, false);
              refresh();
            } catch (e) {
              window.alert(e?.message || "Could not mark absent");
            }
          }}
        >
          Absent
        </Button>
        {isAdmin && (
          <Button
            variant="secondary"
            disabled={!userId}
            onClick={async () => {
              try {
                await markAll(userId, true);
                refresh();
              } catch (e) {
                window.alert(e?.message || "Could not mark all present");
              }
            }}
          >
            Mark all present
          </Button>
        )}
      </div>
    </div>
  );
}