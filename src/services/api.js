export const fetchAttendance = async (start, end) => {
    try {
      const res = await fetch(
        `http://localhost:8080/api/attendance?start=${start}&end=${end}`
      );
  
      if (!res.ok) {
        throw new Error("API error");
      }
  
      return await res.json();
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  export const fetchUsers = async () => {
    return (await fetch("http://localhost:8080/api/users")).json();
  };
  
  export const fetchSubjects = async () => {
    return (await fetch("http://localhost:8080/api/subjects")).json();
  };
  
  export const markAttendance = async (userId, subjectId, present) => {
    await fetch(
      `http://localhost:8080/api/attendance/mark?userId=${userId}&subjectId=${subjectId}&present=${present}`,
      { method: "POST" }
    );
  };

  export const markAll = async (userId, present) => {
    await fetch(
      `http://localhost:8080/api/attendance/mark-all?userId=${userId}&present=${present}`,
      { method: "POST" }
    );
  };