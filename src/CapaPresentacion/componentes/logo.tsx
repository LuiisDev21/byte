import { PawPrint } from "lucide-react"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-semibold ${className}`}>
      <PawPrint className="size-5" />
      <span>Byte Chat</span>
    </div>
  )
}
