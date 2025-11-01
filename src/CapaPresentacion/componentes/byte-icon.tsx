interface ByteIconProps {
  className?: string
  ariaHidden?: boolean
}

export function ByteIcon({ className = "", ariaHidden }: ByteIconProps) {
  return (
    <img
      src="/byte.svg"
      alt="Byte"
      className={className}
      aria-hidden={ariaHidden}
    />
  )
}

