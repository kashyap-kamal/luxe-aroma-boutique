import { Construction } from "lucide-react"

/**
 * Marquee Topbar Component
 * Displays a scrolling message at the top of the website
 * Shows "Website Under Construction" message to inform visitors
 * Uses duplicated content for seamless infinite scrolling
 */
export default function MarqueeTopbar() {
  return (
    <div className="bg-luxe-blue text-white py-2 overflow-hidden relative">
      <div className="marquee-container">
        <div className="marquee-content">
          {/* First set of messages */}
          {[...Array(5)].map((_, index) => (
            <div
              key={`msg-1-${index}`}
              className="flex items-center gap-4 px-8"
            >
              <Construction className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                Website Under Construction
              </span>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {[...Array(5)].map((_, index) => (
            <div
              key={`msg-2-${index}`}
              className="flex items-center gap-4 px-8"
            >
              <Construction className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium whitespace-nowrap">
                Website Under Construction
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
