import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";

export const metadata = {
  title: "About MAUL — Mid-Atlantic Uniform League",
  description: "Learn about the Mid-Atlantic Uniform League.",
};

export default function AboutPage() {
  return (
    <div className="page-wrapper">
      <SiteNav />

      <main className="main-wrapper">
        <header className="section_header46">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="header46_component">
                  <div className="max-width-large">
                    <div className="margin-bottom margin-xsmall">
                      <h1 className="heading-style-h1">About MAUL</h1>
                    </div>
                    <p className="text-size-large">Serving since 2007</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="section_layout3">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="layout3_component">
                  <div className="w-layout-grid layout3_content">
                    <div className="layout3_content-left">
                      <p className="text-size-medium">
                        The Mid-Atlantic Uniform League, or MAUL, is a uniform
                        organization formed in late 2006 and inaugurated in
                        January 2007 with 18 original members.
                      </p>
                      <p className="text-size-medium">
                        Officers of the club assemble at several events during
                        the year including DC Police Week, local police
                        parades, motorcycle rodeos, and other law enforcement
                        events throughout the year.
                      </p>
                      <p className="text-size-medium">
                        MAUL membership is distributed across the USA and
                        isn&rsquo;t limited to men living in the Mid-Atlantic
                        region. Although our membership largely consists of
                        men with Law Enforcement and Military backgrounds, we
                        welcome all men who are able to attend our regular
                        events, wherever you happen to live.
                      </p>
                      <p className="text-size-medium">
                        If you are interested in learning more about becoming
                        a member, see the{" "}
                        <Link href="/membership/how-to-join">
                          <strong>How to Join</strong>
                        </Link>{" "}
                        page. We appreciate your interest in MAUL!
                      </p>
                    </div>
                    <div className="layout3_image-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src="/images/3_Cadets.jpg"
                        alt="MAUL Officers standing next to each other"
                        className="layout3_image image_about"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter variant="blue" />
    </div>
  );
}
