import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { getClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";

export const revalidate = 60;

export const metadata = {
  title: "Gear Vendors — Mid-Atlantic Uniform League",
};

const VENDORS_QUERY = `*[_type == "externalLink" && kind == "vendor"] | order(order asc, name asc){
  _id, category, name, url
}`;

type VendorEntry = {
  _id: string;
  category: string;
  name: string;
  url: string;
};

const FALLBACK: { heading: string; vendors: { name: string; url: string }[] }[] = [
  {
    heading: "Cop Gear",
    vendors: [
      { name: "Alberta Boots", url: "https://www.albertaboot.ca/pages/law-enforcement" },
      { name: "All American Boots", url: "https://www.allamericanboot.com/collections/law-enforcement-boots" },
      { name: "Cycle Cop", url: "https://cyclecop.com/products/" },
      { name: "Dehner Boots", url: "https://dehner.com/product-category/law-enforcement-boots" },
      { name: "Embossy Boots", url: "https://store.embossy.eu/gb/14-uniform" },
      { name: "Galls", url: "http://www.galls.com/" },
      { name: "LA Police Gear", url: "http://www.lapolicegear.com/" },
      { name: "Nick's Police Boots", url: "https://www.nickspoliceboots.com/products" },
      { name: "Police Equipment Worldwide", url: "http://www.police-equipment-worldwide.com/catalog" },
      { name: "Quartermaster", url: "http://www.qmuniforms.com/" },
    ],
  },
  {
    heading: "Firefighter and Other Gear",
    vendors: [{ name: "Paul Conway Shields", url: "https://www.paulconwayshields.com/" }],
  },
  {
    heading: "General",
    vendors: [
      {
        name: "Gear Directory",
        url: "https://geardirectory.notion.site/Gear-Directory-9f9cc24bfc824988946b9c5625f3a4da",
      },
    ],
  },
];

function groupByCategory(rows: VendorEntry[]) {
  const map = new Map<string, VendorEntry[]>();
  for (const r of rows) {
    const arr = map.get(r.category) ?? [];
    arr.push(r);
    map.set(r.category, arr);
  }
  return Array.from(map.entries()).map(([heading, vendors]) => ({
    heading,
    vendors,
  }));
}

export default async function GearVendorsPage() {
  const rows = isSanityConfigured()
    ? await getClient().fetch<VendorEntry[]>(VENDORS_QUERY)
    : [];

  const sections =
    rows.length > 0
      ? groupByCategory(rows)
      : FALLBACK.map((s) => ({
          heading: s.heading,
          vendors: s.vendors.map((v, i) => ({
            _id: `fallback-${s.heading}-${i}`,
            category: s.heading,
            name: v.name,
            url: v.url,
          })),
        }));

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
                      <h1 className="heading-style-h2">Gear Vendors</h1>
                    </div>
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
                <div className="layout396_component">
                  <div className="w-layout-grid layout396_grid-list">
                    <div className="w-layout-grid layout396_row">
                      {sections.map((s) => (
                        <div key={s.heading} className="layout396_card">
                          <div className="layout396_card-content">
                            <div className="layout396_card-content-top">
                              <div className="margin-bottom margin-xsmall">
                                <h2 className="heading-style-h5 text-color-blue">
                                  {s.heading}
                                </h2>
                              </div>
                              <div className="w-richtext">
                                {s.vendors.map((v) => (
                                  <p key={v._id}>
                                    <a
                                      href={v.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {v.name}
                                    </a>
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
