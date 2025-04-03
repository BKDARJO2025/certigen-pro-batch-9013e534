
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileImage, Users, Type, Download } from "lucide-react";
import { Link } from "react-router-dom";

export default function HomePage() {
  const features = [
    {
      title: "Template Upload",
      description: "Upload and manage your certificate templates",
      icon: <FileImage className="h-10 w-10 text-certigen-blue" />,
      path: "/templates",
    },
    {
      title: "Data Input",
      description: "Input names individually or bulk upload via CSV",
      icon: <Users className="h-10 w-10 text-certigen-blue" />,
      path: "/data-input",
    },
    {
      title: "Text Settings",
      description: "Customize fonts, sizes, colors and positioning",
      icon: <Type className="h-10 w-10 text-certigen-blue" />,
      path: "/text-settings",
    },
    {
      title: "Export Certificates",
      description: "Generate and download high-quality PDF certificates",
      icon: <Download className="h-10 w-10 text-certigen-blue" />,
      path: "/export",
    },
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-certigen-dark mb-4">
          Welcome to CertiGen Pro
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Generate professional certificates in bulk with our easy-to-use automated certificate system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden border-t-4 border-t-certigen-blue">
            <CardContent className="p-6 text-center">
              <div className="mb-4 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500 mb-4">{feature.description}</p>
              <Button asChild>
                <Link to={feature.path}>Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-certigen-gray rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-certigen-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">1</div>
            <p>Upload your certificate template</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-certigen-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">2</div>
            <p>Add recipient data individually or via CSV</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-certigen-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">3</div>
            <p>Customize text appearance and positioning</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="bg-certigen-blue text-white rounded-full w-10 h-10 flex items-center justify-center font-bold mb-3">4</div>
            <p>Generate and download certificates</p>
          </div>
        </div>
      </div>
    </div>
  );
}
