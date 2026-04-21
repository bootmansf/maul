import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

const LEADER_QUERY = `*[_type == "leadership" && slug.current == $slug][0]{
  _id, fullName, position, "slug": slug.current, picture, bio,
  instagram, facebook, bluesky
}`;

const ALL_SLUGS_QUERY = `*[_type == "leadership" && defined(slug.current)][].slug.current`;

type Leader = {
  _id: string;
  fullName: string;
  position: string;
  slug: string;
  picture?: { asset?: { _ref: string } };
  bio?: PortableTextBlock[];
  instagram?: string;
  facebook?: string;
  bluesky?: string;
};

export async function generateStaticParams() {
  if (!isSanityConfigured()) return [];
  const slugs = await getClient().fetch<string[]>(ALL_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isSanityConfigured()) return {};
  const leader = await getClient().fetch<Leader | null>(LEADER_QUERY, { slug });
  if (!leader) return {};
  return {
    title: `${leader.fullName} — Mid-Atlantic Uniform League`,
    description: `${leader.position} · Mid-Atlantic Uniform League`,
  };
}

export default async function LeaderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSanityConfigured()) notFound();
  const leader = await getClient().fetch<Leader | null>(LEADER_QUERY, { slug });
  if (!leader) notFound();

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
                    <p className="text-size-small" style={{ opacity: 0.7 }}>
                      {leader.position}
                    </p>
                    <h1 className="heading-style-h1" style={{ marginTop: "0.25rem" }}>
                      {leader.fullName}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="section_event4">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="leadership_detail">
                  <div className="leadership_detail-image">
                    {leader.picture?.asset ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={urlFor(leader.picture).width(900).url()}
                        alt={leader.fullName}
                      />
                    ) : null}
                  </div>

                  <div className="leadership_detail-body text-color-blue">
                    {leader.bio?.length ? (
                      <PortableText value={leader.bio} />
                    ) : (
                      <p>No bio yet.</p>
                    )}

                    {(leader.instagram || leader.facebook || leader.bluesky) && (
                      <div className="leadership_detail-socials">
                        {leader.instagram ? (
                          <SocialLink href={leader.instagram} label="Instagram" />
                        ) : null}
                        {leader.facebook ? (
                          <SocialLink href={leader.facebook} label="Facebook" />
                        ) : null}
                        {leader.bluesky ? (
                          <SocialLink href={leader.bluesky} label="Bluesky" />
                        ) : null}
                      </div>
                    )}

                    <div className="button-group" style={{ marginTop: "2rem" }}>
                      <Link
                        href="/leadership"
                        className="button is-alternate w-button"
                      >
                        ← All leadership
                      </Link>
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

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-style-link"
    >
      {label}
    </a>
  );
}
