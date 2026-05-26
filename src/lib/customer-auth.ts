export const CUSTOMER_SESSION_KEY = "briahs-customer-session";

export type CustomerSession = {
  name: string;
  email: string;
  user_type: "Customers / Renters";
  signedInAt: string;
};

function hasBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function setCustomerSession(session: CustomerSession) {
  if (!hasBrowserStorage()) return;
  window.localStorage.setItem(CUSTOMER_SESSION_KEY, JSON.stringify(session));
}

export function getCustomerSession(): CustomerSession | null {
  if (!hasBrowserStorage()) return null;

  const rawSession = window.localStorage.getItem(CUSTOMER_SESSION_KEY);
  if (!rawSession) return null;

  try {
    const session = JSON.parse(rawSession) as Partial<CustomerSession>;
    if (!session.name || !session.email || session.user_type !== "Customers / Renters") {
      return null;
    }
    return session as CustomerSession;
  } catch {
    window.localStorage.removeItem(CUSTOMER_SESSION_KEY);
    return null;
  }
}

export function clearCustomerSession() {
  if (!hasBrowserStorage()) return;
  window.localStorage.removeItem(CUSTOMER_SESSION_KEY);
}
