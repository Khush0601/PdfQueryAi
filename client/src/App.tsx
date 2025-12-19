import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BASE_URL = "https://pdfqueryai-y8a2.onrender.com";

const App: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async () => {
    if (!question || !file) {
      alert("Please enter a question and select a file");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const formData = new FormData();
      formData.append("text", question);
      formData.append("file", file);

      const res = await fetch(
        "http://localhost:7000/api/v1/pdfQueryAi/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (data.success) {
        setResponse(data.data.aiResponse || "No answer generated");
      } else {
        setResponse(data.message || "Something went wrong");
      }
    } catch (err: any) {
      console.error(err);
      setResponse(err.message || "Error connecting to server");
    }

    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > MAX_FILE_SIZE) {
      alert("File size must be less than or equal to 5 MB");
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
          PdfQueryAi
        </h1>

        {/* Question textarea */}
        <textarea
          placeholder="Type your question here..."
          className="w-full p-4 mb-4 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-gray-800 placeholder-gray-400 transition-all overflow-hidden"
          rows={1}
          style={{ minHeight: "40px" }}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = target.scrollHeight + "px";
          }}
        />

        {/* File input */}
        <label className="block mb-4 cursor-pointer">
          <div className="w-full py-3 px-4 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition">
            {file
              ? file.name
              : "Click to upload a PDF or TXT file (Max 5 MB)"}
          </div>
          <input
            type="file"
            accept=".pdf,.txt,image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        {/* Submit button */}
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Processing..." : "Submit"}
        </button>

        {/* Response */}
        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded-xl text-gray-800 whitespace-pre-wrap">
           <ReactMarkdown remarkPlugins={[remarkGfm]}>
    {response}
  </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
