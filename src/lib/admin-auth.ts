const ADMIN_SESSION_KEY = "briahs-admin-session";

const ADMIN_USERS = [
  {
    username: "admin",
    email: "admin@briahs.local",
    password: "admin123",
    name: "Karla Ignacio",
    role: "Owner",
  },
] as const;

type AdminUser = (typeof ADMIN_USERS)[number];

type AdminSession = {
  username: AdminUser["username"];
  name: AdminUser["name"];
  role: AdminUser["role"];
  signedInAt: string;
};

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function signInAdmin(identifier: string, password: string) {
  if (!hasBrowserStorage()) return false;

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = ADMIN_USERS.find(
    (candidate) =>
      candidate.username === normalizedIdentifier || candidate.email === normalizedIdentifier,
  );

  if (!user || user.password !== password) {
    return false;
  }

  const session: AdminSession = {
    username: user.username,
    name: user.name,
    role: user.role,
    signedInAt: new Date().toISOString(),
  };

  window.localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  return true;
}

export function getAdminSession(): AdminSession | null {
  if (!hasBrowserStorage()) return null;

  const rawSession = window.localStorage.getItem(ADMIN_SESSION_KEY);
  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as Partial<AdminSession>;
    if (!session.username || !session.name || !session.role) {
      return null;
    }
    return session as AdminSession;
  } catch {
    window.localStorage.removeItem(ADMIN_SESSION_KEY);
    return null;
  }
}

export function isAdminSignedIn() {
  return getAdminSession() != null;
}

export function signOutAdmin() {
  if (!hasBrowserStorage()) return;
  window.localStorage.removeItem(ADMIN_SESSION_KEY);
}
