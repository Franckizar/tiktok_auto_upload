'use client';

import { motion } from 'framer-motion';

export default function TermsOfServicePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      <h1 className="text-3xl font-bold gradient-text mb-8">Terms of Service</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
        <p>By using TikScheduler, you agree to these Terms of Service. Please read them carefully.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Service Description</h2>
        <p>
          TikScheduler automates uploading images and videos to TikTok, including features like scheduling, hashtags, and music integration.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
        <p>
          You are responsible for all content uploaded through TikScheduler and must comply with TikTok&apos;s policies and applicable laws.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Account Security</h2>
        <p>
          Protect your login credentials. TikScheduler is not responsible for unauthorized access due to compromised accounts.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Limitation of Liability</h2>
        <p>
          TikScheduler is provided as-is. We disclaim liability for damages arising out of use or inability to use the service.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">6. Contact</h2>
        <p>
          Questions? Contact us at support@tikscheduler.example.
        </p>
      </section>
    </motion.div>
  );
}
