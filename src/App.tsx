/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MetricsBanner } from './components/MetricsBanner';
import { ModelCatalog } from './components/ModelCatalog';
import { Playground } from './components/Playground';
import { GpuCalculator } from './components/GpuCalculator';
import { ArchitectureBento } from './components/ArchitectureBento';
import { FaqSection } from './components/FaqSection';
import { VirtualAssistant } from './components/VirtualAssistant';
import { CalModal } from './components/CalModal';
import { Footer } from './components/Footer';
import { NIM_MODELS } from './data/modelsData';
import { NimModel } from './types';

export default function App() {
  const [isCalModalOpen, setIsCalModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<NimModel>(NIM_MODELS[0]); // Llama 3.3 70B by default
  const [activeSection, setActiveSection] = useState('catalogo');

  // Track scroll position to update active navbar item
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['catalogo', 'playground', 'calculadora', 'arquitetura', 'faqs'];
      const scrollY = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelectModelForPlayground = (model: NimModel) => {
    setSelectedModel(model);
    const playgroundEl = document.getElementById('playground');
    if (playgroundEl) {
      playgroundEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreModels = () => {
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-neutral-100 flex flex-col font-sans selection:bg-[#76B900] selection:text-black">
      {/* Top Navbar */}
      <Navbar 
        onOpenCal={() => setIsCalModalOpen(true)} 
        activeSection={activeSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero 
          onOpenCal={() => setIsCalModalOpen(true)}
          onExploreModels={handleExploreModels}
        />

        {/* High-Impact Metrics Banner */}
        <MetricsBanner />

        {/* Core Interactive Module 1: NIM Models Catalog */}
        <ModelCatalog 
          onSelectModelForPlayground={handleSelectModelForPlayground}
        />

        {/* Core Interactive Module 2: Real-Time Playground */}
        <Playground 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />

        {/* Core Interactive Module 3: GPU Sizing Calculator */}
        <GpuCalculator 
          onOpenCal={() => setIsCalModalOpen(true)}
        />

        {/* Core Interactive Module 4: Bento Architecture Grid */}
        <ArchitectureBento />

        {/* Technical FAQs Accordion */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer 
        onOpenCal={() => setIsCalModalOpen(true)}
      />

      {/* Floating Virtual Assistant Chatbot */}
      <VirtualAssistant 
        onOpenCal={() => setIsCalModalOpen(true)}
        onNavigateToSection={handleNavigateToSection}
      />

      {/* Cal.com Appointment Booking Modal */}
      <CalModal 
        isOpen={isCalModalOpen}
        onClose={() => setIsCalModalOpen(false)}
      />
    </div>
  );
}
