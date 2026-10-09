import Icon from './Icon.jsx'

export default function TopBar() {
  const navigate = (path) => {
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <header className="sticky top-0 z-20 flex h-[72px] shrink-0 items-center justify-between gap-3 bg-[#111113]/95 px-4 backdrop-blur-xl sm:gap-4 sm:px-8">
      <div className="hidden items-center gap-2 sm:flex">
        <button aria-label="Go back" onClick={() => window.history.back()} className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-zinc-300 transition hover:bg-black/70 hover:text-white"><Icon name="arrowLeft" size={18} /></button>
        <button aria-label="Go forward" onClick={() => window.history.forward()} className="grid h-8 w-8 place-items-center rounded-full bg-black/40 text-zinc-300 transition hover:bg-black/70 hover:text-white"><Icon name="arrowRight" size={18} /></button>
      </div>

      <label className="flex h-11 min-w-0 max-w-[460px] flex-1 items-center gap-3 rounded-full border border-transparent bg-white/[0.07] px-4 text-zinc-400 transition focus-within:border-white/20 focus-within:bg-white/[0.1] sm:ml-4">
        <Icon name="search" size={19} />
        <input aria-label="Search for songs, artists or playlists" placeholder="What would you like to listen to today?" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500" />
        <kbd className="hidden rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-zinc-500 md:inline">⌘ K</kbd>
      </label>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button aria-label="Notifications" className="hidden rounded-full p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white sm:inline-flex"><Icon name="bell" size={18} /></button>
        <button onClick={() => navigate('/login')} aria-label="Log in" className="flex h-9 items-center justify-center gap-2 rounded-full border border-white/15 px-2.5 text-xs font-semibold text-zinc-200 transition hover:border-white/40 hover:bg-white/[0.06] sm:px-3.5">
          <Icon name="user" size={17} /><span className="hidden md:inline">Log in</span>
        </button>
      </div>
    </header>
  )
}
