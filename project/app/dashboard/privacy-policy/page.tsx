'use client';

import { motion } from 'framer-motion';

export default function PrivacyPolicyPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-8"
    >
      <h1 className="text-3xl font-bold gradient-text mb-8">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Introduction</h2>
        <p>
          TikScheduler respects your privacy and is committed to protecting your personal information.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
        <p>
          We collect your account details, uploaded content data, and scheduling preferences.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Use of Information</h2>
        <p>
          Your data is used to provide and improve the service, and communicate with you about your account.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Information Sharing</h2>
        <p>
          We do not sell personal data. We may share data with trusted service providers under strict confidentiality.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Security</h2>
        <p>
          We take reasonable measures to secure your information but cannot guarantee complete security.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Your Choices</h2>
        <p>
          You can update or delete your info by contacting support.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
        <p>
          For any questions about privacy, email us at support@tikscheduler.example.
        </p>
      </section>
    </motion.div>
  );
}
