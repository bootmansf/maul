import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";

export const metadata = {
  title: "Gear Vendors — Mid-Atlantic Uniform League",
};

type Vendor = { name: string; href: string };

const SECTIONS: { heading: string; vendors: Vendor[] }[] = [
  {
    heading: "Cop Gear",
    vendors: [
      { name: "Alberta Boots", href: "https://www.albertaboot.ca/pages/law-enforcement" },
      { name: "All American Boots", href: "https://www.allamericanboot.com/collections/law-enforcement-boots" },
      { name: "Cycle Cop", href: "https://cyclecop.com/products/" },
      { name: "Dehner Boots", href: "https://dehner.com/product-category/law-enforcement-boots" },
      { name: "Embossy Boots", href: "https://store.embossy.eu/gb/14-uniform" },
      { name: "Galls", href: "http://www.galls.com/" },
      { name: "LA Police Gear", href: "http://www.lapolicegear.com/" },
      { name: "Nick's Police Boots", href: "https://www.nickspoliceboots.com/products" },
      { name: "Police Equipment Worldwide", href: "http://www.police-equipment-worldwide.com/catalog" },
      { name: "Quartermaster", href: "http://www.qmuniforms.com/" },
    ],
  },
  {
    heading: "Firefighter and Other Gear",
    vendors: [
      { name: "Paul Conway Shields", href: "https://www.paulconwayshields.com/" },
    ],
  },
  {
    heading: "General",
    vendors: [
      {
        name: "Gear Directory",
        href: "https://geardirectory.notion.site/Gear-Directory-9f9cc24bfc824988946b9c5625f3a4da",
      },
    ],
  },
];

export default function GearVendorsPage() {
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
                      {SECTIONS.map((s) => (
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
                                  <p key={v.href}>
                                    <a
                                      href={v.href}
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
