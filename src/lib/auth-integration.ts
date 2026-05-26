export type AuthProvider = "google" | "facebook" | "apple";

export type CredentialLoginInput = {
  identifier: string;
  password: string;
};

export type CredentialLoginResult = {
  ok: boolean;
  message?: string;
};

const apiCredentialsEndpoint = import.meta.env.VITE_AUTH_CREDENTIALS_ENDPOINT as
  | string
  | undefined;
const apiOAuthBase = (import.meta.env.VITE_AUTH_OAUTH_BASE as string | undefined) ?? "/api/auth";

export function hasApiCredentialLogin() {
  return Boolean(apiCredentialsEndpoint);
}

export async function signInWithCredentialsApi({
  identifier,
  password,
}: CredentialLoginInput): Promise<CredentialLoginResult> {
  if (!apiCredentialsEndpoint) {
    return { ok: false, message: "API credential endpoint is not configured." };
  }

  const response = await fetch(apiCredentialsEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  if (!response.ok) {
    let message = "Unable to sign in with credentials.";
    try {
      const payload = (await response.json()) as { message?: string };
      if (payload?.message) message = payload.message;
    } catch {
      // Keep generic message when response is not JSON.
    }
    return { ok: false, message };
  }

  return { ok: true };
}

export function getProviderStartUrl(provider: AuthProvider) {
  return `${apiOAuthBase}/${provider}`;
}

export function continueWithProvider(provider: AuthProvider) {
  if (typeof window === "undefined") return;
  window.location.assign(getProviderStartUrl(provider));
}
