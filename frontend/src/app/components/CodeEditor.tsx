'use client';

import { theme } from '../theme';

interface CodeEditorProps {
  code: string;
  onCodeChange: (code: string) => void;
}

export default function CodeEditor({ code, onCodeChange }: CodeEditorProps) {
  return (
    <div style={{ marginBottom: theme.spacing.xl }}>
      <label
        htmlFor="code"
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
        Paste Your Code
      </label>
      <textarea
        id="code"
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="// Paste your code here..."
        rows={16}
        style={{
          width: '100%',
          padding: theme.spacing.lg,
          fontSize: theme.fontSize.sm,
          fontFamily: 'Fira Code, Monaco, monospace',
          backgroundColor: theme.colors.surface,
          color: theme.colors.text,
          border: `2px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.lg,
          resize: 'vertical',
          minHeight: '400px',
          lineHeight: '1.6',
          transition: 'all 0.2s ease',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = theme.colors.primary;
          e.currentTarget.style.boxShadow = `0 0 0 3px rgba(59, 130, 246, 0.1)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = theme.colors.border;
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      <div
        style={{
          marginTop: theme.spacing.md,
          fontSize: theme.fontSize.xs,
          color: theme.colors.textSecondary,
        }}
      >
        {code.length} characters
      </div>
    </div>
  );
}
