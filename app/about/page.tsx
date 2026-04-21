import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { portableTextComponents } from "../components/portableText";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

export const metadata = {
  title: "About MAUL — Mid-Atlantic Uniform League",
  description: "Learn about the Mid-Atlantic Uniform League.",
};

const PAGE_QUERY = `*[_id == "aboutPage"][0]{
  title, subtitle, body, image
}`;

type SimplePageDoc = {
  title?: string;
  subtitle?: string;
  body?: PortableTextBlock[];
  image?: SanityImageSource;
};

export default async function AboutPage() {
  const doc = isSanityConfigured()
    ? await getClient().fetch<SimplePageDoc | null>(PAGE_QUERY)
    : null;

  const title = doc?.title ?? "About MAUL";
  const subtitle = doc?.subtitle ?? "Serving since 2007";

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
                      <h1 className="heading-style-h1">{title}</h1>
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
                            The Mid-Atlantic Uniform League, or MAUL, is a
                            uniform organization formed in late 2006 and
                            inaugurated in January 2007 with 18 original
                            members.
                          </p>
                          <p className="text-size-medium">
                            Officers of the club assemble at several events
                            during the year including DC Police Week, local
                            police parades, motorcycle rodeos, and other law
                            enforcement events throughout the year.
                          </p>
                          <p className="text-size-medium">
                            MAUL membership is distributed across the USA and
                            isn&rsquo;t limited to men living in the
                            Mid-Atlantic region. Although our membership largely
                            consists of men with Law Enforcement and Military
                            backgrounds, we welcome all men who are able to
                            attend our regular events, wherever you happen to
                            live.
                          </p>
                          <p className="text-size-medium">
                            If you are interested in learning more about
                            becoming a member, see the{" "}
                            <Link href="/membership/how-to-join">
                              <strong>How to Join</strong>
                            </Link>{" "}
                            page. We appreciate your interest in MAUL!
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
                          className="layout3_image image_about"
                          loading="lazy"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          loading="lazy"
                          src="/images/3_Cadets.jpg"
                          alt="MAUL Officers standing next to each other"
                          className="layout3_image image_about"
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
