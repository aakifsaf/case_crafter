import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-quad',
      once: true
    })
  }, [])

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:50px_50px] opacity-10"></div>
      
      {/* Floating elements */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left content */}
          <div className="lg:w-1/2 text-center lg:text-left" data-aos="fade-right">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block">AI-Powered</span>
              <span className="block bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Test Generation
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl">
              Transform requirements into comprehensive test suites with cutting-edge AI. 
              Accelerate delivery while ensuring 100% coverage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="/register"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Free Trial
              </a>
              <a
                href="/login"
                className="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
              >
                Sign In
              </a>
            </div>
          </div>
          
          {/* Right content */}
          <div className="lg:w-1/2 mt-16 lg:mt-0" data-aos="fade-left" data-aos-delay="300">
            <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 ml-6 shadow-2xl">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">How It Works</h3>
              <div className="space-y-6">
                {[
                  { step: '1', text: 'Upload BRD Document' },
                  { step: '2', text: 'AI Analyzes Requirements' },
                  { step: '3', text: 'Generate Test Cases' },
                  { step: '4', text: 'Export & Integrate' }
                ].map((item) => (
                  <div 
                    key={item.step}
                    className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center font-bold text-white">
                      {item.step}
                    </div>
                    <span className="text-blue-100 text-lg font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  )
}