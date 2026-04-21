import Link from "next/link";
import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

const EVENTS_QUERY = `*[_type == "event"] | order(dateTime desc){
  _id, title, "slug": slug.current, dateTime, locationVenue, venueAddress,
  description, eventPicture, infoLink
}`;

type EventRow = {
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EventsPage() {
  const events = isSanityConfigured()
    ? await getClient().fetch<EventRow[]>(EVENTS_QUERY)
    : [];

  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.dateTime).getTime() >= now);
  const past = events.filter((e) => new Date(e.dateTime).getTime() < now);

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
                      <h1 className="heading-style-h1">Events</h1>
                    </div>
                    <p className="text-size-large">
                      Where you can find us next!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section id="event4" className="section_event4">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="event4_component">
                  <div className="max-width-large align-center">
                    {!isSanityConfigured() ? (
                      <EmptyState message="Events will appear here once Sanity is connected." />
                    ) : events.length === 0 ? (
                      <EmptyState message="No events yet. Add some in the Studio." />
                    ) : (
                      <>
                        {upcoming.length > 0 && (
                          <EventList events={upcoming} heading="Upcoming" />
                        )}
                        {past.length > 0 && (
                          <EventList events={past} heading="Past" />
                        )}
                      </>
                    )}
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

function EmptyState({ message }: { message: string }) {
  return (
    <div className="w-dyn-empty">
      <div>{message}</div>
    </div>
  );
}

function EventList({
  events,
  heading,
}: {
  events: EventRow[];
  heading: string;
}) {
  return (
    <div className="event4_content" style={{ marginBottom: "3rem" }}>
      <div className="margin-bottom margin-medium">
        <h2 className="heading-style-h3 text-color-blue">{heading}</h2>
      </div>
      <div className="event4_list-wrapper">
        <div role="list" className="w-dyn-items">
          {events.map((e) => (
            <div role="listitem" className="collection-item-4 w-dyn-item" key={e._id}>
              <div className="event4_item">
                <div className="event4_image-wrapper">
                  {e.eventPicture?.asset ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={urlFor(e.eventPicture).width(800).height(400).url()}
                      alt={e.title}
                      loading="lazy"
                      className="event4_image"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src="/images/Placeholder-Image---Landscape.svg"
                      alt=""
                      className="event4_image"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="event4_item-content">
                  <div className="event4_item-content-left">
                    <div className="margin-bottom margin-xsmall">
                      <div className="event4_item-content-top">
                        <div className="event4_title">
                          <div className="heading-style-h5 text-color-blue">
                            {e.title}
                          </div>
                        </div>
                        <div className="event4_date-wrapper text-color-blue">
                          <div className="text-size-small">
                            {formatDate(e.dateTime)}
                          </div>
                          <div className="event4_text-divider">•</div>
                          <div className="text-size-small">
                            {formatTime(e.dateTime)}
                          </div>
                        </div>
                      </div>
                    </div>
                    {e.description?.length ? (
                      <div className="text-color-blue">
                        <PortableText value={e.description} />
                      </div>
                    ) : null}
                    {e.locationVenue ? (
                      <p className="text-color-blue text-size-small" style={{ marginTop: "0.5rem" }}>
                        {e.locationVenue}
                        {e.venueAddress ? ` — ${e.venueAddress}` : ""}
                      </p>
                    ) : null}
                  </div>
                  <div className="button-group">
                    <Link
                      href={e.infoLink || `/events/${e.slug}`}
                      target={e.infoLink ? "_blank" : undefined}
                      rel={e.infoLink ? "noopener noreferrer" : undefined}
                      className="button w-button"
                    >
                      {e.infoLink ? "More Info" : "Learn More"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
