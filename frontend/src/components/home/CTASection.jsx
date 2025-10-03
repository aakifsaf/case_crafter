export const CTASection = () => {
  return (
    <div className="relative bg-gradient-to-b from-blue-900 to-slate-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 backdrop-blur-xl rounded-3xl border border-cyan-400/30 p-8 md:p-12 lg:p-16 shadow-2xl shadow-cyan-500/20">
          <div className="flex flex-col lg:flex-row items-center justify-between">
            <div className="lg:w-1/2 text-center lg:text-left mb-10 lg:mb-0" data-aos="fade-right">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to transform your <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">QA process</span>?
              </h2>
              <p className="text-lg text-cyan-100 max-w-xl">
                Start generating comprehensive test cases in minutes, not weeks. No credit card required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4" data-aos="fade-left" data-aos-delay="300">
              <a
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1 text-center"
              >
                Start Free Trial
              </a>
              <a
                href="/login"
                className="px-8 py-4 bg-transparent text-white border border-cyan-400/50 rounded-xl font-semibold hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300 text-center"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
