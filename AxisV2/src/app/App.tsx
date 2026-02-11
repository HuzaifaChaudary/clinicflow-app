import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { ScrollToTop } from './components/ScrollToTop';
import { Home } from './pages/Home';
import { Product } from './pages/Product';
import { HowItWorks } from './pages/HowItWorks';
import { Solutions } from './pages/Solutions';
import { TryAva } from './pages/TryAva';
import { Pricing } from './pages/Pricing';
import { About } from './pages/About';
import { Trial } from './pages/Trial';
// import { Login } from './pages/Login'; // Login temporarily disabled
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
          <Route path="/voice-automation" element={<TryAva />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/trial" element={<Trial />} />
          {/* <Route path="/login" element={<Login />} /> */}  {/* Login temporarily disabled */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/demo/infinite-grid" element={<InfiniteGridDemo />} />
          <Route path="/flow-blueprint" element={<FlowBlueprint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Footer */}
        <footer className="relative bg-black text-white">
          <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
              {/* Column 1 - Brand */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                  <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 22 L46 22" stroke="#2563EB" stroke-width="2.5" stroke-linecap="square"/>
                    <path d="M28 6 L28 38" stroke="#2563EB" stroke-width="2.5" stroke-linecap="square"/>
                    <path d="M12 32 L36 14" stroke="#2563EB" stroke-width="2" stroke-linecap="square"/>
                    <rect x="26" y="20" width="4" height="4" fill="#2563EB"/>
                  </svg>
                  <div className="text-2xl font-semibold tracking-tight">AXIS</div>
                </div>
                <p className="text-sm text-gray-300 mb-2 leading-relaxed">
                  AI‑first execution system for clinics.
                </p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Axis and Ava help clinics handle calls, intake, reminders, and notes.
                </p>
              </div>

              {/* Column 2 - Product */}
              <div className="text-center md:text-left">
                <h4 className="text-sm font-semibold mb-4 md:mb-6 tracking-tight text-white">Product</h4>
                <ul className="space-y-2.5 md:space-y-3 text-sm text-gray-300">
                  <li>
                    <Link to="/product" className="hover:text-[var(--accent-primary)] transition-colors">
                      Product overview
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="hover:text-[var(--accent-primary)] transition-colors">
                      How it works
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="hover:text-[var(--accent-primary)] transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/voice-automation" className="hover:text-[var(--accent-primary)] transition-colors">
                      Try Ava
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 3 - Solutions */}
              <div className="text-center md:text-left">
                <h4 className="text-sm font-semibold mb-4 md:mb-6 tracking-tight text-white">Solutions</h4>
                <ul className="space-y-2.5 md:space-y-3 text-sm text-gray-300">
                  <li>
                    <Link to="/solutions" className="hover:text-[var(--accent-primary)] transition-colors">
                      By clinic type
                    </Link>
                  </li>
                  <li>
                    <Link to="/solutions/mental-health" className="hover:text-[var(--accent-primary)] transition-colors">
                      Mental health
                    </Link>
                  </li>
                  <li>
                    <Link to="/solutions/physiotherapy" className="hover:text-[var(--accent-primary)] transition-colors">
                      Physiotherapy
                    </Link>
                  </li>
                  <li>
                    <Link to="/solutions/dental" className="hover:text-[var(--accent-primary)] transition-colors">
                      Dental
                    </Link>
                  </li>
                  <li>
                    <Link to="/solutions/outpatient" className="hover:text-[var(--accent-primary)] transition-colors">
                      Outpatient clinics
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Column 4 - Company */}
              <div className="text-center md:text-left">
                <h4 className="text-sm font-semibold mb-4 md:mb-6 tracking-tight text-white">Company</h4>
                <ul className="space-y-2.5 md:space-y-3 text-sm text-gray-300">
                  <li>
                    <Link to="/about" className="hover:text-[var(--accent-primary)] transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link to="/trial" className="hover:text-[var(--accent-primary)] transition-colors">
                      Join waitlist
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy-policy" className="hover:text-[var(--accent-primary)] transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-of-service" className="hover:text-[var(--accent-primary)] transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="mt-12 md:mt-16 pt-6 md:pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
              <p className="text-sm text-gray-400">
                © 2026 Axis. All rights reserved.
              </p>
              <div className="flex gap-6 md:gap-8 text-sm text-gray-400">
                <Link to="/privacy-policy" className="hover:text-[var(--accent-primary)] transition-colors">
                  Privacy Policy
                </Link>
                <Link to="/terms-of-service" className="hover:text-[var(--accent-primary)] transition-colors">
                  Terms of Service
                </Link>
                <Link to="/trial" className="hover:text-[var(--accent-primary)] transition-colors">
                  Join waitlist
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;