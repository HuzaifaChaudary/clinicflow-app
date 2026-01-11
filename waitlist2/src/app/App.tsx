import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import footerLogo from '../assets/axis-logo-footer-white-wordmark.svg';
import { Home } from './pages/Home';
import { Product } from './pages/Product';
import { HowItWorks } from './pages/HowItWorks';
import { Solutions } from './pages/Solutions';
import { VoiceAutomation } from './pages/VoiceAutomation';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Trial } from './pages/Trial';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { MentalHealth } from './pages/solutions/MentalHealth';
import { Physiotherapy } from './pages/solutions/Physiotherapy';
import { Dental } from './pages/solutions/Dental';
import { Outpatient } from './pages/solutions/Outpatient';
import { InfiniteGridDemo } from './pages/InfiniteGridDemo';
import { FlowBlueprint } from './pages/FlowBlueprint';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="relative min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/mental-health" element={<MentalHealth />} />
          <Route path="/solutions/physiotherapy" element={<Physiotherapy />} />
          <Route path="/solutions/dental" element={<Dental />} />
          <Route path="/solutions/outpatient" element={<Outpatient />} />
          <Route path="/voice-automation" element={<VoiceAutomation />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/trial" element={<Trial />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/demo/infinite-grid" element={<InfiniteGridDemo />} />
          <Route path="/flow-blueprint" element={<FlowBlueprint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Footer */}
        <footer className="relative border-t bg-[#1a1a1a] text-white">
          <div className="max-w-[1400px] mx-auto px-8 py-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div>
                <img src={footerLogo} alt="AXIS" className="h-8 mb-6" />
                <p className="text-gray-400">
                  AI‑first execution system for clinics
                </p>
              </div>

              <div>
                <h4 className="mb-6 text-white">Product</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <a href="/product" className="hover:text-white transition-colors">
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="/how-it-works"
                      className="hover:text-white transition-colors"
                    >
                      How It Works
                    </a>
                  </li>
                  <li>
                    <a href="/pricing" className="hover:text-white transition-colors">
                      Pricing
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-6 text-white">Solutions</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <a
                      href="/solutions"
                      className="hover:text-white transition-colors"
                    >
                      By Clinic Type
                    </a>
                  </li>
                  <li>
                    <a
                      href="/voice-automation"
                      className="hover:text-white transition-colors"
                    >
                      Voice Automation
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="mb-6 text-white">Company</h4>
                <ul className="space-y-3 text-gray-400">
                  <li>
                    <a href="/about" className="hover:text-white transition-colors">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="/trial" className="hover:text-white transition-colors">
                      Join Waitlist
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © 2025 Axis. All rights reserved.
              </p>
              <div className="flex gap-8 text-sm text-gray-400">
                <a href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;