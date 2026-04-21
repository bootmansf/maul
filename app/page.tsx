import Link from "next/link";
import { SiteNav } from "./components/SiteNav";
import { SiteFooter } from "./components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

const UPCOMING_EVENTS_QUERY = `*[_type == "event" && dateTime >= now()] | order(dateTime asc)[0...6]{
  _id, title, "slug": slug.current, dateTime, locationVenue, venueAddress, "infoLink": infoLink, eventPicture
}`;

export const revalidate = 60;

type UpcomingEvent = {
  _id: string;
  title: string;
  slug: string;
  dateTime: string;
  locationVenue?: string;
  venueAddress?: string;
  infoLink?: string;
  eventPicture?: SanityImageSource;
};

function formatEventDate(iso: string) {
  const d = new Date(iso);
  return {
    weekday: d.toLocaleDateString(undefined, { weekday: "short" }),
    day: d.toLocaleDateString(undefined, { day: "numeric" }),
    month: d.toLocaleDateString(undefined, { month: "short" }).toUpperCase(),
    time: d.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

export default async function Home() {
  const events = isSanityConfigured()
    ? await getClient().fetch<UpcomingEvent[]>(UPCOMING_EVENTS_QUERY)
    : [];

  return (
    <div className="page-wrapper background-gradient">
      <SiteNav />

      <main className="main-wrapper">
        {/* Hero */}
        <header className="section_home_hero-header">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="w-layout-grid home_hero-header_component">
                  <div className="home_hero-header_card">
                    <div className="max-width-medium">
                      <div className="icon-embed-custom-2 w-embed">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/MAUL.svg"
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="margin-bottom margin-small">
                        <h1 className="text-color-gold">Serving since 2007</h1>
                      </div>
                      <p className="text-size-medium text-color-white">
                        Mid-Atlantic Uniform League (MAUL) is a gay uniform
                        club. Founded in January 2007, we aim to promote,
                        organize and attend uniform-themed events in the
                        mid-atlantic and surrounding regions.
                      </p>
                      <div className="margin-top margin-medium">
                        <div className="button-group">
                          <Link
                            href="/about"
                            className="button is-icon is-alternate w-inline-block"
                          >
                            <div>Learn More</div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* About */}
        <section className="section_home_about">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-medium">
                <div className="home_about_component">
                  <div className="home_about_content-left">
                    <div className="home_about_image-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/IMG_8507.jpg"
                        alt="MAUL Officers in formation"
                        className="home_about_image1"
                        loading="eager"
                        sizes="(max-width: 4032px) 100vw, 4032px"
                        srcSet="/images/IMG_8507-p-500.jpg 500w, /images/IMG_8507-p-800.jpg 800w, /images/IMG_8507-p-1080.jpg 1080w, /images/IMG_8507-p-1600.jpg 1600w, /images/IMG_8507-p-2000.jpg 2000w, /images/IMG_8507-p-2600.jpg 2600w, /images/IMG_8507-p-3200.jpg 3200w, /images/IMG_8507.jpg 4032w"
                      />
                    </div>
                  </div>
                  <div className="home_about_content-right">
                    <div className="home_about_image-wrapper">
                      <div className="icon-embed-custom-4 w-embed">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/images/MAUL_Badge_Detail.png"
                          srcSet="/images/MAUL_Badge_Detail-p-500.png 500w, /images/MAUL_Badge_Detail-p-800.png 800w, /images/MAUL_Badge_Detail.png 832w"
                          sizes="271px"
                          alt=""
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="home_about_content-right-bottom">
                      <div className="margin-bottom margin-small">
                        <h2 className="text-color-alternate is-gold">
                          Mid-Atlantic &amp; Beyond
                        </h2>
                      </div>
                      <p className="text-size-medium text-color-white">
                        While our officers attend to many events in the
                        Mid-Atlantic, MAUL membership is open to anyone who is
                        proud to openly identify as a gay adult male with a
                        uniform fetish, regardless of age, race, creed,
                        religion, or any other such classification.
                      </p>
                      <div className="margin-top margin-medium">
                        <div className="button-group">
                          <Link
                            href="/membership/how-to-join"
                            className="button is-alternate w-button"
                          >
                            How to Join
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="section_home_features-list">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-medium">
                <div className="home_features-list_component">
                  <div className="margin-bottom margin-large">
                    <div className="text-align-center">
                      <div className="max-width-large">
                        <h3 className="text-color-alternate is-gold">
                          What we&rsquo;re all about!
                        </h3>
                      </div>
                    </div>
                  </div>

                  <div className="w-layout-grid home_features-list_list">
                    {[
                      {
                        img: "/images/PXL_20240113_184215944.MP~2_Original.jpg",
                        alt: "Officers sharing a tender moment",
                        title: "Brotherhood",
                        copy: "We are a social and fraternal association for gay adult male with affinity or fetish for uniforms.",
                        variant: "img_1",
                      },
                      {
                        img: "/images/RoselandGroup.jpg",
                        alt: "MAUL Officers holding banner",
                        title: "Community",
                        copy: "We conduct outreach with other queer leather and uniform clubs and attend leather events throughout the year.",
                        variant: "",
                      },
                      {
                        img: "/images/IMG_1167.webp",
                        alt: "Parade of colors featuring multiple clubs.",
                        title: "Service",
                        copy: "We support and assist appropriate charities and community services, particularly those related to gay, fetish or public safety issues.",
                        variant: "img_3",
                      },
                    ].map((f) => (
                      <div className="home_features-list_item" key={f.title}>
                        <div className="margin-bottom">
                          <div className="home_features-list_image-wrapper">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={f.img}
                              alt={f.alt}
                              className={`home_features-list_image ${f.variant}`.trim()}
                              loading="lazy"
                            />
                          </div>
                        </div>
                        <div className="margin-bottom margin-xsmall">
                          <h3 className="heading-style-h5">
                            <strong className="text-color-blue">
                              {f.title}
                            </strong>
                          </h3>
                        </div>
                        <p className="card_width">{f.copy}</p>
                        <div className="margin-small">
                          <div className="button-group is-center">
                            <Link
                              href="/about/our-mission"
                              className="button is-icon w-inline-block"
                            >
                              <div>Learn More</div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events */}
        <section className="section_home_events">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-medium">
                <div className="home_events_align">
                  <div className="home_events_left">
                    <div className="home_events_lefttop">
                      <div className="text-align-center">
                        <div className="max-width-large align-center">
                          <div className="margin-bottom margin-small">
                            <h3 className="text-align-left text-color-gold">
                              Where to find us
                            </h3>
                          </div>
                          <div className="margin-bottom margin-small">
                            <p className="text-size-medium text-align-left text-color-white">
                              Officers of the club assemble at several events
                              during the year including local police parades,
                              motorcycle rodeos, and other law enforcement
                              events throughout the year.
                            </p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/events"
                        className="button is-alternate w-button"
                      >
                        View all events
                      </Link>
                    </div>

                    <div className="w-layout-grid card-row44_component">
                      <div className="card-row44_card-content text-color-blue">
                        <div className="card-row44_card-content-top">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src="/images/MAUL_Badge_Detail.png"
                            alt="MAUL Badge graphic"
                            className="icon-embed-large"
                            loading="lazy"
                          />
                          <div className="margin-bottom">
                            <h3 className="heading-style-h5 text-color-gold margin-bottom margin-xxsmall">
                              Looking to partner with us for an event?
                            </h3>
                            <p className="text-color-white">
                              Contact our Events Officer or use the form below.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="home_events_component">
                    <div className="home_events_list-wrapper">
                      <div className="w-layout-grid event8_list">
                        {events.length === 0 ? (
                          <div className="w-dyn-empty">
                            <div>
                              {isSanityConfigured()
                                ? "No upcoming events yet. Add some in the Studio."
                                : "Events will appear here once Sanity is connected."}
                            </div>
                          </div>
                        ) : (
                          events.map((e) => {
                            const d = formatEventDate(e.dateTime);
                            return (
                              <div className="event8_item" key={e._id}>
                                <Link
                                  href={e.infoLink || `/events/${e.slug}`}
                                  target={e.infoLink ? "_blank" : undefined}
                                  rel={e.infoLink ? "noopener noreferrer" : undefined}
                                  className="event8_item-link w-inline-block"
                                >
                                  <div className="event8_image-wrapper">
                                    <div className="event8_date-wrapper">
                                      <div className="text-size-small">
                                        {d.weekday}
                                      </div>
                                      <div className="heading-style-h4">
                                        {d.day}
                                      </div>
                                      <div className="text-size-small">
                                        {d.month}
                                      </div>
                                    </div>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={
                                        e.eventPicture
                                          ? urlFor(e.eventPicture)
                                              .width(800)
                                              .height(600)
                                              .fit("crop")
                                              .url()
                                          : "/images/Placeholder-Image---Landscape.svg"
                                      }
                                      alt=""
                                      className="event8_image"
                                      loading="lazy"
                                    />
                                  </div>
                                  <div className="event8_item-content">
                                    <div className="event8_title">
                                      <h3 className="heading-style-h5">
                                        {e.title}
                                      </h3>
                                      {e.locationVenue ? (
                                        <div className="text-size-small">
                                          {e.locationVenue}
                                        </div>
                                      ) : null}
                                      <div className="text-size-small">
                                        {d.time}
                                      </div>
                                    </div>
                                    {e.venueAddress ? (
                                      <div className="text-size-regular">
                                        {e.venueAddress}
                                      </div>
                                    ) : null}
                                  </div>
                                </Link>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="section_home_contact">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-medium">
                <div className="margin-bottom margin-large">
                  <div className="max-width-large">
                    <div className="margin-bottom margin-small">
                      <h2>Contact us</h2>
                    </div>
                    <p className="text-size-medium">
                      For general inquiries, use this form to reach us.
                    </p>
                  </div>
                </div>

                <div className="w-layout-grid home_contact_component">
                  <div className="home_contact_form-block w-form">
                    <form
                      action={
                        process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT || undefined
                      }
                      method="POST"
                      className="home_contact_form"
                    >
                      <div className="form_field-wrapper">
                        <label
                          htmlFor="contact-name"
                          className="form_field-label"
                        >
                          Name
                        </label>
                        <input
                          className="form_input w-input"
                          maxLength={256}
                          name="name"
                          type="text"
                          id="contact-name"
                          required
                        />
                      </div>
                      <div className="form_field-wrapper">
                        <label
                          htmlFor="contact-email"
                          className="form_field-label"
                        >
                          Email
                        </label>
                        <input
                          className="form_input w-input"
                          maxLength={256}
                          name="email"
                          type="email"
                          id="contact-email"
                          required
                        />
                      </div>
                      <div className="form_field-wrapper">
                        <label
                          htmlFor="contact-message"
                          className="form_field-label"
                        >
                          Message
                        </label>
                        <textarea
                          placeholder="Type your message..."
                          maxLength={5000}
                          id="contact-message"
                          name="message"
                          required
                          className="form_input is-text-area w-input"
                        />
                      </div>
                      <input
                        type="submit"
                        className="button w-button"
                        value="Submit"
                        disabled={!process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT}
                      />
                      {!process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT && (
                        <p className="text-size-small text-color-white" style={{ marginTop: "0.5rem", opacity: 0.7 }}>
                          Form not wired up yet. Set{" "}
                          <code>NEXT_PUBLIC_FORMSPREE_ENDPOINT</code> to
                          activate.
                        </p>
                      )}
                    </form>
                  </div>

                  <div className="home_contact_content">
                    <div className="w-layout-grid home_contact_contact-list">
                      <div className="home_contact_item">
                        <div className="margin-bottom margin-xxsmall">
                          <h3 className="heading-style-h6">Email</h3>
                        </div>
                        <a
                          href="mailto:contact@uniformleague.org"
                          className="text-style-link"
                        >
                          contact@uniformleague.org
                        </a>
                      </div>
                      <div className="home_contact_item">
                        <div className="margin-bottom margin-xxsmall">
                          <h3 className="heading-style-h6">
                            Follow us on socials!
                          </h3>
                        </div>
                        <div className="margin-bottom margin-xxsmall">
                          <div>#GetMAULd!</div>
                        </div>
                      </div>
                    </div>

                    <div className="margin-top margin-large">
                      <div className="w-layout-grid card-row44_component">
                        <div className="card-row44_card-content text-color-blue">
                          <div className="card-row44_card-content-top">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src="/images/MAUL_Badge_Detail.png"
                              alt="MAUL Badge graphic"
                              className="icon-embed-large"
                              loading="lazy"
                            />
                            <div className="margin-bottom margin-xxsmall">
                              <h3 className="heading-style-h5 text-color-gold margin-bottom margin-xxsmall">
                                Interested in joining MAUL?
                              </h3>
                              <p className="text-color-white">
                                Check out{" "}
                                <Link
                                  href="/membership/how-to-join"
                                  className="text-color-white"
                                >
                                  our guide
                                </Link>{" "}
                                on how to become a MAUL cadet.
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

      <SiteFooter />
    </div>
  );
}
