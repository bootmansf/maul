import Link from "next/link";
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
  title: "Letter from the Chief — Mid-Atlantic Uniform League",
  description: "A letter from Chief Brad Garbert.",
};

const PAGE_QUERY = `*[_id == "letterChiefPage"][0]{
  title, subtitle, body, image, signatureName, signatureTitle
}`;

type LetterDoc = {
  title?: string;
  subtitle?: string;
  body?: PortableTextBlock[];
  image?: SanityImageSource;
  signatureName?: string;
  signatureTitle?: string;
};

export default async function LetterFromChiefPage() {
  const doc = isSanityConfigured()
    ? await getClient().fetch<LetterDoc | null>(PAGE_QUERY)
    : null;

  const title = doc?.title ?? "Letter From The Chief";
  const subtitle = doc?.subtitle ?? "Chief Brad Garbert";

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
                  <div className="w-layout-grid layout3_content chiefletter">
                    <div className="layout3_content-left">
                      <div className="w-richtext">
                        {doc?.body?.length ? (
                          <>
                            <PortableText
                              value={doc.body}
                              components={portableTextComponents}
                            />
                            {doc.signatureName ? (
                              <>
                                <p>Sincerely,</p>
                                <p>
                                  {doc.signatureTitle
                                    ? `${doc.signatureTitle} `
                                    : ""}
                                  {doc.signatureName}
                                </p>
                              </>
                            ) : null}
                          </>
                        ) : (
                          <>
                            <p>Welcome!</p>
                            <p>
                              When I first encountered MAUL at the Mid-Atlantic
                              Leather event in 2009, I was rapt. As a gay man
                              who has always had an interest in men in uniform,
                              I was enthralled by the group of men I saw. Their
                              uniforms were so crisp and sharp, they owned the
                              lobby of the hotel and commanded everyone&rsquo;s
                              attention. &ldquo;Finally&rdquo;, I thought,
                              &ldquo;here is a group through which I can fulfill
                              my interest and meet like-minded men.&rdquo; While
                              I had heard of other uniform-related groups, MAUL
                              was the first one I had encountered that had its
                              own, unique, and breathtaking club uniform; a
                              uniform that I could call my own if I was
                              fortunate enough to be able to join. I submitted a
                              membership petition and took the club oath of
                              office in 2013. In January 2026, I was elected
                              Chief.
                            </p>
                            <p>
                              Since I joined 13 years ago MAUL has become much
                              more than a social club for gay men in the
                              Mid-Atlantic region with an interest in uniforms.
                              MAUL has grown to embrace members from all across
                              North America, and even some in Europe. While we
                              are widely dispersed, technology allows us to stay
                              in touch and strengthen our camaraderie. MAUL has
                              become a brotherhood through which its members
                              support each other, and the larger community,
                              aligning itself under the AMCC umbrella. My goal
                              as Chief is to continue to strengthen our internal
                              and external bonds and expand MAUL into a vehicle
                              of not only brotherhood, but of service. I will
                              also strive to maintain and increase MAUL&rsquo;s
                              commitment to being a responsible, ethical, and
                              respectful organization that supports our members
                              and the larger community effectively.
                            </p>
                            <p>
                              2026 marks MAUL&rsquo;s 20<sup>th</sup>{" "}
                              Anniversary, which we are celebrating with our
                              first ever club run on September 17-20, 2026, in
                              Providence, RI. Please join our celebration
                              &mdash; details are available{" "}
                              <Link href="/maul20">here</Link>.
                            </p>
                            <p>
                              Please feel free to peruse our website, and if
                              you&rsquo;re interested in joining or just have
                              questions, feel free to reach out using the{" "}
                              <Link href="/contact">contact page</Link>.
                            </p>
                            <p>
                              Thank you for your interest in the Mid-Atlantic
                              Uniform League (MAUL).
                            </p>
                            <p>Sincerely,</p>
                            <p>Chief Brad Garbert</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="layout3_image-wrapper">
                      {doc?.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={urlFor(doc.image).width(2000).fit("max").url()}
                          alt={title}
                          className="layout3_image chiefletter"
                          loading="lazy"
                        />
                      ) : (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          sizes="100vw"
                          srcSet="/images/thread-viewer-p-500.avif 500w, /images/thread-viewer-p-800.avif 800w, /images/thread-viewer-p-1080.avif 1080w, /images/thread-viewer-p-1600.avif 1600w, /images/thread-viewer.avif 3024w"
                          alt=""
                          src="/images/thread-viewer.avif"
                          loading="lazy"
                          className="layout3_image chiefletter"
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
