/**
 * Hero visual: a real telephone receiver photo hanging from its coiled cord,
 * with a subtle swing and soft sound-wave pulses at earpiece height.
 */
import receiver from "@/assets/receiver.png";

export function HeroPhone() {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* soft halo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-40 h-80 w-80 -translate-x-1/2 rounded-full opacity-60 blur-[70px]"
        style={{
          background:
            "radial-gradient(circle at center, color-mix(in oklab, var(--navy-soft) 26%, transparent) 0%, color-mix(in oklab, var(--navy-soft) 10%, transparent) 45%, transparent 72%)",
        }}
      />

      {/* sound waves around the speaker (bottom) */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[45%] top-[72%] h-0 w-0"
      >
        {[0, 0.9, 1.8].map((delay, i) => (
          <span
            key={delay}
            className="wave-ring absolute rounded-full border border-navy-soft/45"
            style={{
              width: 120 + i * 70,
              height: 120 + i * 70,
              marginLeft: -(60 + i * 35),
              marginTop: -(60 + i * 35),
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      <div className="swing-receiver hover:swing-receiver-hover relative transition-all duration-300">
        <img
          src={receiver}
          alt="Navy telephone receiver hanging from a coiled cord"
          width={768}
          height={1280}
          className="relative mx-auto w-full select-none drop-shadow-[0_30px_45px_rgba(20,28,54,0.28)]"
        />
      </div>
    </div>
  );
}
