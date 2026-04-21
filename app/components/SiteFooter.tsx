import Link from "next/link";

type FooterVariant = "gold" | "blue";

export function SiteFooter({ variant = "gold" }: { variant?: FooterVariant } = {}) {
  const cls =
    variant === "blue" ? "footer8_component_blue" : "footer8_component";
  const logoSrc =
    variant === "blue" ? "/svg/maul-logo-gold.svg" : "/svg/maul-logo-blue.svg";

  return (
    <footer className={cls}>
      <div className="padding-global">
        <div className="container-large">
          <div className="padding-vertical padding-xxlarge">
            <div className="padding-bottom padding-small">
              <div className="w-layout-grid footer8_top-wrapper_alt">
                <div className="footer8_left-wrapper">
                  <Link href="/" className="footer8_logo-link w-nav-brand">
                    <div className="icon-embed-custom-3 w-embed">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={logoSrc}
                        alt="Mid-Atlantic Uniform League"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                  </Link>
                  <div className="w-layout-grid footer8_link-list">
                    <Link href="/about" className="footer8_link">About</Link>
                    <Link href="/membership/how-to-join" className="footer8_link">Membership</Link>
                    <Link href="/events" className="footer8_link">Events</Link>
                    <Link href="/gallery" className="footer8_link">Gallery</Link>
                    <Link href="/resources/amcc-clubs" className="footer8_link">Resources</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="line-divider" />
            <div className="padding-top padding-medium">
              <div className="footer8_bottom-wrapper">
                <div className="footer8_credit-text">
                  MMXXIV © Mid-Atlantic Uniform League. All rights reserved.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
