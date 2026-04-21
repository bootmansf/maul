"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type DropdownKey = "about" | "membership" | "resources";

export function SiteNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const pathname = usePathname();

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [menuOpen]);

  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown((cur) => (cur === key ? null : key));
  };

  return (
    <div
      role="banner"
      className="navbar9_component w-nav"
      data-collapse="medium"
      data-animation="default"
      data-duration="400"
      data-nav-open={menuOpen}
    >
      <div className="navbar9_container">
        <Link href="/" className="navbar9_logo-link w-nav-brand">
          <div className="icon-embed-custom w-embed">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/svg/maul-logo-gold.svg"
              alt="Mid-Atlantic Uniform League"
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </Link>

        <nav
          role="navigation"
          className={`navbar9_menu mobilenav_t w-nav-menu${menuOpen ? " is-open" : ""}`}
          aria-hidden={!menuOpen ? undefined : "false"}
        >
          <div className="navbar9_menu-left mobilenav_t">
            <Dropdown
              label="About"
              isOpen={openDropdown === "about"}
              onToggle={() => toggleDropdown("about")}
              items={[
                { href: "/about", label: "About MAUL" },
                { href: "/about/our-mission", label: "Our Mission" },
                { href: "/about/letter-from-the-chief", label: "Letter from the Chief" },
                { href: "/about/letter-from-the-colonel", label: "Letter from the Colonel" },
              ]}
            />

            <Dropdown
              label="Membership"
              isOpen={openDropdown === "membership"}
              onToggle={() => toggleDropdown("membership")}
              items={[
                { href: "/membership/how-to-join", label: "How to Join" },
              ]}
            />

            <Link href="/events" className="navbar9_link w-nav-link">Events</Link>
            <Link href="/gallery" className="navbar9_link w-nav-link">Gallery</Link>

            <Dropdown
              label="Resources"
              isOpen={openDropdown === "resources"}
              onToggle={() => toggleDropdown("resources")}
              items={[
                { href: "/resources/amcc-clubs", label: "AMCC Member Clubs" },
                { href: "/resources/other-clubs", label: "Other Leather and Uniform Clubs" },
                { href: "/resources/gear-vendors", label: "Gear Vendors" },
              ]}
            />

            <Link href="/maul20" className="navbar9_link w-nav-link">20th Anniversary</Link>
          </div>

          <div className="navbar9_menu-right">
            <Link href="/contact" className="button is-alternate is-small w-button">Contact Us</Link>
          </div>
        </nav>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className={`navbar9_menu-button w-nav-button${menuOpen ? " w--open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <div className="menu-icon">
            <div className="menu-icon_line-top" />
            <div className="menu-icon_line-middle">
              <div className="menu-icon_line-middle-inner" />
            </div>
            <div className="menu-icon_line-bottom" />
          </div>
        </button>
      </div>
    </div>
  );
}

function Dropdown({
  label,
  isOpen,
  onToggle,
  items,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  items: { href: string; label: string }[];
}) {
  return (
    <div
      className={`navbar2_menu-dropdown w-dropdown${isOpen ? " is-open" : ""}`}
      data-open={isOpen}
    >
      <button
        type="button"
        className="navbar2_dropdwn-toggle mobilenav_t w-dropdown-toggle"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        <div>{label}</div>
        <div className="dropdown-chevron w-embed" aria-hidden="true">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </button>
      <nav
        className={`navbar2_dropdown-list mobilenav_t w-dropdown-list${isOpen ? " w--open" : ""}`}
        aria-hidden={!isOpen}
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="navbar2_dropdown-link mobilenav_t w-dropdown-link"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
