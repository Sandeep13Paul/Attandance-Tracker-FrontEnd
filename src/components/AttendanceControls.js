import { useEffect, useState } from "react";
import { fetchUsers, fetchSubjects, markAttendance, markAll } from "../services/api";
import Button from "./ui/Button";
import { Select } from "./ui/Field";

export default function AttendanceControls({ refresh, data = [] }) {
  const [users, setUsers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [userId, setUserId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const alreadyMarked = data.some(
    (a) =>
      a.userId === userId &&
      a.subjectName &&
      a.date === new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    fetchUsers().then(setUsers);
    fetchSubjects().then(setSubjects);
  }, []);

  return (
    <div className="grid gap-4 md:grid-cols-12 md:items-end">
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
          disabled={!userId || !subjectId || alreadyMarked}
          onClick={async () => {
            await markAttendance(userId, subjectId, true);
            refresh();
          }}
        >
          Present
        </Button>
        <Button
          variant="danger"
          disabled={!userId || !subjectId || alreadyMarked}
          onClick={async () => {
            await markAttendance(userId, subjectId, false);
            refresh();
          }}
        >
          Absent
        </Button>
        <Button
          variant="secondary"
          disabled={!userId}
          onClick={async () => {
            await markAll(userId, true);
            refresh();
          }}
        >
          Mark all present
        </Button>
      </div>
    </div>
  );
}