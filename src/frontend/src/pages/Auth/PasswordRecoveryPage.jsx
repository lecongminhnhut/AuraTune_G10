import { useState } from 'react'
import { authApi } from '../../services/sessionApiClient.js'
import { getQueryParam, Link, navigate, useLocation } from '../../utils/navigation.jsx'

const inputClass = 'mt-2 h-12 w-full rounded-lg border border-white/10 bg-black/20 px-4 text-sm text-white outline-none focus:border-violet-300/70'
const passwordRules = [
  { label: 'Ít nhất 8 ký tự', test: (value) => value.length >= 8 },
  { label: 'Có chữ hoa (A–Z)', test: (value) => /[A-Z]/.test(value) },
  { label: 'Có chữ thường (a–z)', test: (value) => /[a-z]/.test(value) },
  { label: 'Có chữ số (0–9)', test: (value) => /\d/.test(value) },
  { label: 'Có ký tự đặc biệt', test: (value) => /[^A-Za-z0-9]/.test(value) },
]

export default function PasswordRecoveryPage({ mode }) {
  const { search } = useLocation()
  const token = getQueryParam(search, 'token')
  const isReset = mode === 'reset'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const passwordChecks = passwordRules.map((rule) => ({ ...rule, passed: rule.test(password) }))
  const passwordIsValid = passwordChecks.every((rule) => rule.passed)
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')
    if (isReset && !passwordIsValid) {
      setError('Mật khẩu cần có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, chữ số và ký tự đặc biệt.')
      return
    }
    if (isReset && !passwordsMatch) {
      setError('Mật khẩu xác nhận không khớp.')
      return
    }

    setBusy(true)
    try {
      const result = isReset
        ? await authApi.resetPassword(token, password)
        : await authApi.forgotPassword(email.trim())
      if (!result.success) throw new Error(result.message || 'Yêu cầu không thành công.')
      setMessage(result.message || (isReset
        ? 'Đặt lại mật khẩu thành công. Đang chuyển tới trang đăng nhập…'
        : 'Nếu tài khoản có mật khẩu AuraTune và email hợp lệ, hướng dẫn đặt lại sẽ được gửi đến hộp thư.'))
      if (isReset) window.setTimeout(() => navigate('/login'), 1800)
    } catch (requestError) {
      setError(requestError instanceof TypeError
        ? 'Không thể kết nối tới máy chủ. Hãy kiểm tra kết nối mạng rồi thử lại.'
        : requestError.message || 'Không thể xử lý yêu cầu lúc này. Vui lòng thử lại sau.')
    } finally {
      setBusy(false)
    }
  }

  return <div className="flex min-h-full items-center justify-center px-5 py-10">
    <section className="w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#17171b]/90 p-7 sm:p-9">
      <Link to="/login" className="text-xs text-violet-300 hover:text-violet-200">← Quay lại đăng nhập</Link>
      <h1 className="mt-6 text-2xl font-bold text-white">{isReset ? 'Đặt mật khẩu mới' : 'Quên mật khẩu?'}</h1>
      <p className="mt-2 text-sm leading-6 text-zinc-400">{isReset
        ? 'Chọn mật khẩu mới cho tài khoản AuraTune của bạn.'
        : 'Nhập email đã đăng ký. Nếu tài khoản có mật khẩu AuraTune và email hợp lệ, hướng dẫn đặt lại sẽ được gửi đến hộp thư.'}</p>
      <form onSubmit={submit} className="mt-6 space-y-4">
        {isReset ? <>
          <label className="block text-xs font-semibold text-zinc-200">Mật khẩu mới
            <input required type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className={inputClass} />
          </label>
          <ul aria-live="polite" className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
            {passwordChecks.map((rule) => <li key={rule.label} className={rule.passed ? 'text-emerald-300' : 'text-zinc-400'}>{rule.passed ? '✓' : '•'} {rule.label}</li>)}
          </ul>
          <label className="block text-xs font-semibold text-zinc-200">Xác nhận mật khẩu
            <input required type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className={inputClass} />
          </label>
          {confirmPassword && <p className={`text-xs ${passwordsMatch ? 'text-emerald-300' : 'text-rose-300'}`} aria-live="polite">{passwordsMatch ? 'Mật khẩu khớp.' : 'Mật khẩu chưa khớp.'}</p>}
        </> : <label className="block text-xs font-semibold text-zinc-200">Email
          <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ten@email.com" className={inputClass} />
        </label>}
        {error && <p role="alert" className="text-xs text-rose-300">{error}</p>}
        {message && <p role="status" className="text-xs leading-5 text-emerald-200">{message}</p>}
        <button type="submit" disabled={busy || (isReset && (!token || !passwordIsValid || !passwordsMatch))} className="h-12 w-full rounded-full bg-violet-300 text-sm font-bold text-zinc-950 disabled:opacity-50">{busy ? 'Đang xử lý…' : isReset ? 'Cập nhật mật khẩu' : 'Gửi liên kết đặt lại'}</button>
      </form>
      {isReset && !token && <p className="mt-3 text-xs text-rose-300">Liên kết không hợp lệ hoặc thiếu mã đặt lại.</p>}
    </section>
  </div>
}
