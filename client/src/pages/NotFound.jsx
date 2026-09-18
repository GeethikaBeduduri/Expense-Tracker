import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

/**
 * NotFound — displayed for any route that doesn't match the defined paths.
 */
function NotFound() {
  return (
    <div className="min-h-screen bg-[#07080c] flex items-center justify-center px-4">
      <div className="text-center max-w-md bg-[#0e111a] border border-white/[0.08] p-10 rounded-3xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-indigo-600/15 blur-3xl pointer-events-none rounded-full" />
        
        {/* Large 404 with Gradient / Mono */}
        <p className="text-8xl font-black font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 select-none">
          404
        </p>

        <h1 className="text-2xl font-bold text-white mt-4 tracking-tight">Endpoint Not Found</h1>
        <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
          The fiscal route or resource you are looking for has been relocated or does not exist.
        </p>

        <div className="mt-8 flex justify-center">
          <Link id="back-home-btn" to="/" className="btn-primary flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
