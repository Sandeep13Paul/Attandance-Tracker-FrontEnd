import Button from "./ui/Button";
import { Input } from "./ui/Field";

export default function Filters({ start, end, setStart, setEnd, onFilter }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Start date
          </span>
          <Input
            type="date"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            End date
          </span>
          <Input type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
      </div>

      <div className="flex gap-2">
        <Button onClick={onFilter} variant="secondary">
          Apply filter
        </Button>
      </div>
    </div>
  );
}