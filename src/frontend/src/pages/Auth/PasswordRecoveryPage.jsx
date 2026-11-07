import { useState } from 'react'
import { authApi } from '../../services/sessionApiClient.js'
import { getQueryParam, Link, navigate, useLocation } from '../../utils/navigation.jsx'

const inputClass = 'mt-2 h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-300/70'

export default function PasswordRecoveryPage({ mode }) {
  const { search } = useLocation()
  const token = getQueryParam(search, 'token')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true); setError(''); setMessage('')
    try {
      const result = mode === 'reset'
        ? await authApi.resetPassword(token, password)
        : await authApi.forgotPassword(email.trim())
      if (!result.success) throw new Error(result.message || 'Yêu cầu không thành công.')
      if (mode === 'reset') {
        setMessage(result.message)
        window.setTimeout(() => navigate('/login'), 1800)
      } else setMessage(result.message)
    } catch (requestError) {
      setError(requestError.message || 'Không thể gửi yêu cầu lúc này.')
    } finally { setBusy(false) }
  }

  return <div className="flex min-h-full items-center justify-center px-5 py-10">
    <section className="w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#17171b]/90 p-7 sm:p-9">
      <Link to="/login" className="text-xs text-violet-300 hover:text-violet-200">← Quay lại đăng nhập</Link>
      <h1 className="mt-6 text-2xl font-bold text-white">{mode === 'reset' ? 'Đặt mật khẩu mới' : 'Quên mật khẩu?'}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{mode === 'reset' ? 'Chọn mật khẩu mới cho tài khoản AuraTune của bạn.' : 'Nhập email đã đăng ký. Chúng tôi sẽ gửi liên kết đặt lại mật khẩu nếu email này có tài khoản.'}</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {mode === 'reset' ? <label className="block text-xs font-semibold text-zinc-200">Mật khẩu mới<input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} /></label>
          : <label className="block text-xs font-semibold text-zinc-200">Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ten@email.com" className={inputClass} /></label>}
        {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        {message && <p role="status" className="text-xs leading-5 text-emerald-200">{message}</p>}
        <button disabled={busy || (mode === 'reset' && !token)} className="h-12 w-full rounded-full bg-violet-300 text-sm font-bold text-zinc-950 disabled:opacity-50">{busy ? 'Đang xử lý…' : mode === 'reset' ? 'Cập nhật mật khẩu' : 'Gửi liên kết đặt lại'}</button>
      </form>
      {mode === 'reset' && !token && <p className="mt-3 text-xs text-rose-300">Liên kết không hợp lệ hoặc thiếu mã đặt lại.</p>}
    </section>
  </div>
}
