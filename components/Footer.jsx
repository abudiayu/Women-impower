function Footer({ brand = "Women", links = [], video }) {
  const year = new Date().getFullYear();

  const columns = [
    {
      title: "Explore",
      items: ["Home", ...links].map((l) => ({ label: l, href: "#" })),
    },
    {
      title: "Programs",
      items: [
        { label: "Confidence", href: "#" },
        { label: "Leadership", href: "#" },
        { label: "Mentorship", href: "#" },
        { label: "Community", href: "#" },
      ],
    },
    {
      title: "Connect",
      items: [
        { label: "Instagram", href: "#" },
        { label: "Twitter", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
  ];

  return (
    <footer className="site-footer relative bg-black overflow-hidden">
      {/* soft glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_bottom,_rgba(222,193,252,0.06)_0%,_transparent_65%)]" />

      <div className="relative max-w-6xl mx-auto px-6 pt-24 md:pt-32 pb-8">
        {/* ---------- Top row: statement + CTA ---------- */}
        <Reveal y={30} duration={0.8}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 md:mb-24">
            <h2 className="footer-headline text-3xl md:text-5xl text-white max-w-xl">
              Your next chapter <em className="font-display italic text-white/50">starts here.</em>
            </h2>

            <a href="#top" className="footer-cta self-start md:self-auto">
              <svg viewBox="0 0 9 9" aria-hidden="true">
                <path d="M1.6 .4V6H6.2" fill="none" stroke="currentColor" strokeWidth="1.35" />
                <path d="M5.6 3.6 8.6 6 5.6 8.4Z" fill="currentColor" />
              </svg>
              <span>JOIN THE CIRCLE</span>
            </a>
          </div>
        </Reveal>

        {/* ---------- Link columns ---------- */}
        <Reveal y={30} duration={0.8} delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-20 md:mb-28">
            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <p className="footer-mono text-white/40 mb-5">{col.title}</p>
                <ul className="flex flex-col gap-3">
                  {col.items.map((item) => (
                    <li key={item.label}>
                      <a href={item.href} className="footer-link">
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div className="col-span-2 md:col-span-1">
              <p className="footer-mono text-white/40 mb-5">Say hello</p>
              <a href="mailto:hello@rise.com" className="footer-link">
                HELLO@RISE.COM
              </a>
              <p className="footer-mono text-white/40 mt-6">
                Weekly motivation, real stories.
              </p>
            </div>
          </div>
        </Reveal>

        {/* ---------- Knock-out wordmark: video plays through the letters ---------- */}
        <Reveal y={50} duration={1}>
          <div
            className="relative w-full overflow-hidden bg-black"
            style={{ aspectRatio: "1280 / 260" }}
          >
            {video && (
              <LoopVideo
                src={video}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
            <svg
              viewBox="0 0 1280 260"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <mask
                  id="footer-knockout"
                  maskUnits="userSpaceOnUse"
                  x="0"
                  y="0"
                  width="1280"
                  height="260"
                >
                  <rect width="1280" height="260" fill="#fff" />
                  <text
                    x="640"
                    y="236"
                    textAnchor="middle"
                    fontFamily="'Hanken Grotesk', system-ui, sans-serif"
                    fontWeight="900"
                    fontSize="310"
                    textLength="1240"
                    lengthAdjust="spacingAndGlyphs"
                    fill="#000"
                  >
                    {brand.toUpperCase()}
                  </text>
                </mask>
              </defs>
              <rect width="1280" height="260" fill="#000" mask="url(#footer-knockout)" />
            </svg>
            <span className="sr-only">{brand}</span>
          </div>
        </Reveal>

        {/* ---------- Bottom bar ---------- */}
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="footer-mono text-[#FFFEF7]">
            © {year} Abdulkadir • All rights reserved
          </p>

          <div className="flex items-center gap-3">
            {[InstagramIcon, TwitterIcon, GlobeIcon].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="liquid-glass rounded-full p-3 text-white/80 hover:text-white hover:bg-white/5 transition-all"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="footer-mono text-white/50 hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="footer-mono text-white/50 hover:text-white transition-colors">
              Terms
            </a>
            <a href="#top" className="footer-mono text-white/80 hover:text-white transition-colors">
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

window.Footer = Footer;