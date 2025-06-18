import React, { useState } from 'react';
import { Calendar, Users, Star, ArrowRight, Sparkles, Trophy, Globe } from 'lucide-react';
import { AuthModal } from '../components/auth/AuthModal';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export const HomePage: React.FC = () => {
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'signup' }>({
    isOpen: false,
    mode: 'login',
  });

  const features = [
    {
      icon: Calendar,
      title: 'Smart Event Planning',
      description: 'AI-powered suggestions for venues, catering, and timeline optimization.',
    },
    {
      icon: Users,
      title: 'Seamless Registration',
      description: 'One-click registration with automated confirmations and reminders.',
    },
    {
      icon: Star,
      title: 'Feedback System',
      description: 'Collect and analyze attendee feedback to improve future events.',
    },
    {
      icon: Trophy,
      title: 'Budget Tracking',
      description: 'Comprehensive budget management with real-time expense tracking.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Events Managed' },
    { number: '500K+', label: 'Happy Attendees' },
    { number: '98%', label: 'Success Rate' },
    { number: '24/7', label: 'Support' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10" />
        <nav className="relative container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              EventHub
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
            >
              Sign In
            </Button>
            <Button
              onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
            >
              Get Started
            </Button>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Elevate Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Event Experience
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              From intimate gatherings to large-scale conferences, EventHub provides everything you need 
              to create memorable experiences that attendees will love.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Button
                size="lg"
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
                className="px-8 py-4 text-lg"
                icon={ArrowRight}
              >
                Start Planning Today
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                className="px-8 py-4 text-lg"
              >
                View Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive platform combines powerful tools with intuitive design 
              to make event management effortless.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <CardContent className="py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Events?
            </h2>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of event organizers who trust EventHub to deliver 
              exceptional experiences. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
                onClick={() => setAuthModal({ isOpen: true, mode: 'signup' })}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg"
                onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">EventHub</span>
            </div>
            <div className="flex items-center space-x-6 text-gray-400">
              <Globe className="w-5 h-5" />
              <span>© 2024 EventHub. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={authModal.isOpen}
        onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
        initialMode={authModal.mode}
      />
    </div>
  );
};