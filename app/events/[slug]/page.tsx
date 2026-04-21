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

const EVENT_QUERY = `*[_type == "event" && slug.current == $slug][0]{
  _id, title, "slug": slug.current, dateTime, locationVenue, venueAddress,
  description, eventPicture, infoLink
}`;

const ALL_SLUGS_QUERY = `*[_type == "event" && defined(slug.current)][].slug.current`;

type EventDoc = {
  _id: string;
  title: string;
  slug: string;
  dateTime: string;
  locationVenue?: string;
  venueAddress?: string;
  description?: PortableTextBlock[];
  eventPicture?: { asset?: { _ref: string } };
  infoLink?: string;
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
  const event = await getClient().fetch<EventDoc | null>(EVENT_QUERY, { slug });
  if (!event) return {};
  return {
    title: `${event.title} — Mid-Atlantic Uniform League`,
    description: event.locationVenue || "MAUL event",
  };
}

function formatFullDateTime(iso: string) {
  const d = new Date(iso);
  const date = d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const time = d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${date} · ${time}`;
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSanityConfigured()) notFound();
  const event = await getClient().fetch<EventDoc | null>(EVENT_QUERY, { slug });
  if (!event) notFound();

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
                      <p className="text-size-small" style={{ opacity: 0.7 }}>
                        {formatFullDateTime(event.dateTime)}
                      </p>
                    </div>
                    <h1 className="heading-style-h1">{event.title}</h1>
                    {event.locationVenue ? (
                      <p className="text-size-large" style={{ marginTop: "0.75rem" }}>
                        {event.locationVenue}
                      </p>
                    ) : null}
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
                <div className="max-width-large align-center">
                  {event.eventPicture?.asset ? (
                    <div
                      className="event4_image-wrapper"
                      style={{ marginBottom: "2rem", borderRadius: 25, overflow: "hidden" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={urlFor(event.eventPicture).width(1600).url()}
                        alt={event.title}
                        className="event4_image"
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  ) : null}

                  {event.description?.length ? (
                    <div className="text-color-blue" style={{ marginBottom: "2rem" }}>
                      <PortableText value={event.description} />
                    </div>
                  ) : null}

                  <div
                    className="text-color-blue"
                    style={{ display: "grid", gap: "0.75rem", marginBottom: "2rem" }}
                  >
                    <Detail label="Date & Time" value={formatFullDateTime(event.dateTime)} />
                    {event.locationVenue ? (
                      <Detail label="Venue" value={event.locationVenue} />
                    ) : null}
                    {event.venueAddress ? (
                      <Detail label="Address" value={event.venueAddress} preserveWhitespace />
                    ) : null}
                  </div>

                  <div className="button-group">
                    <Link href="/events" className="button is-alternate w-button">
                      ← All events
                    </Link>
                    {event.infoLink ? (
                      <a
                        href={event.infoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="button w-button"
                        style={{ marginLeft: "1rem" }}
                      >
                        More info
                      </a>
                    ) : null}
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

function Detail({
  label,
  value,
  preserveWhitespace,
}: {
  label: string;
  value: string;
  preserveWhitespace?: boolean;
}) {
  return (
    <div>
      <div className="text-size-small" style={{ opacity: 0.7 }}>{label}</div>
      <div
        className="text-size-regular"
        style={preserveWhitespace ? { whiteSpace: "pre-line" } : undefined}
      >
        {value}
      </div>
    </div>
  );
}
