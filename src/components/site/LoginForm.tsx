"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { person } from "@/lib/content";

/** Where to continue after a successful sign-in. */
const AFTER_LOGIN = "/vocabulary";

export function LoginForm() {
  const router = useRouter();
  const { ready, loggedIn, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // No point letting a signed-in visitor sit here — and after a successful
  // sign-in this is what runs once Firebase reports the state change.
  useEffect(() => {
    if (ready && loggedIn) router.replace(AFTER_LOGIN);
  }, [ready, loggedIn, router]);

  const signInWithGoogle = async () => {
    if (pending) return;
    setPending(true);
    setError(null);
    const result = await loginWithGoogle();
    if (result.ok) {
      router.replace(AFTER_LOGIN);
      return; // Leave the button locked until the page goes away.
    }
    // `error: null` = the visitor closed the popup; just settle back down.
    setError(result.error);
    setPending(false);
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-clip bg-cream px-6 py-16">
      {/* The same flourish the site header uses — keeps this page in family. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -z-0 hidden -translate-x-[125%] -translate-y-1/2 font-display text-[340px] leading-none font-medium text-ghost italic select-none lg:block"
      >
        {person.initial}
      </span>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Offset sage panel, like the portrait frame on the home page. */}
        <div
          aria-hidden="true"
          className="absolute top-5 -right-5 -bottom-5 left-5 -z-10 hidden bg-sage-soft sm:block"
        />

        <div className="flex flex-col gap-7 border border-line bg-paper px-7 py-9 shadow-[0_18px_50px_-30px_rgba(51,48,43,0.45)] sm:px-9 sm:py-10">
          <div className="flex flex-col gap-3">
            <span aria-hidden="true" className="text-lg text-sage">
              ✳
            </span>
            <p className="eyebrow text-sage">Soukromá část</p>
            <h1 className="m-0 font-display text-[34px] leading-[1.15] font-medium">
              Vítejte zpět
            </h1>
            <p className="m-0 text-[14.5px] leading-[1.6] font-light text-muted">
              Přihlaste se svým účtem Google.
            </p>
          </div>

          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={pending}
            className="flex items-center justify-center gap-3 border border-line-strong bg-paper px-6 py-[13px] text-sm font-medium text-ink transition-colors hover:border-sage-dark hover:text-sage-dark disabled:cursor-not-allowed disabled:border-line disabled:text-sand"
          >
            <GoogleLogo />
            {pending ? "Otevírám Google…" : "Pokračovat přes Google"}
          </button>

          {error && (
            <p
              role="alert"
              className="m-0 border-l-2 border-clay bg-clay/[0.07] px-4 py-3 text-[13.5px] leading-[1.5] text-clay"
            >
              {error}
            </p>
          )}

          <Link
            href="/"
            className="text-[13px] font-medium tracking-[0.06em] text-muted uppercase transition-colors hover:text-sage-dark"
          >
            ← Zpět na web
          </Link>
        </div>
      </div>
    </main>
  );
}

/**
 * The official four-colour "G". Google's brand rules say the mark is not to be
 * recoloured, so it stays in colour inside an otherwise muted palette.
 */
function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="size-[18px] shrink-0">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}
