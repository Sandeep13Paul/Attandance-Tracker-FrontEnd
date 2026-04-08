import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function AttendanceCalendar({ data }) {
  const attendanceMap = {};

  data.forEach((a) => {
    attendanceMap[a.date] = a.present;
  });

  const tileClassName = ({ date }) => {
    const d = date.toISOString().split("T")[0];
    if (attendanceMap[d] === true) return "attendance-present";
    if (attendanceMap[d] === false) return "attendance-absent";
    return null;
  };

  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const d = date.toISOString().split("T")[0];
    const v = attendanceMap[d];
    if (v !== true && v !== false) return null;
    return (
      <div className="mt-1 flex justify-center">
        <span
          className={[
            "h-1.5 w-1.5 rounded-full",
            v ? "bg-emerald-600 dark:bg-emerald-400" : "bg-rose-600 dark:bg-rose-400",
          ].join(" ")}
        />
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="font-medium text-slate-700 dark:text-slate-300">Legend</div>
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Present
        </div>
        <div className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-rose-500" />
          Absent
        </div>
      </div>

      <Calendar
        tileClassName={tileClassName}
        tileContent={tileContent}
        showNeighboringMonth={false}
      />
    </div>
  );
}