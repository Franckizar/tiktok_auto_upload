'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, Shield, Lock, User, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function PrivacyPolicyPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      title: "Introduction",
      content: "TikScheduler respects your privacy and is committed to protecting your personal information.",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Information We Collect",
      content: "We collect your account details, uploaded content data, and scheduling preferences.",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Use of Information",
      content: "Your data is used to provide and improve the service, and communicate with you about your account.",
      icon: <Lock className="h-5 w-5" />
    },
    {
      title: "Information Sharing",
      content: "We do not sell personal data. We may share data with trusted service providers under strict confidentiality.",
      icon: <User className="h-5 w-5" />
    },
    {
      title: "Security",
      content: "We take reasonable measures to secure your information but cannot guarantee complete security.",
      icon: <Lock className="h-5 w-5" />
    },
    {
      title: "Your Choices",
      content: "You can update or delete your info by contacting support.",
      icon: <User className="h-5 w-5" />
    },
    {
      title: "Contact Us",
      content: "For any questions about privacy, email us at support@tikscheduler.example.",
      icon: <Mail className="h-5 w-5" />
    }
  ];

  const filteredSections = sections.filter(section => 
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    section.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Privacy Policy</h1>
          <p className="text-gray-600 mt-2">
            Learn how we collect, use, and protect your personal information.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search privacy policy..."
              className="pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg border p-6"
      >
        <div className="space-y-8">
          {filteredSections.length > 0 ? (
            filteredSections.map((section, index) => (
              <motion.section 
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="pb-6 border-b last:border-b-0 last:pb-0"
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-50 rounded-full">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 flex items-center">
                      {section.title}
                    </h2>
                    <p className="text-gray-700">
                      {section.content}
                    </p>
                  </div>
                </div>
              </motion.section>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4" />
              <p>No matching sections found. Try a different search term.</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}