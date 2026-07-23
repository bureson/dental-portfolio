import { type FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { type Auth, getAuth } from "firebase/auth";
import { type Database, getDatabase } from "firebase/database";

/**
 * Firebase for the client side of the site.
 *
 * The values are inlined at build time — `output: "export"` means there is no
 * server behind this — so they have to be `NEXT_PUBLIC_*`. That is fine: a
 * Firebase web API key is a public project identifier, not a secret. Who may
 * read and write what is decided by Auth settings and Security Rules.
 */
const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Without these four there is nothing for `getAuth()` to work from. */
export const firebaseConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
);

/** The Realtime Database additionally needs its own URL. */
export const databaseConfigured =
  firebaseConfigured && Boolean(config.databaseURL);

function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(config);
}

let auth: Auth | null = null;
let database: Database | null = null;

/**
 * Initialised on first call from the browser — the build-time render of the
 * server components must never try to start Firebase.
 *
 * Returns `null` when the configuration is missing, so callers can show a
 * readable message instead of crashing.
 */
export function getAuthClient(): Auth | null {
  if (typeof window === "undefined" || !firebaseConfigured) return null;
  if (!auth) auth = getAuth(getFirebaseApp());
  return auth;
}

/** Same contract as `getAuthClient`, for the Realtime Database. */
export function getDatabaseClient(): Database | null {
  if (typeof window === "undefined" || !databaseConfigured) return null;
  if (!database) database = getDatabase(getFirebaseApp());
  return database;
}
