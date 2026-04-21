import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "Letter from the Colonel — Mid-Atlantic Uniform League",
  description: "A letter from Colonel William F. Buckley, Jr.",
};

export default function LetterFromColonelPage() {
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
                      <h1 className="heading-style-h2">Letter From The Colonel</h1>
                    </div>
                    <p className="text-size-large">Colonel William F. Buckley, Jr.</p>
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
                  <div className="w-layout-grid layout3_content chiefletter">
                    <div className="layout3_content-left">
                      <div className="w-richtext">
                        <p className="text-size-medium">
                          Whenever I&rsquo;m asked to comment on why I so
                          passionately believe in the Mid-Atlantic Uniform
                          League, I focus on the core foundations and values
                          that help propel our overall success and well-being.
                          I believe best serving our member base and providing
                          an engaging and rewarding environment ultimately
                          creates long term value and a strong sense of pride
                          and comradery.
                        </p>
                        <p className="text-size-medium">
                          As the former Chief of MAUL (now retired to the rank
                          of Colonel), I was entrusted with the care and the
                          direction of the club during my term of office.
                          Chief of MAUL is an elected position in which he is
                          entrusted with the care and the direction of the
                          club during his term of office. Having served in
                          this role, I can report there are no shortcuts if
                          you want to create enduring value. One of my goals
                          has been to establish a commitment to being a
                          responsible, ethical, and respectful. Through
                          teamwork and a respect for the observance of a
                          military-style chain of command sets the bar high
                          for excellence work that starts at the top of the
                          organization and extends to all our members across
                          the country.{" "}
                          <strong>
                            I also want to take a moment to express my sincere
                            gratitude for the ongoing dedication and hard work
                            of the MAUL Executive Board.
                          </strong>
                        </p>
                        <p className="text-size-medium">
                          Our approach to serving within our larger community
                          is also enduring and integral to our values. This is
                          evident in our efforts to align with other clubs and
                          organizations, especially those under the AMCC
                          umbrella.
                        </p>
                        <p className="text-size-medium">
                          I believe that the brotherhood which exists through
                          our collective passion and focus, we will continue
                          to challenge expectations and build towards a
                          brighter future for our group. But we in MAUL are
                          neither finished nor content with where we stand
                          currently. We will remain committed to building on
                          our already strong foundation of integrity and
                          responsibility so we can take actionable steps and
                          create meaningful impact as we move forward with
                          purpose for all.
                        </p>
                        <p className="text-size-medium">
                          Thank you for your interest in the Mid-Atlantic
                          Uniform League.
                        </p>
                        <p className="text-size-medium">Sincerely,</p>
                        <p className="text-size-medium">
                          Colonel William F. Buckley, Jr.
                        </p>
                      </div>
                    </div>
                    <div className="layout3_image-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src="/images/IMG_1871.png"
                        alt="Picture of Chief Buckley"
                        className="layout3_image chiefletter"
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
