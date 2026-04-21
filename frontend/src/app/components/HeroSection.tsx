'use client';

import { theme } from '../theme';

interface HeroSectionProps {
  title?: string;
  description?: string;
}

export default function HeroSection({
  title = 'Optimize Your Code with AI',
  description = 'OptiCode is a code analysis tool that finds inefficient code patterns, estimates time complexity, and suggests better data structures and algorithms. It also uses AI to explain problems and recommend optimized solutions in simple terms.',
}: HeroSectionProps) {
  return (
    <section
      style={{
        background: `linear-gradient(135deg, ${theme.colors.surface} 0%, ${theme.colors.background} 100%)`,
        borderBottom: `1px solid ${theme.colors.border}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Main Title */}
        <h1
          style={{
            fontSize: theme.fontSize['4xl'],
            color: theme.colors.text,
            fontWeight: 'bold',
            marginBottom: theme.spacing.lg,
            background: `linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.accent} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          {title}
        </h1>

        {/* Description */}
        <p
          style={{
            fontSize: theme.fontSize.lg,
            color: theme.colors.textSecondary,
            lineHeight: '1.75',
            maxWidth: '800px',
          }}
        >
          {description}
        </p>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '⚡', title: 'Time Complexity', description: 'Analyze algorithm efficiency' },
            { icon: '🎯', title: 'Smart Suggestions', description: 'AI-powered optimizations' },
            { icon: '📚', title: 'Better Data Structures', description: 'Recommended improvements' },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                backgroundColor: theme.colors.surfaceLight,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
              }}
            >
              <div style={{ fontSize: '1.5rem', marginBottom: theme.spacing.sm }}>
                {feature.icon}
              </div>
              <h3
                style={{
                  color: theme.colors.text,
                  fontWeight: '600',
                  marginBottom: theme.spacing.xs,
                }}
              >
                {feature.title}
              </h3>
              <p style={{ color: theme.colors.textSecondary, fontSize: theme.fontSize.sm }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
