import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "Our Mission — Mid-Atlantic Uniform League",
  description: "Who we are and what we stand for.",
};

export default function OurMissionPage() {
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
                      <h1 className="heading-style-h2">Our Mission</h1>
                    </div>
                    <p className="text-size-large">Who we are</p>
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
                        The Mid-Atlantic Uniform League (MAUL) is an Honor
                        Guard unit created as a fraternal network of gay men,
                        largely with Law Enforcement and Military backgrounds,
                        with an interest in uniforms in the Mid-Atlantic and
                        surrounding regions.
                      </p>
                      <p className="text-size-medium">
                        To promote, organize and attend appropriate
                        uniform-themed events, celebratory parades, and to
                        encourage a uniformed presence at regional gay events.
                      </p>
                      <p className="text-size-medium">
                        To promote education and understanding of the uniform
                        fetish among the larger gay community.
                      </p>
                      <p className="text-size-medium">
                        To support and assist appropriate charities and
                        community services, particularly those related to gay,
                        fetish or public safety issues.
                      </p>
                    </div>
                    <div className="layout3_image-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        sizes="(max-width: 767px) 90vw, (max-width: 991px) 43vw, 41vw"
                        srcSet="/images/8_MAULBanner-p-500.jpg 500w, /images/8_MAULBanner-p-800.jpg 800w, /images/8_MAULBanner-p-1080.jpg 1080w, /images/8_MAULBanner-p-1600.jpg 1600w, /images/8_MAULBanner-p-2000.jpg 2000w, /images/8_MAULBanner.jpg 2304w"
                        alt="Picture of MAUL banner"
                        src="/images/8_MAULBanner.jpg"
                        loading="lazy"
                        className="layout3_image image_mission"
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
