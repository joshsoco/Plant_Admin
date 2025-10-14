import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

const TermsOfService: React.FC = () => {
  const lastUpdated = "August 20, 2025";

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: {lastUpdated}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Table of Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] cursor-pointer">
                  <nav className="space-y-2">
                    {[
                      { id: 'acceptance', title: 'Acceptance of Terms' },
                      { id: 'description', title: 'Service Description' },
                      { id: 'accounts', title: 'User Accounts' },
                      { id: 'conduct', title: 'Acceptable Use' },
                      { id: 'content', title: 'User Content' },
                      { id: 'privacy', title: 'Privacy' },
                      { id: 'payment', title: 'Payment Terms' },
                      { id: 'termination', title: 'Termination' },
                      { id: 'disclaimers', title: 'Disclaimers' },
                      { id: 'liability', title: 'Limitation of Liability' },
                      { id: 'changes', title: 'Changes to Terms' },
                      { id: 'contact', title: 'Contact Information' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline py-1 cursor-pointer"
                      >
                        {item.title}
                      </button>
                    ))}
                  </nav>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-8 space-y-8">
                
                <section id="acceptance" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    These Terms of Service ("Terms") govern your use of our application and services. By creating an account or using our service, 
                    you agree to comply with these terms in their entirety.
                  </p>
                </section>

                <Separator />

                <section id="description" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">2. Service Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our service provides [describe your app's main functionality]. We reserve the right to modify, suspend, or discontinue 
                    any part of our service at any time with or without notice.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    We strive to maintain high availability and performance, but we cannot guarantee uninterrupted access to our services.
                  </p>
                </section>

                <Separator />

                <section id="accounts" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">3. User Accounts</h2>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Account Creation</h3>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                      <li>You must provide accurate and complete information when creating an account</li>
                      <li>You are responsible for maintaining the security of your account credentials</li>
                      <li>You must be at least 13 years old to create an account</li>
                      <li>One person may not maintain multiple accounts</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Account Responsibility</h3>
                    <p className="text-gray-700 leading-relaxed">
                      You are fully responsible for all activities that occur under your account. Notify us immediately of any unauthorized use.
                    </p>
                  </div>
                </section>

                <Separator />

                <section id="conduct" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">4. Acceptable Use</h2>
                  <p className="text-gray-700 leading-relaxed">
                    You agree not to use our service for any unlawful purpose or in any way that could damage our service or reputation.
                  </p>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Prohibited Activities</h3>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li>Violating any applicable laws or regulations</li>
                        <li>Impersonating others or providing false information</li>
                        <li>Uploading malicious code or attempting to breach security</li>
                        <li>Harassing, threatening, or intimidating other users</li>
                        <li>Distributing spam or unauthorized commercial content</li>
                        <li>Infringing on intellectual property rights</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <Separator />

                <section id="content" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">5. User Content</h2>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Your Rights</h3>
                    <p className="text-gray-700 leading-relaxed">
                      You retain ownership of any content you submit to our service. However, by submitting content, you grant us a 
                      worldwide, royalty-free license to use, modify, and distribute your content as necessary to provide our services.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Content Standards</h3>
                    <p className="text-gray-700 leading-relaxed">
                      All user content must comply with our community guidelines and applicable laws. We reserve the right to remove 
                      content that violates these standards.
                    </p>
                  </div>
                </section>

                <Separator />

                <section id="privacy" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">6. Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of our service, 
                    to understand our practices regarding the collection and use of your information.
                  </p>
                </section>

                <Separator />

                <section id="payment" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">7. Payment Terms</h2>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Billing</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you purchase paid services, you agree to pay all applicable fees. All fees are non-refundable unless 
                      otherwise stated or required by law.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Subscription Services</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Subscription fees are billed in advance and will automatically renew unless cancelled. You may cancel your 
                      subscription at any time through your account settings.
                    </p>
                  </div>
                </section>

                <Separator />

                <section id="termination" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">8. Termination</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may terminate or suspend your account and access to our service at our sole discretion, without prior notice, 
                    for conduct that we believe violates these Terms or is harmful to other users or our business.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    You may terminate your account at any time by contacting us or using the account deletion feature in your settings.
                  </p>
                </section>

                <Separator />

                <section id="disclaimers" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">9. Disclaimers</h2>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed font-medium">
                      Our service is provided "as is" without warranties of any kind. We do not guarantee that our service will be 
                      uninterrupted, error-free, or secure.
                    </p>
                  </div>
                </section>

                <Separator />

                <section id="liability" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">10. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, 
                    consequential, or punitive damages arising from your use of our service.
                  </p>
                </section>

                <Separator />

                <section id="changes" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">11. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms at any time. We will notify users of significant changes via email 
                    or through our service. Continued use of our service after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <Separator />

                <section id="contact" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">12. Contact Information</h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed">
                      If you have any questions about these Terms of Service, please contact us at:
                    </p>
                    <div className="mt-3 space-y-1 text-gray-700">
                      <p><strong>Email:</strong> joso.co.up@phinmaed.com</p>
                      <p><strong>Address:</strong> Dagupan City</p>
                      <p><strong>Phone:</strong> 09066177270</p>
                    </div>
                  </div>
                </section>

              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;