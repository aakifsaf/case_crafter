import { BrainIcon, CheckBadgeIcon, LinkIcon, DocumentArrowDownIcon, UsersIcon, ShieldCheckIcon } from "../ui/icons"
import { useEffect } from 'react'
import AOS from 'aos'

export const FeaturesSection = () => {
  useEffect(() => {
    AOS.refresh()
  }, [])

  const features = [
    {
      name: 'AI-Powered Analysis',
      description: 'Advanced NLP understands your business requirements and extracts key entities, conditions, and acceptance criteria.',
      icon: BrainIcon,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: '100% Coverage',
      description: 'Automatically ensures every requirement is covered by test cases, including edge cases and negative scenarios.',
      icon: CheckBadgeIcon,
      color: 'from-green-500 to-emerald-500'
    },
    {
      name: 'Smart Traceability',
      description: 'Maintains bidirectional links between requirements and test cases with automatic updates.',
      icon: LinkIcon,
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Multi-Format Export',
      description: 'Export test suites to Excel, JSON, PDF, or integrate directly with your testing tools.',
      icon: DocumentArrowDownIcon,
      color: 'from-orange-500 to-red-500'
    },
    {
      name: 'Team Collaboration',
      description: 'Share test suites with your team, track changes, and maintain version history.',
      icon: UsersIcon,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      name: 'Security First',
      description: 'Enterprise-grade security with on-premise deployment options for sensitive documents.',
      icon: ShieldCheckIcon,
      color: 'from-yellow-500 to-amber-500'
    },
  ]

  return (
    <div className="py-20 bg-gradient-to-b from-slate-900 to-blue-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:100px_100px] opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-base font-semibold tracking-wide text-cyan-400 uppercase">Features</h2>
          <p className="mt-2 text-4xl md:text-5xl font-bold text-white">
            Why Choose <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">AUTOMAGIC QA</span>?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-blue-200 mx-auto">
            Transform your QA process with cutting-edge AI technology that understands your business needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.name}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:border-cyan-400/30 transition-all duration-500 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {feature.name}
              </h3>
              <p className="text-blue-200 group-hover:text-white transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}