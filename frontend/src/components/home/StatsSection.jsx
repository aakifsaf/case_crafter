export const StatsSection = () => {
  const stats = [
    { label: 'Projects Completed', value: '500+' },
    { label: 'Test Cases Generated', value: '50K+' },
    { label: 'Time Saved', value: '90%' },
    { label: 'Coverage Improvement', value: '300%' },
  ]

  return (
    <div className="bg-blue-600">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Trusted by QA Teams Worldwide
          </h2>
          <p className="mt-3 text-xl text-blue-200 sm:mt-4">
            Join thousands of teams that have transformed their testing process with AUTOMAGIC QA.
          </p>
        </div>
        <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-2 sm:gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="order-2 mt-2 text-lg leading-6 font-medium text-blue-200">
                {stat.label}
              </dt>
              <dd className="order-1 text-5xl font-extrabold text-white">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}