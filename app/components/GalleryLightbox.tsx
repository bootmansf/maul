"use client";

import { useCallback, useEffect, useState } from "react";

type LightboxImage = {
  key: string;
  thumbSrc: string;
  fullSrc: string;
  caption?: string;
};

export function GalleryLightbox({
  images,
  galleryName,
}: {
  images: LightboxImage[];
  galleryName: string;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const isOpen = index !== null;

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () =>
      setIndex((i) =>
        i === null ? null : (i - 1 + images.length) % images.length
      ),
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, next, prev]);

  const active = index !== null ? images[index] : null;

  return (
    <>
      <div className="gallery_detail-grid">
        {images.map((img, i) => (
          <button
            type="button"
            key={img.key}
            className="gallery_detail-image"
            onClick={() => setIndex(i)}
            aria-label={`Open ${img.caption || galleryName} in full size`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.thumbSrc}
              alt={img.caption || galleryName}
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {active ? (
        <div
          className="gallery_lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={active.caption || galleryName}
          onClick={close}
        >
          <button
            type="button"
            className="gallery_lightbox-close"
            onClick={close}
            aria-label="Close"
          >
            ×
          </button>
          {images.length > 1 ? (
            <>
              <button
                type="button"
                className="gallery_lightbox-nav is-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous image"
              >
                ‹
              </button>
              <button
                type="button"
                className="gallery_lightbox-nav is-next"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next image"
              >
                ›
              </button>
            </>
          ) : null}
          <figure
            className="gallery_lightbox-figure"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={active.fullSrc}
              alt={active.caption || galleryName}
              className="gallery_lightbox-image"
            />
            {active.caption ? (
              <figcaption className="gallery_lightbox-caption">
                {active.caption}
              </figcaption>
            ) : null}
          </figure>
        </div>
      ) : null}
    </>
  );
}
