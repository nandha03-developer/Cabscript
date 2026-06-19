"use client";
import { useState } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";

interface DocSection {
  id: string;
  title: string;
  content: string[];
  subsections?: DocSection[];
}



export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<string>("getting-started");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["getting-started"]));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Fixed Background Image */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/Contain/slider-bg-1-2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Scrollable Content */}
      <div className="relative z-10">
        {/* Header */}
        <Header />
        
        {/* Navigation */}
        <Navigation />

        {/* Hero Section */}
        <section className="relative py-16 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-black/30 backdrop-blur-md rounded-2xl px-8 py-6 inline-block">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                <span className="text-white">Pricing</span>
              </h1>
              <p className="text-lg text-gray-200 max-w-2xl mx-auto">
                Complete guide to set up, configure, and manage your taxi booking platform
              </p>
            </div>
          </div>
        </section>

        {/* Main Content with White Background */}
        <div className="bg-white">
          <div className="container mx-auto px-6 py-12 max-w-7xl">
        
<PricingSection/>
          
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}