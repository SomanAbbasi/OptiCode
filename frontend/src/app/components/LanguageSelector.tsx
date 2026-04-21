'use client';

import { theme } from '../theme';

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const languages = ['Python', 'C++', 'C', 'Java', 'C#'];

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
}: LanguageSelectorProps) {
  return (
    <div style={{ marginBottom: theme.spacing.xl }}>
      <label
        htmlFor="language"
        style={{
          display: 'block',
          fontSize: theme.fontSize.sm,
          fontWeight: '600',
          color: theme.colors.text,
          marginBottom: theme.spacing.md,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Select Programming Language
      </label>
      <select
        id="language"
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '300px',
          padding: `${theme.spacing.md} ${theme.spacing.lg}`,
          fontSize: theme.fontSize.base,
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          border: `2px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontWeight: '500',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.colors.primary;
          e.currentTarget.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>
    </div>
  );
}
