// Highlights words the way IMPACT's template does: yellow on black, grey on white.
export function Highlight({ children }: { children: React.ReactNode }) {
  return <span className="text-highlight">{children}</span>
}
