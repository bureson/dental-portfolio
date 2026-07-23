"use client";

import { FirebaseError } from "firebase/app";
import {
  type Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { firebaseConfigured, getAuthClient } from "@/lib/firebase";

/**
 * Sign-in for the private part of the site, via Firebase Authentication.
 *
 * Accounts are created in the Firebase console (Authentication → Users) — the
 * site offers no registration. The Firebase SDK keeps the session in
 * localStorage, so a sign-in survives closing the tab.
 */

/** `error: null` means the visitor cancelled — nothing worth reporting. */
export type LoginResult = { ok: true } | { ok: false; error: string | null };

/** Firebase codes translated into messages that mean something to a visitor. */
const ERRORS: Record<string, string> = {
  "auth/invalid-email": "Zadejte platnou e-mailovou adresu.",
  "auth/missing-password": "Zadejte heslo.",
  "auth/invalid-credential": "Nesprávný e-mail nebo heslo.",
  "auth/wrong-password": "Nesprávný e-mail nebo heslo.",
  "auth/user-not-found": "Nesprávný e-mail nebo heslo.",
  "auth/user-disabled": "Tento účet je zablokovaný.",
  "auth/too-many-requests":
    "Příliš mnoho pokusů. Zkuste to prosím za chvíli znovu.",
  "auth/network-request-failed":
    "Nepodařilo se spojit se serverem. Zkontrolujte připojení.",
  "auth/popup-blocked":
    "Prohlížeč zablokoval přihlašovací okno. Povolte pro tento web vyskakovací okna a zkuste to znovu.",
  "auth/account-exists-with-different-credential":
    "K tomuto e-mailu už existuje účet s heslem. Přihlaste se e-mailem a heslem.",
  "auth/operation-not-allowed":
    "Přihlášení přes Google není u tohoto projektu povolené.",
  "auth/unauthorized-domain":
    "Tato doména není povolená v nastavení Firebase Authentication.",
};

/** Closing the popup is not a failure worth putting on screen. */
const CANCELLED = new Set([
  "auth/popup-closed-by-user",
  "auth/cancelled-popup-request",
  "auth/user-cancelled",
]);

const GENERIC_ERROR = "Přihlášení se nepodařilo. Zkuste to prosím znovu.";

type AuthValue = {
  /** False until Firebase reports whether anyone is signed in. */
  ready: boolean;
  loggedIn: boolean;
  /** Email of the signed-in user, otherwise null. */
  email: string | null;
  login: (email: string, password: string) => Promise<LoginResult>;
  /** Sign in with a Google account, in a popup window. */
  loginWithGoogle: () => Promise<LoginResult>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

/**
 * Shared wrapper for both sign-in methods: gets the client, runs the given
 * action and translates any Firebase error into a message.
 */
async function attemptLogin(
  action: (auth: Auth) => Promise<unknown>,
): Promise<LoginResult> {
  const auth = getAuthClient();
  if (!auth) {
    return {
      ok: false,
      error: firebaseConfigured
        ? GENERIC_ERROR
        : "Přihlášení zatím není nastavené.",
    };
  }
  try {
    await action(auth);
    return { ok: true };
  } catch (e) {
    const code = e instanceof FirebaseError ? e.code : "";
    if (CANCELLED.has(code)) return { ok: false, error: null };
    return { ok: false, error: ERRORS[code] ?? GENERIC_ERROR };
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // With no configuration there is nothing to wait for — pages render signed
  // out right away. `firebaseConfigured` is a build-time constant, so server
  // and client start from the same value.
  const [ready, setReady] = useState(!firebaseConfigured);

  useEffect(() => {
    const auth = getAuthClient();
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
  }, []);

  const login = useCallback(
    (email: string, password: string) =>
      attemptLogin((auth) =>
        signInWithEmailAndPassword(auth, email.trim(), password),
      ),
    [],
  );

  const loginWithGoogle = useCallback(
    () =>
      attemptLogin((auth) => {
        const provider = new GoogleAuthProvider();
        // Always let Google offer the account picker instead of silently
        // reusing the last one.
        provider.setCustomParameters({ prompt: "select_account" });
        return signInWithPopup(auth, provider);
      }),
    [],
  );

  const logout = useCallback(async () => {
    const auth = getAuthClient();
    if (auth) await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      ready,
      loggedIn: user !== null,
      email: user?.email ?? null,
      login,
      loginWithGoogle,
      logout,
    }),
    [ready, user, login, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
