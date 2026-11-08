import { useRef } from 'react'

// Vuốt xuống ở phần đầu bottom sheet (trên điện thoại) để đóng.
export default function useSwipeDown(onClose, threshold = 70) {
  const startY = useRef(null)
  return {
    onTouchStart: (event) => { startY.current = event.touches[0].clientY },
    onTouchEnd: (event) => {
      if (startY.current !== null && event.changedTouches[0].clientY - startY.current > threshold) onClose()
      startY.current = null
    },
  }
}
