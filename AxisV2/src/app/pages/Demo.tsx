import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export function Demo() {
  const flowEasing = [0.22, 1, 0.36, 1] as const;
  
  // Cal.com embed — no external script needed, using iframe

  return (
    <div className="min-h-screen pt-32">
      {/* Hero Section */}
      <section className="relative py-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-[var(--blue-soft)]/50 border border-[var(--blue-primary)]/20 text-[var(--blue-primary)] text-sm font-medium mb-6">
                🎉 First 3 months free for early adopters
              </div>
              <h1 className="mb-8 font-medium">Book a walkthrough with our team</h1>
              <p className="text-lg text-[var(--foreground-muted)] font-normal mb-12" style={{ lineHeight: '1.75' }}>
                See how Axis and Ava can help your clinic handle calls, intake, and reminders.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="relative py-12 mb-32">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: flowEasing, delay: 0.2 }}
              className=""
            >
              {/* Cal.com inline widget */}
              <iframe
                src="https://cal.com/axis-founders/15min?embed=true&layout=month_view&theme=light"
                style={{ width: '100%', minWidth: '320px', height: '900px', border: 'none' }}
                title="Book a walkthrough"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-20 border-t border-[var(--glass-border)]">
        <div className="max-w-[1400px] mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: flowEasing }}
            >
              <h2 className="mb-6 font-medium">Not ready to book yet?</h2>
              <p className="text-base text-[var(--foreground-muted)] mb-12 font-normal" style={{ lineHeight: '1.75' }}>
                Join our waitlist to stay updated on Axis and get early access when we launch.
              </p>

              <div className="max-w-[600px] mx-auto p-10 rounded-3xl bg-[var(--blue-soft)]/40">
                <Link to="/trial">
                  <motion.button
                    className="w-full px-10 py-5 rounded-full text-base bg-[var(--blue-primary)] text-white font-medium mb-4"
                    style={{ transition: 'all 150ms ease-out' }}
                    whileHover={{ scale: 1.01, boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)' }}
                    whileTap={{ scale: 0.99 }}
                  >
                    Join the waitlist
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
