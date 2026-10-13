function Hero({ content, brand, links }) {
  const videoRef = React.useRef(null);
  const rafRef = React.useRef(0);
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState(null); // {ok, message}
  const [loading, setLoading] = React.useState(false);

  // ----- Video fade logic (vanilla JS via refs, no CSS transitions) -----
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.style.opacity = "0";
    const FADE = 500;
    let fadingOut = false;

    const fadeTo = (target, duration = FADE) => {
      cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const from = parseFloat(video.style.opacity || "0");
      const step = (now) => {
        const t = Math.min((now - start) / duration, 1);
        video.style.opacity = String(from + (target - from) * t);
        if (t < 1) rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    };

    const onCanPlay = () => {
      video.play().catch(() => {});
      fadingOut = false;
      fadeTo(1);
    };

    const onTimeUpdate = () => {
      if (!video.duration) return;
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && !fadingOut) {
        fadingOut = true;
        fadeTo(0);
      }
    };

    const onEnded = () => {
      video.style.opacity = "0";
      setTimeout(() => {
        video.currentTime = 0;
        video.play().catch(() => {});
        fadingOut = false;
        fadeTo(1);
      }, 100);
    };

    video.muted = true;
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    return () => {
      cancelAnimationFrame(rafRef.current);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, []);

  // ----- Newsletter submit -> Flask API -----
  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(data);
      if (data.ok) setEmail("");
    } catch {
      setStatus({ ok: false, message: "Something went wrong. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col bg-black">
      <video
        ref={videoRef}
        src={content.hero_video}
        className="absolute inset-0 w-full h-full object-cover object-bottom"
        muted
        autoPlay
        playsInline
        preload="auto"
        style={{ opacity: 0 }}
      />

      <Navbar brand={brand} links={links} />

      {/*
        SPACING CONTROL:
        - pt-16 md:pt-24  -> space between the navbar and the heading (increase to push it lower)
        - the old -translate-y-[20%] is removed, so nothing overlaps the navbar anymore
      */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 pt-16 md:pt-24 pb-12 text-center">
        <h1 className="font-display text-white tracking-tight whitespace-nowrap text-7xl md:text-8xl lg:text-9xl mb-10">
          {content.title_before} <em className="italic">{content.title_italic}</em>.
        </h1>

        <form onSubmit={submit} className="max-w-xl w-full mb-4">
          <div className="liquid-glass rounded-full pl-6 pr-2 py-2 flex items-center gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={content.placeholder}
              className="flex-1 bg-transparent text-white"
              aria-label="Email address"
              required
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Subscribe"
              className="bg-white rounded-full p-3 text-black btn-press disabled:opacity-60"
            >
              <ArrowRightIcon size={20} />
            </button>
          </div>
          <p
            className={`text-sm mt-3 h-5 transition-opacity ${
              status ? "opacity-100" : "opacity-0"
            } ${status && !status.ok ? "text-red-300" : "text-white"}`}
          >
            {status?.message}
          </p>
        </form>

        <p className="text-white text-sm leading-relaxed px-4 max-w-xl mb-6">
          {content.subtitle}
        </p>

        <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium hover:bg-white/5 transition-colors">
          {content.manifesto_button}
        </button>
      </div>

      <div className="relative z-10 flex justify-center gap-4 pb-12">
        {[InstagramIcon, TwitterIcon, GlobeIcon].map((Icon, i) => (
          <button
            key={i}
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white hover:bg-white/5 transition-all"
          >
            <Icon size={20} />
          </button>
        ))}
      </div>
    </section>
  );
}

window.Hero = Hero;