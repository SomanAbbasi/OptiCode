'use client';

import { useState } from 'react';
import { theme } from '../theme';
import HeroSection from './HeroSection';
import LanguageSelector from './LanguageSelector';
import CodeEditor from './CodeEditor';
import OptimizeButton from './OptimizeButton';

export default function CodeAnalyzer() {
  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async () => {
    if (!code.trim()) {
      alert('Please enter some code to optimize');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Connect to backend API for code analysis
      console.log('Optimizing code:', { language: selectedLanguage, code });
      // Example API call:
      // const response = await fetch('/api/optimize', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ language: selectedLanguage, code })
      // });
    } catch (error) {
      console.error('Error optimizing code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: theme.colors.background, minHeight: '100vh' }}>
      {/* Hero Section */}
      <HeroSection />

      {/* Main Editor Section */}
      <section style={{ backgroundColor: theme.colors.background, paddingTop: '3rem', paddingBottom: '3rem' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Language Selector */}
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onLanguageChange={setSelectedLanguage}
          />

          {/* Code Editor */}
          <CodeEditor
            code={code}
            onCodeChange={setCode}
          />

          {/* Optimize Button */}
          <OptimizeButton
            onClick={handleOptimize}
            isLoading={isLoading}
            disabled={isLoading || !code.trim()}
          />
        </div>
      </section>

    </div>
  );
}
