import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

const CLUBS_QUERY = `*[_type == "amccClub"] | order(name asc){
  _id, name, "slug": slug.current, websiteLink, location, logo
}`;

type Club = {
  _id: string;
  name: string;
  slug: string;
  websiteLink?: string;
  location?: string;
  logo?: { asset?: { _ref: string } };
};

export const metadata = {
  title: "AMCC Member Clubs — Mid-Atlantic Uniform League",
  description:
    "Other clubs part of the Atlantic Motorcycle Coordinating Council.",
};

export default async function AmccClubsPage() {
  const clubs = isSanityConfigured()
    ? await getClient().fetch<Club[]>(CLUBS_QUERY)
    : [];

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
                    <div className="margin-bottom margin-small">
                      <h1 className="heading-style-h2">AMCC Member Clubs</h1>
                    </div>
                    <p className="text-size-large">
                      Other clubs part of the Atlantic Motorcycle Coordinating
                      Council.
                    </p>
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
                  {clubs.length === 0 ? (
                    <div className="w-dyn-empty">
                      <div>
                        {isSanityConfigured()
                          ? "No clubs added yet. Add some in the Studio."
                          : "Clubs will appear here once Sanity is connected."}
                      </div>
                    </div>
                  ) : (
                    <div className="clubs_grid">
                      {clubs.map((c) => {
                        const CardTag = c.websiteLink ? "a" : "div";
                        const props = c.websiteLink
                          ? {
                              href: c.websiteLink,
                              target: "_blank" as const,
                              rel: "noopener noreferrer",
                            }
                          : {};
                        return (
                          <CardTag key={c._id} className="club_card" {...props}>
                            <div className="club_card-logo">
                              {c.logo?.asset ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={urlFor(c.logo).width(240).height(240).url()}
                                  alt={c.name}
                                  loading="lazy"
                                />
                              ) : null}
                            </div>
                            <h3 className="heading-style-h5">{c.name}</h3>
                            {c.location ? <p>{c.location}</p> : null}
                          </CardTag>
                        );
                      })}
                    </div>
                  )}
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
