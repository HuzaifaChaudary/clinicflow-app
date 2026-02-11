import { motion } from 'motion/react';

export function PrivacyPolicy() {
  const flowEasing = [0.22, 1, 0.36, 1];

  const sections = [
    {
      title: 'Introduction',
      content: [
        'Axis is an AI-first operations platform for clinics. Axis and Ava (the AI assistant within the platform) handle limited data only to support scheduling, communication, and automation workflows.',
        'This privacy policy explains how we process information, what safeguards we apply, and how clinics maintain control over their data.',
        'Throughout this policy: "Axis" refers to Axis, Inc., the company providing the platform. "Ava" refers to the AI assistant that is part of the Axis product. Together, Axis and Ava process calls, texts, emails, and visit notes on behalf of clinics.',
        'Clinics remain controllers of patient data; Axis acts as a processor/service provider under clinic direction.'
      ]
    },
    {
      title: 'Information we process',
      content: [
        'Axis processes clinic-provided information to deliver operational automation services. This includes:',
      ],
      list: [
        'Clinic configuration details such as operating hours, staff schedules, and workflow rules',
        'Patient contact information required for confirmations, reminders, and follow-ups (calls, texts, emails)',
        'Appointment-related metadata including visit types, timing, and status',
        'Visit notes drafted by Ava MD for clinician review (when this feature is used)',
        'System usage data necessary for reliability and performance monitoring'
      ],
      footer: 'We do not collect marketing data. We do not use patient information for advertising purposes.'
    },
    {
      title: 'How data is used',
      content: [
        'Data processed by Axis is used only to:',
      ],
      list: [
        'Deliver clinic-initiated communications to patients (Ava handles calls, sends texts and emails)',
        'Execute scheduling and automation rules configured by the clinic',
        'Draft visit notes for clinician review and signature (Axis does not provide medical advice)',
        'Maintain system reliability, performance, and security',
        'Provide support and troubleshooting when requested by the clinic'
      ],
      footer: 'Axis does not sell, rent, or monetize personal data. Data is not shared with third parties for purposes unrelated to service delivery.'
    },
    {
      title: 'Patient communications',
      content: [
        'All patient communications sent through Axis and Ava are initiated on behalf of the clinic. Clinics are responsible for obtaining appropriate patient consent before using automated communication services.',
        'Axis acts as a service provider executing instructions configured by the clinic. The clinic maintains responsibility for compliance with applicable healthcare communication regulations.'
      ]
    },
    {
      title: 'Data protection',
      content: [
        'Axis applies administrative, technical, and operational safeguards designed to protect sensitive healthcare-related information from unauthorized access, disclosure, or misuse.',
        'These safeguards include access controls, encryption during transmission and storage, regular security assessments, and staff training on data handling procedures.',
        'While we implement protections consistent with industry standards for healthcare data, no system is completely immune to risk. Clinics should assess whether our safeguards meet their operational and regulatory requirements.'
      ]
    },
    {
      title: 'Clinic control',
      content: [
        'Clinics retain ownership and control of their data. Data access within Axis follows clinic-configured permissions.',
        'Clinics can export their data at any time. Upon service termination, data is deleted or returned according to the clinic\'s instructions, subject to legal retention requirements.'
      ]
    },
    {
      title: 'Data retention',
      content: [
        'Data is retained only as long as necessary to operate the service or as directed by the clinic.',
        'When a clinic terminates service, data deletion occurs within 90 days unless the clinic requests earlier removal or specifies an alternative timeline.',
        'Certain records may be retained longer where required by law or legitimate operational needs such as billing, dispute resolution, or security investigations.'
      ]
    },
    {
      title: 'Changes to this policy',
      content: [
        'This privacy policy may be updated as the platform evolves or legal requirements change. Material updates will be communicated to active clinic accounts.',
        'Continued use of Axis after policy updates constitutes acceptance of the revised terms.'
      ]
    },
    {
      title: 'Contact',
      content: [
        'Questions about this privacy policy or data handling practices should be directed to:',
      ],
      contact: 'privacy@useaxis.app'
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
            <h1 className="mb-6">Privacy Policy</h1>
            <p className="text-xl text-[var(--foreground-muted)]">
              How Axis and Ava process and protect clinic and patient information
            </p>
            <p className="text-sm text-[var(--foreground-muted)] mt-4">
              Last updated: February 1, 2025
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