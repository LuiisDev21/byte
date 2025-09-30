import Link from "next/link"
import { MessageSquareText } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function AppSidebar() {
  const recent = ["Proximamente historial de chats"]

  return (
    <nav aria-label="Menú lateral" className="flex w-full flex-col h-full">
      <div className="p-4">
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
