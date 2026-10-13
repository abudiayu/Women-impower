function FeaturedVideoSection({ content }) {
  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <Reveal y={60} duration={0.9}>
          <div className="relative rounded-3xl overflow-hidden aspect-video">
            <LoopVideo src={content.video} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
                <p className="text-white/50 text-xs tracking-widest uppercase mb-3">
                  {content.label}
                </p>
                <p className="text-white text-sm md:text-base leading-relaxed">
                  {content.text}
                </p>
              </div>

              <button className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium btn-press self-start md:self-auto">
                {content.button}
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

window.FeaturedVideoSection = FeaturedVideoSection;