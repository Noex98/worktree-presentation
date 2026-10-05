import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"

// Markdown in the slides' fonts, but set to be read rather than glanced at: loose line spacing, and
// headings in normal case, since uppercase condensed type is slow to read beyond a title. Whatever shows
// it keeps the column narrow.
const components: Components = {
  h1: ({ children }) => <h1 className="font-heading text-[3cqw] leading-none uppercase">{children}</h1>,
  h2: ({ children }) => <h2 className="pt-[1.5cqw] font-heading text-[2.2cqw] leading-tight">{children}</h2>,
  h3: ({ children }) => <h3 className="pt-[1cqw] font-heading text-[1.8cqw] leading-tight">{children}</h3>,
  p: ({ children }) => <p>{children}</p>,
  ul: ({ children }) => <ul className="list-disc space-y-[0.5cqw] pl-[2cqw]">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal space-y-[0.5cqw] pl-[2cqw]">{children}</ol>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  a: ({ children, href }) => (
    <a href={href} className="underline underline-offset-[0.3cqw]">
      {children}
    </a>
  ),
  hr: () => <hr className="my-[1cqw] border-border" />,
  pre: ({ children }) => (
    <pre className="bg-muted px-[1.4cqw] py-[1.2cqw] font-mono text-[1.2cqw] leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[1em]">
      {children}
    </pre>
  ),
  code: ({ children }) => <code className="bg-muted px-[0.3cqw] font-mono text-[0.85em]">{children}</code>,
  table: ({ children }) => <table className="w-full border-collapse text-[1.3cqw] leading-normal">{children}</table>,
  th: ({ children }) => (
    <th className="border-b-[0.15cqw] border-foreground px-[0.8cqw] py-[0.6cqw] text-left font-bold">{children}</th>
  ),
  td: ({ children }) => <td className="border-b border-border px-[0.8cqw] py-[0.7cqw] align-top">{children}</td>,
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="space-y-[1.4cqw] text-[1.55cqw] leading-relaxed">
      {/* Markdown can't break a line inside a table cell, so files use <br> there; read it as a space. */}
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content.replaceAll("<br>", " ")}
      </ReactMarkdown>
    </div>
  )
}
