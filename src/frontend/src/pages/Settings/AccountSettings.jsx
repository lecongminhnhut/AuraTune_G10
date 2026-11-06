import { useState } from 'react'
import { useStore } from '../../context/AppStore.jsx'
import { navigate } from '../../utils/navigation.jsx'

export default function AccountSettings() {
  const store = useStore()
  const user = store.currentUser
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

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

  const handleUnlink = (provider) => {
    setErrorMsg('')
    setSuccessMsg('')
    const res = store.unlinkOAuthProvider(provider)
    if (res.ok) {
      setSuccessMsg(res.message)
      store.toast(res.message, 'success')
    } else {
      setErrorMsg(res.error)
      store.toast(res.error, 'error')
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

      <div className="mb-6 rounded-2xl border border-white/[0.08] bg-[#17171b]/80 p-6 backdrop-blur-md">
        <h2 className="text-lg font-semibold text-white">Tài khoản liên kết</h2>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <div>
              <p className="text-sm font-semibold text-white">🔑 Mật khẩu AuraTune</p>
              <p className="text-xs text-zinc-400">{hasLocalPassword ? 'Đã thiết lập' : 'Chưa tạo mật khẩu local'}</p>
            </div>
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">{hasLocalPassword ? 'Hoạt động' : 'Không có'}</span>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <div>
              <p className="text-sm font-semibold text-white">G Google</p>
              <p className="text-xs text-zinc-400">{hasGoogle ? 'Đã liên kết' : 'Chưa liên kết'}</p>
            </div>
            {hasGoogle ? (
              <button type="button" onClick={() => handleUnlink('google')} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20">
                Hủy liên kết
              </button>
            ) : (
              <span className="text-xs text-zinc-500">Chưa kết nối</span>
            )}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 p-4">
            <div>
              <p className="text-sm font-semibold text-white">f Facebook</p>
              <p className="text-xs text-zinc-400">{hasFacebook ? 'Đã liên kết' : 'Chưa liên kết'}</p>
            </div>
            {hasFacebook ? (
              <button type="button" onClick={() => handleUnlink('facebook')} className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3.5 py-1 text-xs font-semibold text-rose-300 hover:bg-rose-500/20">
                Hủy liên kết
              </button>
            ) : (
              <span className="text-xs text-zinc-500">Chưa kết nối</span>
            )}
          </div>
        </div>
      </div>

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
