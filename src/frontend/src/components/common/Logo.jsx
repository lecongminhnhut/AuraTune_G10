import brandLogo from '../../assets/auratune-logo.png'
import brandMark from '../../assets/auratune-mark.png'

// Logo nền trong suốt, hiển thị trực tiếp trên nền tối của giao diện. height: lớp Tailwind đặt chiều cao logo đầy đủ.
export default function Logo({ compact = false, height = 'h-[138px]' }) {
  return (
    <img
      src={compact ? brandMark : brandLogo}
      alt="AuraTune"
      draggable={false}
      className={compact ? 'h-10 w-auto select-none' : `${height} w-auto select-none drop-shadow-[0_6px_24px_rgba(56,189,248,0.18)]`}
    />
  )
}
