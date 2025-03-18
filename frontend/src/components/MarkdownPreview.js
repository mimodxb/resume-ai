import ReactMarkdown from "react-markdown";

export default function MarkdownPreview({ markdown }) {
    return (
        <div>
            <h2>Generated Resume</h2>
            <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
    );
}