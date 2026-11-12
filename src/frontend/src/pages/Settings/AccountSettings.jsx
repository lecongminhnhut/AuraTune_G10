import { useState } from 'react'
import { Check, KeyRound, Link2, Loader2, Unlink } from 'lucide-react'
import { useStore } from '../../context/AppStore.jsx'
import { navigate } from '../../utils/navigation.jsx'
import { linkFacebookForAccount } from '../../services/firebaseAuth.js'

const getFacebookLinkErrorMessage = (error) => {
  const messages = {
    FACEBOOK_ALREADY_LINKED: 'Tài khoản Facebook này đã được liên kết với tài khoản AuraTune khác hoặc tài khoản của bạn đã liên kết với Facebook khác.',
    FACEBOOK_IDENTITY_LINK_CONFLICT: 'Danh tính Firebase này thuộc tài khoản AuraTune khác. Hãy đăng nhập đúng tài khoản rồi thử lại.',
    FACEBOOK_IDENTITY_REQUIRED: 'Hãy xác thực bằng Facebook trước khi liên kết.',
    FACEBOOK_TOKEN_INVALID: 'Phiên xác thực Facebook không hợp lệ hoặc đã hết hạn. Hãy thử lại.',
    FACEBOOK_TOKEN_REQUIRED: 'Thiếu thông tin xác thực Facebook. Hãy thử lại.',
    FACEBOOK_LINK_FAILED: 'Không thể liên kết Facebook lúc này. Hãy thử lại sau.',
    UNAUTHENTICATED: 'Phiên AuraTune đã hết hạn. Hãy đăng nhập lại rồi thử liên kết Facebook.',
  }
  if (messages[error?.code]) return messages[error.code]
  if (error?.code === 'auth/account-exists-with-different-credential' || error?.code === 'auth/credential-already-in-use') return 'Email Facebook này đang dùng phương thức đăng nhập khác. Hãy đăng nhập bằng phương thức đó rồi liên kết Facebook lại.'
  if (error?.code === 'auth/provider-already-linked') return 'Facebook đã được liên kết với tài khoản Firebase này.'
  if (error?.code === 'auth/popup-blocked') return 'Trình duyệt đã chặn cửa sổ Facebook. Hãy cho phép popup rồi thử lại.'
  if (error?.code === 'auth/unauthorized-domain') return 'Tên miền hiện tại chưa được cho phép trong Firebase Authentication.'
  if (error?.code === 'auth/operation-not-allowed') return 'Đăng nhập Facebook chưa được bật trong Firebase Console.'
  if (error?.code === 'auth/network-request-failed' || error?.name === 'TypeError') return 'Không thể kết nối tới Firebase hoặc máy chủ. Hãy kiểm tra mạng rồi thử lại.'

  const text = error?.message || ''
  if (text.toLowerCase().includes('sign in with the google account')) return 'Email Facebook này đang dùng Google. Hãy đăng nhập đúng tài khoản Google rồi liên kết Facebook lại.'
  if (text.toLowerCase().includes('already linked')) return 'Tài khoản Facebook này đã được liên kết với tài khoản khác.'
  if (text.toLowerCase().includes('thiếu cấu hình firebase')) return text
  return text || 'Không thể liên kết Facebook. Hãy thử lại.'
}

export default function AccountSettings() {
  const store = useStore()
  const user = store.currentUser
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [providerAction, setProviderAction] = useState(null)

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <p className="text-zinc-400">Bạn chưa đăng nhập.</p>
        <button type="button" onClick={() => navigate('/login')} className="mt-4 rounded-full bg-violet-300 px-5 py-2 text-xs font-bold text-zinc-950">
          Đăng nhập ngay
        </button>
      </div>
    )
  }

  const linkedProviders = user.linkedProviders || []
  const hasGoogle = linkedProviders.includes('google')
  const hasFacebook = linkedProviders.includes('facebook')
  const hasLocalPassword = !!user.hasLocalPassword || !!user.passwordHash

  const handleUnlink = async (provider) => {
    setErrorMsg('')
    setSuccessMsg('')
    setProviderAction(`unlink-${provider}`)
    try {
      const res = await store.unlinkOAuthProvider(provider)
      if (res.ok) {
        setSuccessMsg(res.message)
        store.toast(res.message, 'success')
      } else {
        setErrorMsg(res.error)
        store.toast(res.error, 'error')
      }
    } finally {
      setProviderAction(null)
    }
  }

  const handleLinkFacebook = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    setProviderAction('link-facebook')
    try {
      const firebaseUser = await linkFacebookForAccount()
      const result = await store.linkFacebook(firebaseUser)
      if (!result.ok) {
        const message = getFacebookLinkErrorMessage(result)
        setErrorMsg(message)
        store.toast(message, 'error')
        return
      }
      setSuccessMsg(result.message)
      store.toast(result.message, 'success')
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        const message = getFacebookLinkErrorMessage(error)
        setErrorMsg(message)
        store.toast(message, 'error')
      }
    } finally {
      setProviderAction(null)
    }
  }

  const handleLogoutAll = async () => {
    setErrorMsg('')
    setSuccessMsg('')
    await store.logoutFromAllDevices()
    store.toast('Đã đăng xuất khỏi tất cả thiết bị thành công.', 'info')
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Cài đặt tài khoản</h1>
        <p className="mt-1 text-xs text-zinc-400 sm:text-sm">Quản lý phương thức đăng nhập và phiên làm việc đa thiết bị.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#17171b]/80 p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white mb-4">Thông tin cá nhân</h2>
        <div className="flex items-center gap-4">
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.displayName} className="h-14 w-14 rounded-full object-cover border border-white/20" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-500/20 text-lg font-bold text-violet-300">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div>
            <p className="text-base font-bold text-white">{user.displayName}</p>
            <p className="text-xs text-zinc-400">{user.email}</p>
            <span className="mt-1 inline-block rounded-full bg-violet-400/10 px-2.5 py-0.5 text-[10px] font-semibold text-violet-300 uppercase">
              {user.role || 'user'}
            </span>
          </div>
        </div>
      </div>

      {errorMsg && <div role="alert" className="mb-4 rounded-xl border border-rose-400/30 bg-rose-500/10 p-4 text-xs leading-5 text-rose-200">✕ {errorMsg}</div>}
      {successMsg && <div role="status" className="mb-4 rounded-xl border border-emerald-400/30 bg-emerald-500/10 p-4 text-xs leading-5 text-emerald-200">✓ {successMsg}</div>}

      <section className="mb-6 rounded-2xl border border-white/[0.08] bg-[#17171b]/80 p-5 backdrop-blur-md sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Tài khoản liên kết</h2>
          <p className="mt-1 max-w-2xl text-xs leading-5 text-zinc-400">
            Quản lý các cách đăng nhập đang dùng cho tài khoản AuraTune. Facebook cần được liên kết trước khi dùng để đăng nhập.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center text-violet-200"><KeyRound size={19} /></span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Mật khẩu AuraTune</p>
              </div>
            </div>
            <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${hasLocalPassword ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/[0.06] text-zinc-400'}`}>
              {hasLocalPassword && <Check size={13} />}{hasLocalPassword ? 'Đã thiết lập' : 'Chưa thiết lập'}
            </span>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center">
                <svg aria-label="Google" role="img" viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.43.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.78.43 3.47 1.18 4.94l3.66-2.84z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Google</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${hasGoogle ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/[0.06] text-zinc-400'}`}>
                {hasGoogle && <Check size={13} />}{hasGoogle ? 'Đã liên kết' : 'Chưa liên kết'}
              </span>
              {hasGoogle && (
                <button type="button" disabled={Boolean(providerAction)} onClick={() => handleUnlink('google')} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-rose-400/25 px-3 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                  {providerAction === 'unlink-google' ? <Loader2 size={14} className="animate-spin" /> : <Unlink size={14} />}
                  {providerAction === 'unlink-google' ? 'Đang hủy…' : 'Hủy liên kết'}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl border border-white/[0.07] bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center">
                <svg aria-label="Facebook" role="img" viewBox="0 0 24 24" className="h-6 w-6">
                  <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.093 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.49 0-1.953.93-1.953 1.885v2.262h3.328l-.532 3.49h-2.796V24C19.612 23.093 24 18.1 24 12.073z" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">Facebook</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${hasFacebook ? 'bg-emerald-400/10 text-emerald-200' : 'bg-white/[0.06] text-zinc-400'}`}>
                {hasFacebook && <Check size={13} />}{hasFacebook ? 'Đã liên kết' : 'Chưa liên kết'}
              </span>
              {hasFacebook ? (
                <button type="button" disabled={Boolean(providerAction)} onClick={() => handleUnlink('facebook')} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-rose-400/25 px-3 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10 disabled:cursor-not-allowed disabled:opacity-50">
                  {providerAction === 'unlink-facebook' ? <Loader2 size={14} className="animate-spin" /> : <Unlink size={14} />}
                  {providerAction === 'unlink-facebook' ? 'Đang hủy…' : 'Hủy liên kết'}
                </button>
              ) : (
                <button type="button" disabled={Boolean(providerAction)} onClick={handleLinkFacebook} className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-[#1877f2]/35 bg-[#1877f2]/15 px-3 text-xs font-semibold text-blue-100 transition hover:bg-[#1877f2]/25 disabled:cursor-not-allowed disabled:opacity-50">
                  {providerAction === 'link-facebook' ? <Loader2 size={14} className="animate-spin" /> : <Link2 size={14} />}
                  {providerAction === 'link-facebook' ? 'Đang kết nối…' : 'Liên kết Facebook'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
      <div className="rounded-2xl border border-white/[0.08] bg-[#17171b]/80 p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Quản lý phiên đăng nhập</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Đăng xuất khỏi tất cả các trình duyệt và thiết bị khác đang kết nối.</p>
          </div>
          <button
            type="button"
            onClick={handleLogoutAll}
            className="rounded-xl border border-rose-500/40 bg-rose-500/15 px-4 py-2 text-xs font-semibold text-rose-200 transition hover:bg-rose-500/30"
          >
            Đăng xuất khỏi tất cả thiết bị
          </button>
        </div>
      </div>
    </div>
  )
}
