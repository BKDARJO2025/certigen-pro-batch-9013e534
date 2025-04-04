
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileImage, Users, Type, Download } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";

export default function LandingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [heroImage, setHeroImage] = useState("/placeholder.svg");

  // Save the image to localStorage on component mount
  useEffect(() => {
    // Save the image URL to localStorage if it doesn't exist yet
    if (!localStorage.getItem("lovable.dev.heroImage")) {
      localStorage.setItem("lovable.dev.heroImage", "/lovable-uploads/68b7fc9d-fe25-4620-9634-60798093b5ef.png");
    }
    
    // Set the hero image from localStorage
    const savedImage = localStorage.getItem("lovable.dev.heroImage");
    if (savedImage) {
      setHeroImage(savedImage);
    }
  }, []);

  const openLoginModal = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const openSignupModal = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileImage className="h-8 w-8 text-certigen-blue" />
            <span className="text-xl font-semibold tracking-tight font-montserrat">CertiGen Pro</span>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={openLoginModal}>Log In</Button>
            <Button onClick={openSignupModal}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-certigen-blue/10 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-certigen-dark mb-6">
                Professional Certificate Generation Made Easy
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Create, customize, and distribute professional certificates in bulk for your events, courses, and recognition programs.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={openSignupModal}>Get Started</Button>
              </div>
            </div>
            <div className="flex justify-center">
              <img 
                src={heroImage} 
                alt="Certificate bulk generation system" 
                className="rounded-lg shadow-lg max-w-full h-auto"
                style={{ maxHeight: '500px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Certificate Generation Features</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create professional certificates at scale
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-certigen-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileImage className="h-8 w-8 text-certigen-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Template Library</h3>
              <p className="text-gray-600">Choose from professional templates or upload your own designs.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-certigen-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-certigen-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Bulk Processing</h3>
              <p className="text-gray-600">Import recipient data from CSV and generate hundreds of certificates in seconds.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-certigen-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Type className="h-8 w-8 text-certigen-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Full Customization</h3>
              <p className="text-gray-600">Control fonts, colors, positioning and add dynamic text fields.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
              <div className="bg-certigen-blue/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-certigen-blue" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Distribution</h3>
              <p className="text-gray-600">Download as PDF, share links or send directly via email.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-certigen-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations creating professional certificates with CertiGen Pro
          </p>
          <Button size="lg" variant="secondary" onClick={openSignupModal}>
            Create Your First Certificate
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <FileImage className="h-6 w-6 text-certigen-blue" />
                <span className="text-lg font-semibold">CertiGen Pro</span>
              </div>
              <p className="text-gray-600 text-sm">
                Professional certificate generation platform for organizations of all sizes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Templates</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Examples</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">API</a></li>
                <li><a href="#" className="text-gray-600 hover:text-certigen-blue">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600 text-sm">
            <p>&copy; {new Date().getFullYear()} CertiGen Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode} 
      />
    </div>
  );
}
