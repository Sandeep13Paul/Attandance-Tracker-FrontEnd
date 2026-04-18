import { useState } from "react";
import { login, register } from "../services/api";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Field";

function saveTokenAndFinish(data, onLogin) {
  const token = data?.token ?? data?.accessToken;
  console.log(data);
  if (!token) {
    throw new Error("Invalid response (no token).");
  }
  const user = data.user || data;
  localStorage.setItem("token", token);
  localStorage.setItem("userId", user.id);  // ✅ IMPORTANT
  if (data?.role) {
    localStorage.setItem("role", String(user.role));
  }
  onLogin?.();
}

export default function LoginPage({ onLogin }) {
  const [mode, setMode] = useState("signin"); // signin | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState("STUDENT");

  const handleLogin = async (e) => {
    e?.preventDefault?.();
    setError("");
    setLoading(true);
    try {
      const data = await login(email.trim(), password);
      saveTokenAndFinish(data, onLogin);
    } catch (err) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e?.preventDefault?.();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        name: name.trim(),
        role, // 🔥 NEW
      });
      const loginData = await login(email.trim(), password);
      saveTokenAndFinish(loginData, onLogin);
    } catch (err) {
      setError(err?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  const isSignup = mode === "signup";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6">
      <div className="w-full max-w-md">
        <Card
          title={isSignup ? "Create account" : "Welcome back"}
          description={
            isSignup
              ? "Sign up to start tracking attendance."
              : "Sign in to access your attendance dashboard."
          }
          right={
            <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-medium dark:bg-slate-900">
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 transition ${
                  !isSignup
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                onClick={() => {
                  setMode("signin");
                  setError("");
                }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={`rounded-lg px-3 py-1.5 transition ${
                  isSignup
                    ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-600 dark:text-slate-400"
                }`}
                onClick={() => {
                  setMode("signup");
                  setError("");
                }}
              >
                Sign up
              </button>
            </div>
          }
        >
          <form
            className="space-y-4"
            onSubmit={isSignup ? handleSignup : handleLogin}
          >
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100">
                {error}
              </div>
            )}

            {isSignup && (
              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Name (optional)
                </span>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>
            )}

            {isSignup && (
            <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Role
                </span>
                <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="rounded-xl border px-3 py-2 dark:bg-slate-900"
                >
                <option value="STUDENT">Student</option>
                <option value="ADMIN">Admin</option>
                </select>
            </label>
            )}

            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Email
              </span>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                inputMode="email"
              />
            </label>

            <label className="grid gap-1">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Password
              </span>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPw ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={() => setShowPw((v) => !v)}
                  aria-pressed={showPw}
                >
                  {showPw ? "Hide" : "Show"}
                </Button>
              </div>
            </label>

            {isSignup && (
              <label className="grid gap-1">
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                  Confirm password
                </span>
                <Input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                />
              </label>
            )}

            <div className="pt-1">
              <Button
                variant="primary"
                className="w-full"
                disabled={
                  loading ||
                  !email.trim() ||
                  !password ||
                  (isSignup && !confirmPassword)
                }
                type="submit"
              >
                {loading
                  ? isSignup
                    ? "Creating account…"
                    : "Signing in…"
                  : isSignup
                    ? "Create account"
                    : "Sign in"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
