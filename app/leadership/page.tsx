import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

const LEADERSHIP_QUERY = `*[_type == "leadership"] | order(order asc, fullName asc){
  _id, fullName, position, "slug": slug.current, picture
}`;

type Leader = {
  _id: string;
  fullName: string;
  position: string;
  slug: string;
  picture?: { asset?: { _ref: string } };
};

export default async function LeadershipPage() {
  const leaders = isSanityConfigured()
    ? await getClient().fetch<Leader[]>(LEADERSHIP_QUERY)
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
                    <div className="margin-bottom margin-xsmall">
                      <h1 className="heading-style-h1">Leadership</h1>
                    </div>
                    <p className="text-size-large">
                      The officers who keep MAUL running.
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
                  {leaders.length === 0 ? (
                    <div className="w-dyn-empty">
                      <div>
                        {isSanityConfigured()
                          ? "No leadership entries yet. Add some in the Studio."
                          : "Leadership will appear here once Sanity is connected."}
                      </div>
                    </div>
                  ) : (
                    <div className="leadership_grid">
                      {leaders.map((l) => (
                        <LeaderCard key={l._id} leader={l} />
                      ))}
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

function LeaderCard({ leader }: { leader: Leader }) {
  const href = `/leadership/${leader.slug}`;
  return (
    <Link href={href} className="leadership_card">
      <div className="leadership_card-image">
        {leader.picture?.asset ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={urlFor(leader.picture).width(600).height(600).url()}
            alt={leader.fullName}
            loading="lazy"
          />
        ) : (
          <div className="leadership_card-image-placeholder" aria-hidden="true" />
        )}
      </div>
      <div className="leadership_card-text">
        <h3 className="heading-style-h5 text-color-blue">{leader.fullName}</h3>
        <p className="text-size-small">{leader.position}</p>
      </div>
    </Link>
  );
}
