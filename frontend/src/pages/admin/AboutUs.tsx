import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Leaf, 
  Users, 
  Target, 
  Heart, 
  Sprout,
  TreePine,
  Flower,
  Sun,
  Droplets,
  Shield,
  Zap,
  Globe,
  Award,
  TrendingUp,
  Clock,
  Camera,
  Database,
  Brain,
  Microscope,
  Search,
  BarChart3,
  Lightbulb,
  CheckCircle,
  Star,
  ArrowRight
} from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Brain,
      title: "AI-Powered Accuracy",
      description: "Our advanced machine learning algorithms continuously learn from botanical data to provide increasingly accurate plant identification with each interaction.",
      color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
    },
    {
      icon: Database,
      title: "Comprehensive Database",
      description: "Access to over 50,000 plant species with detailed botanical information, care instructions, and high-resolution reference images from certified botanists.",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
    },
    {
      icon: Microscope,
      title: "Scientific Precision",
      description: "Built with input from leading botanists and research institutions to ensure taxonomically accurate identification and classification.",
      color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
    },
    {
      icon: Shield,
      title: "Research-Grade Security",
      description: "Enterprise-level data protection ensures your botanical research and institutional data remain secure and confidential.",
      color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
    }
  ];

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Botanist & AI Director",
      specialty: "Machine Learning for Botanical Classification",
      description: "Former research scientist at Royal Botanic Gardens with 15 years in plant taxonomy and AI model development.",
      icon: TreePine,
      credentials: "PhD in Botany, MS in Computer Science"
    },
    {
      name: "Marcus Rivera",
      role: "Lead Plant Vision Engineer",
      specialty: "Computer Vision & Image Processing",
      description: "Specialist in developing image recognition systems for botanical applications with focus on field identification accuracy.",
      icon: Camera,
      credentials: "MS in Computer Vision, Plant Biology Certificate"
    },
    {
      name: "Dr. Emily Watson",
      role: "Database Curator & Taxonomist",
      specialty: "Plant Database Management",
      description: "Certified taxonomist managing our comprehensive species database and ensuring scientific accuracy of all botanical data.",
      icon: Database,
      credentials: "PhD in Plant Systematics, Certified Taxonomist"
    },
    {
      name: "James Park",
      role: "Field Research Coordinator",
      specialty: "User Experience & Field Testing",
      description: "Coordinates field testing with botanists worldwide to optimize the identification process for real-world conditions.",
      icon: Search,
      credentials: "MS in Ecology, UX Research Certification"
    }
  ];

  const stats = [
    { icon: Leaf, label: "Plant Species Identified", value: "50,000+" },
    { icon: Users, label: "Research Institutions", value: "1,200+" },
    { icon: Globe, label: "Countries Covered", value: "95" },
    { icon: Brain, label: "AI Accuracy Rate", value: "97.3%" }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Botanical Vision Born",
      description: "Founded by botanists frustrated with manual plant identification. Initial AI model trained on 10,000 species.",
      achievement: "First prototype developed"
    },
    {
      year: "2021",
      title: "Research Partnership",
      description: "Partnered with 50+ botanical gardens and universities worldwide to expand our species database and improve accuracy.",
      achievement: "Database expanded to 25,000 species"
    },
    {
      year: "2023",
      title: "AI Breakthrough",
      description: "Achieved 95%+ identification accuracy with advanced deep learning models trained on millions of plant images.",
      achievement: "Industry-leading accuracy achieved"
    },
    {
      year: "2025",
      title: "Global Standard",
      description: "Recognized as the leading plant identification platform used by researchers, educators, and conservationists globally.",
      achievement: "50,000+ species database completed"
    }
  ];

  const features = [
    {
      icon: Camera,
      title: "Instant Identification",
      description: "Upload any plant photo for immediate species identification with confidence scores"
    },
    {
      icon: Database,
      title: "Detailed Species Info",
      description: "Access comprehensive botanical data, care guides, and distribution maps"
    },
    {
      icon: BarChart3,
      title: "Research Analytics",
      description: "Track identification patterns and generate reports for scientific research"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with certified botanists for complex identification challenges"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 dark:from-green-800 dark:via-emerald-800 dark:to-teal-900 text-white">
        <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
            opacity: 0.2,
          }}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <div className="p-6 bg-white/20 dark:bg-white/10 rounded-full backdrop-blur-sm animate-pulse">
                <Leaf className="h-20 w-20 text-white" />
              </div>
            </div>
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                <Award className="h-4 w-4 mr-2" />
                Award-Winning Plant Identification Technology
              </Badge>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                PlantScope AI
                <span className="block text-green-200 dark:text-green-300 text-4xl md:text-5xl mt-2">
                  Revolutionizing Botanical Research
                </span>
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-green-100 dark:text-green-200 max-w-4xl mx-auto leading-relaxed">
              Empowering researchers, educators, and conservationists with the world's most advanced 
              AI-powered plant identification system. Discover, classify, and understand plant life 
              with unprecedented accuracy and speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center group">
                Start Identifying Plants
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 space-y-24">
        {/* Mission Statement */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center space-x-3 bg-green-100 dark:bg-green-900/30 px-6 py-3 rounded-full">
            <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
            <span className="text-green-800 dark:text-green-200 font-semibold">Our Mission</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground dark:text-white leading-tight">
            Democratizing Botanical Knowledge
          </h2>
          <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We believe that understanding plant life should be accessible to everyone. Our AI-powered platform 
            bridges the gap between complex botanical science and practical field identification, making plant 
            research and conservation efforts more efficient and accurate than ever before.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4 group">
              <div className="flex justify-center">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-foreground dark:text-white">{stat.value}</div>
                <div className="text-muted-foreground dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-3 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-full">
              <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              <span className="text-blue-800 dark:text-blue-200 font-semibold">Key Features</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground dark:text-white">Advanced Plant Recognition</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card dark:bg-card">
                <CardHeader className="pb-4">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <feature.icon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg text-foreground dark:text-white">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 text-center">
                  <p className="text-muted-foreground dark:text-gray-300 text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-3 bg-purple-100 dark:bg-purple-900/30 px-6 py-3 rounded-full">
              <Heart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              <span className="text-purple-800 dark:text-purple-200 font-semibold">Our Values</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground dark:text-white">Built on Scientific Excellence</h2>
            <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto">
              Our platform is rooted in rigorous scientific methodology and cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-border dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 bg-card dark:bg-card group">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${value.color} group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl text-foreground dark:text-white">{value.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center space-x-3 bg-yellow-100 dark:bg-yellow-900/30 px-6 py-3 rounded-full">
              <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              <span className="text-yellow-800 dark:text-yellow-200 font-semibold">Our Team</span>
            </div>
            <h2 className="text-4xl font-bold text-foreground dark:text-white">Meet Our Botanical Experts</h2>
            <p className="text-xl text-muted-foreground dark:text-gray-300 max-w-3xl mx-auto">
              Our interdisciplinary team combines botanical expertise with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="border-border dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 bg-card dark:bg-card group">
                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <member.icon className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-foreground dark:text-white">{member.name}</CardTitle>
                      <p className="text-green-600 dark:text-green-400 font-medium">{member.role}</p>
                      <p className="text-sm text-muted-foreground dark:text-gray-400 mt-1">{member.specialty}</p>
                      <Badge variant="outline" className="mt-2 text-xs border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                        {member.credentials}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground dark:text-gray-300 leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
              opacity: 0.2,
            }}
          ></div>
          <div className="relative space-y-8">
            <div className="flex justify-center">
              <div className="p-4 bg-white/20 rounded-full">
                <Zap className="h-16 w-16 text-green-200" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">Ready to Advance Botanical Research?</h2>
              <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
                Join leading research institutions and conservation organizations using PlantScope AI 
                to accelerate plant identification and botanical discovery.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 transition-all duration-300 flex items-center justify-center group">
                <Star className="mr-2 h-5 w-5" />
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300">
                Schedule Expert Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;