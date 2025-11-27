import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Copy, Check } from "lucide-react";
import { useState } from "react";

interface MessageRendererProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

function CodeBlockWithCopy({
  language,
  code,
}: {
  language: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 border border-white/10 shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between bg-gradient-to-r from-orange-600/20 to-orange-500/10 px-4 py-3 border-b border-white/10">
        <span className="text-xs font-mono text-orange-300 font-semibold uppercase tracking-wide">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 text-white/70 hover:text-white text-xs font-medium transition-all duration-200 hover:shadow-md"
          title="Copier le code"
        >
          {copied ? (
            <>
              <Check size={14} className="text-green-400" />
              <span>Copié!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copier</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto">
        <code className="font-mono text-sm leading-relaxed text-white/90 whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

export function MessageRenderer({
  content,
  role,
  isStreaming = false,
}: MessageRendererProps) {
  // Check if content is an image URL
  const imageUrlPattern = /^https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const isImageUrl = imageUrlPattern.test(content.trim());

  if (isImageUrl) {
    return (
      <div className="flex justify-center">
        <div className="rounded-3xl overflow-hidden border-2 border-white/20 shadow-lg max-w-xs">
          <img
            src={content}
            alt="Message content"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Code blocks with copy button
          code({ inline, className, children }: any) {
            if (inline) {
              return (
                <code className="bg-white/15 px-2 py-1 rounded font-mono text-sm text-orange-300 border border-white/10 font-semibold break-words">
                  {children}
                </code>
              );
            }

            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");

            return (
              <CodeBlockWithCopy language={language} code={code} />
            );
          },
          
          // Paragraphs
          p({ children }: any) {
            return <p className="mb-3 leading-relaxed text-white/90">{children}</p>;
          },

          // Headers
          h1({ children }: any) {
            return (
              <h1 className="text-3xl font-bold mb-4 mt-6 text-white border-b border-white/20 pb-2">
                {children}
              </h1>
            );
          },
          h2({ children }: any) {
            return (
              <h2 className="text-2xl font-bold mb-3 mt-5 text-white border-b border-white/10 pb-2">
                {children}
              </h2>
            );
          },
          h3({ children }: any) {
            return (
              <h3 className="text-xl font-bold mb-2 mt-4 text-white/95">
                {children}
              </h3>
            );
          },
          h4({ children }: any) {
            return (
              <h4 className="text-lg font-bold mb-2 mt-3 text-white/90">
                {children}
              </h4>
            );
          },
          h5({ children }: any) {
            return (
              <h5 className="text-base font-bold mb-2 mt-3 text-white/85">
                {children}
              </h5>
            );
          },
          h6({ children }: any) {
            return (
              <h6 className="text-sm font-bold mb-2 mt-2 text-white/80">
                {children}
              </h6>
            );
          },

          // Lists
          ul({ children }: any) {
            return (
              <ul className="list-disc list-inside mb-3 space-y-2 text-white/90 pl-2">
                {children}
              </ul>
            );
          },
          ol({ children }: any) {
            return (
              <ol className="list-decimal list-inside mb-3 space-y-2 text-white/90 pl-2">
                {children}
              </ol>
            );
          },
          li({ children }: any) {
            return (
              <li className="text-white/90 leading-relaxed">
                {children}
              </li>
            );
          },

          // Blockquotes
          blockquote({ children }: any) {
            return (
              <blockquote className="border-l-4 border-orange-500 pl-4 py-2 my-3 text-white/70 italic bg-orange-500/10 rounded-r-lg">
                {children}
              </blockquote>
            );
          },

          // Links
          a({ href, children }: any) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-400 hover:text-orange-300 underline font-medium transition-colors"
              >
                {children}
              </a>
            );
          },

          // Text formatting
          strong({ children }: any) {
            return (
              <strong className="font-bold text-white">
                {children}
              </strong>
            );
          },
          em({ children }: any) {
            return (
              <em className="italic text-white/95">
                {children}
              </em>
            );
          },
          del({ children }: any) {
            return (
              <del className="line-through text-white/60">
                {children}
              </del>
            );
          },

          // Tables
          table({ children }: any) {
            return (
              <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
                <table className="w-full border-collapse">{children}</table>
              </div>
            );
          },
          thead({ children }: any) {
            return (
              <thead className="bg-orange-600/20 border-b border-white/10">
                {children}
              </thead>
            );
          },
          tbody({ children }: any) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }: any) {
            return (
              <tr className="border-b border-white/10 hover:bg-white/5 transition-colors">
                {children}
              </tr>
            );
          },
          th({ children }: any) {
            return (
              <th className="px-4 py-2 text-left font-bold text-white/90 text-sm">
                {children}
              </th>
            );
          },
          td({ children }: any) {
            return (
              <td className="px-4 py-2 text-white/80 text-sm">
                {children}
              </td>
            );
          },

          // Horizontal rule
          hr() {
            return <hr className="my-4 border-t border-white/20" />;
          },

          // Breaks
          br() {
            return <br />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-white/50 ml-1 animate-pulse" />
      )}
    </>
  );
}
