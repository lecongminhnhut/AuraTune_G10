import { useState } from 'react'
import Icon from '../../components/common/Icon.jsx'
import Logo from '../../components/common/Logo.jsx'

export default function AuthPage() {
  const [notice, setNotice] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    setNotice('Local login is in demo mode; your details are not verified or saved.')
  }

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[100px]" />

      <section className="relative w-full max-w-[460px] rounded-2xl border border-white/[0.08] bg-[#17171b]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <a href="/" className="inline-flex"><Logo /></a>
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">Welcome back</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">Log in to AuraTune</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">Keep discovering music selected just for you.</p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setNotice('Google login is in demo mode; this button does not redirect to OAuth yet.')} className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04] sm:text-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-zinc-900">G</span>
            Google
          </button>
          <button type="button" onClick={() => setNotice('Facebook login is in demo mode; this button does not redirect to OAuth yet.')} className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04] sm:text-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877f2] text-sm font-bold text-white">f</span>
            Facebook
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
          <span className="h-px flex-1 bg-white/10" />or log in with email<span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-xs font-semibold text-zinc-200">
            Email
            <input required type="email" autoComplete="email" placeholder="name@email.com" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm font-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-300/70 focus:ring-2 focus:ring-violet-300/10" />
          </label>
          <label className="block text-xs font-semibold text-zinc-200">
            Password
            <input required type="password" autoComplete="current-password" placeholder="Enter your password" className="mt-2 h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm font-normal text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-300/70 focus:ring-2 focus:ring-violet-300/10" />
          </label>
          <div className="flex items-center justify-between gap-3 pt-1 text-xs">
            <label className="flex items-center gap-2 text-zinc-400"><input type="checkbox" className="h-4 w-4 accent-violet-300" /> Remember me</label>
            <button type="button" onClick={() => setNotice('Password recovery will be available when the backend is ready.')} className="font-medium text-violet-300 transition hover:text-violet-200">Forgot password?</button>
          </div>
          <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-violet-300 text-sm font-bold text-zinc-950 transition hover:bg-violet-200">
            Log in <Icon name="arrowRight" size={16} />
          </button>
        </form>

        {notice && <p role="status" className="mt-4 rounded-lg border border-violet-300/20 bg-violet-300/[0.08] px-3 py-2.5 text-xs leading-5 text-violet-100">{notice}</p>}

        <p className="mt-6 text-center text-xs text-zinc-400">No account yet? <button onClick={() => setNotice('Account registration will be available when the backend is ready.')} className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">Sign up</button></p>
        <a href="/" className="mt-7 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-white"><Icon name="arrowLeft" size={15} /> Back to home</a>
        <p className="mt-5 text-center text-[10px] leading-5 text-zinc-600">This is a demo login interface. No accounts are created and your details are not sent or saved anywhere.</p>
      </section>
    </div>
  )
}
