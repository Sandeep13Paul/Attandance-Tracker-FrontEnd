const BASE_URL =
  (process.env.REACT_APP_API_URL || "https://attandance-tracker-backend.onrender.com/api").replace(
    /\/$/,
    ""
  );
// const BASE_URL =
//   (process.env.REACT_APP_API_URL || "http://localhost:8080/api").replace(
//     /\/$/,
//     ""
//   );

const getToken = () => localStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function safeFetch(url, options) {
  try {
    return await fetch(url, options);
  } catch (e) {
    const msg =
      `Network error (Failed to fetch).\\n\\n` +
      `API base: ${BASE_URL}\\n` +
      `URL: ${url}\\n\\n` +
      `Most common causes:\\n` +
      `- Backend is not running / wrong URL\\n` +
      `- CORS blocked by backend\\n` +
      `- Mixed content (frontend https, backend http)\\n\\n` +
      `Fix: set REACT_APP_API_URL in attendance-frontend/.env and restart npm start.`;
    throw new Error(msg);
  }
}

async function readErrorMessage(res) {
  try {
    const body = await res.json();
    return body?.message || body?.error || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status} ${res.statusText})`;
  }
}

// ✅ Fetch attendance
export const fetchAttendance = async (start, end) => {
  try {
    const res = await safeFetch(
      `${BASE_URL}/attendance?start=${start}&end=${end}`,
      {
        headers: { ...authHeaders() },
      }
    );

    if (!res.ok) {
      if (res.status === 401)
        throw new Error("Not signed in or session expired. Please log in again.");
      throw new Error(await readErrorMessage(res));
    }

    return await res.json();
  } catch (err) {
    console.error("Fetch error:", err);
    throw err;
  }
};

// ✅ Fetch users
export const fetchUsers = async () => {
  const res = await safeFetch(`${BASE_URL}/users`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
};

// ✅ Fetch subjects
export const fetchSubjects = async () => {
  const res = await safeFetch(`${BASE_URL}/subjects`, { headers: authHeaders() });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json();
};

// ✅ Mark attendance
export const markAttendance = async (userId, subjectId, present, date) => {
  const q = new URLSearchParams();
  if (userId != null && String(userId).length > 0) q.set("userId", String(userId));
  q.set("subjectId", String(subjectId));
  q.set("present", String(present));

  if (date) q.set("date", date); // 🔥 NEW

  const res = await safeFetch(
    `${BASE_URL}/attendance/mark?${q.toString()}`,
    {
      method: "POST",
      headers: authHeaders(),
    }
  );
  if (!res.ok) {
    if (res.status === 401)
      throw new Error("Not signed in or session expired. Please log in again.");
    throw new Error(await readErrorMessage(res));
  }
};

// ✅ Mark all
export const markAll = async (userId, present) => {
  const res = await safeFetch(
    `${BASE_URL}/attendance/mark-all?userId=${userId}&present=${present}`,
    {
      method: "POST",
      headers: authHeaders(),
    }
  );
  if (!res.ok) {
    if (res.status === 401)
      throw new Error("Not signed in or session expired. Please log in again.");
    throw new Error(await readErrorMessage(res));
  }
};

export const createUser = async (name, email) => {
  const res = await safeFetch(`${BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name, email }),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json().catch(() => ({}));
};

export const createSubject = async (name) => {
  const res = await safeFetch(`${BASE_URL}/subjects`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await readErrorMessage(res));
  return res.json().catch(() => ({}));
};

export const login = async (email, password) => {
  const res = await safeFetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error(await readErrorMessage(res));
  }

  return res.json();
};

/**
 * New account. Backends differ on path (`/auth/register`, `/auth/signup`, etc.).
 * - Set REACT_APP_REGISTER_PATH to match your server (e.g. `auth/signup`).
 * - Otherwise we try common paths; 404 on one path tries the next.
 */
export const register = async ({ email, password, name, role }) => {
  const res = await safeFetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      email,
      password,
      role,
    }),
  });

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(body?.message || body?.error || `Request failed (${res.status})`);
  }
  if (body && body.success === false) {
    throw new Error(body.message || "Registration failed");
  }
  return body;
};

export const fetchSubjectStats = async (userId) => {
  let url = `${BASE_URL}/attendance/subject-stats`;

  if (userId) {
    url += `?userId=${userId}`;
  }

  const res = await fetch(url, {
    headers: authHeaders(),
  });

  return res.json();
};