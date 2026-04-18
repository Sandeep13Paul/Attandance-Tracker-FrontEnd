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
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0] // ✅ default = today
  );

  const role = localStorage.getItem("role");

  // ✅ Set logged-in user automatically
  useEffect(() => {
    if (!isAdmin && currentUserId) {
      setUserId(String(currentUserId));
    }
  }, [isAdmin, currentUserId]);

  // ✅ Load users & subjects
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

  // ✅ Detect already marked (NOW BASED ON SELECTED DATE)
  const selectedSubject = subjects.find(
    (s) => String(s.id) === String(subjectId)
  );

  const alreadyMarked = data.some((a) => {
    if (String(a.userId) !== String(userId)) return false;
    if (a.date !== selectedDate) return false;

    if (subjectId && a.subjectId != null)
      return String(a.subjectId) === String(subjectId);

    if (selectedSubject?.name && a.subjectName)
      return a.subjectName === selectedSubject.name;

    return false;
  });

  return (
    <div className="grid gap-4 md:grid-cols-12 md:items-end">

      {/* 👤 USER */}
      {isAdmin ? (
        <label className="grid gap-1 md:col-span-3">
          <span className="text-xs font-medium text-slate-600">User</span>
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
        <div className="md:col-span-3">
          <div className="text-xs font-medium text-slate-600">User</div>
          <div className="mt-1 h-10 rounded-xl border px-3 text-sm leading-10">
            You
          </div>
        </div>
      )}

      {/* 📚 SUBJECT */}
      <label className="grid gap-1 md:col-span-3">
        <span className="text-xs font-medium text-slate-600">Subject</span>
        <Select value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
          <option value="">Select subject</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </Select>
      </label>

      {/* 📅 DATE SELECTOR (NEW) */}
      <label className="grid gap-1 md:col-span-3">
        <span className="text-xs font-medium text-slate-600">Date</span>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-10 rounded-xl border px-3 text-sm"
        />
      </label>

      {/* 🔘 ACTION BUTTONS */}
      <div className="flex flex-wrap gap-2 md:col-span-3 md:justify-end">
        <Button
          variant="success"
          disabled={
            !subjectId ||
            alreadyMarked ||
            (role === "ADMIN" && !userId)
          }
          onClick={async () => {
            try {
              await markAttendance(
                role === "ADMIN" ? userId : null,
                subjectId,
                true,
                selectedDate // ✅ PASS DATE
              );
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
              await markAttendance(
                role === "ADMIN" ? userId : null,
                subjectId,
                false,
                selectedDate // ✅ PASS DATE
              );
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
            Mark all
          </Button>
        )}
      </div>
    </div>
  );
}