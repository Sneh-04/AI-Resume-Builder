import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-white mb-4">AI Resume Builder</h1>
        <p className="text-slate-300 text-xl mb-8">
          Build ATS-friendly resumes with AI-powered content generation.
          Powered by Java Spring Boot + Next.js.
        </p>
        <Link
          href="/builder"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors"
        >
          Build My Resume
        </Link>
      </div>
    </main>
  );
}
