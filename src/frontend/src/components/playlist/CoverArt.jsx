const coverStyles = {
  aurora: 'from-indigo-950 via-violet-800 to-orange-300',
  night: 'from-slate-950 via-indigo-900 to-violet-500',
  ocean: 'from-sky-300 via-cyan-800 to-slate-950',
  rose: 'from-pink-300 via-rose-700 to-violet-950',
  sunset: 'from-amber-300 via-orange-600 to-rose-950',
  forest: 'from-lime-300 via-emerald-800 to-slate-950',
  violet: 'from-fuchsia-300 via-violet-700 to-slate-950',
}

const motifs = {
  aurora: '◒', night: '☾', ocean: '≈', rose: '✳', sunset: '◉', forest: '✦', violet: '✺',
}

export default function CoverArt({ variant = 'aurora', title, className = '', showLabel = false }) {
  return (
    <div className={`group relative isolate overflow-hidden bg-gradient-to-br ${coverStyles[variant] ?? coverStyles.aurora} ${className}`}>
      <div className="absolute -right-[18%] -top-[13%] h-[70%] w-[70%] rounded-full bg-white/15 blur-2xl transition duration-700 group-hover:scale-125" />
      <div className="absolute -bottom-[30%] -left-[12%] h-[75%] w-[75%] rounded-full border border-white/20 bg-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />
      <div className="absolute inset-0 grid place-items-center">
        <span className="cover-motif select-none font-serif text-[clamp(3rem,8vw,6rem)] leading-none text-white/80 drop-shadow-[0_4px_20px_rgba(0,0,0,.25)] transition duration-500 group-hover:scale-110">{motifs[variant] ?? '◒'}</span>
      </div>
      {showLabel && <span className="absolute bottom-3 left-3 right-3 truncate text-[9px] font-bold uppercase tracking-[0.24em] text-white/75">{title}</span>}
    </div>
  )
}
