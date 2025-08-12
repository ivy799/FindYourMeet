export function ModernLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative size-8 ${className}`}>
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-black dark:border-white"></div>

      {/* Inner dot */}
      <div className="absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black dark:bg-white"></div>

      {/* Location pin tail */}
      <div className="absolute top-1/2 left-1/2 w-0.5 h-2 -translate-x-1/2 translate-y-1 bg-black dark:bg-white origin-top rotate-0"></div>
    </div>
  )
}

// Alternative version with more geometric approach
export function ModernLogoAlt({ className = "" }: { className?: string }) {
  return (
    <div className={`size-8 ${className}`}>
      <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
        {/* Modern geometric location pin */}
        <circle
          cx="16"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-black dark:text-white"
        />
        <circle cx="16" cy="12" r="3" fill="currentColor" className="text-black dark:text-white" />
        <path
          d="M16 20L16 28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-black dark:text-white"
        />
        <circle cx="16" cy="28" r="1.5" fill="currentColor" className="text-black dark:text-white" />
      </svg>
    </div>
  )
}

// Minimalist version
export function ModernLogoMinimal({ className = "" }: { className?: string }) {
  return (
    <div className={`size-8 flex items-center justify-center ${className}`}>
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-black dark:text-white"
        />
        <circle cx="12" cy="9" r="2" fill="currentColor" className="text-black dark:text-white" />
      </svg>
    </div>
  )
}
