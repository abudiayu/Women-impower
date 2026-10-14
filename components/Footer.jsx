/* ============================================================
   AUTH POPUP (login / signup)
   ============================================================ */
function AuthDialog({ mode, onClose, onSwitch, onSuccess }) {
  const [form, setForm] = React.useState({ name: "", email: "", password: "" });
  const [showPw, setShowPw] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [done, setDone] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const firstRef = React.useRef(null);

  const isSignup = mode === "signup";

  const close = React.useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 220);
  }, [onClose]);

  React.useEffect(() => {
    const onKey = (e) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [close]);

  React.useEffect(() => {
    setError("");
    const t = setTimeout(() => firstRef.current && firstRef.current.focus(), 120);
    return () => clearTimeout(t);
  }, [mode]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const pw = form.password;
  const score =
    (pw.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(pw) ? 1 : 0) +
    (/[0-9]/.test(pw) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  const strengthLabel = ["Too short", "Weak", "Okay", "Good", "Strong"][pw ? score : 0];
  const strengthColor = ["#ffffff22", "#f87171", "#fbbf24", "#a3e635", "#34d399"][pw ? score : 0];

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (isSignup && form.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Please enter a valid email address.");
    if (pw.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      const res = await fetch(`/api/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(
          isSignup
            ? { name: form.name.trim(), email: form.email.trim(), password: pw }
            : { email: form.email.trim(), password: pw }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || data.message || "Something went wrong. Try again.");

      setDone(true);
      setTimeout(() => {
        onSuccess && onSuccess(data.user || { name: form.name, email: form.email });
        close();
      }, 1100);
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`auth-overlay fixed inset-0 z-[100] flex items-center justify-center p-4 ${closing ? "auth-out" : "auth-in"}`}
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-label={isSignup ? "Sign up" : "Log in"}
    >
      <style>{`
        .auth-overlay{background:radial-gradient(ellipse at top,rgba(222,193,252,.10),transparent 60%),rgba(0,0,0,.65);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
        .auth-in{animation:authFade .25s ease-out both}
        .auth-out{animation:authFadeOut .22s ease-in both}
        .auth-in .auth-card{animation:authPop .45s cubic-bezier(.2,.9,.3,1.2) both}
        .auth-out .auth-card{animation:authPopOut .22s ease-in both}
        @keyframes authFade{from{opacity:0}to{opacity:1}}
        @keyframes authFadeOut{from{opacity:1}to{opacity:0}}
        @keyframes authPop{from{opacity:0;transform:translateY(24px) scale(.94)}to{opacity:1;transform:none}}
        @keyframes authPopOut{to{opacity:0;transform:translateY(12px) scale(.97)}}
        @keyframes authFloat{0%,100%{transform:translate(0,0)}50%{transform:translate(18px,-22px)}}
        @keyframes authSpin{to{transform:rotate(360deg)}}
        @keyframes authShake{0%,100%{transform:translateX(0)}25%{transform:translateX(-6px)}75%{transform:translateX(6px)}}
        @keyframes authCheck{to{stroke-dashoffset:0}}
        @keyframes authRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .auth-orb{position:absolute;border-radius:9999px;filter:blur(60px);animation:authFloat 9s ease-in-out infinite;pointer-events:none}
        .auth-card{background:linear-gradient(160deg,rgba(255,255,255,.09),rgba(255,255,255,.02));border:1px solid rgba(255,255,255,.14);box-shadow:0 30px 80px -20px rgba(0,0,0,.8),inset 0 1px 0 rgba(255,255,255,.15)}
        .auth-input{width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:22px 16px 8px;color:#fff;font-size:15px;outline:none;transition:border-color .2s,background .2s,box-shadow .2s}
        .auth-input:focus{border-color:rgba(222,193,252,.7);background:rgba(255,255,255,.08);box-shadow:0 0 0 4px rgba(222,193,252,.12)}
        .auth-label{position:absolute;left:16px;top:16px;color:rgba(255,255,255,.5);font-size:15px;pointer-events:none;transition:all .18s ease;transform-origin:left top}
        .auth-input:focus + .auth-label,.auth-input:not(:placeholder-shown) + .auth-label{transform:translateY(-9px) scale(.75);color:rgba(222,193,252,.9)}
        .auth-btn{position:relative;overflow:hidden;width:100%;border-radius:14px;padding:14px;font-weight:600;font-size:15px;color:#0a0a0a;background:linear-gradient(135deg,#f5e9ff,#dec1fc 50%,#b79cf5);transition:transform .15s,box-shadow .2s,opacity .2s;box-shadow:0 10px 30px -10px rgba(222,193,252,.6)}
        .auth-btn:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 14px 36px -8px rgba(222,193,252,.8)}
        .auth-btn:active:not(:disabled){transform:scale(.98)}
        .auth-btn:disabled{opacity:.7;cursor:not-allowed}
        .auth-btn::after{content:"";position:absolute;inset:0;background:linear-gradient(110deg,transparent 30%,rgba(255,255,255,.55) 50%,transparent 70%);transform:translateX(-120%);transition:transform .7s}
        .auth-btn:hover:not(:disabled)::after{transform:translateX(120%)}
        .auth-err{animation:authShake .35s}
        .auth-field{animation:authRise .4s ease both}
      `}</style>

      <div className="relative w-full max-w-md">
        <div className="auth-orb w-56 h-56 -top-16 -left-16" style={{ background: "rgba(222,193,252,.35)" }} />
        <div className="auth-orb w-48 h-48 -bottom-12 -right-10" style={{ background: "rgba(129,140,248,.28)", animationDelay: "-4s" }} />

        <div className="auth-card relative rounded-[28px] p-7 sm:p-9 text-white">
          <button
            onClick={close}
            aria-label="Close"
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          {done ? (
            <div className="py-10 flex flex-col items-center text-center" style={{ animation: "authRise .4s ease both" }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: "rgba(52,211,153,.12)", border: "1px solid rgba(52,211,153,.4)" }}>
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 13l4 4L19 7" style={{ strokeDasharray: 30, strokeDashoffset: 30, animation: "authCheck .6s .15s ease forwards" }} />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-1">{isSignup ? "Welcome to the circle!" : "Welcome back!"}</h3>
              <p className="text-white/60 text-sm">{isSignup ? "Your account is ready." : "You're signed in."}</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-3xl font-semibold tracking-tight">
                  {isSignup ? "Join the circle" : "Welcome back"}
                </h2>
                <p className="text-white/55 text-sm mt-2">
                  {isSignup
                    ? "Weekly motivation, real stories. Start your next chapter."
                    : "Log in to continue your journey."}
                </p>
              </div>

              <div className="relative grid grid-cols-2 p-1 mb-6 rounded-full bg-white/5 border border-white/10">
                <div
                  className="absolute top-1 bottom-1 left-1 rounded-full transition-transform duration-300"
                  style={{
                    width: "calc(50% - 4px)",
                    transform: isSignup ? "translateX(100%)" : "translateX(0)",
                    background: "rgba(255,255,255,.14)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,.2)",
                  }}
                />
                {["login", "signup"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onSwitch(m)}
                    className={`relative z-10 py-2 text-sm font-medium rounded-full transition-colors ${mode === m ? "text-white" : "text-white/50 hover:text-white/80"}`}
                  >
                    {m === "login" ? "Login" : "Sign Up"}
                  </button>
                ))}
              </div>

              <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
                {isSignup && (
                  <div className="relative auth-field">
                    <input
                      ref={firstRef}
                      id="auth-name"
                      className="auth-input"
                      type="text"
                      placeholder=" "
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                    />
                    <label htmlFor="auth-name" className="auth-label">Full name</label>
                  </div>
                )}

                <div className="relative auth-field" style={{ animationDelay: ".05s" }}>
                  <input
                    ref={isSignup ? null : firstRef}
                    id="auth-email"
                    className="auth-input"
                    type="email"
                    placeholder=" "
                    autoComplete="email"
                    value={form.email}
                    onChange={set("email")}
                  />
                  <label htmlFor="auth-email" className="auth-label">Email address</label>
                </div>

                <div className="auth-field" style={{ animationDelay: ".1s" }}>
                  <div className="relative">
                    <input
                      id="auth-password"
                      className="auth-input"
                      style={{ paddingRight: 48 }}
                      type={showPw ? "text" : "password"}
                      placeholder=" "
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      value={form.password}
                      onChange={set("password")}
                    />
                    <label htmlFor="auth-password" className="auth-label">Password</label>
                    <button
                      type="button"
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-colors"
                    >
                      {showPw ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19M14.12 14.12a3 3 0 1 1-4.24-4.24M1 1l22 22" />
                        </svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      )}
                    </button>
                  </div>

                  {isSignup && (
                    <div className="mt-3">
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-300"
                            style={{ background: pw && i <= score ? strengthColor : "rgba(255,255,255,.12)" }}
                          />
                        ))}
                      </div>
                      <p className="text-xs mt-1.5 text-white/45">
                        {pw ? strengthLabel : "Use 8+ characters with a mix of letters, numbers and symbols."}
                      </p>
                    </div>
                  )}
                </div>

                {error && (
                  <div
                    key={error}
                    className="auth-err flex items-start gap-2 text-sm rounded-xl px-3.5 py-2.5"
                    style={{ background: "rgba(248,113,113,.1)", border: "1px solid rgba(248,113,113,.35)", color: "#fca5a5" }}
                    role="alert"
                  >
                    <svg className="shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 8v4M12 16h.01" />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="auth-btn mt-1">
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span
                        style={{ width: 16, height: 16, border: "2px solid rgba(0,0,0,.25)", borderTopColor: "#000", borderRadius: "50%", animation: "authSpin .7s linear infinite" }}
                      />
                      {isSignup ? "Creating account…" : "Logging in…"}
                    </span>
                  ) : isSignup ? (
                    "Create my account"
                  ) : (
                    "Log in"
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-white/55 mt-6">
                {isSignup ? "Already have an account?" : "New here?"}{" "}
                <button
                  type="button"
                  onClick={() => onSwitch(isSignup ? "login" : "signup")}
                  className="text-white font-medium underline underline-offset-4 decoration-white/30 hover:decoration-white transition-all"
                >
                  {isSignup ? "Log in" : "Create an account"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* Renders the popup on document.body so footer overflow/transforms can't clip it */
function AuthModal({ mode, onClose, onSwitch, onSuccess }) {
  if (!mode) return null;
  return ReactDOM.createPortal(
    <AuthDialog mode={mode} onClose={onClose} onSwitch={onSwitch} onSuccess={onSuccess} />,
    document.body
  );
}

window.AuthModal = AuthModal;

/* ============================================================
   FOOTER
   ============================================================ */
function Footer({ brand = "Women", links = [], video, onLogout }) {
  const year = new Date().getFullYear();

  // null = closed, "login" | "signup" = popup open
  const [authMode, setAuthMode] = React.useState(null);

  const openLogin = (e) => {
    e.preventDefault();
    setAuthMode("login");
  };

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

            <a
              href="#"
              onClick={openLogin}
              className="footer-cta self-start md:self-auto"
            >
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

      {/* Login / signup popup */}
      <AuthModal
        mode={authMode}
        onClose={() => setAuthMode(null)}
        onSwitch={setAuthMode}
        onSuccess={() => window.location.reload()}
      />
    </footer>
  );
}

window.Footer = Footer;