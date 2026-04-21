import Link from "next/link";
import { notFound } from "next/navigation";
import type { PortableTextBlock } from "@portabletext/react";
import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { GalleryLightbox } from "../../components/GalleryLightbox";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

const GALLERY_QUERY = `*[_type == "gallery" && slug.current == $slug][0]{
  _id, name, "slug": slug.current, date, description, coverImage,
  images[]{ _key, caption, asset }
}`;

const ALL_SLUGS_QUERY = `*[_type == "gallery" && defined(slug.current)][].slug.current`;

type GalleryImage = {
  _key: string;
  caption?: string;
  asset?: { _ref: string };
};

type Gallery = {
  _id: string;
  name: string;
  slug: string;
  date?: string;
  description?: PortableTextBlock[];
  coverImage?: { asset?: { _ref: string } };
  images?: GalleryImage[];
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
  const gallery = await getClient().fetch<Gallery | null>(GALLERY_QUERY, { slug });
  if (!gallery) return {};
  return {
    title: `${gallery.name} — Mid-Atlantic Uniform League`,
  };
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!isSanityConfigured()) notFound();
  const gallery = await getClient().fetch<Gallery | null>(GALLERY_QUERY, { slug });
  if (!gallery) notFound();

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
                    {gallery.date ? (
                      <p className="text-size-small" style={{ opacity: 0.7 }}>
                        {new Date(gallery.date).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    ) : null}
                    <h1 className="heading-style-h1" style={{ marginTop: "0.25rem" }}>
                      {gallery.name}
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
                <div className="max-width-large align-center">
                  {gallery.description?.length ? (
                    <div
                      className="text-color-blue"
                      style={{ marginBottom: "2.5rem", maxWidth: 700 }}
                    >
                      <PortableText value={gallery.description} />
                    </div>
                  ) : null}

                  {gallery.images?.length ? (
                    <GalleryLightbox
                      galleryName={gallery.name}
                      images={gallery.images
                        .filter((img): img is GalleryImage & { asset: { _ref: string } } =>
                          Boolean(img.asset)
                        )
                        .map((img) => ({
                          key: img._key,
                          caption: img.caption,
                          thumbSrc: urlFor(img)
                            .width(800)
                            .height(800)
                            .fit("crop")
                            .url(),
                          fullSrc: urlFor(img).width(2000).url(),
                        }))}
                    />
                  ) : (
                    <p className="text-color-blue">No photos in this gallery yet.</p>
                  )}

                  <div className="button-group" style={{ marginTop: "2.5rem" }}>
                    <Link href="/gallery" className="button is-alternate w-button">
                      ← All galleries
                    </Link>
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
