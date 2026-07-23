"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { PersonName } from "@/components/site/PersonName";
import { person } from "@/lib/content";

/**
 * The ✳ in the corner leads to the login page; once signed in it turns into a
 * way back out.
 */
export function SiteFooter({
  year,
  name,
}: {
  year: number;
  name: string;
}) {
  const { ready, loggedIn, logout } = useAuth();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-4 px-6 py-7 text-[13px] text-sand sm:flex-row md:px-9">
        <p className="m-0">
          © {year} {person.title} <PersonName initial={name} />
        </p>

        {/* `ready` guards against a flash of the wrong control on load. */}
        <div className="flex items-center gap-3.5">
          {ready && loggedIn && (
            <button
              type="button"
              onClick={logout}
              className="text-xs text-sand transition-colors hover:text-sage-dark"
            >
              Odhlásit se
            </button>
          )}

          {ready && !loggedIn && (
            <Link
              href="/login"
              title="Přihlášení"
              aria-label="Přihlášení"
              className="p-1 text-[13px] text-rule transition-colors hover:text-sage-dark"
            >
              ✳
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
