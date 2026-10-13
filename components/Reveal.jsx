// Scroll-reveal animation (replaces framer-motion's useInView, once: true)
function useInView(margin = "-100px") {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px` }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return [ref, inView];
}

function Reveal({
  children,
  className = "",
  x = 0,
  y = 0,
  delay = 0,
  duration = 0.8,
  as: Tag = "div",
}) {
  const [ref, inView] = useInView();
  const style = {
    opacity: inView ? 1 : 0,
    transform: inView ? "translate(0,0)" : `translate(${x}px, ${y}px)`,
    transition: `opacity ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform ${duration}s cubic-bezier(0.22,1,0.36,1) ${delay}s`,
    willChange: "opacity, transform",
  };
  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
}

// Looping, muted, autoplaying video that browsers won't block
function LoopVideo({ src, className = "" }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);
  return (
    <video
      ref={ref}
      src={src}
      className={className}
      muted
      autoPlay
      loop
      playsInline
      preload="auto"
    />
  );
}

Object.assign(window, { useInView, Reveal, LoopVideo });