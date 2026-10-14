function Navbar({ brand, links, user, onAuth, onLogout }) {
  return (
    <nav className="relative z-20 px-6 py-6">
      <div className="fixed top-4 left-1/2 -translate-x-1/2 liquid-glass rounded-full max-w-5xl w-[calc(100%-2rem)] mx-auto px-6 py-3 flex items-center justify-between z-50">
        <div className="flex items-center">
          <div className="flex items-center gap-2 text-white">
            <div className="flex items-center justify-center w-9 h-9 rounded-full overflow-hidden shrink-0">
              <img
                src="../static/images/logo.jpg"
                alt={`${brand} logo`}
                className="w-full h-full object-cover"
              />
            </div>
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
          {user ? (
            <>
              <span className="hidden sm:inline text-white/80 text-sm font-medium">
                Hi, {user.name || user.email}
              </span>
              <button
                onClick={onLogout}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium btn-press"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onAuth("signup")}
                className="text-white text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Sign Up
              </button>
              <button
                onClick={() => onAuth("login")}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium btn-press"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

window.Navbar = Navbar;