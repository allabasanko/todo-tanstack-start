import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-20 px-6 text-center overflow-hidden h-96 flex flex-col justify-center items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>

        <div className="flex items-center justify-center gap-6 mb-6">
          <h1 className="text-6xl md:text-7xl font-black text-white [letter-spacing:-0.08em]">
            <span className="text-gray-300">TANSTACK</span>{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              START
            </span>
          </h1>
        </div>
        <p className="text-xl text-gray-400">This is test app</p>
      </section>
    </div>
  )
}
