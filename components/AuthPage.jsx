function AuthPage({ initialMode = "login", onClose, onSuccess }) {
  const [mode, setMode] = React.useState(initialMode);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPw, setShowPw] = React.useState(false);
  const [error, setError] = React.useState("");
  const [info, setInfo] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const isLogin = mode === "login";

  // Lock page scroll + close on Escape
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  const switchMode = (next) => {
    setMode(next);
    setError("");
    setInfo("");
    setPassword("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch(isLogin ? "/api/login" : "/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || "Something went wrong. Please try again.");
      } else {
        onSuccess(data.user);
      }
    } catch {
      setError("Couldn't reach the server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" role="dialog" aria-modal="true" aria-label={isLogin ? "Log in" : "Sign up"}>
      {/* ---------- Left: video ---------- */}
      <section className="auth-photo">
        <LoopVideo
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260813_052122_e77a27e6-17f1-4794-889b-3ceaa0e9e8cb.mp4"
          className="auth-video"
        />
        <div className="auth-scrim" />
        <div className="auth-hero">
          <div className="auth-badge">
            <svg viewBox="0 0 582 557" width="17" height="16.27" aria-hidden="true">
              <path
                fill="#fff"
                fillRule="evenodd"
                d="M449.0 0.0 435.0 0.0 415.0 10.0 200.0 249.0 187.0 276.0 189.0 299.0 212.0 326.0 232.0 332.0 289.0 334.0 289.0 516.0 301.0 543.0 324.0 556.0 346.0 556.0 374.0 536.0 573.0 311.0 582.0 288.0 579.0 264.0 559.0 240.0 539.0 233.0 478.0 230.0 478.0 32.0 470.0 13.0ZM442.0 38.0 446.0 250.0 466.0 267.0 540.0 270.0 547.0 285.0 341.0 520.0 332.0 522.0 324.0 514.0 321.0 314.0 307.0 300.0 295.0 297.0 233.0 297.0 224.0 291.0 221.0 282.0ZM1.0 67.0 4.0 81.0 17.0 90.0 216.0 90.0 223.0 87.0 232.0 74.0 228.0 57.0 215.0 49.0 18.0 49.0 5.0 57.0ZM0.0 285.0 4.0 300.0 17.0 308.0 105.0 308.0 118.0 299.0 121.0 291.0 119.0 278.0 111.0 270.0 103.0 267.0 17.0 267.0 4.0 275.0ZM1.0 495.0 4.0 511.0 10.0 517.0 23.0 520.0 179.0 520.0 191.0 516.0 200.0 500.0 196.0 488.0 182.0 479.0 18.0 479.0 9.0 483.0Z"
              />
            </svg>
            <span>Built for women who lead</span>
          </div>
          <p className="auth-hl">Find your strength</p>
          <p className="auth-hl">
            <em>Every single day</em>
          </p>
        </div>
      </section>

      {/* ---------- Right: form ---------- */}
      <section className="auth-pane">
        <button type="button" className="auth-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="auth-card">
          <h1 className="auth-h1">{isLogin ? "Welcome Back!" : "Join the circle"}</h1>
          <p className="auth-sub">
            {isLogin ? (
              <>
                <b>Log in</b> to continue your journey.
              </>
            ) : (
              <>
                <b>Sign up</b> free and start rising today.
              </>
            )}
          </p>

          <form onSubmit={submit} noValidate>
            {!isLogin && (
              <div className="auth-field">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  aria-label="Name"
                />
              </div>
            )}

            <div className="auth-field">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Eg. johndoe@gmail.com"
                autoComplete="email"
                aria-label="Email address"
              />
            </div>

            <div className="auth-field auth-field--pw">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                aria-label="Password"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? "HIDE" : "SHOW"}
              </button>
            </div>

            <p className={`auth-msg ${error ? "is-error" : ""}`} aria-live="polite">
              {error || info || (isLogin ? "\u00A0" : "At least 8 characters.")}
            </p>

            <button type="submit" className="auth-primary" disabled={loading}>
              <span>{loading ? "Please wait..." : isLogin ? "Login" : "Create account"}</span>
              {!loading && (
                <svg viewBox="0 0 22 22" width="13" height="13" aria-hidden="true">
                  <path d="M3 11h15.4M11 3.3l7.7 7.7-7.7 7.7" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <i />
            <b>OR</b>
            <i />
          </div>

          <button
            type="button"
            className="auth-google"
            onClick={() => {
              setError("");
              setInfo("Google sign-in isn't connected yet.");
            }}
          >
            <svg viewBox="0 0 48 48" width="18" height="18" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Sign in with Google</span>
          </button>

          <p className="auth-bottom">
            {isLogin ? "Don\u2019t have an account? " : "Already have an account? "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                switchMode(isLogin ? "signup" : "login");
              }}
            >
              {isLogin ? "Start Free" : "Log in"}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

window.AuthPage = AuthPage;