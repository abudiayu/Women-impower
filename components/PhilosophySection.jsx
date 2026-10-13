function PhilosophySection({ content }) {
  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal y={40} duration={0.8}>
          <h2 className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24">
            {content.title_before}{" "}
            <em className="font-display italic text-white/40">{content.title_italic}</em>{" "}
            {content.title_after}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <Reveal x={-40} duration={0.8}>
            <div className="rounded-3xl overflow-hidden aspect-[4/3]">
              <LoopVideo src={content.video} className="w-full h-full object-cover" />
            </div>
          </Reveal>

          <Reveal x={40} duration={0.8}>
            <div className="flex flex-col gap-8">
              {content.blocks.map((b, i) => (
                <React.Fragment key={b.label}>
                  {i > 0 && <div className="w-full h-px bg-white/10" />}
                  <div>
                    <p className="text-white/40 text-xs tracking-widest uppercase mb-4">
                      {b.label}
                    </p>
                    <p className="text-white/70 text-base md:text-lg leading-relaxed">
                      {b.text}
                    </p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

window.PhilosophySection = PhilosophySection;