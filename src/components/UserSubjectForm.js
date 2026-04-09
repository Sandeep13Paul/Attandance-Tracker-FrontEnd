import { useState } from "react";
import { createSubject, createUser } from "../services/api";
import Button from "./ui/Button";
import { Input } from "./ui/Field";

export default function UserSubjectForm({ refresh }) {
  const [userName, setUserName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const addUser = async () => {
    try {
      await createUser(userName.trim(), `${userName.trim()}@test.com`);
      setUserName("");
      refresh();
    } catch (e) {
      window.alert(e?.message || "Could not add user");
    }
  };

  const addSubject = async () => {
    try {
      await createSubject(subjectName.trim());
      setSubjectName("");
      refresh();
    } catch (e) {
      window.alert(e?.message || "Could not add subject");
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="grid gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Add user
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="User name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Button
            onClick={addUser}
            variant="secondary"
            disabled={!userName.trim()}
            className="sm:shrink-0"
          >
            Add
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Add subject
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Subject name"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <Button
            onClick={addSubject}
            variant="secondary"
            disabled={!subjectName.trim()}
            className="sm:shrink-0"
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}