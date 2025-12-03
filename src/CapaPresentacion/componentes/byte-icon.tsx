/**
 * Componente de icono SVG para la marca Byte.
 * - Renderiza el logo desde /byte.svg.
 * - Soporta clases personalizadas y control de accesibilidad.
 * - Accesibilidad: aria-hidden opcional para ocultar de screen readers cuando es decorativo.
 */
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

