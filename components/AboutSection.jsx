function AboutSection({ content }) {
  return (
    <section className="relative bg-black pt-32 md:pt-44 pb-10 md:pb-14 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_70%)]" />
      <div className="relative max-w-6xl mx-auto text-center">
        <Reveal y={20} duration={0.6}>
          <p className="text-white/40 text-sm tracking-widest uppercase mb-8">
            {content.label}
          </p>
        </Reveal>

        <Reveal y={40} duration={0.8} delay={0.1}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight">
            {content.before}{" "}
            <em className="font-display italic text-white/60">{content.italic_1}</em>{" "}
            {content.middle}
            <br className="hidden md:block" />{" "}
            <em className="font-display italic text-white/60">{content.italic_2}</em>
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

window.AboutSection = AboutSection;