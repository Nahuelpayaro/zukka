"use client";

/**
 * ZukkaMobileNav — client drawer for mobile viewports.
 *
 * Design decisions:
 * - bg-black/94 backdrop-blur matches existing navbar style.
 * - aria-expanded / aria-controls for a11y.
 * - 44px minimum touch targets on all interactive elements.
 * - focus-visible rings on trigger and nav links.
 * - Closes on Escape key and on nav link click.
 */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navigation = [
  { label: "Colección", href: "/coleccion" },
  { label: "Contacto", href: "#footer" },
];

const DRAWER_ID = "mobile-nav-drawer";

export function ZukkaMobileNavTrigger() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  function closeDrawer() {
    setOpen(false);
  }

  // Close on Escape key, body scroll lock, focus management
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";

    // Move focus to first focusable element in drawer
    const focusable = drawerRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Return focus to trigger when drawer closes
  useEffect(() => {
    if (!open) {
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      {/* Hamburger trigger — only visible on mobile (md:hidden handled by parent) */}
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={DRAWER_ID}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/14 bg-black/40 text-white transition hover:border-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Backdrop */}
      {open ? (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          aria-hidden="true"
          onClick={closeDrawer}
        />
      ) : null}

      {/* Drawer */}
      <nav
        ref={drawerRef}
        id={DRAWER_ID}
        aria-label="Menú de navegación móvil"
        aria-hidden={!open}
        inert={!open}
        className={[
          "fixed inset-y-0 right-0 z-50 flex w-72 flex-col gap-2 border-l border-white/10 bg-black/94 px-6 py-8 backdrop-blur-xl transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.28em] text-white/50">Menú</span>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Cerrar menú"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/14 text-white transition hover:border-white/28 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <CloseIcon />
          </button>
        </div>

        <ul className="flex flex-col gap-1">
          {navigation.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                onClick={closeDrawer}
                className="flex min-h-[44px] items-center rounded-xl px-4 py-3 text-base font-medium text-white/82 transition hover:bg-white/6 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-white/10 pt-6">
          <Link
            href="/coleccion"
            onClick={closeDrawer}
            className="flex min-h-[44px] items-center justify-center rounded-full bg-[#b40f1d] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#cc1323] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Ver colección
          </Link>
        </div>
      </nav>
    </>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}
