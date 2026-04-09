export function decodeJwt(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(b64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function normalizeRoles(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return [value];
  return [];
}

export function getAuthInfoFromToken(token) {
  const payload = decodeJwt(token) || {};

  const roles = [
    ...normalizeRoles(payload.role),
    ...normalizeRoles(payload.roles),
    ...normalizeRoles(payload.authorities),
  ].map((r) => r.toUpperCase());

  const storedRole =
    typeof window !== "undefined" ? localStorage.getItem("role") : "";
  if (storedRole && roles.length === 0) {
    roles.push(String(storedRole).toUpperCase());
  }

  const isAdmin =
    roles.includes("ADMIN") ||
    roles.includes("ROLE_ADMIN") ||
    String(storedRole || "").toUpperCase() === "ADMIN";

  // Common identifiers across JWT providers
  const userId =
    payload.userId ?? payload.uid ?? payload.id ?? payload.sub ?? payload.email;

  return {
    payload,
    roles,
    isAdmin,
    userId: userId != null ? String(userId) : "",
    email: payload.email ? String(payload.email) : "",
    name: payload.name ? String(payload.name) : "",
  };
}

