export const StatsSection = () => {
  const stats = [
    { label: 'Projects Completed', value: '500+', suffix: '' },
    { label: 'Test Cases Generated', value: '50K', suffix: '+' },
    { label: 'Time Saved', value: '90', suffix: '%' },
    { label: 'Coverage Improvement', value: '300', suffix: '%' },
  ]

  return (
    <div className="relative bg-gradient-to-r from-purple-900 to-blue-900 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent"></div>
      
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Trusted by <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">QA Teams Worldwide</span>
          </h2>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Join thousands of teams that have transformed their testing process with AUTOMAGIC QA.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              data-aos="fade-up"
              data-aos-delay={index * 150}
              className="text-center group bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 p-8 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <div className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.value}<span className="text-white">{stat.suffix}</span>
              </div>
              <div className="text-lg font-medium text-purple-200 group-hover:text-white transition-colors duration-300">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}