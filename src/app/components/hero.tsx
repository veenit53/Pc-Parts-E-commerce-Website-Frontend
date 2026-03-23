import { useNavigate } from "react-router";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#0f172a]">
      
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8">
          
          {/* LEFT */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#22c55e]"></span>
              <span className="text-sm text-[#22c55e]">
                New RTX 50 Series Available
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl lg:text-6xl leading-tight">
              Build Your
              <span className="block text-[#22c55e]">
                Dream Gaming PC
              </span>
            </h1>

            <p className="mb-8 text-lg text-gray-400 max-w-xl">
              High-performance components, best prices, and smooth building experience.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              
              <button
                onClick={() => navigate("/pc-builder")}
                className="rounded-full bg-[#22c55e] px-8 py-4 font-semibold text-black hover:bg-[#22c55e]/90"
              >
                Build Your PC
              </button>

              <button
                onClick={() => navigate("/products")}
                className="rounded-full border border-white/20 px-8 py-4 text-white hover:border-[#22c55e] hover:bg-[#22c55e]/10 hover:text-[#22c55e]"
              >
                Browse Components
              </button>

            </div>

            {/* STATS */}
            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-white/10 pt-8">
              <div>
                <div className="text-2xl font-bold text-[#22c55e]">1000+</div>
                <div className="text-sm text-gray-400">Components</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#22c55e]">50K+</div>
                <div className="text-sm text-gray-400">Users</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#22c55e]">24/7</div>
                <div className="text-sm text-gray-400">Support</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            
            <div className="absolute inset-0 bg-gradient-to-r from-[#22c55e]/20 to-transparent blur-3xl"></div>

            <img
              src="https://images.unsplash.com/photo-1704871132546-d1d3b845ae65"
              className="relative rounded-2xl shadow-2xl"
            />

            {/* FLOATING CARDS */}
            <div className="absolute -left-4 bottom-8 rounded-xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur-md">
              <div className="text-sm text-gray-400">Performance</div>
              <div className="text-2xl font-bold text-[#22c55e]">240 FPS</div>
            </div>

            <div className="absolute -right-4 top-8 rounded-xl border border-white/10 bg-[#111827]/80 p-4 backdrop-blur-md">
              <div className="text-sm text-gray-400">Build Time</div>
              <div className="text-2xl font-bold text-[#22c55e]">2 Hours</div>
            </div>

          </div>
        </div>
      </div>

      {/* BG EFFECT */}
      <div className="absolute -left-40 top-0 h-80 w-80 rounded-full bg-[#22c55e]/10 blur-3xl"></div>
      <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#22c55e]/10 blur-3xl"></div>
    </section>
  );
}