import { useEffect, useState } from "react";
import { ArrowUpRight, LockKeyhole, MapPin, Phone } from "lucide-react";
import inrishiLogo from "@/assets/inrishi-logo.png";
import { loadPortalStore, portalStoreEventName } from "@/lib/portal-store";

const officeAddress = "Plot No. 76, Road No. 9, Sumashaila Township, Isnapur, Patancheru, Hyderabad, Telangana 502307, India";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`;

export function SiteFooter() {
  const [showCustomerLogin, setShowCustomerLogin] = useState(true);
  useEffect(() => {
    const sync = () => setShowCustomerLogin(loadPortalStore().websiteControls.customerLoginVisible);
    sync();
    const event = portalStoreEventName();
    window.addEventListener(event, sync);
    return () => { window.removeEventListener(event, sync); };
  }, []);
  return (
    <footer className="site-footer relative border-t border-border/70 bg-background/75 backdrop-blur-[2px]">
      <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-12 md:px-10 lg:grid-cols-[1.2fr_0.65fr_0.65fr_1fr] lg:gap-14 lg:px-16 lg:py-16">
        <div>
          <a href="/" aria-label="Inrishi home" className="inline-flex items-center">
            <img src={inrishiLogo} alt="INRISHI" className="w-[132px]" />
          </a>
          <p className="mt-6 max-w-[340px] text-sm leading-[1.8] text-muted-foreground">
            Intelligent software, AI transformation, business systems, website design and custom workflows built around the way your organization actually works.
          </p>
          <p className="mt-5 font-display text-base font-medium text-cyan">Intelligence Inside</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Explore</h3>
          <nav className="mt-6 flex flex-col gap-4 text-sm text-muted-foreground" aria-label="Footer explore navigation">
            <a href="/#solutions" className="transition-colors hover:text-primary">Solutions</a>
            <a href="/sample-work" className="transition-colors hover:text-primary">Sample Work</a>
          </nav>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Company</h3>
          <nav className="mt-6 flex flex-col gap-4 text-sm text-muted-foreground" aria-label="Footer company navigation">
            <a href="/#approach" className="transition-colors hover:text-primary">Our approach</a>
            <a href="/contact" className="transition-colors hover:text-primary">Contact</a>
            {showCustomerLogin && <a href="/customer-login" className="inline-flex items-center gap-2 transition-colors hover:text-primary"><LockKeyhole size={13} /> Customer Login</a>}
            <a href="tel:+918341889762" className="transition-colors hover:text-primary">Call us</a>
          </nav>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-foreground">Office</h3>
          <div className="mt-6 text-sm leading-[1.8] text-muted-foreground">
            <p className="font-semibold text-foreground">Sumashaila Township, Patancheru</p>
            <p>Plot No. 76, Road No. 9</p>
            <p>Sumashaila Township, Isnapur</p>
            <p>Patancheru, Hyderabad</p>
            <p>Telangana 502307, India</p>
          </div>
          <div className="mt-6 flex flex-col gap-3 text-sm">
            <a href="tel:+918341889762" className="inline-flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-primary">
              <Phone size={15} /> +91 83418 89762
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-primary transition-colors hover:text-cyan">
              <MapPin size={15} /> Open in Maps <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-5 py-5 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
          <div className="flex flex-col gap-1">
            <span>© {new Date().getFullYear()} Inrishi. All rights reserved.</span>
            <span className="text-[10px] opacity-70">Space imagery: NASA/ESA/Hubble (NGC 1300), NASA/Goddard/University of Arizona (Bennu), and NASA/ESA/CSA/STScI (Jupiter).</span>
          </div>
          <a href="/contact" className="inline-flex items-center gap-2 transition-colors hover:text-primary">
            Start a conversation <ArrowUpRight size={13} />
          </a>
        </div>
      </div>
    </footer>
  );
}
