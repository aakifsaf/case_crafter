import { BrainIcon, CheckBadgeIcon, LinkIcon, DocumentArrowDownIcon, DocumentTextIcon, UsersIcon, ShieldCheckIcon } from "../ui/icons"
export const FeaturesSection = () => {
  const features = [
    {
      name: 'AI-Powered Analysis',
      description: 'Advanced NLP understands your business requirements and extracts key entities, conditions, and acceptance criteria.',
      icon: BrainIcon,
    },
    {
      name: '100% Coverage',
      description: 'Automatically ensures every requirement is covered by test cases, including edge cases and negative scenarios.',
      icon: CheckBadgeIcon,
    },
    {
      name: 'Smart Traceability',
      description: 'Maintains bidirectional links between requirements and test cases with automatic updates.',
      icon: LinkIcon,
    },
    {
      name: 'Multi-Format Export',
      description: 'Export test suites to Excel, JSON, PDF, or integrate directly with your testing tools.',
      icon: DocumentArrowDownIcon,
    },
    {
      name: 'Team Collaboration',
      description: 'Share test suites with your team, track changes, and maintain version history.',
      icon: UsersIcon,
    },
    {
      name: 'Security First',
      description: 'Enterprise-grade security with on-premise deployment options for sensitive documents.',
      icon: ShieldCheckIcon,
    },
  ]

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose AUTOMAGIC QA?
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Transform your QA process with cutting-edge AI technology that understands your business needs.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}