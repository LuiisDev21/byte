import Link from "next/link"
import { MessageSquareText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AppSidebar() {
  const recent = ["Proximamente historial de chats"]

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r bg-sidebar p-4 gap-4 h-full">
      {/* Cabecera fija del sidebar */}
      <div>
        <Button asChild className="w-full justify-start gap-2">
          <Link href="#">
            <MessageSquareText className="size-4" />
            Nuevo Chat
          </Link>
        </Button>
      </div>
      <Separator />

      {/* Zona scrollable de recientes */}
      <div className="flex-1 min-h-0">
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
    </aside>
  )
}
