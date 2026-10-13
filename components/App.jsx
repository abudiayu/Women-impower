function App() {
  const [content, setContent] = React.useState(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then(setContent)
      .catch(() => setError(true));
  }, []);

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
      <Hero content={content.hero} brand={content.brand} links={content.nav_links} />
      <AboutSection content={content.about} />
      <FeaturedVideoSection content={content.featured} />
      <PhilosophySection content={content.philosophy} />
      <ServicesSection content={content.services} />
      <Footer
        brand={content.brand}
        links={content.nav_links}
        video={content.featured.video}
      />
    </main>
  );
}

window.App = App;