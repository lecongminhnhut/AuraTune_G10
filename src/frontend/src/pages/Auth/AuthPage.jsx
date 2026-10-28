import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Icon from '../../components/common/Icon.jsx'
import Logo from '../../components/common/Logo.jsx'
import { EMAIL_PATTERN, isStrongPassword, useStore } from '../../context/AppStore.jsx'
import { Link, getQueryParam, navigate, useLocation } from '../../utils/navigation.jsx'

const inputBase = 'mt-2 h-12 w-full rounded-lg border bg-black/20 px-4 text-sm font-normal text-white outline-none transition placeholder:text-zinc-600 focus:ring-2'
const inputClass = (invalid) => `${inputBase} ${invalid ? 'border-rose-400/60 focus:border-rose-300 focus:ring-rose-300/10' : 'border-white/10 focus:border-violet-300/70 focus:ring-violet-300/10'}`

const passwordChecks = (value) => [
  { label: 'Ít nhất 8 ký tự', ok: value.length >= 8 },
  { label: 'Có chữ cái', ok: /[A-Za-z]/.test(value) },
  { label: 'Có chữ số', ok: /\d/.test(value) },
]

const safeNext = (value) => (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/login') && !value.startsWith('/register') ? value : '/')

export default function AuthPage({ mode }) {
  const store = useStore()
  const { search } = useLocation()
  const next = safeNext(getQueryParam(search, 'next'))
  const isRegister = mode === 'register'
  const [form, setForm] = useState({ email: '', password: '', displayName: '', remember: true, consent: false })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => { setErrors({}); setFormError(''); setNotice('') }, [mode])

  if (store.currentUser) {
    return (
      <div className="flex min-h-full items-center justify-center px-5 py-10">
        <section className="w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#17171b]/90 p-8 text-center">
          <p className="text-sm text-zinc-300">Bạn đang đăng nhập với <span className="font-semibold text-white">{store.currentUser.email}</span>.</p>
          <div className="mt-5 flex justify-center gap-2">
            <Link to={next} className="rounded-full bg-violet-300 px-5 py-2 text-xs font-bold text-zinc-950">Tiếp tục</Link>
            <button type="button" onClick={store.logout} className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white">Đăng xuất</button>
          </div>
        </section>
      </div>
    )
  }

  const update = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: '' }))
    setFormError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!EMAIL_PATTERN.test(form.email.trim())) nextErrors.email = 'Email không đúng định dạng (ví dụ: ten@email.com).'
    if (isRegister) {
      if (!form.displayName.trim()) nextErrors.displayName = 'Vui lòng nhập tên hiển thị.'
      if (!isStrongPassword(form.password)) nextErrors.password = 'Mật khẩu chưa đủ mạnh: cần ít nhất 8 ký tự, gồm cả chữ và số.'
      if (!form.consent) nextErrors.consent = 'Bạn cần đồng ý với chính sách quyền riêng tư để tạo tài khoản.'
    } else if (!form.password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!validate()) return
    if (isRegister) {
      const result = store.register(form)
      if (!result.ok) { setErrors({ [result.field]: result.error }); return }
      store.toast(`Chào mừng ${result.user.displayName} đến với AuraTune!`)
      navigate(next, { replace: true })
      return
    }
    const result = store.login(form)
    if (!result.ok) {
      const lockedText = result.lockedUntil ? ` Có thể thử lại lúc ${new Date(result.lockedUntil).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}.` : ''
      setFormError(`${result.error}${lockedText}${result.remaining && result.remaining <= 3 ? ` Còn ${result.remaining} lần thử trước khi tài khoản bị tạm khóa.` : ''}`)
      return
    }
    store.toast(`Đăng nhập thành công. Xin chào ${result.user.displayName}!`)
    navigate(next, { replace: true })
  }

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[100px]" />

      <section className="relative w-full max-w-[460px] rounded-2xl border border-white/[0.08] bg-[#17171b]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <Link to="/" className="inline-flex"><Logo /></Link>
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">{isRegister ? 'Bắt đầu hành trình' : 'Chào mừng trở lại'}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{isRegister ? 'Tạo tài khoản AuraTune' : 'Đăng nhập AuraTune'}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{isRegister ? 'Lưu bài hát yêu thích, playlist và nhận gợi ý theo gu của bạn.' : 'Tiếp tục khám phá những giai điệu dành riêng cho bạn.'}</p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setNotice('Đăng nhập Google cần backend OAuth; nút này đang ở chế độ demo.')} className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04] sm:text-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-zinc-900">G</span>
            Google
          </button>
          <button type="button" onClick={() => setNotice('Đăng nhập Facebook cần backend OAuth; nút này đang ở chế độ demo.')} className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04] sm:text-sm">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877f2] text-sm font-bold text-white">f</span>
            Facebook
          </button>
        </div>

        <div className="my-6 flex items-center gap-3 text-[10px] uppercase tracking-[0.15em] text-zinc-600">
          <span className="h-px flex-1 bg-white/10" />{isRegister ? 'hoặc đăng ký bằng email' : 'hoặc đăng nhập bằng email'}<span className="h-px flex-1 bg-white/10" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {isRegister && (
            <label className="block text-xs font-semibold text-zinc-200">
              Tên hiển thị
              <input value={form.displayName} onChange={update('displayName')} maxLength={50} autoComplete="nickname" placeholder="Tên mọi người sẽ thấy" aria-invalid={Boolean(errors.displayName)} aria-describedby="displayName-error" className={inputClass(errors.displayName)} />
              {errors.displayName && <span id="displayName-error" className="mt-1.5 block text-[11px] font-normal text-rose-300">{errors.displayName}</span>}
            </label>
          )}
          <label className="block text-xs font-semibold text-zinc-200">
            Email
            <input type="email" value={form.email} onChange={update('email')} autoComplete="email" placeholder="ten@email.com" aria-invalid={Boolean(errors.email)} aria-describedby="email-error" className={inputClass(errors.email)} />
            {errors.email && <span id="email-error" className="mt-1.5 block text-[11px] font-normal text-rose-300">{errors.email}</span>}
          </label>
          <label className="block text-xs font-semibold text-zinc-200">
            Mật khẩu
            <span className="relative block">
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={update('password')} autoComplete={isRegister ? 'new-password' : 'current-password'} placeholder={isRegister ? 'Tối thiểu 8 ký tự, có chữ và số' : 'Nhập mật khẩu của bạn'} aria-invalid={Boolean(errors.password)} aria-describedby="password-error password-rules" className={`${inputClass(errors.password)} pr-12`} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className="absolute right-2 top-1/2 mt-1 -translate-y-1/2 rounded-md p-2 text-zinc-500 hover:text-white">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </span>
            {errors.password && <span id="password-error" className="mt-1.5 block text-[11px] font-normal text-rose-300">{errors.password}</span>}
            {isRegister && (
              <span id="password-rules" className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-normal">
                {passwordChecks(form.password).map((check) => <span key={check.label} className={check.ok ? 'text-emerald-300' : 'text-zinc-500'}>{check.ok ? '✓' : '•'} {check.label}</span>)}
              </span>
            )}
          </label>

          {isRegister ? (
            <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-zinc-400">
              <input type="checkbox" checked={form.consent} onChange={update('consent')} className="mt-0.5 h-4 w-4 shrink-0 accent-violet-300" />
              <span>Tôi đồng ý để AuraTune lưu lịch sử nghe nhằm cá nhân hóa gợi ý, theo <button type="button" onClick={() => setNotice('Chính sách quyền riêng tư: AuraTune chỉ dùng lịch sử nghe của bạn để gợi ý nhạc, không chia sẻ thông tin định danh cho bên thứ ba và mã hóa dữ liệu khi truyền tải.')} className="font-medium text-violet-300 underline underline-offset-2">chính sách quyền riêng tư</button>.</span>
            </label>
          ) : (
            <div className="flex items-center justify-between gap-3 pt-1 text-xs">
              <label className="flex items-center gap-2 text-zinc-400"><input type="checkbox" checked={form.remember} onChange={update('remember')} className="h-4 w-4 accent-violet-300" /> Ghi nhớ đăng nhập</label>
              <button type="button" onClick={() => setNotice('Khôi phục mật khẩu nằm ngoài phạm vi spec 011 và sẽ được bổ sung ở tính năng riêng.')} className="font-medium text-violet-300 transition hover:text-violet-200">Quên mật khẩu?</button>
            </div>
          )}
          {errors.consent && <p className="text-[11px] text-rose-300">{errors.consent}</p>}

          {formError && <p role="alert" className="rounded-lg border border-rose-300/25 bg-rose-400/10 px-3 py-2.5 text-xs leading-5 text-rose-100">{formError}</p>}

          <button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-violet-300 text-sm font-bold text-zinc-950 transition hover:bg-violet-200">
            {isRegister ? 'Tạo tài khoản' : 'Đăng nhập'} <Icon name="arrowRight" size={16} />
          </button>
        </form>

        {notice && <p role="status" className="mt-4 rounded-lg border border-violet-300/20 bg-violet-300/[0.08] px-3 py-2.5 text-xs leading-5 text-violet-100">{notice}</p>}

        <p className="mt-6 text-center text-xs text-zinc-400">
          {isRegister ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <Link to={`${isRegister ? '/login' : '/register'}${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`} className="font-semibold text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">{isRegister ? 'Đăng nhập' : 'Đăng ký'}</Link>
        </p>
        <Link to="/" className="mt-7 flex items-center justify-center gap-2 text-xs font-medium text-zinc-500 transition hover:text-white"><Icon name="arrowLeft" size={15} /> Quay về trang chủ</Link>
        {!isRegister && (
          <div className="mt-5 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[11px] leading-5 text-zinc-500">
            <p className="font-semibold text-zinc-400">Tài khoản demo (mật khẩu: Aura1234)</p>
            <p>demo@auratune.vn · artist@auratune.vn · admin@auratune.vn</p>
          </div>
        )}
        <p className="mt-4 text-center text-[10px] leading-5 text-zinc-600">Bản demo lưu tài khoản trong trình duyệt của bạn; chưa gửi thông tin tới máy chủ.</p>
      </section>
    </div>
  )
}
