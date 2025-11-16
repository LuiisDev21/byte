/**
 * Componente React para renderizar Markdown con soporte GFM.
 * - Usa react-markdown + remark-gfm.
 * - Aplica clases a headers, párrafos, listas, citas, tablas y separadores.
 * - Diferencia código inline vs bloque y abre enlaces en nueva pestaña.
 */
"use client"
import React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import type { Components } from "react-markdown"

type Props = {
  children: string
  className?: string
}

export function Markdown({ children, className }: Props) {
  const componentes: Components = {
    h1: ({ ...props }) => (
      <h1 {...props} className="mt-6 scroll-m-20 text-3xl font-bold tracking-tight" />
    ),
    h2: ({ ...props }) => (
      <h2 {...props} className="mt-6 scroll-m-20 text-2xl font-semibold tracking-tight" />
    ),
    h3: ({ ...props }) => (
      <h3 {...props} className="mt-6 scroll-m-20 text-xl font-semibold tracking-tight" />
    ),
    p: ({ ...props }) => <p {...props} className="leading-7 [&:not(:first-child)]:mt-4" />,
    ul: ({ ...props }) => <ul {...props} className="my-4 ml-6 list-disc" />,
    ol: ({ ...props }) => <ol {...props} className="my-4 ml-6 list-decimal" />,
    li: ({ ...props }) => <li {...props} className="mt-2" />,
    blockquote: ({ ...props }) => (
      <blockquote
        {...props}
        className="mt-4 border-l-4 border-muted-foreground/30 pl-3 italic text-muted-foreground"
      />
    ),
    pre: ({ ...props }) => (
      <pre {...props} className="my-4 overflow-x-auto rounded-md bg-muted p-4 text-sm" />
    ),
    code: (props) => {
      const { inline, className, children, ...rest } = props as {
        inline?: boolean
        className?: string
        children?: React.ReactNode
      }
      const esInline = inline || !className || !/language-/.test(className)
      if (esInline) {
        return (
          <code className="rounded bg-muted px-1 py-0.5 text-sm" {...rest}>
            {children}
          </code>
        )
      }
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      )
    },
    a: ({ ...props }) => (
      <a
        {...props}
        className="font-medium text-primary underline underline-offset-4 hover:opacity-90"
        target="_blank"
        rel="noreferrer"
      />
    ),
    hr: ({ ...props }) => <hr {...props} className="my-6 border-muted" />,
    table: ({ ...props }) => (
      <div className="my-4 overflow-x-auto">
        <table {...props} className="w-full border-collapse text-sm" />
      </div>
    ),
    th: ({ ...props }) => (
      <th {...props} className="border-b bg-muted p-2 text-left font-medium" />
    ),
    td: ({ ...props }) => <td {...props} className="border-b p-2 align-top" />,
  }

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={componentes}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
