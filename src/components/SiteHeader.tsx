"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/content/site";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the menu after navigating. Adjusting state during render, not in an effect.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const main = document.getElementById("main");
    const footer = document.querySelector("footer");
    main?.setAttribute("inert", "");
    footer?.setAttribute("inert", "");
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      main?.removeAttribute("inert");
      footer?.removeAttribute("inert");
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Pages that open on the light "paper" surface need the solid bar from the start.
  const solid = scrolled || open || pathname.startsWith("/contact");

  const isCurrent = (href: string) =>
    !href.includes("#") && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={styles.header} data-scrolled={solid} data-open={open}>
      <div className={`wrap ${styles.bar}`}>
        <Link href="/" className={styles.wordmark} aria-label="Xoro Visuals, home">
          {/* eslint-disable-next-line @next/next/no-img-element -- tiny fixed-size brand mark */}
          <img src="/brand/xv-mark.png" alt="" width={54} height={32} className={styles.mark} />
          <span className="grad-text">Xoro</span>
          <span className={styles.wordmarkLight}>Visuals</span>
        </Link>

        <nav aria-label="Main" className={styles.desktopNav}>
          <ul>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.navLink}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <Link href="/contact" className={`btn btn-primary ${styles.cta}`}>
            Start a Project
          </Link>
          <button
            ref={toggleRef}
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
            <span aria-hidden="true" className={styles.toggleLabel}>
              {open ? "Close" : "Menu"}
            </span>
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={styles.sheet} hidden={!open}>
        <nav aria-label="Main" className="wrap">
          <ul className={styles.sheetList}>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={styles.sheetLink}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
            Start a Project <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
