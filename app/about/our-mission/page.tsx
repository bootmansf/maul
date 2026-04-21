import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { portableTextComponents } from "../../components/portableText";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

export const metadata = {
  title: "Our Mission — Mid-Atlantic Uniform League",
  description: "Who we are and what we stand for.",
};

const PAGE_QUERY = `*[_id == "missionPage"][0]{
  title, subtitle, body, image
}`;

type SimplePageDoc = {
  title?: string;
  subtitle?: string;
  body?: PortableTextBlock[];
  image?: SanityImageSource;
};

export default async function OurMissionPage() {
  const doc = isSanityConfigured()
    ? await getClient().fetch<SimplePageDoc | null>(PAGE_QUERY)
    : null;

  const title = doc?.title ?? "Our Mission";
  const subtitle = doc?.subtitle ?? "Who we are";

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
                      <h1 className="heading-style-h2">{title}</h1>
                    </div>
                    {subtitle ? (
                      <p className="text-size-large">{subtitle}</p>
                    ) : null}
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
                      {doc?.body?.length ? (
                        <PortableText
                          value={doc.body}
                          components={portableTextComponents}
                        />
                      ) : (
                        <>
                          <p className="text-size-medium">
                            The Mid-Atlantic Uniform League (MAUL) is an Honor
                            Guard unit created as a fraternal network of gay
                            men, largely with Law Enforcement and Military
                            backgrounds, with an interest in uniforms in the
                            Mid-Atlantic and surrounding regions.
                          </p>
                          <p className="text-size-medium">
                            To promote, organize and attend appropriate
                            uniform-themed events, celebratory parades, and to
                            encourage a uniformed presence at regional gay
                            events.
                          </p>
                          <p className="text-size-medium">
                            To promote education and understanding of the
                            uniform fetish among the larger gay community.
                          </p>
                          <p className="text-size-medium">
                            To support and assist appropriate charities and
                            community services, particularly those related to
                            gay, fetish or public safety issues.
                          </p>
                        </>
                      )}
                    </div>
                    <div className="layout3_image-wrapper">
                      {doc?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={urlFor(doc.image).width(2000).fit("max").url()}
                          alt={title}
                          className="layout3_image image_mission"
                          loading="lazy"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          sizes="(max-width: 767px) 90vw, (max-width: 991px) 43vw, 41vw"
                          srcSet="/images/8_MAULBanner-p-500.jpg 500w, /images/8_MAULBanner-p-800.jpg 800w, /images/8_MAULBanner-p-1080.jpg 1080w, /images/8_MAULBanner-p-1600.jpg 1600w, /images/8_MAULBanner-p-2000.jpg 2000w, /images/8_MAULBanner.jpg 2304w"
                          alt="Picture of MAUL banner"
                          src="/images/8_MAULBanner.jpg"
                          loading="lazy"
                          className="layout3_image image_mission"
                        />
                      )}
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
