import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import { Loader2, Send, Code2, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    setError('');
    setResponse('');

    try {
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: question,
        config: {
          systemInstruction: "You are a helpful C programming tutor. The user will provide a C programming question. Your task is to explain the logic to solve the problem in exactly 3 simple bullet points, and then provide a helpful hint. DO NOT provide the full code answer. Format your response clearly with a 'Logic:' section and a 'Hint:' section.",
        }
      });
      
      if (result.text) {
        setResponse(result.text);
      } else {
        setError("Failed to generate a response. Please try again.");
      }
    } catch (err) {
      console.error("Error generating content:", err);
      setError("An error occurred while fetching the response.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-emerald-500/30">
      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <header className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-emerald-500/10 rounded-2xl mb-6 ring-1 ring-emerald-500/20">
            <Code2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
            C Logic Tutor
          </h1>
          <p className="text-neutral-400 text-lg max-w-xl mx-auto">
            Paste your C programming question below. Get the logic explained in 3 bullet points and a helpful hint to guide you.
          </p>
        </header>

        <main className="space-y-8">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
            <div className="relative bg-neutral-900 rounded-2xl p-2 ring-1 ring-white/10 shadow-2xl">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., How do I reverse a linked list in C?"
                className="w-full h-40 bg-transparent text-neutral-100 placeholder-neutral-500 p-4 resize-none focus:outline-none text-lg"
                disabled={loading}
              />
              <div className="flex justify-between items-center p-2 border-t border-white/5">
                <div className="text-xs text-neutral-500 px-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  <span>No full answers, just guidance.</span>
                </div>
                <button
                  type="submit"
                  disabled={!question.trim() || loading}
                  className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Get Hint
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 bg-red-500/10 text-red-400 rounded-xl ring-1 ring-red-500/20 text-center"
              >
                {error}
              </motion.div>
            )}

            {response && !loading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-neutral-900 rounded-3xl p-8 ring-1 ring-white/10 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-emerald-500 to-cyan-500"></div>
                <div className="prose prose-invert prose-emerald max-w-none prose-p:leading-relaxed prose-li:marker:text-emerald-500">
                  <ReactMarkdown>{response}</ReactMarkdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
