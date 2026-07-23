"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { PersonName } from "@/components/site/PersonName";
import { navigation, person } from "@/lib/content";

/** `name` is the build-time value; `PersonName` keeps it honest thereafter. */
export function SiteNav({ name }: { name: string }) {
  const { loggedIn } = useAuth();
  const [open, setOpen] = useState(false);

  const linkClass =
    "text-muted transition-colors hover:text-sage-dark focus-visible:text-sage-dark";

  return (
    <nav className="sticky top-0 z-20 border-b border-line bg-cream/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1140px] items-center justify-between px-6 py-4 md:px-9 md:py-[22px]">
        <Link href="/" className="flex items-baseline gap-3 text-ink">
          <span className="font-display text-2xl font-semibold tracking-[0.02em]">
            <PersonName initial={name} />
          </span>
          <span className="text-xs font-medium tracking-[0.18em] text-sand uppercase">
            {person.title}
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-8 text-[13.5px] font-medium tracking-[0.06em] uppercase md:flex">
          {navigation.map((item) => (
            <a key={item.href} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
          {loggedIn && (
            <Link
              href="/vocabulary"
              className="border-b-[1.5px] border-sage-mid pb-0.5 text-sage-dark transition-colors hover:text-sage-deep"
            >
              Slovníček
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobilni-menu"
          aria-label={open ? "Zavřít menu" : "Otevřít menu"}
          className="flex size-10 items-center justify-center text-ink md:hidden"
        >
          <span className="relative block h-3 w-6">
            <span
              className={`absolute inset-x-0 top-0 block h-px bg-current transition-transform duration-200 ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 block h-px bg-current transition-transform duration-200 ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      {open && (
        <div
          id="mobilni-menu"
          className="border-t border-line px-6 pb-5 text-[13.5px] font-medium tracking-[0.06em] uppercase md:hidden"
        >
          <div className="flex flex-col">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-b border-line py-3.5 ${linkClass}`}
              >
                {item.label}
              </a>
            ))}
            {loggedIn && (
              <Link
                href="/vocabulary"
                onClick={() => setOpen(false)}
                className="py-3.5 text-sage-dark"
              >
                Slovníček
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
