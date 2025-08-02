'use client'

import { Container } from '@/components/layout/Container';
import { useState } from 'react';

export default function AboutPage() {
  const [showContact, setShowContact] = useState(false);

  const teamMembers = [
    {
      name: "Chengxuan Yang",
      role: "Club Founder",
      description: "Founder & Builder of this website",
      avatar: "CY"
    },
    {
      name: "Jason Yu",
      role: "Club Cofounder",
      description: "F1D expert",
      avatar: "JY"
    },
    {
      name: "Changhong Zhao",
      role: "Club Cofounder",
      description: "C++ expert",
      avatar: "CZ"
    },
    {
      name: "Zhitong Ning",
      role: "Club Cofounder",
      description: "Machine Learning expert",
      avatar: "ZN"
    },
    {
      name: "Yubo Wang",
      role: "Club Cofounder",
      description: "",
      avatar: "YW"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              About Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are a group of high school students passionate about artificial intelligence, dedicated to promoting AI technology on campus and cultivating students&apos; innovative thinking and practical abilities
            </p>
          </div>

          {/* Team Members */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">
              Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-monet-blue to-monet-purple rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{member.avatar}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">
                    {member.name}
                  </h3>
                  <p className="text-monet-blue text-sm font-medium mb-3">
                    {member.role}
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">
              Join Us
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              If you&apos;re interested in artificial intelligence and want to learn and grow with like-minded peers,
              welcome to join our club! Let&apos;s explore the infinite possibilities of AI together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/blogs"
                className="bg-gradient-to-r from-monet-blue to-monet-purple text-white px-8 py-4 rounded-xl font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300 shadow-lg hover:shadow-monet-blue/20"
              >
                Browse Our Blog
              </a>
              <button
                onClick={() => setShowContact(true)}
                className="border border-border text-foreground px-8 py-4 rounded-xl font-medium hover:bg-accent transition-all duration-300"
              >
                Join the Club
              </button>
            </div>
          </div>
        </div>
      </Container>

      {/* Contact Modal */}
      {showContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-xl p-8 max-w-md mx-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-card-foreground mb-6">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5 text-monet-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-card-foreground font-medium">Email:</span>
                  <span className="text-muted-foreground">yangchengxuan27@gmail.com</span>
                </div>
                <div className="flex items-center justify-center space-x-3">
                  <svg className="w-5 h-5 text-monet-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="text-card-foreground font-medium">WeChat:</span>
                  <span className="text-muted-foreground">ycx_2025318</span>
                </div>
              </div>
              <button
                onClick={() => setShowContact(false)}
                className="mt-6 bg-gradient-to-r from-monet-blue to-monet-purple text-white px-6 py-2 rounded-lg font-medium hover:from-monet-blue-dark hover:to-monet-purple-dark transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
