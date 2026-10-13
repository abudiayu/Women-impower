function App() {
  const [content, setContent] = React.useState(null);
  const [error, setError] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [authMode, setAuthMode] = React.useState(null); // null | "login" | "signup"

  React.useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setError(true));

    // Restore session if already logged in
    fetch("/api/me")
      .then((r) => r.json())
      .then((d) => d.user && setUser(d.user))
      .catch(() => {});
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {}
    setUser(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        Couldn't load the site. Is the server running?
      </div>
    );
  }
  if (!content) return <div className="min-h-screen bg-black" />;

  return (
    <main id="top" className="bg-black">
      <Hero
        content={content.hero}
        brand={content.brand}
        links={content.nav_links}
        user={user}
        onAuth={setAuthMode}
        onLogout={logout}
      />
      <AboutSection content={content.about} />
      <FeaturedVideoSection content={content.featured} />
      <PhilosophySection content={content.philosophy} />
      <ServicesSection content={content.services} />
      <Footer
        brand={content.brand}
        links={content.nav_links}
        video={content.featured.video}
      />

      {authMode && (
        <AuthPage
          key={authMode}
          initialMode={authMode}
          onClose={() => setAuthMode(null)}
          onSuccess={(u) => {
            setUser(u);
            setAuthMode(null);
          }}
        />
      )}
    </main>
  );
}

window.App = App;