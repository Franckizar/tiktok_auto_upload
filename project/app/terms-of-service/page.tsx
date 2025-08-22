'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, BookOpen, UserCheck, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function TermsOfServicePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    {
      title: "Acceptance of Terms",
      content: "By using TikScheduler, you agree to these Terms of Service. Please read them carefully.",
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: "Service Description",
      content: "TikScheduler automates uploading images and videos to TikTok, including features like scheduling, hashtags, and music integration.",
      icon: <BookOpen className="h-5 w-5" />
    },
    {
      title: "User Responsibilities",
      content: "You are responsible for all content uploaded through TikScheduler and must comply with TikTok's policies and applicable laws.",
      icon: <UserCheck className="h-5 w-5" />
    },
    {
      title: "Account Security",
      content: "Protect your login credentials. TikScheduler is not responsible for unauthorized access due to compromised accounts.",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Limitation of Liability",
      content: "TikScheduler is provided as-is. We disclaim liability for damages arising out of use or inability to use the service.",
      icon: <Shield className="h-5 w-5" />
    },
    {
      title: "Contact",
      content: "Questions? Contact us at support@tikscheduler.example.",
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
          <h1 className="text-3xl font-bold gradient-text">Terms of Service</h1>
          <p className="text-gray-600 mt-2">
            Understand your rights and responsibilities when using our service.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search terms of service..."
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
                    <h2 className="text-xl font-semibold mb-2">
                      {index + 1}. {section.title}
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