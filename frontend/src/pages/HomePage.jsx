import { HeroSection } from '../components/home/HeroSection'
import { FeaturesSection } from '../components/home/FeaturesSection'
import { StatsSection } from '../components/home/StatsSection'
import { CTASection } from '../components/home/CTASection'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'

export const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-quad',
      once: true
    })
  }, [])

  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  )
}
