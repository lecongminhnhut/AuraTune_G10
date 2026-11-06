import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Icon from '../../components/common/Icon.jsx'
import Logo from '../../components/common/Logo.jsx'
import { EMAIL_PATTERN, isStrongPassword, useStore } from '../../context/AppStore.jsx'
import { Link, getQueryParam, navigate, useLocation } from '../../utils/navigation.jsx'
import { initiateOAuthLogin } from '../../../../database/services/oauthService.js'
import {
  loginWithGoogle,
  loginWithFacebook,
  getSignInMethodsForEmail
} from '../../services/firebaseAuth.js'
import { auth } from '../../config/firebase.js'

const inputBase = 'mt-2 h-12 w-full rounded-lg border bg-black/20 px-4 text-sm font-normal text-white outline-none transition placeholder:text-zinc-600 focus:ring-2'
const inputClass = (invalid) => `${inputBase} ${invalid ? 'border-rose-400/60 focus:border-rose-300 focus:ring-rose-300/10' : 'border-white/10 focus:border-violet-300/70 focus:ring-violet-300/10'}`

const passwordChecks = (value) => [
  { label: 'Ít nhất 8 ký tự', ok: value.length >= 8 },
  { label: 'Chữ hoa (A-Z)', ok: /[A-Z]/.test(value) },
  { label: 'Chữ thường (a-z)', ok: /[a-z]/.test(value) },
  { label: 'Chữ số (0-9)', ok: /\d/.test(value) },
  { label: 'Ký tự đặc biệt', ok: /[^A-Za-z0-9]/.test(value) },
]

const safeNext = (value) => (value.startsWith('/') && !value.startsWith('//') && !value.startsWith('/login') && !value.startsWith('/register') ? value : '/')
const isGoogleFirebaseUser = (user) => user?.providerData?.some(({ providerId }) => providerId === 'google.com')

export default function AuthPage({ mode }) {
  const store = useStore()
  const { search } = useLocation()
  const next = safeNext(getQueryParam(search, 'next'))
  const isRegister = mode === 'register'
  const [form, setForm] = useState({
  email: '',
  password: '',
  displayName: '',
  remember: true,
  consent: false,
  termsConsent: false
  })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [notice, setNotice] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showNotFoundModal, setShowNotFoundModal] = useState(false)

  useEffect(() => { setErrors({}); setFormError(''); setNotice(''); setShowNotFoundModal(false) }, [mode])

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
      const hasOAuthIdentity = isGoogleFirebaseUser(auth.currentUser) && auth.currentUser.email?.toLowerCase() === form.email.trim().toLowerCase()
      if (!form.displayName.trim()) nextErrors.displayName = 'Vui lòng nhập tên hiển thị.'
      if (!hasOAuthIdentity && !form.password) {
        nextErrors.password = 'Vui lòng nhập mật khẩu.'
      } else if (!hasOAuthIdentity && !isStrongPassword(form.password)) {
        nextErrors.password = 'Mật khẩu chưa đủ mạnh: cần ít nhất 8 ký tự, gồm cả chữ và số.'
      }
      if (!form.consent) nextErrors.consent = 'Bạn cần đồng ý với chính sách quyền riêng tư để tạo tài khoản.'
      if (!form.termsConsent) nextErrors.termsConsent = 'Bạn cần đồng ý với điều khoản đăng ký AuraTune.'
    } else if (!form.password) {
      nextErrors.password = 'Vui lòng nhập mật khẩu.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

    const handleSubmit = async (event) => {
      event.preventDefault()

      setFormError('')
      setNotice('')

      if (!validate()) return

      if (isRegister && isGoogleFirebaseUser(auth.currentUser) && auth.currentUser.email?.toLowerCase() === form.email.trim().toLowerCase()) {
        const result = await store.loginWithFirebase({ firebaseUser: auth.currentUser, termsAccepted: form.consent && form.termsConsent })
        if (!result.ok) {
          setFormError(result.error || 'Không thể hoàn tất đăng ký.')
          return
        }
        store.toast(`Tạo tài khoản thành công. Xin chào ${result.user.displayName}!`)
        navigate(next, { replace: true })
        return
      }

      const result = isRegister
        ? await store.register({ email: form.email, password: form.password, displayName: form.displayName, termsAccepted: form.consent && form.termsConsent })
        : await store.login({ email: form.email, password: form.password, rememberMe: form.remember })

      if (!result.ok) {
        if (result.field) setErrors((previous) => ({ ...previous, [result.field]: result.error }))
        else setFormError(result.error || 'Không thể xác thực tài khoản.')
        return
      }

      store.toast(isRegister ? `Tạo tài khoản thành công. Xin chào ${result.user.displayName}!` : `Đăng nhập thành công. Xin chào ${result.user.displayName}!`)
      navigate(next, { replace: true })
    }

    const handleOAuthClick = async (provider) => {
      setFormError('')

      try {
        // Google Authentication through Firebase
        if (provider === 'google') {
          const firebaseUser = await loginWithGoogle()

          if (isRegister) {
            if (!firebaseUser.email) {
              setFormError(
                'Tài khoản Google của bạn chưa liên kết email hoặc chưa được xác minh. Vui lòng cập nhật email trên Google hoặc sử dụng phương thức đăng ký bằng Email.'
              )
              return
            }
            setForm((previous) => ({
              ...previous,
              displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || '',
              email: firebaseUser.email || ''
            }))
            setNotice(
              'Đã xác thực bằng Google. Hãy xác nhận các lựa chọn đồng ý rồi bấm Tạo tài khoản.'
            )
            return
          }

          const result = await store.loginWithFirebase({
            firebaseUser,
            termsAccepted: false
          })

          if (!result.ok) {
            if (!isRegister && (result.code === 'TERMS_ACCEPTANCE_REQUIRED' || result.error?.includes('terms'))) {
              setShowNotFoundModal(true)
              return
            }
            setFormError(
              result.error || 'Đăng nhập Google thất bại.'
            )
            return
          }

          store.toast(
            `Đăng nhập thành công. Xin chào ${result.user.displayName}!`
          )

          navigate(next, { replace: true })
          return
        }

        // Facebook Authentication through Firebase
        if (provider === 'facebook') {
          if (isRegister) {
            setFormError('Facebook không dùng để tạo tài khoản mới. Hãy đăng ký bằng Email hoặc Google, sau đó liên kết Facebook trong Cài đặt tài khoản.')
            return
          }

          const firebaseUser = await loginWithFacebook()

          const result = await store.loginWithFirebase({
            firebaseUser,
            termsAccepted: false
          })

          if (!result.ok) {
            if (result.code === 'FACEBOOK_ACCOUNT_NOT_LINKED') {
              setFormError('Facebook chưa được liên kết với AuraTune. Hãy đăng nhập bằng Email hoặc Google rồi liên kết Facebook trong Cài đặt tài khoản.')
              return
            }
            if (!isRegister && (result.code === 'TERMS_ACCEPTANCE_REQUIRED' || result.error?.includes('terms'))) {
              setShowNotFoundModal(true)
              return
            }
            setFormError(
              result.error || 'Đăng nhập Facebook thất bại.'
            )
            return
          }

          store.toast(
            `Đăng nhập thành công. Xin chào ${result.user.displayName}!`
          )

          navigate(next, { replace: true })
          return
        }

        // Preserve existing OAuth flow for other providers
        const res = await initiateOAuthLogin(
          provider,
          `${window.location.origin}/auth/callback`
        )

        if (res.mode === 'redirect' && res.url) {
          window.location.href = res.url
        } else {
          navigate(
            `/auth/callback?provider=${provider}&next=${encodeURIComponent(next)}`
          )
        }
      } catch (error) {
        if (error.code === 'auth/popup-closed-by-user') {
          return
        }

        if (error.code === 'auth/account-exists-with-different-credential') {
          const email = error.customData?.email || ''
          let existingMethodsText = ''

          if (email) {
            const methods = await getSignInMethodsForEmail(email)
            if (methods && methods.length > 0) {
              const friendlyNames = methods.map((m) => {
                if (m === 'password') return 'Email / Mật khẩu'
                if (m === 'google.com') return 'Google'
                if (m === 'facebook.com') return 'Facebook'
                return m
              })
              existingMethodsText = friendlyNames.join(', ')
            }
          }

          setFormError(
            `Email${email ? ` (${email})` : ''} đã được đăng ký bằng phương thức khác${existingMethodsText ? ` (${existingMethodsText})` : ''}. Vui lòng đăng nhập bằng ${existingMethodsText || 'phương thức bạn đã dùng trước đó'} để vào hệ thống!`
          )
          return
        }

        setFormError(
          error.message || 'Không thể xác thực bằng mạng xã hội.'
        )
      }
    }


  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-5 py-10 sm:px-8">
      {showNotFoundModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#1e1e24] p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white">Không tìm thấy tài khoản</h3>
            <p className="mt-3 text-sm leading-6 text-zinc-300">
              Tài khoản mạng xã hội này chưa kết nối với một tài khoản AuraTune.
            </p>
            
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowNotFoundModal(false)}
                className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
              >
                Đăng nhập lại
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowNotFoundModal(false)
                  navigate(`/register${next !== '/' ? `?next=${encodeURIComponent(next)}` : ''}`)
                }}
                className="rounded-full bg-violet-300 px-5 py-2 text-xs font-bold text-zinc-950 transition hover:bg-violet-200"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-violet-600/15 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[100px]" />

      <section className="relative w-full max-w-[460px] rounded-2xl border border-white/[0.08] bg-[#17171b]/90 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
        <Link to="/" className="inline-flex"><Logo height="h-[132px]" /></Link>
        <div className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-300">{isRegister ? 'Bắt đầu hành trình' : 'Chào mừng trở lại'}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{isRegister ? 'Tạo tài khoản AuraTune' : 'Đăng nhập AuraTune'}</h1>
          <p className="mt-2 text-sm leading-6 text-zinc-400">{isRegister ? 'Lưu bài hát yêu thích, playlist và nhận gợi ý theo gu của bạn.' : 'Tiếp tục khám phá những giai điệu dành riêng cho bạn.'}</p>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => handleOAuthClick('google')} className={`flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04] sm:text-sm ${isRegister ? 'col-span-2' : ''}`}>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-xs font-bold text-zinc-900">G</span>
            Google
          </button>
          {!isRegister && (
            <button type="button" onClick={() => handleOAuthClick('facebook')} className="flex h-11 items-center justify-center gap-2 rounded-full border border-white/15 text-xs font-semibold text-white transition hover:border-white/35 hover:bg-white/[0.04] sm:text-sm">
              <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877f2] text-sm font-bold text-white">f</span>
              Facebook
            </button>
          )}
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
            <>
              <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-zinc-400">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={update('consent')}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-violet-300"
                />
                <span>
                  Tôi đồng ý cho AuraTune lưu lịch sử nghe
                  nhằm cá nhân hóa gợi ý theo chính sách quyền riêng tư.
                </span>
              </label>

              <label className="flex items-start gap-2 pt-1 text-xs leading-5 text-zinc-400">
                <input
                  type="checkbox"
                  checked={form.termsConsent}
                  onChange={update('termsConsent')}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-violet-300"
                />
                <span>
                  Tôi đã đọc và đồng ý với điều khoản sử dụng
                  và điều kiện đăng ký tài khoản AuraTune.
                </span>
              </label>

              {errors.termsConsent && (
                <p className="text-[11px] text-rose-300">
                  {errors.termsConsent}
                </p>
              )}
            </>
          ) : (

            <div className="flex items-center justify-between gap-3 pt-1 text-xs">
              <label className="flex items-center gap-2 text-zinc-400"><input type="checkbox" checked={form.remember} onChange={update('remember')} className="h-4 w-4 accent-violet-300" /> Ghi nhớ đăng nhập</label>
              <button type="button" onClick={() => setNotice('Khôi phục mật khẩu hiện chưa sẵn sàng vì dịch vụ gửi email chưa được cấu hình.')} className="font-medium text-violet-300 transition hover:text-violet-200">Quên mật khẩu?</button>
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
            <p className="font-semibold text-zinc-400">Tài khoản demo (mật khẩu: Aura1234!)</p>
            <p>demo@auratune.vn · artist@auratune.vn · admin@auratune.vn</p>
          </div>
        )}
        <p className="mt-4 text-center text-[10px] leading-5 text-zinc-600">Bản demo lưu tài khoản trong trình duyệt của bạn; chưa gửi thông tin tới máy chủ.</p>
      </section>
    </div>
  )
}
