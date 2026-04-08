import { useState } from "react";
import Button from "./ui/Button";
import { Input } from "./ui/Field";

export default function UserSubjectForm({ refresh }) {
  const [userName, setUserName] = useState("");
  const [subjectName, setSubjectName] = useState("");

  const addUser = async () => {
    await fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: userName, email: userName + "@test.com" }),
    });

    setUserName("");
    refresh();
  };

  const addSubject = async () => {
    await fetch("http://localhost:8080/api/subjects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: subjectName }),
    });

    setSubjectName("");
    refresh();
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