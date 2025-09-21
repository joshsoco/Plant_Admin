import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Eye, Lock, Database, Mail, Settings } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "August 20,2025";

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
          <div className="flex justify-center mb-4">
            <Shield className="h-16 w-16 text-black-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: {lastUpdated}</p>
          <p className="text-sm text-gray-500 mt-2">
            We value your privacy and are committed to protecting your personal information.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-lg">Quick Navigation</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] cursor-pointer">
                  <nav className="space-y-2">
                    {[
                      { id: 'overview', title: 'Overview', icon: Eye },
                      { id: 'collection', title: 'Information We Collect', icon: Database },
                      { id: 'usage', title: 'How We Use Information', icon: Settings },
                      { id: 'sharing', title: 'Information Sharing', icon: Mail },
                      { id: 'storage', title: 'Data Storage & Security', icon: Lock },
                      { id: 'rights', title: 'Your Rights', icon: Shield },
                      { id: 'cookies', title: 'Cookies & Tracking' },
                      { id: 'children', title: 'Children\'s Privacy' },
                      { id: 'international', title: 'International Users' },
                      { id: 'changes', title: 'Policy Updates' },
                      { id: 'contact', title: 'Contact Us' }
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className="flex items-center space-x-2 w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline py-1 cursor-pointer"
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.title}</span>
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
                
                <section id="overview" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Eye className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">1. Overview</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. 
                    We are committed to protecting your privacy and ensuring transparency about our data practices.
                  </p>
                  <div className="bg-transparent border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Key Points:</h3>
                    <ul className="list-disc list-inside space-y-1 text-blue-800 text-sm">
                      <li>We only collect information necessary to provide our services</li>
                      <li>We never sell your personal information to third parties</li>
                      <li>You have control over your data and privacy settings</li>
                      <li>We use industry-standard security measures to protect your information</li>
                    </ul>
                  </div>
                </section>

                <Separator />

                <section id="collection" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Database className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">2. Information We Collect</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-800">Personal Information</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Information you provide directly when creating an account or using our services:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-2">Account Information</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Name and email address</li>
                            <li>• Username and password</li>
                            <li>• Profile information</li>
                            <li>• Account preferences</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <h4 className="font-medium text-gray-800 mb-2">Usage Information</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Content you create or upload</li>
                            <li>• Comments and interactions</li>
                            <li>• Communication with support</li>
                            <li>• Feedback and survey responses</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-medium text-gray-800">Technical Information</h3>
                      <p className="text-gray-700 leading-relaxed">
                        Information automatically collected when you use our services:
                      </p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <ul className="text-sm text-gray-600 space-y-2">
                          <li>• Device information (browser type, operating system)</li>
                          <li>• IP address and location data (city/country level)</li>
                          <li>• Usage analytics (pages visited, time spent, features used)</li>
                          <li>• Performance data (load times, errors)</li>
                          <li>• Referral information (how you found our service)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section id="usage" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Settings className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">3. How We Use Your Information</h2>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    We use your information for the following purposes:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-3">Service Operations</h3>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Provide and maintain our services</li>
                        <li>• Process transactions and payments</li>
                        <li>• Authenticate users and prevent fraud</li>
                        <li>• Provide customer support</li>
                        <li>• Send important service notifications</li>
                      </ul>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-3">Improvements & Communications</h3>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Analyze usage to improve our services</li>
                        <li>• Develop new features and functionality</li>
                        <li>• Send marketing communications (with consent)</li>
                        <li>• Personalize user experience</li>
                        <li>• Ensure security and prevent abuse</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Legal Basis for Processing</h3>
                    <p className="text-sm text-green-800">
                      We process your data based on: your consent, contractual necessity, legitimate business interests, 
                      and compliance with legal obligations.
                    </p>
                  </div>
                </section>

                <Separator />

                <section id="sharing" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">4. Information Sharing</h2>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-red-900 mb-2">We Do NOT Sell Your Data</h3>
                    <p className="text-sm text-red-800">
                      We never sell, rent, or trade your personal information to third parties for marketing purposes.
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    We may share your information only in the following limited circumstances:
                  </p>

                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h3 className="font-medium text-gray-800 mb-2">Service Providers</h3>
                      <p className="text-sm text-gray-600">
                        With trusted third-party service providers who help us operate our service (hosting, analytics, payment processing). 
                        These providers are contractually bound to protect your information.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h3 className="font-medium text-gray-800 mb-2">Legal Requirements</h3>
                      <p className="text-sm text-gray-600">
                        When required by law, court order, or to protect our rights, property, or safety, or that of our users or others.
                      </p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h3 className="font-medium text-gray-800 mb-2">Business Transfers</h3>
                      <p className="text-sm text-gray-600">
                        In connection with a merger, acquisition, or sale of assets. Users will be notified of any ownership changes.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section id="storage" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Lock className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">5. Data Storage & Security</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-transparent border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Security Measures</h3>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Encryption in transit and at rest</li>
                        <li>• Regular security audits and penetration testing</li>
                        <li>• Access controls and authentication</li>
                        <li>• Monitoring and incident response procedures</li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-800">Data Retention</h3>
                        <p className="text-sm text-gray-600">
                          We retain your information only as long as necessary to provide our services and comply with legal obligations. 
                          Account data is typically deleted within 30 days of account closure.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-800">Data Location</h3>
                        <p className="text-sm text-gray-600">
                          Your data is stored in secure data centers located in [specify regions]. We may transfer data across borders 
                          to provide our services, always with appropriate safeguards.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                <Separator />

                <section id="rights" className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-6 w-6 text-blue-600" />
                    <h2 className="text-2xl font-semibold text-gray-900">6. Your Privacy Rights</h2>
                  </div>
                  
                  <p className="text-gray-700 leading-relaxed">
                    You have several rights regarding your personal information:
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <h4 className="font-medium text-green-900 text-sm mb-1">Access & Portability</h4>
                        <p className="text-xs text-green-800">Request a copy of your personal data in a portable format</p>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <h4 className="font-medium text-blue-900 text-sm mb-1">Correction</h4>
                        <p className="text-xs text-blue-800">Update or correct inaccurate personal information</p>
                      </div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <h4 className="font-medium text-yellow-900 text-sm mb-1">Deletion</h4>
                        <p className="text-xs text-yellow-800">Request deletion of your personal information</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                        <h4 className="font-medium text-purple-900 text-sm mb-1">Restriction</h4>
                        <p className="text-xs text-purple-800">Limit how we process your personal information</p>
                      </div>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <h4 className="font-medium text-orange-900 text-sm mb-1">Objection</h4>
                        <p className="text-xs text-orange-800">Object to certain types of processing</p>
                      </div>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="font-medium text-red-900 text-sm mb-1">Withdraw Consent</h4>
                        <p className="text-xs text-red-800">Withdraw consent for data processing at any time</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-800 mb-2">How to Exercise Your Rights</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      To exercise any of these rights, contact us at privacy gmail or use your account settings. 
                      We will respond within 30 days of receiving your request.
                    </p>
                    <p className="text-xs text-gray-500">
                      Note: Some rights may be limited by applicable laws or our legitimate business needs.
                    </p>
                  </div>
                </section>

                <Separator />

                <section id="cookies" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">7. Cookies & Tracking Technologies</h2>
                  
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar technologies to enhance your experience and analyze usage patterns.
                  </p>

                  <div className="space-y-4">
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Essential</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Required for basic site functionality</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">Session</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Analytics</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Help us understand site usage</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">2 years</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">Preferences</td>
                            <td className="px-4 py-3 text-sm text-gray-600">Remember your settings and choices</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">1 year</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-transparent border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Managing Cookies</h3>
                      <p className="text-sm text-blue-800">
                        You can control cookies through your browser settings or our cookie preference center. 
                        Note that disabling certain cookies may affect site functionality.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section id="children" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">8. Children's Privacy</h2>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h3 className="font-medium text-orange-900 mb-2">Age Restrictions</h3>
                    <p className="text-sm text-orange-800 leading-relaxed">
                      Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
                      information from children under 13. If you are a parent or guardian and believe your child has provided 
                      us with personal information, please contact us immediately.
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    If we learn that we have collected personal information from a child under 13 without parental consent, 
                    we will take steps to delete that information as quickly as possible.
                  </p>
                </section>

                <Separator />

                <section id="international" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">9. International Users</h2>
                  
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-gray-800">Cross-Border Data Transfers</h3>
                    <p className="text-gray-700 leading-relaxed">
                      If you are accessing our service from outside Philippines, please note that your information 
                      may be transferred to, stored, and processed in countries with different privacy laws.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-900 mb-2">GDPR Compliance</h4>
                      <p className="text-sm text-blue-800">
                        For EU residents, we comply with GDPR requirements including data protection rights and lawful basis for processing.
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-green-900 mb-2">CCPA Compliance</h4>
                      <p className="text-sm text-green-800">
                        For California residents, we comply with CCPA requirements including rights to know, delete, and opt-out.
                      </p>
                    </div>
                  </div>
                </section>

                <Separator />

                <section id="changes" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">10. Policy Updates</h2>
                  
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, 
                    operational, or regulatory reasons.
                  </p>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-medium text-yellow-900 mb-2">How We Notify You</h3>
                    <ul className="text-sm text-yellow-800 space-y-1">
                      <li>• Email notification for significant changes</li>
                      <li>• In-app notification when you next visit</li>
                      <li>• Updated "Last Modified" date at the top of this policy</li>
                      <li>• 30-day notice period for material changes</li>
                    </ul>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    Your continued use of our service after any changes indicates your acceptance of the updated Privacy Policy.
                  </p>
                </section>

                <Separator />

                <section id="contact" className="space-y-4">
                  <h2 className="text-2xl font-semibold text-gray-900">11. Contact Us</h2>
                  
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                    please don't hesitate to contact us.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-transparent border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-3">General Inquiries</h3>
                      <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>Email:</strong> joso.co.up@phinmaed.com</p>
                        <p><strong>Response Time:</strong> Within 5 years</p>
                        <p><strong>Phone:</strong> 09066177270</p>
                        <p><strong>Hours:</strong> Monday-Friday, 9 AM - 5 PM</p>
                      </div>
                    </div>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-800 mb-3">Postal Address</h3>
                      <div className="text-sm text-gray-600">
                        <p>plant-Identifier</p>
                        <p>Attn: Privacy Officer</p>
                        <p> Arellano St, Downtown District</p>
                        <p>Dagupan City, Pangasinan, 2400</p>
                        <p>Philippines</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">Data Protection Officer</h3>
                    <p className="text-sm text-green-800">
                      For EU residents or complex privacy matters, you can contact our Data Protection Officer directly at: 
                      joso.co.up@phinmaed.com
                    </p>
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

export default PrivacyPolicy;