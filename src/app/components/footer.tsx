import { MonitorSpeaker, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const footerLinks = {
    shop: [
      "CPUs",
      "GPUs",
      "Motherboards",
      "RAM",
      "Storage",
      "Gaming Accessories",
    ],
    support: [
      "Help Center",
      "Track Order",
      "Returns",
      "Warranty",
      "Build Guides",
      "Contact Us",
    ],
    company: [
      "About Us",
      "Careers",
      "Press",
      "Partnerships",
      "Blog",
      "Reviews",
    ],
    legal: [
      "Privacy Policy",
      "Terms of Service",
      "Cookie Policy",
      "Shipping Policy",
    ],
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
    { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
    { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
    { icon: <Youtube className="h-5 w-5" />, label: "YouTube" },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#0f172a]">
      {/* Newsletter Section */}
      <div className="border-b border-white/10 bg-gradient-to-r from-[#111827] to-[#0f172a]">
        {/* <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8"> */}
          {/* <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div>
              <h3 className="mb-2 text-2xl font-bold text-white">
                Stay Updated
              </h3>
              <p className="text-gray-400">
                Subscribe to get exclusive deals and new product announcements
              </p>
            </div>
            
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-full border-white/10 bg-[#1e293b] text-white placeholder:text-gray-400 focus:border-[#22c55e] focus:ring-[#22c55e] px-4 py-2 w-full"
              />
              <button className="rounded-full bg-[#22c55e] px-8 hover:bg-[#22c55e]/90">
                Subscribe
              </button>
            </div>
          </div> */}
        {/* </div> */}
      </div>

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <MonitorSpeaker className="h-8 w-8 text-[#22c55e]" />
              <span className="text-xl font-bold text-white">PC Builder Store</span>
            </div>
            
            <p className="mb-6 text-gray-400">
              Your trusted partner for premium PC components and custom builds.
              Building gaming dreams since 2020.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-5 w-5 text-[#22c55e]" />
                <span>support@pcbuilderstore.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-5 w-5 text-[#22c55e]" />
                <span>1-800-PC-BUILD</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin className="h-5 w-5 text-[#22c55e]" />
                <span>123 Tech Street, Silicon Valley, CA</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social, index) => (
                <button
                  key={index}
                  className="rounded-full border border-white/10 text-gray-400 transition-all hover:border-[#22c55e] hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
                  aria-label={social.label}
                >
                  {social.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="mb-4 font-bold text-white">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-[#22c55e]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Support</h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-[#22c55e]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-white">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 transition-colors hover:text-[#22c55e]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-400">
              © 2026 PC Builder Store. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-gray-400 transition-colors hover:text-[#22c55e]"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
