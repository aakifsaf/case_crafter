import { HeroSection } from '../components/home/HeroSection'
import { FeaturesSection } from '../components/home/FeaturesSection'
import { StatsSection } from '../components/home/StatsSection'
import { CTASection } from '../components/home/CTASection'

export const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  )
}