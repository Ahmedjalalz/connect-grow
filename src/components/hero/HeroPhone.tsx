import { useState } from "react";
import receiver from "@/assets/receiver.webp";

export function HeroPhone() {
  const [isHeld, setIsHeld] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-[380px] -mt-2 sm:-mt-3 select-none">
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
        className="pointer-events-none absolute left-[45%] top-[80%] h-0 w-0"
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

      <div
        className="group swing-receiver relative cursor-pointer"
        onPointerDown={() => setIsHeld(true)}
        onPointerUp={() => setIsHeld(false)}
        onPointerCancel={() => setIsHeld(false)}
        onPointerLeave={() => setIsHeld(false)}
      >
        <div
          className={`relative transition-all duration-300 ${
            isHeld ? "receiver-buzz" : "group-hover:receiver-buzz"
          }`}
        >
          <img
            src={receiver}
            alt="Navy telephone receiver hanging from a coiled cord - tap or hover to ring"
            width={600}
            height={1000}
            fetchPriority="high"
            loading="eager"
            decoding="async"
            draggable={false}
            className="relative mx-auto w-full select-none drop-shadow-[0_30px_45px_rgba(20,28,54,0.28)] transition-all duration-300 group-hover:drop-shadow-[0_35px_55px_rgba(20,28,54,0.38)]"
          />
        </div>
      </div>
    </div>
  );
}
