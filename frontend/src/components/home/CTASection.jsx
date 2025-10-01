export const CTASection = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="py-10 px-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl sm:py-16 sm:px-12 lg:p-16 lg:flex lg:items-center">
          <div className="lg:w-0 lg:flex-1">
            <h2 className="text-3xl font-extrabold tracking-tight text-white">
              Ready to transform your QA process?
            </h2>
            <p className="mt-4 max-w-3xl text-lg text-blue-100">
              Start generating comprehensive test cases in minutes, not weeks. No credit card required.
            </p>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-8">
            <div className="inline-flex rounded-md shadow">
              <a
                href="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50"
              >
                Get Started Free
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-400 hover:bg-blue-500"
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