function Navbar({ brand, links }) {
  return (
    <nav className="relative z-20 px-6 py-6">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 liquid-glass rounded-full max-w-5xl w-[calc(100%-2rem)] mx-auto px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center">
          <div className="flex items-center gap-2 text-white">
            <GlobeIcon size={24} />
            <span className="text-white font-semibold text-lg">{brand}</span>
          </div>
          <div className="hidden md:flex items-center gap-8 ml-8">
            {links.map((l) => (
              <a
                key={l}
                href="#"
                className="text-white/80 hover:text-white text-sm font-medium transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white text-sm font-medium">Sign Up</button>
          <button className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium btn-press">
            Login
          </button>
        </div>
      </div>
    </nav>
  );
}

window.Navbar = Navbar;