function ServicesSection({ content }) {
  return (
    <section className="relative bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto">
        <Reveal y={30} duration={0.7}>
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl text-white tracking-tight">
              {content.title}
            </h2>
            <p className="hidden md:block text-white/40 text-sm">{content.side_label}</p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {content.cards.map((card, i) => (
            <Reveal key={card.title} y={50} duration={0.8} delay={i * 0.15}>
              <div className="group liquid-glass rounded-3xl overflow-hidden h-full">
                <div className="relative aspect-video overflow-hidden">
                  <LoopVideo
                    src={card.video}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/40 text-xs tracking-widest uppercase">
                      {card.tag}
                    </span>
                    <span className="liquid-glass rounded-full p-2 text-white">
                      <ArrowUpRightIcon size={18} />
                    </span>
                  </div>
                  <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight">
                    {card.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">{card.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

window.ServicesSection = ServicesSection;