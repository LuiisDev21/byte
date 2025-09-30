import Link from "next/link"
import { MessageSquareText, PawPrint, PanelLeft } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react"

interface AppSidebarProps {
  isCollapsed?: boolean
  onToggle?: () => void
  onCollapse?: () => void
  isMobile?: boolean
}

export function AppSidebar({ isCollapsed = false, onToggle, onCollapse, isMobile = false }: AppSidebarProps) {
  const [isHovered, setIsHovered] = useState(false)
  const recent = ["Proximamente historial de chats"]

  useEffect(() => {
    if (isCollapsed) {
      setIsHovered(false)
    }
  }, [isCollapsed])

  if (isCollapsed) {
    return (
      <nav aria-label="Menú lateral colapsado" className="flex w-full flex-col h-full items-center py-4">
        <div
          className="group relative mb-4 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={() => onToggle?.()}
        >
          <div className="p-2 rounded-lg hover:bg-accent transition-all duration-200">
            {isHovered ? (
              <PanelLeft className="size-6 text-primary" />
            ) : (
              <PawPrint className="size-6 text-primary" />
            )}
          </div>
        </div>

        <Separator className="w-8" />

        <div className="mt-4 space-y-2">
          <Button size="icon" variant="ghost" className="size-10" title="Nuevo Chat">
            <MessageSquareText className="size-5" />
          </Button>
        </div>
      </nav>
    )
  }

  return (
    <nav aria-label="Menú lateral" className="flex w-full flex-col h-full">
      <div className="p-4">
        {!isMobile && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PawPrint className="size-5 text-primary" />
              <span className="font-semibold">Byte Chat</span>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="size-8 hover:bg-accent"
              onClick={() => onCollapse?.()}
              title="Colapsar menú"
            >
              <PanelLeft className="size-4" />
            </Button>
          </div>
        )}
        <Button asChild className="w-full justify-start gap-2">
          <Link href="#">
            <MessageSquareText className="size-4" />
            Nuevo Chat
          </Link>
        </Button>
      </div>
      <Separator />

      <div className="flex-1 min-h-0 p-4 pt-3">
        <ScrollArea className="size-full pr-2">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground px-2">Recientes</p>
            <ul className="space-y-1">
              {recent.map((r) => (
                <li key={r}>
                  <Link
                    href="#"
                    className="block truncate rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    title={r}
                  >
                    {r}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </ScrollArea>
      </div>
    </nav>
  )
}
