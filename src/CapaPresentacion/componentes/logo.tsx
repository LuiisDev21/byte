import { ByteIcon } from "@/CapaPresentacion/componentes/byte-icon"

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 font-semibold ${className}`}>
      <ByteIcon className="size-5" />
      <span>Byte Chat</span>
    </div>
  )
}
