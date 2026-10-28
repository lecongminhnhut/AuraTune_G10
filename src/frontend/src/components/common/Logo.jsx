export default function Logo({ compact = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-400 via-fuchsia-400 to-orange-300 shadow-glow">
        <span className="absolute h-5 w-5 rounded-full border-2 border-white/90" />
        <span className="absolute h-2 w-2 translate-x-1.5 -translate-y-1.5 rounded-full bg-white" />
      </div>
      {!compact && (
        <span className="text-[19px] font-bold tracking-[-0.06em] text-white">
          aura<span className="text-violet-300">tune</span>
        </span>
      )}
    </div>
  )
}
