import { Facebook, Instagram, Youtube, X } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-white text-sm">
      <div className="container mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-6 border-b border-gray-700">
        <div>
          <h3 className="text-gray-400 font-semibold mb-3">ABOUT</h3>
          <ul className="space-y-2">
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Flipkart Stories</li>
            <li>Press</li>
            <li>Corporate Information</li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-400 font-semibold mb-3">GROUP COMPANIES</h3>
          <ul className="space-y-2">
            <li>Myntra</li>
            <li>Cleartrip</li>
            <li>Shopsy</li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-400 font-semibold mb-3">HELP</h3>
          <ul className="space-y-2">
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div>
          <h3 className="text-gray-400 font-semibold mb-3">CONSUMER POLICY</h3>
          <ul className="space-y-2">
            <li>Cancellation & Returns</li>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
            <li>Sitemap</li>
            <li>Grievance Redressal</li>
            <li>EPR Compliance</li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h3 className="text-gray-400 font-semibold mb-3">Mail Us:</h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Flipkart Internet Private Limited,
            <br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,
            <br />
            Outer Ring Road, Devarabeesanahalli Village,
            <br />
            Bengaluru, 560103,
            <br />
            Karnataka, India
          </p>

          <div className="flex gap-3 mt-4">
            <a href="#" aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="X">
              <X size={18} />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={18} />
            </a>
          </div>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h3 className="text-gray-400 font-semibold mb-3">
            Registered Office Address:
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Flipkart Internet Private Limited,
            <br />
            Buildings Alyssa, Begonia & Clove Embassy Tech Village,
            <br />
            Outer Ring Road, Devarabeesanahalli Village,
            <br />
            Bengaluru, 560103,
            <br />
            Karnataka, India
          </p>
          <p className="mt-2 text-gray-400 text-sm">
            CIN : <span className="text-white">U51109KA2012PTC066107</span>
            <br />
            Telephone:{" "}
            <a href="tel:04445614700" className="text-blue-400 hover:underline">
              044-45614700
            </a>{" "}
            /{" "}
            <a href="tel:04467415800" className="text-blue-400 hover:underline">
              044-67415800
            </a>
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-400 text-xs">
        <div className="flex flex-wrap justify-center sm:justify-start gap-6">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">💼</span> Become a Seller
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">⭐</span> Advertise
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">🎁</span> Gift Cards
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">❓</span> Help Center
          </div>
        </div>

        <div className="text-center sm:text-right">
          © 2007–2025 Flipkart.com
        </div>
      </div>
    </footer>
  );
};

export default Footer;
