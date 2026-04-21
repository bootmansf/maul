import { SiteNav } from "../components/SiteNav";
import { SiteFooter } from "../components/SiteFooter";
import { ContactForm } from "../components/ContactForm";

export const metadata = {
  title: "Contact Us — Mid-Atlantic Uniform League",
  description: "Get in touch with MAUL.",
};

export default function ContactPage() {
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
                      <h1 className="heading-style-h2">Contact Us</h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="section_contact9">
          <div className="padding-global">
            <div className="container-large">
              <div className="padding-section-small">
                <div className="contact9_component">
                  <div className="w-layout-grid contact9_content">
                    <div className="contact9_image-wrapper">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        loading="lazy"
                        src="/images/PXL_20240113_184215944.MP~2_Original.jpg"
                        alt="Officers sharing a tender moment"
                        className="contact9_image"
                      />
                    </div>
                    <div className="contact9_content-left">
                      <ContactForm />
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
