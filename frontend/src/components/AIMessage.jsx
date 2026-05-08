import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

const AIMessage = ({ text }) => {
  return (
    <div
      className="prose prose-sm max-w-none prose-invert 
                    leading-relaxed 
                    prose-p:my-2 
                    prose-li:my-1 
                    prose-headings:mt-4 prose-headings:mb-2 
                    prose-hr:my-2"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h3: ({ children }) => (
            <h3 className=" text-sm font-semibold text-primary">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-relaxed text-base-content/90">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="ml-3 space-y-1 list-disc">{children}</ul>
          ),
          code({ inline, children }) {
            return inline ? (
              <code className="bg-base-300 p-1 rounded text-sm ">
                {children}
              </code>
            ) : (
              <pre className="bg-base-300 p-1 rounded-lg overflow-x-auto">
                <code>{children}</code>
              </pre>
            );
          },
          hr: () => <hr className="border-base-300 my-3" />,
        }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
};

export default AIMessage;