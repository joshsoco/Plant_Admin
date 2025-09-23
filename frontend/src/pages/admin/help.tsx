import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  FileText, 
  Settings, 
  Users, 
  BarChart3, 
  Shield, 
  Leaf,
  ChevronRight,
  Clock,
  CheckCircle,
  TreePine,
  Sprout,
  Camera,
  Search,
  Database,
  Bug
} from 'lucide-react';

const HelpPage = () => {
  const helpTopics = [
    {
      icon: Camera,
      title: "Plant Identification",
      description: "Learn how to capture and upload images for accurate plant identification",
      link: "#plant-identification"
    },
    {
      icon: Search,
      title: "Species Database",
      description: "Navigate and manage the comprehensive plant species database",
      link: "#species-database"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "View identification statistics and generate plant-related reports",
      link: "#analytics-reports"
    },
    {
      icon: Database,
      title: "Data Management",
      description: "Import, export, and maintain plant identification data",
      link: "#data-management"
    },
    {
      icon: Settings,
      title: "System Configuration",
      description: "Configure AI models, detection settings, and system preferences",
      link: "#system-settings"
    }
  ];

  const faqItems = [
    {
      question: "How accurate is the plant identification AI?",
      answer: "Our AI model has a 95% accuracy rate for common species and 88% for rare plants. Accuracy improves with high-quality images and proper lighting."
    },
    {
      question: "What image formats are supported for identification?",
      answer: "We support JPEG, PNG, and WebP formats. Images should be at least 300x300 pixels for best results."
    },
    {
      question: "How do I add new plant species to the database?",
      answer: "Navigate to Database Management > Add Species. You'll need botanical name, common names, characteristics, and reference images."
    },
    {
      question: "Can I export identification results?",
      answer: "Yes, go to Reports > Export Data. You can export in CSV, Excel, or JSON format with filtering options."
    },
    {
      question: "How do I handle misidentified plants?",
      answer: "Use the 'Report Issue' feature on any identification result to flag errors. Our team reviews and corrects the database accordingly."
    }
  ];

  const supportOptions = [
    {
      icon: MessageSquare,
      title: "Botanical Support Chat",
      description: "Get help from our plant identification specialists",
      availability: "Available 9AM-5PM EST",
      action: "Start Chat",
      primary: true
    },
    {
      icon: Mail,
      title: "Technical Support",
      description: "Report bugs or technical issues with the system",
      availability: "Response within 4 hours",
      action: "Send Email"
    },
    {
      icon: Phone,
      title: "Expert Consultation",
      description: "Schedule a call with our botanical experts",
      availability: "Mon-Fri, 10AM-4PM EST",
      action: "Schedule Call"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4">
      <div className="w-full space-y-8">
        {/* Header Section */}
        <div className="space-y-4 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2">
              <TreePine className="h-8 w-8 text-green-600 dark:text-green-400" />
              <Leaf className="h-6 w-6 text-green-500 dark:text-green-300" />
            </div>
            <h1 className="text-3xl font-bold text-foreground dark:text-white">Plant Identifier Help Centre</h1>
          </div>
          <p className="text-lg text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto">
            Welcome to the Plant Identifier admin help center. Find guidance on plant identification, 
            database management, system configuration, and botanical support resources.
          </p>
        </div>

        {/* Quick Status Alert */}
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Plant identification system operational. Database last updated: {new Date().toLocaleDateString()}
          </AlertDescription>
        </Alert>

        {/* Help Topics Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-foreground dark:text-white">Browse Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpTopics.map((topic, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer border-border dark:border-gray-700 bg-card dark:bg-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <topic.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground dark:text-white">{topic.title}</CardTitle>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground dark:text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-muted-foreground dark:text-gray-300">
                    {topic.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground dark:text-white">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqItems.map((faq, index) => (
                <Card key={index} className="border-border dark:border-gray-700 bg-card dark:bg-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg text-foreground dark:text-white">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground dark:text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-foreground dark:text-white">Contact Plant Experts</h2>
            <div className="space-y-4">
              {supportOptions.map((option, index) => (
                <Card key={index} className={`border-border dark:border-gray-700 bg-card dark:bg-card ${option.primary ? 'ring-2 ring-green-500 dark:ring-green-400' : ''}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${option.primary ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <option.icon className={`h-6 w-6 ${option.primary ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2 text-foreground dark:text-white">
                          {option.title}
                          {option.primary && (
                            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                              Recommended
                            </span>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 text-muted-foreground dark:text-gray-300">
                          {option.description}
                        </CardDescription>
                        <div className="flex items-center mt-2 text-sm text-muted-foreground dark:text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          {option.availability}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <button className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                      option.primary 
                        ? 'bg-green-600 dark:bg-green-600 text-white hover:bg-green-700 dark:hover:bg-green-700' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}>
                      {option.action}
                    </button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Additional Resources */}
            <Card className="border-border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <CardHeader>
                <CardTitle className="text-lg text-foreground dark:text-white">Botanical Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground dark:text-gray-300">Plant Photography Guide</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground dark:text-gray-300">Species Database API</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground dark:text-gray-300">AI Model Training Data</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground dark:text-gray-300">Botanical Classification Guide</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground dark:text-gray-300">Report False Identifications</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground dark:text-gray-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-border dark:border-gray-700">
          <p className="text-muted-foreground dark:text-gray-400">
            Need help with plant identification or have questions about our botanical database? 
            <button className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium ml-1">
              Contact our botanical experts
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;