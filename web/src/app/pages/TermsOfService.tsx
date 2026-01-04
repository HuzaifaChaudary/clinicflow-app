import { motion } from 'motion/react';

export function TermsOfService() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const sections = [
    {
      title: 'What Clinicflow is',
      content: [
        'Clinicflow provides operational automation tools for clinics. The platform supports scheduling coordination, patient communication, intake handling, and administrative workflows.',
        'Clinicflow is designed to reduce manual work, improve scheduling reliability, and support operational clarity in clinical environments.'
      ]
    },
    {
      title: 'What Clinicflow is not',
      content: [
        'Clinicflow does not provide medical services, clinical decision making, or medical advice. It is not a diagnostic tool. It is not a replacement for clinical judgment.',
        'Clinicflow does not replace electronic health record systems. It operates as a complementary layer focused on operational workflows and patient communication.'
      ]
    },
    {
      title: 'Clinic responsibilities',
      content: [
        'Clinics using Clinicflow are responsible for:',
      ],
      list: [
        'Configuring workflows, automation rules, and communication templates accurately',
        'Ensuring patient consent for automated communications where required by law',
        'Complying with applicable healthcare regulations, communication laws, and privacy requirements',
        'Reviewing system outputs and intervening when clinical or operational judgment is required',
        'Maintaining the security of account credentials and access permissions'
      ],
      footer: 'Clinicflow provides tools. Clinics remain responsible for how those tools are used and the outcomes they produce.'
    },
    {
      title: 'Service operation',
      content: [
        'Clinicflow executes instructions configured by the clinic. The platform is designed for reliability, but uninterrupted service is not guaranteed.',
        'System availability may be affected by maintenance, technical issues, or factors beyond our control. Clinics should maintain backup procedures for critical operations.',
        'We will make reasonable efforts to notify clinics of planned maintenance or significant service disruptions.'
      ]
    },
    {
      title: 'Acceptable use',
      content: [
        'Clinicflow is intended for legitimate clinical operations. Misuse, abuse, or use outside intended clinical workflows may result in service suspension or termination.',
        'Examples of unacceptable use include sending unsolicited communications, attempting to compromise system security, or using the platform in ways that violate applicable laws.'
      ]
    },
    {
      title: 'Service modifications',
      content: [
        'Clinicflow may introduce new features, modify existing functionality, or discontinue certain capabilities as the platform evolves.',
        'We will make reasonable efforts to communicate significant changes that affect core workflows. Clinics are responsible for adapting their configurations to accommodate platform updates.'
      ]
    },
    {
      title: 'Data and privacy',
      content: [
        'Data handling, retention, and protection are described in the Clinicflow Privacy Policy.',
        'Clinics retain ownership of their data. Clinicflow processes data as a service provider under clinic direction.'
      ]
    },
    {
      title: 'Termination',
      content: [
        'Clinics may stop using Clinicflow at any time. Upon termination, data will be handled according to clinic instructions and the Privacy Policy.',
        'Clinicflow may suspend or terminate service if a clinic violates these terms, poses a security risk, or engages in conduct harmful to the platform or other users.'
      ]
    },
    {
      title: 'Limitation of liability',
      content: [
        'Clinicflow is provided as a tool to support clinic operations. While we design for reliability and accuracy, the platform does not guarantee specific outcomes.',
        'Clinics assume responsibility for clinical and operational decisions. Clinicflow is not liable for missed appointments, communication failures, or operational disruptions beyond the direct cost of service fees.',
        'This limitation applies to the fullest extent permitted by law.'
      ]
    },
    {
      title: 'Updates to these terms',
      content: [
        'These terms may be updated as the platform evolves or legal requirements change. Material updates will be communicated to active clinic accounts.',
        'Continued use of Clinicflow after terms are updated constitutes acceptance of the revised terms.'
      ]
    },
    {
      title: 'Contact',
      content: [
        'Questions about these terms or service operation should be directed to:',
      ],
      contact: 'support@clinicflow.com'
    }
  ];

  return (
    <div className="min-h-screen pt-32">
      {/* Hero */}
      <section className="relative py-20">
        <div className="max-w-[900px] mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: flowEasing }}
          >
            <h1 className="mb-6">Terms of Service</h1>
            <p className="text-xl text-[var(--foreground-muted)]">
              Usage terms for Clinicflow operational automation platform
            </p>
            <p className="text-sm text-[var(--foreground-muted)] mt-4">
              Last updated: January 3, 2025
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-16 border-t border-[var(--glass-border)]">
        <div className="max-w-[900px] mx-auto px-8">
          <div className="space-y-16">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: flowEasing }}
              >
                <h2 className="mb-6">{section.title}</h2>
                
                {section.content.map((paragraph, j) => (
                  <p key={j} className="text-lg text-[var(--foreground-muted)] mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}

                {section.list && (
                  <ul className="space-y-3 my-6">
                    {section.list.map((item, k) => (
                      <li key={k} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] mt-2.5 flex-shrink-0" />
                        <span className="text-lg text-[var(--foreground-muted)]">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.footer && (
                  <p className="text-lg text-[var(--foreground-muted)] mt-6 leading-relaxed">
                    {section.footer}
                  </p>
                )}

                {section.contact && (
                  <div className="mt-6">
                    <a 
                      href={`mailto:${section.contact}`}
                      className="text-lg text-[var(--accent-primary)] hover:underline"
                    >
                      {section.contact}
                    </a>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
