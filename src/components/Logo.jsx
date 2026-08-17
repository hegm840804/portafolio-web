export default function Logo() {
  return (
    <div className="flex flex-col items-center justify-center group cursor-pointer select-none">
      <div className="relative">
        <svg
          viewBox="0 0 120 120"
          className="w-11 h-11 sm:w-12 sm:h-12 drop-shadow-[0_4px_12px_rgba(6,182,212,0.45)] transition-transform duration-300 group-hover:scale-110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0891b2" />
              <stop offset="45%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>

            <linearGradient id="italicTextGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e0f2fe" />
              <stop offset="80%" stopColor="#a5f3fc" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>

            <linearGradient id="strokeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>

            <linearGradient id="glossEffect" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>

          <rect x="6" y="6" width="108" height="108" rx="30" fill="#020617" opacity="0.7" />
          <rect
            x="8"
            y="8"
            width="104"
            height="104"
            rx="28"
            fill="url(#badgeGradient)"
            stroke="url(#strokeGrad)"
            strokeWidth="3"
          />

          <path
            d="M 12 36 C 12 22, 22 12, 36 12 L 84 12 C 98 12, 108 22, 108 36 C 70 42, 40 40, 12 36 Z"
            fill="url(#glossEffect)"
          />

          <text
            x="58"
            y="76"
            textAnchor="middle"
            fontFamily="'Brush Script MT', 'Dancing Script', 'Segoe Script', cursive, sans-serif"
            fontSize="54"
            fontStyle="italic"
            fontWeight="900"
            fill="url(#italicTextGrad)"
            style={{
              filter: 'drop-shadow(0px 3px 5px rgba(0, 0, 0, 0.6))',
              letterSpacing: '-2px'
            }}
          >
            MH
          </text>

          <circle cx="95" cy="25" r="5.5" fill="#10b981" stroke="#020617" strokeWidth="2.5" />
        </svg>
      </div>

      <div className="flex flex-col items-center mt-1 leading-none text-center">
        <span className="text-[12px] sm:text-xs md:text-sm italic font-extrabold tracking-wide bg-gradient-to-r from-white via-cyan-200 to-teal-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:to-pink-400 transition-all duration-300">
          Martin Tonatiuh Hernandez Garfias
        </span>
        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-semibold text-slate-400 tracking-widest uppercase mt-0.5">
          Frontend & QA Automation
        </span>
      </div>
    </div>
  )
}
