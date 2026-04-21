import Link from "next/link";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "How to Join — Mid-Atlantic Uniform League",
  description: "How to become a MAUL officer.",
};

export default function HowToJoinPage() {
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
                      <h1 className="heading-style-h1">How To Join</h1>
                    </div>
                    <p className="text-size-large">
                      We&rsquo;re looking for a few good men!
                    </p>
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
                      <AccordionStep
                        title={<>Step One: <br />Come and meet us</>}
                        body="The first step toward becoming a MAUL Officer is to attend an event and meet the officers. We want to meet you and hear about your uniform experience! This also gives you a chance to see what we are about too! You must attend at least one in-person event before becoming a MAUL Cadet. MAUL hosts uniform events at both MAL and CLAW in addition to attending other events. Upcoming events are listed on the main page of the MAUL website."
                      />
                      <AccordionStep
                        title={<>Step Two: <br />Membership Petition</>}
                        body={
                          <>
                            Any gay male wishing to become an officer in the
                            Mid-Atlantic Uniform League should submit a
                            Membership Petition (via our online form) to the
                            Deputy Chief/Membership Officer. This email should
                            tell us a bit about you and your interest in the
                            club. In addition, three Active Duty MAUL officers
                            must endorse the petition before it is sent to the
                            Chief for approval. You&rsquo;ll get these
                            endorsements while attending one of our events.
                            You can submit your Membership Petition email via
                            our{" "}
                            <Link href="/contact">
                              <strong>Contact Us</strong>
                            </Link>{" "}
                            page.
                          </>
                        }
                      />
                      <AccordionStep
                        title={<>Step Three: <br />Cadet Training</>}
                        body="Upon the Chief's approval, the petitioner is granted probationary membership in MAUL and holds the rank of Cadet. Cadets will complete their training under the supervision of the Deputy Chief and a Training Officer. The Cadet's primary responsibility during their training period will be to familiarize themselves with the club, attend online meetings, and in-person events. Cadets will also need to assemble and wear the MAUL Class B uniform. You must attend at least one in-person event as a Cadet before being considered for full Officer status."
                      />
                      <AccordionStep
                        title={<>Step Four:<br />Granting Membership</>}
                        body="When the Cadet has finished his training and completed his Class B uniform, the Deputy Chief will certify to the Chief that the requirements of membership have been met. The Chief may then appoint the Cadet to be an Active Duty or Reserve Officer of the Mid-Atlantic Uniform League."
                      />

                      <div className="w-layout-grid card-row10_component">
                        <InfoCard
                          heading="Costs of Membership"
                          body="Membership in MAUL is set at $75 annually, payable once a petitioner is appointed as a Cadet. The cost of the uniform will vary depending on how much of it the Cadet already owns."
                        />
                        <InfoCard
                          heading="Levels of Membership"
                          body="Membership in MAUL is set at $75 annually, payable once a petitioner is appointed as a Cadet. The cost of the uniform will vary depending on how much of it the Cadet already owns."
                        />
                      </div>
                    </div>

                    <div className="layout3_content-left">
                      <div className="layout3_image-wrapper">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          sizes="(max-width: 912px) 100vw, 912px"
                          srcSet="/images/5_Group-p-500.jpg 500w, /images/5_Group-p-800.jpg 800w, /images/5_Group.jpg 912w"
                          alt="MAUL officers in formation"
                          src="/images/5_Group.jpg"
                          loading="lazy"
                          className="layout3_image"
                        />
                      </div>
                      <div className="w-layout-grid card-row10_component">
                        <div className="card-row10_card_contact">
                          <div className="card-row10_card-small-content_alt">
                            <div className="card-row10_card-small-content-top">
                              <div className="margin-bottom margin-small">
                                <h3 className="heading-style-h6">
                                  <strong>Contact</strong>
                                </h3>
                              </div>
                              <p>
                                For more information, please contact the Deputy
                                Chief/Membership Officer on our{" "}
                                <Link href="/contact">
                                  <strong>Contact Us</strong>
                                </Link>{" "}
                                page.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
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

function AccordionStep({
  title,
  body,
}: {
  title: React.ReactNode;
  body: React.ReactNode;
}) {
  return (
    <details className="accordion2_component">
      <summary className="accordion2_top">
        <div className="heading-style-h6">
          <strong>{title}</strong>
        </div>
        <div className="accordion2_icon" aria-hidden="true">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M25.3333 15.667V16.3336C25.3333 16.7018 25.0349 17.0003 24.6667 17.0003H17V24.667C17 25.0351 16.7015 25.3336 16.3333 25.3336H15.6667C15.2985 25.3336 15 25.0351 15 24.667V17.0003H7.3333C6.96511 17.0003 6.66663 16.7018 6.66663 16.3336V15.667C6.66663 15.2988 6.96511 15.0003 7.3333 15.0003H15V7.33365C15 6.96546 15.2985 6.66699 15.6667 6.66699H16.3333C16.7015 6.66699 17 6.96546 17 7.33365V15.0003H24.6667C25.0349 15.0003 25.3333 15.2988 25.3333 15.667Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </summary>
      <div className="accordion2_bottom">
        <div className="margin-bottom margin-small">
          <p>{body}</p>
        </div>
      </div>
    </details>
  );
}

function InfoCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="card-row10_card-small">
      <div className="card-row10_card-small-content">
        <div className="card-row10_card-small-content-top">
          <div className="margin-bottom margin-small">
            <h3 className="heading-style-h6">
              <strong>{heading}</strong>
            </h3>
          </div>
          <p>{body}</p>
        </div>
      </div>
    </div>
  );
}
