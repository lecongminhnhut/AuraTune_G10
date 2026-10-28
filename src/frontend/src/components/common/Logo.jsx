import brandLogo from '../../assets/auratune-logo.jpg'
import brandMark from '../../assets/auratune-mark.jpg'

export default function Logo({ compact = false }) {
  return (
    <div className={compact ? 'h-10 w-10 overflow-hidden rounded-xl border border-sky-300/15 bg-black' : 'relative h-[132px] w-[196px] overflow-hidden rounded-xl border border-sky-300/10 bg-black shadow-[0_8px_32px_rgba(14,165,233,0.08)]'}>
      <img
        src={compact ? brandMark : brandLogo}
        alt="AuraTune"
        className={compact ? 'h-full w-full scale-[1.4] object-cover' : 'absolute left-1/2 top-1/2 w-[190px] max-w-none -translate-x-1/2 -translate-y-1/2'}
      />
    </div>
  )
}
