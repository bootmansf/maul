import Link from "next/link";
import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

const GALLERIES_QUERY = `*[_type == "gallery"] | order(date desc){
  _id, name, "slug": slug.current, date, coverImage, "imageCount": count(images)
}`;

type Gallery = {
  _id: string;
  name: string;
  slug: string;
  date?: string;
  coverImage?: { asset?: { _ref: string } };
  imageCount?: number;
};

export default async function GalleryPage() {
  const galleries = isSanityConfigured()
    ? await getClient().fetch<Gallery[]>(GALLERIES_QUERY)
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
                      <h1 className="heading-style-h1">Gallery</h1>
                    </div>
                    <p className="text-size-large">
                      Moments from MAUL events and gatherings.
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
                  {galleries.length === 0 ? (
                    <div className="w-dyn-empty">
                      <div>
                        {isSanityConfigured()
                          ? "No galleries yet. Add some in the Studio."
                          : "Galleries will appear here once Sanity is connected."}
                      </div>
                    </div>
                  ) : (
                    <div className="gallery_grid">
                      {galleries.map((g) => (
                        <Link key={g._id} href={`/gallery/${g.slug}`} className="gallery_card">
                          <div className="gallery_card-cover">
                            {g.coverImage?.asset ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={urlFor(g.coverImage).width(600).height(450).url()}
                                alt={g.name}
                                loading="lazy"
                              />
                            ) : null}
                          </div>
                          <div className="gallery_card-text">
                            <h3 className="heading-style-h5 text-color-blue">
                              {g.name}
                            </h3>
                            <p className="text-size-small">
                              {g.date
                                ? new Date(g.date).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                  })
                                : ""}
                              {g.imageCount ? ` · ${g.imageCount} photos` : ""}
                            </p>
                          </div>
                        </Link>
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
