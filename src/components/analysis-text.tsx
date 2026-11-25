import ReactMarkdown from "react-markdown";

export function AnalysisText({ children }: { children: string }) {
  return <ReactMarkdown components={{
    a: ({ href, children: label }) => <a href={href} target="_blank" rel="noopener noreferrer" className="break-words text-primary underline underline-offset-4">{label}</a>,
    p: ({ children: content }) => <p className="mb-2 last:mb-0">{content}</p>,
  }}>{children}</ReactMarkdown>;
}