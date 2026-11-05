import { useEffect, useRef, useState } from 'react';
import Icon from '../../components/common/Icon.jsx';
import Logo from '../../components/common/Logo.jsx';
import { useStore } from '../../context/AppStore.jsx';
import { navigate, useLocation, getQueryParam } from '../../utils/navigation.jsx';

export default function OAuthCallback() {
  const store = useStore();
  const { search } = useLocation();
  const [status, setStatus] = useState({ loading: true, error: '', success: false, message: '' });
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    async function handleCallback() {
      const provider = getQueryParam(search, 'provider') || 'google';
      const isCancel = getQueryParam(search, 'error') === 'access_denied';
      const next = getQueryParam(search, 'next') || '/';

      if (isCancel) {
        setStatus({
          loading: false,
          error: `Đăng nhập bị hủy: Người dùng đã từ chối cấp quyền truy cập từ ${provider.toUpperCase()}.`,
          success: false,
          message: '',
        });
        return;
      }

      // Standard / Simulation payload
      const mockEmail = getQueryParam(search, 'email') || (provider === 'google' ? 'alex.google@auratune.vn' : 'alex.fb@auratune.vn');
      const mockName = getQueryParam(search, 'name') || (provider === 'google' ? 'Alex (Google User)' : 'Alex (Facebook User)');
      const mockAvatar = provider === 'google'
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';

      const oauthPayload = {
        provider,
        providerUserId: `${provider}-user-${Date.now()}`,
        email: mockEmail,
        displayName: mockName,
        avatarUrl: mockAvatar,
      };

      const result = await store.loginWithOAuth(oauthPayload);

      if (result.ok) {
        setStatus({
          loading: false,
          error: '',
          success: true,
          message: result.isNewAccount
            ? `Tạo tài khoản mới thành công qua ${provider.toUpperCase()}!`
            : `Đã liên kết và đăng nhập thành công qua ${provider.toUpperCase()}!`,
        });

        store.toast(
          result.isNewAccount
            ? `Chào mừng ${result.user.displayName} đến với AuraTune!`
            : `Đã đăng nhập thành công với ${result.user.email}`,
          'success'
        );

        setTimeout(() => {
          navigate(next);
        }, 1200);
      } else {
        setStatus({
          loading: false,
          error: result.error || 'Xử lý phản hồi OAuth thất bại.',
          success: false,
          message: '',
        });
      }
    }

    handleCallback();
  }, [search, store]);

  return (
    <div className="flex min-h-full items-center justify-center px-5 py-10">
      <section className="w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#17171b]/90 p-8 text-center shadow-xl backdrop-blur-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {status.loading && (
          <div className="py-6">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-violet-300 border-t-transparent mb-4"></div>
            <p className="text-sm font-medium text-zinc-300">Đang xử lý đăng nhập OAuth...</p>
          </div>
        )}

        {status.success && (
          <div className="py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300 mb-3">
              ✓
            </div>
            <p className="text-sm font-semibold text-white">{status.message}</p>
            <p className="mt-2 text-xs text-zinc-400">Đang chuyển hướng về ứng dụng...</p>
          </div>
        )}

        {status.error && (
          <div className="py-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-400/20 text-rose-300 mb-3">
              ✕
            </div>
            <p className="text-sm font-semibold text-rose-200">{status.error}</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              aria-label="Quay lại trang Đăng nhập"
              className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-full bg-violet-300 text-xs font-bold text-zinc-950 transition hover:bg-violet-200"
            >
              <Icon name="arrowLeft" size={15} /> Quay lại đăng nhập
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

