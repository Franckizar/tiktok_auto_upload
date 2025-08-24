'use client';
// import { Button } from "@/components/Job_portail/Home/components/ui/button";
import { Button } from "@/components/ui/button";
import { Compass, Home, Mail } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-white min-h-screen flex items-center">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="relative mb-12">
            <div className="text-[120px] md:text-[180px] font-bold text-sky-300">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="h-24 w-24 text-sky-700 opacity-70" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="bg-sky-700 hover:bg-sky-600">
              <Link href="/Job_portail/Home" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Return Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Support
              </Link>
            </Button>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              While you&apos;re here, check out our <Link href="/jobs" className="text-sky-700 hover:underline">latest job listings</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
